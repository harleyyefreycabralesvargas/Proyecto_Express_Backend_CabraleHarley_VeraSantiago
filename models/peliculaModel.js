// exportar funciones acerca de peliculas
export const PeliculaModel = {
  async crear(db, pelicula) {
    const result = await db.collection("peliculas").insertOne({
      ...pelicula,
      vistas: 0,
      promedio: 0
    });
    return result.insertedId;
  },

  async listarTodas(db) {
    return await db.collection("peliculas").find().toArray();
  },

  async buscarPorTitulo(db, titulo) {
    return await db.collection("peliculas").findOne({ titulo });
  },

  async actualizar(db, titulo, datos) {
    const result = await db.collection("peliculas").updateOne(
      { titulo },
      { $set: datos }
    );
    return result.modifiedCount;
  },

  async eliminar(db, titulo) {
    const result = await db.collection("peliculas").deleteOne({ titulo });
    return result.deletedCount;
  },

  // Random con $sample
  async random(db, cantidad = 50) {
    return await db.collection("peliculas").aggregate([
      { $sample: { size: cantidad } }
    ]).toArray();
  },

  // Mejor rankeadas
  async topRated(db, cantidad = 30) {
    return await db.collection("peliculas")
      .find()
      .sort({ rating: -1 })
      .limit(cantidad)
      .toArray();
  },

  // Más vistas
  async mostViewed(db, cantidad = 50) {
    return await db.collection("peliculas").aggregate([
      {
        $addFields: {
          totalReacciones: {
            $add: [
              { $size: { $ifNull: ["$likes", []] } },
              { $size: { $ifNull: ["$dislikes", []] } }
            ]
          }
        }
      },
      { $sort: { totalReacciones: -1 } },
      { $limit: cantidad }
    ]).toArray();
  }
};