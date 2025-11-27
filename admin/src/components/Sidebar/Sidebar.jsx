import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {userRole === "superadmin" && (
          <>
            <NavLink to="/addshop" className="sidebar-option">
              <img src={assets.shop_add} className="sidebar-img" alt="" />
              <p>Добавить ресторан</p>
            </NavLink>
            <NavLink to="/shoplist" className="sidebar-option">
              <img src={assets.shop_icon} className="sidebar-img" alt="" />
              <p>Список ресторанов</p>
            </NavLink>
            <NavLink to="/administrator" className="sidebar-option">
              <img src={assets.moderator_icon} className="sidebar-img" alt="" />
              <p>Администраторы</p>
            </NavLink>
            <NavLink to="/banners" className="sidebar-option">
              <img src={assets.balance_edit_icon} className="sidebar-img" alt="" />
              <p>Баннеры</p>
            </NavLink>
          </>
        )}

        {(userRole === "superadmin" || userRole === "manager") && (
          <>
            <NavLink to="/category" className="sidebar-option">
              <img src={assets.balance_edit_icon} className="sidebar-img" alt="" />
              <p>Категории блюд</p>
            </NavLink>
            <NavLink to="/addproduct" className="sidebar-option">
              <img src={assets.item_add} className="sidebar-img" alt="" />
              <p>Добавить блюдо</p>
            </NavLink>
            <NavLink to="/updateshop" className="sidebar-option">
              <img src={assets.edit_icon} className="sidebar-img" alt="" />
              <p>Редактировать ресторан</p>
            </NavLink>
            <NavLink to="/productlist" className="sidebar-option">
              <img src={assets.item_icon} className="sidebar-img" alt="" />
              <p>Список блюд</p>
            </NavLink>
            <NavLink to="/orders" className="sidebar-option">
              <img src={assets.order_icon2} className="sidebar-img" alt="" />
              <p>Заказы</p>
            </NavLink>
            <NavLink to="/ratinglist" className="sidebar-option">
              <img src={assets.review_icon} className="sidebar-img" alt="" />
              <p>Отзывы</p>
            </NavLink>
            <NavLink to="/push" className="sidebar-option">
              <img src={assets.balance_icon} className="sidebar-img" alt="" />
              <p>Push уведомления</p>
            </NavLink>
          </>
        )}

        {userRole === "waiter" && (
          <NavLink to="/orders" className="sidebar-option">
            <img src={assets.order_icon2} className="sidebar-img" alt="" />
            <p>Заказы</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

