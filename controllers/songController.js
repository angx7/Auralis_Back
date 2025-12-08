// controllers/songController.js
import Song from "../models/Song.js";
import AdmZip from "adm-zip";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

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
// ================================
// Obtener solo las notas (C4, D#5, Bb3, etc.)
// ================================
export const getSongNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    if (!song) {
      return res
        .status(404)
        .json({ ok: false, message: "Canción no encontrada" });
    }

    const url = song.recursos.musicXMLUrl;

    // Descargar archivo .mxl
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const zip = new AdmZip(Buffer.from(response.data));
    const xmlEntry = zip.getEntry("score.xml");

    if (!xmlEntry) {
      return res
        .status(500)
        .json({ ok: false, message: "score.xml no encontrado" });
    }

    const xmlContent = xmlEntry.getData().toString("utf8");

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const xml = parser.parse(xmlContent);

    const parts = xml["score-partwise"].part;
    const notes = [];

    for (const part of [].concat(parts)) {
      for (const measure of [].concat(part.measure)) {
        if (!measure.note) continue;

        for (const note of [].concat(measure.note)) {
          if (!note.pitch) continue; // ignora silencios

          const step = note.pitch.step; // C, D, E...
          const octave = note.pitch.octave; // 3, 4, 5...
          const alter = note.pitch.alter ?? 0; // sostenidos/bemoles

          // Convertir alter a # o b
          let accidental = "";
          if (alter === 1) accidental = "#";
          if (alter === -1) accidental = "b";

          // Ejemplo final: C4, D#5, Eb4
          const pitch = `${step}${accidental}${octave}`;

          notes.push(pitch);
        }
      }
    }

    res.json({
      ok: true,
      notes,
      total: notes.length,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
