// exportar express para usar rutas
import express from "express";
// permitit solicitudes de front
import cors from "cors";
// usar variables de entorno
import dotenv from "dotenv";
// llamar a la conexionde la base de datos
import { client,db } from "./config/db.js";
// llamar todas las rutas
import authRoutes from "./routes/userRoutes.js";
import peliculasRoutes from "./routes/peliculaRoutes.js"
import categoriasRoutes from "./routes/categoriaRoutes.js";
import reseñasRoutes from "./routes/reseñaRoutes.js";
// iniciar dotenv
dotenv.config();
// crear api y no aplicar restricciones
const app = express();
app.use(express.json());
app.use(cors());

// middleware para inyectar db
app.use(async (req, res, next) => {
  req.client=client
  req.db =db
  next();
});

// rutas de la api
app.use("/api/auth", authRoutes);
app.use("/api/peliculas", peliculasRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/resenas", reseñasRoutes);
// correr el servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));