import { Router } from "express";
import {
  getPianoTip,
  getAIProgressReport,
} from "../controllers/aiController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// Ruta para generar un ProTip usando OpenAI
router.post("/protip", verificarToken, getPianoTip);
router.get("/report", verificarToken, getAIProgressReport);

export default router;
