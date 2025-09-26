import { ObjectId } from "mongodb";
import { ReseñaModel } from "../models/reseñaModel.js";

export const ReseñasController = {
    async crear(req, res) {
        const session = req.client.startSession(); // req.client = MongoClient
        try {
            const { titulo, texto, calificacion } = req.body;
            const usuario = req.user.email;

            if (!titulo || !texto || !calificacion) {
                return res.status(400).json({ error: "Faltan datos" });
            }

            await session.withTransaction(async () => {
                // 1. Insertar reseña
                await req.db.collection("reseñas").insertOne(
                    {
                        titulo,
                        texto,
                        calificacion: Number(calificacion),
                        usuario,
                        fecha: new Date(),
                    },
                    { session }
                );

                // 2. Recalcular rating
                const result = await req.db
                    .collection("reseñas")
                    .aggregate(
                        [
                            { $match: { titulo } },
                            {
                                $group: { _id: "$titulo", rating: { $avg: "$calificacion" } },
                            },
                        ],
                        { session }
                    )
                    .toArray();

                const rating = result.length > 0 ? result[0].rating : 0;

                // 3. Actualizar película
                await req.db
                    .collection("peliculas")
                    .updateOne({ titulo }, { $set: { rating } }, { session });
            });

            res.status(201).json({ mensaje: "Reseña creada y rating actualizado" });
        } catch (err) {
            console.error("Error en transacción:", err);
            res.status(500).json({ error: "Error en el servidor" });
        } finally {
            await session.endSession();
        }
    },

    async listar(req, res) {
        try {
            const { titulo } = req.params;
            const reseñas = await ReseñaModel.listarPorPelicula(req.db, titulo);

            // Formatear fecha antes de enviar
            const reseñasConFormato = reseñas.map((r) => ({
                usuario: r.usuario, // ya es email
                calificacion: r.calificacion,
                texto: r.texto,
                fecha: new Date(r.fecha).toLocaleString("es-CO"),
            }));

            res.json(reseñasConFormato);
        } catch (err) {
            console.error("Error en listar reseñas:", err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async eliminar(req, res) {
        const session = req.db.client.startSession();

        try {
            const { id } = req.params;
            const usuario = req.user.email;
            let resultadoFinal = null;

            await session.withTransaction(async () => {
                // 1. Buscar reseña antes de eliminar (para obtener el título)
                const reseña = await req.db.collection("reseñas").findOne(
                    { _id: new ObjectId(id), usuario },
                    { session }
                );

                if (!reseña) {
                    throw new Error("Reseña no encontrada o no te pertenece");
                }

                const titulo = reseña.titulo;

                // 2. Eliminar la reseña
                const result = await req.db.collection("reseñas").deleteOne(
                    { _id: new ObjectId(id), usuario },
                    { session }
                );

                if (result.deletedCount === 0) {
                    throw new Error("No se pudo eliminar la reseña");
                }

                // 3. Recalcular promedio de calificaciones
                const agg = await req.db.collection("reseñas").aggregate([
                    { $match: { titulo } },
                    { $group: { _id: "$titulo", promedio: { $avg: "$calificacion" } } }
                ], { session }).toArray();

                const nuevoPromedio = agg.length > 0 ? agg[0].promedio : 0;

                // 4. Actualizar película con nuevo promedio
                await req.db.collection("peliculas").updateOne(
                    { titulo },
                    { $set: { rating: nuevoPromedio } },
                    { session }
                );

                resultadoFinal = { mensaje: "Reseña eliminada y rating actualizado", rating: nuevoPromedio };
            });

            res.json(resultadoFinal);

        } catch (err) {
            console.error("Error en eliminar reseña:", err);
            res.status(500).json({ error: err.message });
        } finally {
            await session.endSession();
        }
    },
    async obtenerDeUsuario(req, res) {
        try {
            const { titulo } = req.params;
            const usuario = req.user.email;

            const reseña = await ReseñaModel.buscarPorUsuarioYPelicula(
                req.db,
                usuario,
                titulo
            );
            if (!reseña) {
                return res.status(404).json({ error: "No has reseñado esta película" });
            }

            res.json(reseña);
        } catch (err) {
            console.error("Error en obtenerDeUsuario:", err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },
    async editar(req, res) {
        const session = req.db.client.startSession();

        try {
            const { id } = req.params;
            const { texto, calificacion } = req.body;
            const usuario = req.user.email;

            let resultadoFinal = null;

            await session.withTransaction(async () => {
                // 1. Actualizar la reseña
                const result = await req.db.collection("reseñas").updateOne(
                    { _id: new ObjectId(id), usuario },
                    { $set: { texto, calificacion: Number(calificacion), fecha: new Date() } },
                    { session }
                );

                if (result.matchedCount === 0) {
                    throw new Error("Reseña no encontrada o no te pertenece");
                }

                // 2. Buscar reseña actualizada para obtener el título
                const reseña = await req.db.collection("reseñas").findOne(
                    { _id: new ObjectId(id) },
                    { session }
                );

                if (!reseña) {
                    throw new Error("Reseña no encontrada tras actualizar");
                }

                const titulo = reseña.titulo;

                // 3. Recalcular el promedio de calificaciones para esa película
                const agg = await req.db.collection("reseñas").aggregate([
                    { $match: { titulo } },
                    { $group: { _id: "$titulo", promedio: { $avg: "$calificacion" } } }
                ], { session }).toArray();

                const nuevoPromedio = agg.length > 0 ? agg[0].promedio : 0;

                // 4. Actualizar película con el nuevo promedio
                await req.db.collection("peliculas").updateOne(
                    { titulo },
                    { $set: { rating: nuevoPromedio } },
                    { session }
                );

                resultadoFinal = { mensaje: "Reseña y rating actualizados", rating: nuevoPromedio };
            });

            res.json(resultadoFinal);

        } catch (err) {
            console.error("Error en editar reseña:", err);
            res.status(500).json({ error: err.message });
        } finally {
            await session.endSession();
        }
    }
};
