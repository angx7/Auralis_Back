// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =======================================
// REGISTRO
// =======================================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Todos los campos son obligatorios",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ ok: false, message: "El usuario ya existe" });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      username,
      email,
      password_hash,
      login_streak: 0,
      last_connection: null,
      last_streak_update: null,
    });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    return res.json({ ok: true, token, user: newUser });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// =======================================
// LOGIN CON RACHAS
// =======================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "Contraseña incorrecta" });
    }

    // ======================
    // LÓGICA DEL STREAK
    // ======================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastUpdate = user.last_streak_update
      ? new Date(user.last_streak_update)
      : null;

    if (lastUpdate) lastUpdate.setHours(0, 0, 0, 0);

    if (!lastUpdate) {
      // Primer login de la vida
      user.login_streak = 1;
      user.last_streak_update = today;
    } else {
      const diffDays =
        (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        // Ya se logueó hoy → no incrementamos
      } else if (diffDays === 1) {
        // Logueo consecutivo
        user.login_streak += 1;
        user.last_streak_update = today;
      } else if (diffDays >= 2) {
        // Perdió la racha
        user.login_streak = 1;
        user.last_streak_update = today;
      }
    }

    // Actualizar última conexión por separado
    user.last_connection = new Date();

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    return res.json({
      ok: true,
      token,
      streak: user.login_streak,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// =======================================
// EDIT PROFILE
// =======================================
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newUsername, newEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    if (newUsername) user.username = newUsername;
    if (newEmail) user.email = newEmail;

    await user.save();

    return res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// =======================================
// GET PROFILE
// =======================================
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password_hash");
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    return res.json({
      ok: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// =======================================
// GET LOGIN STREAK
// =======================================
export const getLoginStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    return res.json({
      ok: true,
      streak: user.login_streak || 0,
      last_update: user.last_streak_update,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
