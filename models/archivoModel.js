export const ArchivoModel = {
    async listarPorPelicula(db, titulo) {
        return await db.collection("reseñas").find({ titulo }).toArray();
    },
}