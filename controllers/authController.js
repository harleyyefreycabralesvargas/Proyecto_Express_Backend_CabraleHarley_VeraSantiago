import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioModel } from "../models/usuario.model.js";

const SECRET = process.env.JWT_SECRET || "supersecreto";

export const AuthController = {
  async register(req, res) {
    try {
      const { nombre, email, password } = req.body;
      if (!nombre || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const existing = await UsuarioModel.buscarPorEmail(req.db, email);
      if (existing) return res.status(400).json({ error: "Email ya registrado" });

      const hashed = await bcrypt.hash(password, 10);
      const id = await UsuarioModel.crear(req.db, { nombre, email, password: hashed });

      res.status(201).json({ message: "Usuario creado", id });
    } catch (e) {
      res.status(500).json({ error: "Error en servidor" });
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

      res.json({ message: "Login exitoso", token });
    } catch (e) {
      res.status(500).json({ error: "Error en servidor" });
    }
  }
};