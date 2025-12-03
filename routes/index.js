// routes/index.js
import { Router } from "express";
import authRoutes from "./auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

// Rutas de autenticación
router.use("/auth", authRoutes);

export default router;
