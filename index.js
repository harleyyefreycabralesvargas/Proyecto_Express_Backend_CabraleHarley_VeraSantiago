// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectar } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Middleware para inyectar db
app.use(async (req, res, next) => {
  req.db = await conectar();
  next();
});

// Rutas
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));