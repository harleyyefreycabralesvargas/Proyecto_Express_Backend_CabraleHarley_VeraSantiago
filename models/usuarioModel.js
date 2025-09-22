import { ObjectId } from "mongodb";

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
  },

  async buscarPorId(db, id) {
    return await db.collection(this.collection).findOne({ _id: new ObjectId(id) });
  }
};