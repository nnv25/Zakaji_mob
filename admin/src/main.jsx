import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";

// 🟢 Импортируем Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopProvider>
      <App />
      {/* 🟢 Контейнер для всех тостов */}
      <ToastContainer
        position="top-center" // где будет показываться
        autoClose={2500} // время закрытия (мс)
        hideProgressBar={false} // прогресс-бар
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // стиль: colored / dark / light
      />
    </ShopProvider>
  </BrowserRouter>
);
