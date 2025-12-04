// routes/session.js
import { Router } from "express";
import {
  getUserSessions,
  getMonthSummary,
  getSessionById,
  createSession,
  finishSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, getUserSessions);
router.get("/month", verificarToken, getMonthSummary);
router.get("/:id", verificarToken, getSessionById);

router.post("/", verificarToken, createSession); // iniciar sesión
router.put("/:id", verificarToken, finishSession); // terminar sesión

router.delete("/:id", verificarToken, deleteSession);

export default router;
