import express from "express";
import { ReseñasController } from "../controllers/reseñaController.js";
import { authMiddleware } from "../middleWares/auth.js";

const router = express.Router();

// Listar reseñas de una película
router.get("/:titulo", authMiddleware, ReseñasController.listar);

// Crear reseña
router.post("/", authMiddleware, ReseñasController.crear);

// Eliminar reseña
router.delete("/:id", authMiddleware, ReseñasController.eliminar);
router.get("/mias/:titulo", authMiddleware, ReseñasController.obtenerDeUsuario);
// ruta editar mi reseña
router.put("/:id", authMiddleware, ReseñasController.editar);
export default router;
