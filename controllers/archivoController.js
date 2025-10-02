import { ObjectId } from "mongodb";
import { ArchivoModel } from "../models/archivoModel.js";
import fs from "fs"
import { log } from "console";
export const ArchivoController = {
    async listar(req, res) {
        try {
            const { titulo } = req.params;
            const reseñas = await ArchivoModel.listarPorPelicula(req.db, titulo);

            // Formatear fecha antes de enviar
            const reseñasConFormato = reseñas.map((r) => ({
                usuario: r.usuario, // ya es email
                calificacion: r.calificacion,
                texto: r.texto,
                fecha: new Date(r.fecha).toLocaleString("es-CO"),
            }));
            
            console.log(reseñas);

            var writeStream = fs.createWriteStream("./exports/pelicula_" + titulo + ".csv");
            writeStream.write(`Usuario,Calificacion,Comentario,Fecha
${reseñas[0].usuario},${reseñas[0].calificacion},${reseñas[0].texto},${reseñas[0].fecha}`);
            writeStream.end();

            res.json(reseñasConFormato);
        } catch (err) {
            console.error("Error en listar reseñas:", err);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },
}
// async function exports(id) {
//     let { collection } = await conectar("personas");
//     // Buscar usuario por su nombre
//     let user = await collection.findOne({idPersona:id});
//     await desconectarDb();
//     let informacion=await verProyectosC(id)
//     console.log(informacion)


//     var writeStream = fs.createWriteStream("./exports/cliente_" + user.name + ".json");
//     writeStream.write(`{"_id": "${reseñas[0].}}{user._id}",
//       "idPersona": ${user.idPersona},
//       "name": "${user.name}",
//       "apellido": "${user.apellido}",
//       "email": "${user.email}",
//       "telefono": "${user.telefono}",
//       "userName": "${user.userName}",
//       "password": "${user.password}",
//       "rol": "${user.rol}"
//     }`);
//     writeStream.end();
// }
// async function pedirCliente() {
//     let id = await inquirer.prompt([
//         { type: "number", name: "cualId", message: "Cual es el id del cliente a exportar:" }
//     ])
//     return id.cualId
// }
// let id = await pedirCliente()
// let resultado = await exports(id)
