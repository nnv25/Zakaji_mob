import React from "react";
import "./SupportPage.css";

const SupportPage = () => {
  return (
    <div className="support">
      <div className="support-container">
        <h1 className="support-title">Поддержка приложения «Закажи»</h1>

        <p className="support-text">
          Если у вас возникли вопросы, проблемы или предложения по работе
          приложения «Закажи», пожалуйста, свяжитесь с нами любым удобным
          способом.
        </p>

        <div className="support-contacts">
          <div className="support-contact">
            <span className="label">📧 Электронная почта:</span>
            <a href="mailto:nnv25@mail.ru">nnv25@mail.ru</a>
          </div>

          <div className="support-contact">
            <span className="label">📞 Телефон:</span>
            <a href="tel:+79141090001">+7 (914) 109-00-01</a>
          </div>
        </div>

        <div className="support-info">
          <h2>Часто задаваемые вопросы</h2>
          <ul>
            <li>Как восстановить доступ к аккаунту?</li>
            <li>Почему не отображается заказ?</li>
            <li>Как связаться с поддержкой?</li>
          </ul>
        </div>

        <p className="support-footer">
          Мы стараемся отвечать на обращения как можно быстрее. Спасибо, что
          используете приложение «Закажи»!
        </p>
      </div>
    </div>
  );
};

export default SupportPage;
