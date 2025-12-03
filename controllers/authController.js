// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar campos
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Todos los campos son obligatorios" });
    }

    // Usuario existente
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

    return res.json({ ok: true, message: "Usuario creado", user: newUser });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

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

    // Crear token
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

    return res.json({ ok: true, token });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
