import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import { ShopContext } from "./context/ShopContext";

import AddRestaurant from "./pages/AddRestaurant/AddRestaurant";
import AddFood from "./pages/AddFood/AddFood";
import EditRestaurant from "./pages/EditRestaurant/EditRestaurant";
import RestaurantList from "./pages/RestaurantList/RestaurantList";
import FoodList from "./pages/FoodList/FoodList";
import EditFood from "./pages/EditFood/EditFood";
import CategoryManager from "./pages/CategoryManager/CategoryManager";
import OrderList from "./pages/OrderList/OrderList";
import AddBanners from "./pages/AddBanners/AddBanners";
import AddUser from "./pages/AddUser/AddUser";
import PushPage from "./pages/PushPage/PushPage";

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const { selectedShop, setSelectedShop } = useContext(ShopContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setChecking(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin-users/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setUser({
            role: data.role,
            restaurantId: data.restaurant?._id,
            username: data.name,
          });
          if (data.restaurant?._id) setSelectedShop(data.restaurant._id); // ✅ подставляем сразу
        } else {
          localStorage.clear();
        }
      } catch (error) {
        localStorage.clear();
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) return <p>Загрузка...</p>;

  if (!user)
    return <Login onLogin={setUser} setSelectedShop={setSelectedShop} />; // ✅ передаём

  return (
    <>
      <Navbar onLogout={() => setUser(null)} userRole={user.role} />
      <hr />
      <div className="app-content">
        <Sidebar userRole={user.role} />
        <Routes>
          {/* SUPERADMIN */}
          {user.role === "superadmin" && (
            <>
              <Route
                path="/"
                element={<h2>Добро пожаловать, {user.username}</h2>}
              />
              <Route path="/addshop" element={<AddRestaurant />} />
              <Route path="/shoplist" element={<RestaurantList />} />
              <Route path="/administrator" element={<AddUser />} />
              <Route path="/banners" element={<AddBanners />} />
            </>
          )}

          {/* MANAGER */}
          {(user.role === "superadmin" || user.role === "manager") && (
            <>
              <Route path="/category" element={<CategoryManager />} />
              <Route path="/addproduct" element={<AddFood />} />
              <Route path="/updateshop" element={<EditRestaurant />} />
              <Route path="/productlist" element={<FoodList />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/ratinglist" element={<h2>Отзывы</h2>} />
              <Route path="/push" element={<PushPage/>} />
            </>
          )}

          {/* WAITER */}
          {(user.role === "superadmin" ||
            user.role === "manager" ||
            user.role === "waiter") && (
            <Route path="/orders" element={<OrderList />} />
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
