import { Router } from "express";
import {
  loginUser,
  registerUser,
  editProfile,
  getMyProfile,
} from "../controllers/authController.js";

import { verificarToken } from "../middleware/authMiddleware.js";

const router = Router();

// Público
router.post("/register", registerUser);
router.post("/login", loginUser);

// Privados
router.put("/profile", verificarToken, editProfile);
router.get("/me", verificarToken, getMyProfile);

export default router;
