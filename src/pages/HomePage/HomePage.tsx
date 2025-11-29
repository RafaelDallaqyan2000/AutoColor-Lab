import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-image-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">AutoColor Lab</h1>
          <p className="hero-subtitle">
            Профессиональный подбор и продажа автокраски
          </p>
          <p className="hero-description">
            Мы предлагаем широкий ассортимент качественной автокраски и
            профессиональный подбор цвета по VIN-коду вашего автомобиля
          </p>
          <div className="hero-actions">
            <Link to="/color-match">
              <Button variant="primary" size="large">
                Подобрать краску
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="outline" size="large">
                Каталог товаров
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="features-container">
          <h2 className="features-title">Наши услуги</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Подбор краски по VIN</h3>
              <p className="feature-description">
                Точный подбор цвета краски по VIN-коду вашего автомобиля. Просто
                введите VIN и получите список подходящих вариантов.
              </p>
              <Link to="/color-match" className="feature-link">
                Подобрать краску →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3 className="feature-title">Каталог товаров</h3>
              <p className="feature-description">
                Широкий ассортимент автокраски различных брендов и типов.
                Удобный поиск и фильтрация по параметрам.
              </p>
              <Link to="/catalog" className="feature-link">
                Открыть каталог →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3 className="feature-title">Наш магазин</h3>
              <p className="feature-description">
                Приходите к нам в магазин для консультации и покупки. Мы всегда
                готовы помочь с выбором.
              </p>
              <Link to="/contacts" className="feature-link">
                Контакты →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-content">
          <h2 className="cta-title">Нужна помощь с выбором?</h2>
          <p className="cta-description">
            Свяжитесь с нами, и мы поможем подобрать идеальную краску для вашего
            автомобиля
          </p>
          <Link to="/contacts">
            <Button variant="primary" size="large">
              Связаться с нами
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
