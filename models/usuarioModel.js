
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export const UsuarioModel = {
  collection: "usuarios",

  async crear(db, { nombre, email, password, rol = "usuario" }) {
    const result = await db.collection(this.collection).insertOne({
      nombre,
      email,
      password,
      rol,
      fechaRegistro: new Date()
    });
    return result.insertedId;
  },

  async buscarPorEmail(db, email) {
    return await db.collection(this.collection).findOne({ email });
  }
};