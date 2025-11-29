import React from "react";
import { storeInfo } from "../../data/storeInfo";
import "./ContactsPage.css";

const ContactsPage: React.FC = () => {
  const { coordinates } = storeInfo;

  // Создаем URL для Яндекс.Карт
  const yandexMapUrl = `https://yandex.ru/map-widget/v1/?ll=${coordinates.lng},${coordinates.lat}&z=15&pt=${coordinates.lng},${coordinates.lat},pm2rdm`;

  return (
    <div className="contacts-page">
      <div className="contacts-page-header">
        <h1 className="contacts-page-title">Контакты</h1>
        <p className="contacts-page-description">
          Свяжитесь с нами или посетите наш магазин
        </p>
      </div>

      <div className="contacts-page-content">
        <div className="contacts-info">
          <div className="contact-section">
            <h2 className="contact-section-title">Контактная информация</h2>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-content">
                  <h3 className="contact-label">Адрес</h3>
                  <p className="contact-value">{storeInfo.address}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-content">
                  <h3 className="contact-label">Телефон</h3>
                  <a
                    href={`tel:${storeInfo.phone.replace(/\s/g, "")}`}
                    className="contact-value link"
                  >
                    {storeInfo.phone}
                  </a>
                </div>
              </div>

              {/* <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-content">
                  <h3 className="contact-label">Email</h3>
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="contact-value link"
                  >
                    {storeInfo.email}
                  </a>
                </div>
              </div> */}

              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div className="contact-content">
                  <h3 className="contact-label">Часы работы</h3>
                  <div className="contact-value">
                    <p>{storeInfo.workingHours.weekdays}</p>
                    {storeInfo.workingHours.saturday && (
                      <p>{storeInfo.workingHours.saturday}</p>
                    )}
                    {storeInfo.workingHours.sunday && (
                      <p>{storeInfo.workingHours.sunday}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {storeInfo.socialMedia &&
            (storeInfo.socialMedia.vk || storeInfo.socialMedia.telegram) && (
              <div className="contact-section">
                <h2 className="contact-section-title">Мы в соцсетях</h2>
                <div className="social-links">
                  {storeInfo.socialMedia.vk && (
                    <a
                      href={storeInfo.socialMedia.vk}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      VKontakte
                    </a>
                  )}
                  {storeInfo.socialMedia.telegram && (
                    <a
                      href={storeInfo.socialMedia.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      Telegram
                    </a>
                  )}
                  {storeInfo.socialMedia.instagram && (
                    <a
                      href={storeInfo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
        </div>

        <div className="contacts-map">
          <h2 className="map-title">Как нас найти</h2>
          <div className="map-container">
            <iframe
              src={yandexMapUrl}
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen
              title="Карта магазина"
              className="map-iframe"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
