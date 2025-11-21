import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isMobilePhone(v, "any"),
      message: "Неверный формат номера телефона",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Защита от повторного создания модели (важно при hot reload)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
