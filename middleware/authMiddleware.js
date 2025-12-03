// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ ok: false, message: "Token requerido" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guarda info del usuario autenticado
    next();
  } catch (error) {
    return res.status(403).json({ ok: false, message: "Token inválido" });
  }
};
