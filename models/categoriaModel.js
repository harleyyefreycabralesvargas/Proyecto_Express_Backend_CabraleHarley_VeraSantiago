export const CategoriaModel = {
    async crear(db, categoria) {
        const result = await db.collection("categorias").insertOne(categoria);
        return result.insertedId;
    },

    async buscarPorId(db, categoriaId) {
        return await db.collection("categorias").findOne({ categoriaId });
    },

    async actualizar(db, categoriaId, datos) {
        const result = await db.collection("categorias").updateOne(
            { categoriaId },
            { $set: datos }
        );
        return result.modifiedCount;
    },

    async eliminar(db, categoriaId) {
        const result = await db.collection("categorias").deleteOne({ categoriaId });
        return result.deletedCount;
    },

    async listarTodas(db) {
        return await db.collection("categorias").find().toArray();
    }
};