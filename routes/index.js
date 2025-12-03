// routes/index.js
import { Router } from "express";
import authRoutes from "./auth.js";
import aiRoutes from "./ai.js";

const router = Router();

// Endpoint de prueba
router.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando correctamente 🚀, TQM SAMPEPE",
  });
});

// Rutas de autenticación
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/seed", (await import("./seed.js")).default);

export default router;
