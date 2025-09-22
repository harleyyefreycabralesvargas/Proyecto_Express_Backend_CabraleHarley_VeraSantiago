// src/config/db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

export async function conectar() {
  if (db) return db;

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  
 
  db = client.db(process.env.DB_NAME);
  
  console.log("✅ Conectado a MongoDB:", process.env.DB_NAME);
  return db;
}