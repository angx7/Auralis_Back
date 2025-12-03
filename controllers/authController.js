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

    // Validar campos
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Todos los campos son obligatorios" });
    }

    // Verificar si existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ ok: false, message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password_hash,
    });

    return res.json({
      ok: true,
      message: "Usuario creado exitosamente",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// =======================================
// LOGIN
// =======================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    // Comparar contraseña
    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "Contraseña incorrecta" });
    }

    // Crear JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "7d",
      }
    );

    return res.json({
      ok: true,
      token,
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
// EDIT PROFILE — usa req.user.id del token
// =======================================
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token
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

    return res.json({ ok: true, message: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// =======================================
// GET PROFILE — usa req.user.id del token
// =======================================
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password_hash");
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    return res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
