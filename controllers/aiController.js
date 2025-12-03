// controllers/aiController.js
import { openai } from "../config/openai.js";

export const getPianoTip = async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: ` 
            Dame un protip breve, práctico y avanzado para alguien que está aprendiendo a tocar piano.
            Enfócalo en técnica, postura o independencia de manos.
            Ejemplo: "Para mejorar la independencia de manos..."
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
