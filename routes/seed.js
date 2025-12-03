// routes/seed.js
import { Router } from "express";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Song from "../models/Song.js";
import UserProfile from "../models/UserProfile.js";
import Session from "../models/Session.js";

const router = Router();

router.post("/seed", async (req, res) => {
  try {
    // ===============================
    // 1. Encriptar contraseña
    // ===============================
    const password = "admin123";
    const password_hash = await bcrypt.hash(password, 10); // 10 salt rounds

    // ===============================
    // 2. Crear usuario
    // ===============================
    const user = await User.create({
      username: "usuario_1",
      email: "user@gmail.com",
      password_hash,
    });

    // ===============================
    // 3. Crear canción
    // ===============================
    const song = await Song.create({
      _id: "bethoveen_virus",
      titulo: "Beethoven Virus",
      artista: "Beethoven",
      dificultad: "dificil",
      recursos: {
        musicXMLUrl:
          "https://auralismusic.s3.us-east-1.amazonaws.com/MusicXML/Dificil/bethoveen_virus.mxl",
      },
    });

    // ===============================
    // 4. Crear perfil de usuario
    // ===============================
    const profile = await UserProfile.create({
      user_id: user._id,
      favoritas: ["bethoveen_virus"],
      historial_desempeno: [],
    });

    // ===============================
    // 5. Crear sesión
    // ===============================
    const session = await Session.create({
      user_id: user._id,
      song_id: "bethoveen_virus",
      puntaje_total: 95,
      fecha_sesion: new Date(),

      deteccion_visual: {
        notas_incorrectas_visual: 2,
        secuencia_detectada: [
          { tiempo_ms: 1200, nota_detectada: "C4" },
          { tiempo_ms: 1500, nota_detectada: "E4" },
          { tiempo_ms: 1700, nota_detectada: "G4" },
        ],
      },

      analisis_audio_opcional: {
        precision_ritmica: 90,
        errores_promedio_ms: 55,
      },
    });

    // ===============================
    // Respuesta final
    // ===============================
    res.json({
      ok: true,
      message: "Seed ejecutado correctamente. Colecciones creadas.",
      usuario_creado: user,
      cancion_creada: song,
      perfil_creado: profile,
      sesion_creada: session,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
