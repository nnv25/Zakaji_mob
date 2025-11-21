import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    delivery: { type: Boolean, default: false },
    image: { type: String, required: true },
    worktime: {
      weekdays: { type: String, required: true },
      saturday: { type: String, required: true },
      sunday: { type: String, required: true },
    },
    isBanned: { type: Boolean, default: false }, // 👈 флаг блокировки
  },
  { timestamps: true }
);

const restaurantModel =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);

export default restaurantModel;
