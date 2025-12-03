import mongoose from "mongoose";

const RecursosSchema = new mongoose.Schema(
  {
    musicXMLUrl: { type: String, required: true },
    imagenUrl: { type: String, required: false, trim: true }, // URL de la imagen de la canción
  },
  { _id: false }
);

const SongSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Ej: "bethoveen_virus"

    titulo: { type: String, required: true, trim: true },
    artista: { type: String, required: true, trim: true },

    dificultad: {
      type: String,
      enum: ["facil", "intermedio", "dificil"],
      required: true,
    },

    recursos: { type: RecursosSchema, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Song", SongSchema);
