import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./AddBanners.css";

const API_URL = import.meta.env.VITE_API_URL;

const AddBanners = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
  });

  const [preview, setPreview] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
  });

  useEffect(() => {
    fetch(`${API_URL}/api/banners/all`)
      .then((res) => res.json())
      .then((data) => {
        setPreview(data);
      })
      .catch((err) => console.error("Ошибка загрузки баннеров:", err));
  }, []);

  const handleChange = (key, file) => {
    setBanners((prev) => ({ ...prev, [key]: file }));
    setPreview((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (banners.banner1) formData.append("banner1", banners.banner1);
    if (banners.banner2) formData.append("banner2", banners.banner2);
    if (banners.banner3) formData.append("banner3", banners.banner3);

    try {
      const res = await fetch(`${API_URL}/api/banners/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Ошибка загрузки");
      alert("Баннеры успешно обновлены!");
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Ошибка при загрузке баннеров");
    }
  };

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">ДОБАВИТЬ / ИЗМЕНИТЬ БАННЕРЫ</h3>
      </div>

      <hr className="shop-info-divider" />

      <div className="add-img-upload flex-col">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <p className="shop-title">Баннер {i}</p>
            <label htmlFor={`banner${i}`}>
              <img
                src={
                  preview[`banner${i}`]
                    ? preview[`banner${i}`]
                    : assets.shop_logo_load
                }
                alt={`banner${i}`}
                className="upload-preview"
              />
            </label>
            <input
              type="file"
              id={`banner${i}`}
              accept="image/*"
              hidden
              onChange={(e) => handleChange(`banner${i}`, e.target.files[0])}
            />
          </div>
        ))}
      </div>

      <button type="button" className="add-btn" onClick={handleSubmit}>
        Сохранить баннеры
      </button>
    </div>
  );
};

export default AddBanners;
