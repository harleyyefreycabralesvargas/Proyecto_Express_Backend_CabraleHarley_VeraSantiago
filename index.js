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
import swaggerUI from 'swagger-ui-express'
import swaggerDocumentation from './swagger.json'  with { type: 'json' };
// Definir puerto
const PORT = process.env.PORT || 3000;
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

// swagger doc
app.use('/doc',swaggerUI.serve,swaggerUI.setup(swaggerDocumentation))
// rutas de la api
app.use("/1.5.2/api/auth", authRoutes);
app.use("/1.5.2/api/peliculas", peliculasRoutes);
app.use("/1.5.2/api/categorias", categoriasRoutes);
app.use("/1.5.2/api/resenas", reseñasRoutes);
// correr el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
