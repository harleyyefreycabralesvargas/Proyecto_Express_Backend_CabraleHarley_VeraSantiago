// importar rutas de express
import express from "express";
// exportar rutas de funciones
import { AuthController } from "../controllers/userController.js";
// usar rutas
const router = express.Router();
// registro ruta
router.post("/register", AuthController.register);
// login ruta
router.post("/login", AuthController.login);
// exportar rutas
export default router;