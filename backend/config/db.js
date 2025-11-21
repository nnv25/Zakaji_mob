import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://nikitindamir87_db_user:t1F82aY63jI1AiXX@cluster0.bupzfht.mongodb.net/Zakaji"
    )
    .then(() => console.log("DB Connected"));
};
