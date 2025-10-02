import express from "express";
import { ArchivoController } from "../controllers/archivoController.js";
import { authMiddleware } from "../middleWares/auth.js";
const router = express.Router();

router.get("/:titulo", ArchivoController.listar);

export default router;
