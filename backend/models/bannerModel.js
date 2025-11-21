import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    banner1: { type: String, required: false },
    banner2: { type: String, required: false },
    banner3: { type: String, required: false },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;