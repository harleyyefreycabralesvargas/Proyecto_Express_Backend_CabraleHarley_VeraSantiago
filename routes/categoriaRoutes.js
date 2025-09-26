import express from "express";
import { CategoriasController } from "../controllers/categoriaController.js";
import { authMiddleware, esAdmin } from "../middleWares/auth.js";

const router = express.Router();

// Solo admin puede añadir, actualizar y eliminar
router.post("/", authMiddleware, esAdmin, CategoriasController.crear);
router.put("/:categoriaId", authMiddleware, esAdmin, CategoriasController.actualizar);
router.delete("/:categoriaId", authMiddleware, esAdmin, CategoriasController.eliminar);

// Usuarios logueados pueden ver
router.get("/", authMiddleware, CategoriasController.listarTodas);
router.get("/:categoriaId", authMiddleware, CategoriasController.buscarPorId);

export default router;