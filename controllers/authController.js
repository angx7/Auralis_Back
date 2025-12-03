// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones simples
    if (!username || !email || !password)
      return res.status(400).json({ ok: false, error: "Faltan datos" });

    // Verificar si ya existe
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ ok: false, error: "El email ya está registrado" });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password_hash,
    });

    res.json({ ok: true, message: "Usuario registrado", user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ ok: false, error: "Faltan datos" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ ok: false, error: "Usuario no encontrado" });

    // Comparar contraseña
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return res
        .status(400)
        .json({ ok: false, error: "Contraseña incorrecta" });

    // Crear JWT
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    });

    res.json({
      ok: true,
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
