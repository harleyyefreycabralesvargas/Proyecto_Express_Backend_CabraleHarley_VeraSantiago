import express from "express";
import { PeliculasController } from "../controllers/peliculaController.js";
import { authMiddleware, esAdmin } from "../middleWares/auth.js";

const router = express.Router();

// Solo admin puede añadir, actualizar y eliminar
router.post("/", authMiddleware, esAdmin, PeliculasController.crear);
router.put("/:titulo", authMiddleware, esAdmin, PeliculasController.actualizar);
router.delete("/:titulo", authMiddleware, esAdmin, PeliculasController.eliminar);

// Usuarios logueados pueden ver
router.get("/", authMiddleware, PeliculasController.listarTodas);
router.get("/:titulo", authMiddleware, PeliculasController.buscarPorTitulo);

export default router;