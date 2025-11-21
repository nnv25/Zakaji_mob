import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import ShopDropDown from "../ShopDropDown/ShopDropDown";
import { ShopContext } from "../../context/ShopContext";

const Navbar = ({ onLogout, userRole }) => {
  const { selectedShop, setSelectedShop } = useContext(ShopContext);

  // выбор ресторана
  const handleShopChange = (shopId) => {
    console.log("Выбран ресторан:", shopId);
    setSelectedShop(shopId);
  };

  // сброс ресторана (только для superadmin)
  const handleResetShop = () => {
    if (userRole !== "superadmin") return; // 👈 защита
    console.log("Ресторан сброшен");
    setSelectedShop("");
  };

  // выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("username");
    setSelectedShop("");
    if (onLogout) onLogout(); // уведомляем App
  };

  return (
    <div className="navbar">
      <img className="epl-logo" src={assets.logo_zakaji} alt="Логотип" />

      <div className="navbar-menu__container">
        <ShopDropDown
          selectedShop={selectedShop}
          onShopChange={handleShopChange}
          userRole={userRole}
        />

        {userRole === "superadmin" && (
          <button className="reset-shop-button" onClick={handleResetShop}>
            Сбросить ресторан
          </button>
        )}
      </div>

      <div className="exit-container">
        <button className="exit-shop-button" onClick={handleLogout}>
          <img src={assets.logout_icon} alt="Выйти" className="logout-icon" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
