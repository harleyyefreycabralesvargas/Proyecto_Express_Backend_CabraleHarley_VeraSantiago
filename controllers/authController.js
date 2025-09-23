import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { UsuarioModel } from "../models/usuarioModel.js";
dotenv.config();

const SECRET = process.env.JWT_SECRET

export const AuthController = {
  async register(req, res) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      // Verificar si ya existe
      const existe = await UsuarioModel.buscarPorEmail(req.db, email);
      if (existe) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const id = await UsuarioModel.crear(req.db, {
        nombre,
        email,
        password: hashedPassword
      });

      res.status(201).json({ message: "Usuario registrado correctamente", id });
    } catch (err) {
      console.error("Error en register:", err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UsuarioModel.buscarPorEmail(req.db, email);
      if (!user) return res.status(400).json({ error: "Credenciales inválidas" });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: "Credenciales inválidas" });
      const token = jwt.sign(
        { id: user._id, rol: user.rol, nombre: user.nombre },
        SECRET,
        { expiresIn: "1h" }
      );
      res.json({
        message: "Login exitoso",
        token,
        usuario: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      });
    } catch (err) {
      console.error("Error en login:", err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
};