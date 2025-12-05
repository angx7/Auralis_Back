// controllers/aiController.js
import { openai } from "../config/openai.js";
import Session from "../models/Session.js";

export const getPianoTip = async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: ` 
            Necesito una respuesta super rapida, concisa y profesional.
            Eres un experto pianista y profesor de piano con años de experiencia enseñando a estudiantes de todos los niveles.

            Dame un protip breve, práctico y avanzado para alguien que está aprendiendo a tocar piano.
            Enfócalo en técnica, postura o independencia de manos.
            
            NO des listas largas, solo un tip profesional.
            Un máximo de 15 palabras, para que sea conciso.`,
        },
      ],
    });

    const tip = response.choices[0].message.content;

    res.json({
      ok: true,
      tip,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ ok: false, message: "Error al generar tip" });
  }
};

// =======================================================
// 2) INFORME DE PROGRESO — NUEVO
// =======================================================
export const getAIProgressReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener últimas 10 sesiones
    const sessions = await Session.find({ user_id: userId })
      .sort({ fecha_sesion: -1 })
      .limit(10)
      .populate("song_id");

    if (sessions.length === 0) {
      return res.json({
        ok: true,
        message: "Sin sesiones para analizar",
        report: null,
      });
    }

    // Preparamos data reducida para IA
    const resumenSesiones = sessions.map((s) => ({
      fecha: s.fecha_sesion,
      cancion: s.song_id.titulo,
      precision_ritmica: s.analisis_audio_opcional?.precision_ritmica || null,
      errores_ms: s.analisis_audio_opcional?.errores_promedio_ms || null,
      notas_incorrectas: s.deteccion_visual.notas_incorrectas_visual,
      puntaje_total: s.puntaje_total,
      duracion: s.duration_seconds,
    }));

    // PROMPT INTELIGENTE PARA IA
    const prompt = `
Eres un sistema experto en análisis pianístico. Recibirás datos reales de sesiones
del usuario y debes generar un informe profesional, motivador y basado en datos.

ENTRADAS:
${JSON.stringify(resumenSesiones, null, 2)}

DEVUELVE EXCLUSIVAMENTE un JSON con esta estructura:

{
  "resumen": "Texto narrativo profesional que explique avances, mejoras, debilidades.",
  "precisionGlobal": number,     
  "tendenciaPrecision": "mejora | estable | descenso",
  "graficaPrecision": [number],  
  "ritmoEstableNivel": "bajo | medio | alto",
  "dinamicaPuntaje": number,     
  "precisionActual": number      
}

Reglas:
- Usa análisis estadístico real basado en los datos.
- NO inventes datos que no existan.
- Calcula tendencias.
- Escribe el resumen como en aplicaciones de progreso musical premium.
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Eres un analista musical experto en técnica pianística",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    const jsonText = aiResponse.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({
        ok: false,
        message: "La IA devolvió un formato inválido",
        raw: jsonText,
      });
    }

    return res.json({
      ok: true,
      report: parsed,
    });
  } catch (error) {
    console.error("AI Report Error:", error);
    res.status(500).json({ ok: false, message: "Error generando reporte" });
  }
};
