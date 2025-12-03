import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());

await connectMongo();

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
