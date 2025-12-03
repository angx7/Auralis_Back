// routes/index.js
import { Router } from "express";
import authRoutes from "./auth.js";

const router = Router();

// Endpoint de prueba
router.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando correctamente gracias SAMPAPAS",
  });
});

// Rutas de autenticación
router.use("/auth", authRoutes);

export default router;
