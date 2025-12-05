import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password_hash: {
      type: String,
      required: true,
    },

    // Última vez que el usuario inició sesión
    last_connection: {
      type: Date,
      default: null,
    },

    // Nueva propiedad: racha de días consecutivos
    login_streak: {
      type: Number,
      default: 0,
    },

    // Último día en que se actualizó la racha
    last_streak_update: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
