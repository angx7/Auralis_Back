// controllers/songController.js
import Song from "../models/Song.js";

// =========================
// Crear canción
// =========================
export const createSong = async (req, res) => {
  try {
    const data = req.body;

    // Verifica que no exista un ID duplicado
    const exists = await Song.findById(data._id);
    if (exists) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe una canción con ese ID",
      });
    }

    const song = await Song.create(data);

    res.json({
      ok: true,
      message: "Canción creada correctamente",
      song,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// =========================
// Obtener todas las canciones
// =========================
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ titulo: 1 });

    res.json({
      ok: true,
      songs,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// =========================
// Buscar canciones por dificultad
// =========================
export const getSongsByDifficulty = async (req, res) => {
  try {
    const { dificultad } = req.params;

    const songs = await Song.find({ dificultad });

    res.json({ ok: true, songs });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// =========================
// Obtener una canción por ID
// =========================
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        ok: false,
        message: "Canción no encontrada",
      });
    }

    res.json({ ok: true, song });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// =========================
// Actualizar canción
// =========================
export const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!song) {
      return res
        .status(404)
        .json({ ok: false, message: "Canción no encontrada" });
    }

    res.json({ ok: true, song });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// =========================
// Eliminar canción
// =========================
export const deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);

    res.json({
      ok: true,
      message: "Canción eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
