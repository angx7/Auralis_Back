// controllers/aiController.js
import { openai } from "../config/openai.js";

export const getPianoTip = async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      // model: "gpt-5-mini",
      // model: "gpt-4o-mini",
      model: "gpt-4.1-mini",
      // model: "gpt-5-nano",
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
