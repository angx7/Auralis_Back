import mongoose from "mongoose";

const VisualNoteSchema = new mongoose.Schema(
  {
    tiempo_ms: { type: Number, required: true },
    nota_detectada: { type: String, required: true },
  },
  { _id: false }
);

const DeteccionVisualSchema = new mongoose.Schema(
  {
    notas_incorrectas_visual: { type: Number, required: true },
    secuencia_detectada: [VisualNoteSchema],
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

const SessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    song_id: { type: String, required: true, ref: "Song" },

    fecha_sesion: { type: Date, default: Date.now },

    puntaje_total: { type: Number, required: true },

    deteccion_visual: { type: DeteccionVisualSchema, required: true },

    analisis_audio_opcional: { type: AnalisisAudioSchema },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Session", SessionSchema);
