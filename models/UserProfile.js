import mongoose from "mongoose";

const DeteccionVisualSchema = new mongoose.Schema(
  {
    notas_incorrectas_visual: { type: Number, required: true },
    secuencia_detectada: [
      {
        tiempo_ms: { type: Number, required: true },
        nota_detectada: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const AnalisisAudioSchema = new mongoose.Schema(
  {
    precision_ritmica: { type: Number, required: true },
    errores_promedio_ms: { type: Number, required: true },
  },
  { _id: false }
);

const SesionSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    song_id: { type: String, required: true, ref: "Song" },

    fecha_sesion: { type: Date, required: true },
    puntaje_total: { type: Number, required: true },

    deteccion_visual: { type: DeteccionVisualSchema, required: true },

    analisis_audio_opcional: { type: AnalisisAudioSchema },
  },
  { _id: false }
);

const UserProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    favoritas: [{ type: String, ref: "Song" }],

    historial_desempeno: [SesionSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("UserProfile", UserProfileSchema);
