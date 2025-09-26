// importamos librerias de cifrado para el login
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
// importamos las funciones de manejo de usuarios
import { UsuarioModel } from "../models/userModel.js";
dotenv.config();
// traemos token de acceso
const SECRET = process.env.JWT_SECRET
// exponar funciones para ruutas
export const AuthController = {
  // funcion de ruta para crear un usuario
  async register(req, res) {
    // intentar crear un usuario
    try {
      // definimos los datos a ingresar pepidos en el cuerpo del request
      const { nombre, email, password } = req.body;
      // verificar que si contengan informacion
      if (!nombre || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }
      // Verificar si ya existe
      const existe = await UsuarioModel.buscarPorEmail(req.db, email);
      if (existe) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
      // hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      // crear usuario con funcion del model
      const id = await UsuarioModel.crear(req.db, {
        nombre,
        email,
        password: hashedPassword
      });
      // yei pasoo
      res.status(201).json({ message: "Usuario registrado correctamente", id });
    } catch (err) {
      // no paso :(
      console.error("Error en register:", err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },
  // funcion ruta dar validacion de la sesion
  async login(req, res) {
    // intentar logear usuario 
    try {
      // requerir parametros del body
      const { email, password } = req.body;
      // bucar el usuairo por el correo
      const user = await UsuarioModel.buscarPorEmail(req.db, email);
      // no se encontro
      if (!user) return res.status(400).json({ error: "Credenciales inválidas" });
      // verificar contraseña
      const valid = await bcrypt.compare(password, user.password);
      // no es igual
      if (!valid) return res.status(400).json({ error: "Credenciales inválidas" });
      // informacion de la sesion por 1 hora
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          rol: user.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // envio de ala respuesta 
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
      // error con el servidor
      console.error("Error en login:", err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
};