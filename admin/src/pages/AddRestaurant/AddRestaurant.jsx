import { useState } from "react";
import { assets } from "../../assets/assets";
import "./AddRestaurant.css";

const AddRestaurant = () => {
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // Форматирование телефона
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    let formatted = "+7";
    if (digits.length > 1) formatted += "(" + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ")";
    if (digits.length >= 5) formatted += digits.slice(4, 7);
    if (digits.length >= 7) formatted += "-" + digits.slice(7, 9);
    if (digits.length >= 9) formatted += "-" + digits.slice(9, 11);
    return formatted;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(formatPhone(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.name.value);
    formData.append("weekdays", form.weekdays.value);
    formData.append("saturday", form.saturday.value);
    formData.append("sunday", form.sunday.value);
    formData.append("address", form.address.value);
    formData.append("phone", phone);
    formData.append("delivery", form.delivery.value);
    formData.append("image", image);

    try {
      const res = await fetch(`${API_URL}/api/restaurant/add`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        form.reset();
        setImage(null);
        setPhone("");
      }
    } catch (error) {
      console.error("Ошибка при добавлении ресторана:", error);
      alert("Ошибка при добавлении ресторана");
    }
  };

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">ДОБАВИТЬ РЕСТОРАН</h3>
      </div>
      <hr className="shop-info-divider" />
      <form className="flex-col" onSubmit={handleSubmit}>
        <div className="add-shop-name">
          <p className="shop-title">Название ресторана</p>
          <input
            type="text"
            name="name"
            placeholder="Введите название ресторана"
            required
            className="addshop-input"
          />
        </div>

        <div className="add-shop-worktime">
          <label className="shop-title">Часы работы:</label>
          <div className="shop-worktime">
            <div className="addshop-container">
              <p className="shop-title-time">Пн–Пт</p>
              <input
                name="weekdays"
                placeholder="Введите часы работы в будни"
                required
                className="addshop-input"
              />
            </div>
            <div className="addshop-container">
              <p className="shop-title-time">Суб</p>
              <input
                name="saturday"
                placeholder="Введите часы работы в субботу"
                required
                className="addshop-input"
              />
            </div>
            <div className="addshop-container">
              <p className="shop-title-time">Вск</p>
              <input
                name="sunday"
                placeholder="Введите часы работы в воскресенье"
                required
                className="addshop-input"
              />
            </div>
          </div>
        </div>

        <div className="add-shop-address">
          <p className="shop-title">Адрес</p>
          <input
            type="text"
            name="address"
            placeholder="Введите адрес ресторана"
            required
            className="addshop-input"
          />
        </div>

        <div className="add-shop-phone">
          <p className="shop-title">Телефон</p>
          <input
            type="tel"
            name="phone"
            inputMode="numeric"
            placeholder="+7(999)999-99-99"
            className="addshop-input"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
        </div>

        <div className="add-shop-delivery">
          <p className="shop-title">Доставка:</p>
          <select name="delivery" className="addshop-input">
            <option value="false">Нет</option>
            <option value="true">Да</option>
          </select>
        </div>

        <div className="add-img-upload flex-col">
          <p className="shop-title">Загрузить логотип ресторана</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.shop_logo_load}
              alt="Upload area"
            />
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            hidden
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="add-btn">
          Добавить ресторан
        </button>
      </form>
    </div>
  );
};

export default AddRestaurant;
