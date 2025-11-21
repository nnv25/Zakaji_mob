import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import foodRouter from "./routes/foodRoute.js";
import categoryRouter from "./routes/categoryRouter.js";
import userRoutes from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import bannerRouter from "./routes/bannerRoutes.js";
import adminUserRouter from "./routes/adminUserRoutes.js";

const app = express();
const port = 4000;

// создаем HTTP сервер
const server = http.createServer(app);

// создаем socket.io сервер
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// обработка подключений
io.on("connection", (socket) => {
  console.log("🟢 Клиент подключён:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Клиент отключён:", socket.id);
  });
});

// middleware
app.use(express.json());
app.use(cors());

// статика
app.use("/uploads", express.static("uploads"));
app.use("/uploadsFood", express.static("uploadsFood"));
app.use("/uploadsBanner", express.static("uploadsBanner"));

// db connect
connectDB();

// роуты
app.use("/api/restaurant", restaurantRouter);
app.use("/api/food", foodRouter);
app.use("/api/category", categoryRouter);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/admin-users", adminUserRouter);

app.get("/", (req, res) => {
  res.send("Zakaji API Working");
});

// запуск сервера с websocket
server.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});