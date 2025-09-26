// Importar extensiones de node y variables de entorno
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
// creamos un cliente de mongo db
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
await client.connect();
// conectar a la base de datos
const db = client.db(process.env.DB_NAME);
// exportamos el ciente y la base de datos
export { client, db };