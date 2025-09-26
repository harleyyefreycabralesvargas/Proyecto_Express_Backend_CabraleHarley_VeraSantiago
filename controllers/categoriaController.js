import { CategoriaModel } from "../models/categoriaModel.js";

export const CategoriasController = {
    async crear(req, res) {
        try {
            const { categoriaId, nombre, descripcion } = req.body;

            if (!categoriaId || !nombre || !descripcion) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }

            const existe = await CategoriaModel.buscarPorId(req.db, categoriaId);
            if (existe) {
                return res.status(400).json({ error: "Ya existe una categoría con ese ID" });
            }

            const categoria = { categoriaId, nombre, descripcion };
            const id = await CategoriaModel.crear(req.db, categoria);
            console.log("Body recibido:", req.body);
            res.status(201).json({ message: "Categoría añadida", id });
        } catch (err) {
            console.error(" Error al crear categoría:", err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async listarTodas(req, res) {
        try {
            const categorias = await CategoriaModel.listarTodas(req.db);
            res.json(categorias);
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { categoriaId } = req.params;
            const categoria = await CategoriaModel.buscarPorId(req.db, categoriaId);
            if (!categoria) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }
            res.json(categoria);
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async actualizar(req, res) {
        try {
            const { categoriaId } = req.params;
            const { nombre, descripcion } = req.body;

            const datos = {};
            if (nombre) datos.nombre = nombre;
            if (descripcion) datos.descripcion = descripcion;

            const modificados = await CategoriaModel.actualizar(req.db, categoriaId, datos);
            if (modificados === 0) {
                return res.status(404).json({ error: "Categoría no encontrada o sin cambios" });
            }

            res.json({ message: "Categoría actualizada" });
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    async eliminar(req, res) {
        try {
            const { categoriaId } = req.params;
            const eliminados = await CategoriaModel.eliminar(req.db, categoriaId);
            if (eliminados === 0) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }
            res.json({ message: "Categoría eliminada" });
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
};