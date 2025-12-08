// routes/song.js
import { Router } from "express";
import {
  createSong,
  getAllSongs,
  getSongById,
  getSongsByDifficulty,
  updateSong,
  deleteSong,
  getSongNotes,
} from "../controllers/songController.js";

import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// CRUD
router.post("/", verificarToken, createSong);
router.get("/", verificarToken, getAllSongs);
router.get("/difficulty/:dificultad", verificarToken, getSongsByDifficulty);
router.get("/:id", verificarToken, getSongById);
router.put("/:id", verificarToken, updateSong);
router.delete("/:id", verificarToken, deleteSong);
router.get("/:id/notes", verificarToken, getSongNotes);

export default router;
