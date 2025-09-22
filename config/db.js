import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const client = new MongoClient(process.env.MONGO_URI);

export async function conectar(coleccion) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    return db.collection(coleccion);
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
  }
}

export async function desconectarDb() {
  await client.close();
}