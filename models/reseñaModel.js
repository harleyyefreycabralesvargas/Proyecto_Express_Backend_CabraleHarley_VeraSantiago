import { ObjectId } from "mongodb";
export const ReseñaModel = {
    async crear(db, datos) {
        return await db.collection("reseñas").insertOne(datos);
    },

    async listarPorPelicula(db, titulo) {
        return await db.collection("reseñas").find({ titulo }).toArray();
    },

    async eliminar(db, id, usuario) {
        // El usuario solo puede borrar sus propias reseñas
        return await db.collection("reseñas").deleteOne({
            _id: id,
            usuario,
        });
    },
    async buscarPorUsuarioYPelicula(db, usuario, titulo) {
        return await db.collection("reseñas").findOne({ usuario, titulo });
    },

    async editar(db, id, usuario, datos) {
        const result = await db.collection("reseñas").updateOne(
            { _id: new ObjectId(id), usuario },   // filtro: id y que pertenezca al usuario
            { $set: { ...datos, fecha: new Date() } } // 👈 importante: spread!
        );
        return result.modifiedCount > 0;
    },
};
