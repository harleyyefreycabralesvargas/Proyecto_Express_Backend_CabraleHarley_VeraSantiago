// controllers/peliculas.controller.js
import { PeliculaModel } from "../models/peliculaModel.js";

export const PeliculasController = {
    async crear(req, res) {
        try {
            const { titulo,director ,descripcion, categoriaId, fechaPublicacion, poster } = req.body;

            if (!titulo ||!director || !descripcion || !categoriaId || !fechaPublicacion || !poster) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }

            const existe = await PeliculaModel.buscarPorTitulo(req.db, titulo);
            if (existe) {
                return res.status(400).json({ error: "Ya existe una película con ese título" });
            }

            const pelicula = {
                titulo,
                director,
                descripcion,
                categoriaId,
                fechaPublicacion: new Date(fechaPublicacion),
                poster,
                fechaRegistro: new Date()
            };

            const id = await PeliculaModel.crear(req.db, pelicula);
            res.status(201).json({ message: "Película añadida", id });
        } catch (err) {
            console.error("Error al crear película:", err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async buscarPorTitulo(req, res) {
        try {
            const { titulo } = req.params;
            const pelicula = await PeliculaModel.buscarPorTitulo(req.db, titulo);
            if (!pelicula) {
                return res.status(404).json({ error: "Película no encontrada" });
            }
            res.json(pelicula);
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async actualizar(req, res) {
        try {
            const { titulo } = req.params;
            const { descripcion, categoriaId, fechaPublicacion, poster } = req.body;

            const datos = {};
            if (descripcion) datos.descripcion = descripcion;
            if (categoriaId) datos.categoriaId = categoriaId;
            if (fechaPublicacion) datos.fechaPublicacion = new Date(fechaPublicacion);
            if (poster) datos.poster = poster;

            const modificados = await PeliculaModel.actualizar(req.db, titulo, datos);
            if (modificados === 0) {
                return res.status(404).json({ error: "Película no encontrada o sin cambios" });
            }

            res.json({ message: "Película actualizada" });
        } catch (err) {
            console.error("Error al actualizar película:", err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async eliminar(req, res) {
        try {
            const { titulo } = req.params;
            const eliminados = await PeliculaModel.eliminar(req.db, titulo);
            if (eliminados === 0) {
                return res.status(404).json({ error: "Película no encontrada" });
            }
            res.json({ message: "Película eliminada" });
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async listarTodas(req, res) {
        try {
            const peliculas = await PeliculaModel.listarTodas(req.db);
            res.json(peliculas);
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
};