// controllers/sessionController.js
import Session from "../models/Session.js";

// ========================================
//  Obtener todas las sesiones del usuario
// ========================================
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.find({ user_id: userId })
      .populate("song_id")
      .sort({ fecha_sesion: -1 });

    res.json({ ok: true, sessions });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// ========================================
//  Resumen del mes actual
// ========================================
export const getMonthSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const sessions = await Session.find({
      user_id: userId,
      fecha_sesion: { $gte: startMonth, $lte: endMonth },
    });

    if (sessions.length === 0) {
      return res.json({
        ok: true,
        totalSeconds: 0,
        totalMinutes: 0,
        totalHours: "0h 0m",
        precisionPromedio: 0,
        sesiones: 0,
      });
    }

    // SUMA REAL DE DURACIÓN
    const totalSeconds = sessions.reduce(
      (acc, s) => acc + (s.duration_seconds || 0),
      0
    );

    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const precisionPromedio = Math.round(
      sessions.reduce((acc, s) => acc + s.puntaje_total, 0) / sessions.length
    );

    res.json({
      ok: true,
      totalSeconds,
      totalMinutes,
      totalHours: `${hours}h ${minutes}m`,
      precisionPromedio,
      sesiones: sessions.length,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// ========================================
// Obtener detalle de una sesión
// ========================================
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("song_id");

    if (!session) {
      return res
        .status(404)
        .json({ ok: false, message: "Sesión no encontrada" });
    }

    res.json({ ok: true, session });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// ========================================
// Crear sesión ("INICIO GRABACIÓN")
// ========================================
export const createSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const newSession = await Session.create({
      ...req.body,
      user_id: userId,
      fecha_sesion: new Date(),
    });

    res.json({ ok: true, session: newSession });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// ========================================
// Actualizar sesión ("DETENER GRABACIÓN")
// ========================================
export const finishSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const updated = await Session.findByIdAndUpdate(
      sessionId,
      { ...req.body },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, message: "Sesión no encontrada" });
    }

    res.json({ ok: true, session: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// ========================================
// Eliminar sesión
// ========================================
export const deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);

    res.json({ ok: true, message: "Sesión eliminada" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
