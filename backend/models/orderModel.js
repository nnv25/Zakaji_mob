import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        title: String,
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        weight: String,
        image: String,
      },
    ],
    tableNumber: { type: String, required: true },
    comment: { type: String },
    totalPrice: { type: Number, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
