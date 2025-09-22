import express from "express";
import dotenv from "dotenv";

import { AuthController } from "../controllers/authController.js";
dotenv.config();

const router = express.Router();

// Registro
router.post("/register", AuthController.register);

// Login
router.post("/login", AuthController.login);

export default router;