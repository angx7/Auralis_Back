import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());

// conectar a MongoDB
await connectMongo();

// rutas
app.use("/  ", router);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
