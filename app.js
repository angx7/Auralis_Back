// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongo } from "./config/mongo.js";
import router from "./routes/index.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
await connectMongo();

// Rutas principales
app.use("/", router);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Auralis API running on port ${PORT}`);
});
