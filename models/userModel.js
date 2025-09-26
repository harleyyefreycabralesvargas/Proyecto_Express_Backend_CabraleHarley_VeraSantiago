// funciones de usuario
export const UsuarioModel = {
  // definimos la coleccion que vamos a usar
  collection: "usuarios",
// funcion de crear nuevos usuarios con la coleccion, nombre, email, password,eol,fechaRegistro
  async crear(db, { nombre, email, password, rol = "usuario" }) {
    const result = await db.collection(this.collection).insertOne({
      nombre,
      email,
      password,
      rol,
      fechaRegistro: new Date()
    });
    // retornamos
    return result.insertedId;
  },

  async buscarPorEmail(db, email) {
    return await db.collection(this.collection).findOne({ email });
  }
};