import { PeliculaModel } from "../models/peliculaModel.js";


export const PeliculasController = {
    async crear(req, res) {
      try {
        const { titulo, descripcion,director, categoria, fechaPublicacion, poster } = req.body;
  
        if (!titulo || !descripcion || !director || !categoria || !fechaPublicacion) {
          return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
  
        const pelicula = {
          titulo,
          director,
          descripcion,
          categoria,
          fechaPublicacion: new Date(fechaPublicacion),
          poster
        };
  
        const id = await PeliculaModel.crear(req.db, pelicula);
        res.status(201).json({ message: "Película creada", id });
      } catch (err) {
        console.error(" Error al crear película:", err);
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
    console.error("❌ Error en buscarPorTitulo:", err);
    res.status(500).json({ error: "Error en el servidor", detalle: err.message });
  }
},
  
    async actualizar(req, res) {
      try {
        const { titulo } = req.params;
        const datos = req.body;
  
        const mod = await PeliculaModel.actualizar(req.db, titulo, datos);
        if (mod === 0) return res.status(404).json({ error: "No encontrada o sin cambios" });
  
        res.json({ message: "Película actualizada" });
      } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
      }
    },
  
    async eliminar(req, res) {
      try {
        const { titulo } = req.params;
        const del = await PeliculaModel.eliminar(req.db, titulo);
        if (del === 0) return res.status(404).json({ error: "No encontrada" });
  
        res.json({ message: "Película eliminada" });
      } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
      }
    },
  
    // Random
    async random(req, res) {
      try {
        const peliculas = await PeliculaModel.random(req.db, 50);
        res.json(peliculas);
      } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
      }
    },
  
    // Mejor rankeadas
    async topRated(req, res) {
      try {
        const peliculas = await PeliculaModel.topRated(req.db, 30);
        res.json(peliculas);
      } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
      }
    },
  
    // Más vistas
    async mostViewed(req, res) {
        try {
          const peliculas = await PeliculaModel.mostViewed(req.db, 50);
          res.json(peliculas);
        } catch (err) {
          res.status(500).json({ error: "Error en el servidor" });
        }
      },
      async darLike(req, res) {
  try {
    const { titulo } = req.params;
    const usuario = req.user.email;

    // Quitar al usuario de dislikes y añadir a likes (sin duplicados)
    const result = await req.db.collection("peliculas").updateOne(
      { titulo },
      {
        $addToSet: { likes: usuario },
        $pull: { dislikes: usuario }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json({ mensaje: "Like registrado" });
  } catch (err) {
    console.error("Error en darLike:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
},

async darDislike(req, res) {
  try {
    const { titulo } = req.params;
    const usuario = req.user.email;

    // Quitar al usuario de likes y añadir a dislikes (sin duplicados)
    const result = await req.db.collection("peliculas").updateOne(
      { titulo },
      {
        $addToSet: { dislikes: usuario },
        $pull: { likes: usuario }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json({ mensaje: "Dislike registrado" });
  } catch (err) {
    console.error("Error en darDislike:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
  };