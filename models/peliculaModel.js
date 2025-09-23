// models/pelicula.model.js
export const PeliculaModel = {
    async crear(db, pelicula) {
        const result = await db.collection("peliculas").insertOne(pelicula);
        return result.insertedId;
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

    async listarTodas(db) {
        return await db.collection("peliculas").find().toArray();
    }
};