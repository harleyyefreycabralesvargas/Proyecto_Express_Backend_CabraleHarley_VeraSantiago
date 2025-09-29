import express from "express";
import { PeliculasController } from "../controllers/peliculaController.js";
import { authMiddleware, esAdmin } from "../middleWares/auth.js";

const router = express.Router();

// CRUD normal
router.post("/", authMiddleware, esAdmin, PeliculasController.crear);
router.get("/", authMiddleware, PeliculasController.listarTodas);
router.get("/:titulo", authMiddleware, PeliculasController.buscarPorTitulo);
router.put("/:titulo", authMiddleware, esAdmin, PeliculasController.actualizar);
router.delete("/:titulo", authMiddleware, esAdmin, PeliculasController.eliminar);

// Extra: random, top, vistas
router.get("/extra/random", authMiddleware, PeliculasController.random);
router.get("/extra/top-rated", authMiddleware, PeliculasController.topRated);
router.get("/extra/most-viewed", authMiddleware, PeliculasController.mostViewed);

router.post("/:titulo/like", authMiddleware, PeliculasController.darLike);
router.post("/:titulo/dislike", authMiddleware, PeliculasController.darDislike);

router.get("/buscar/:titulo", PeliculasController.buscarTitulo);
export default router;
