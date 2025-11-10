import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">AutoColor Lab</h3>
          <p className="footer-text">
            Профессиональный подбор и продажа автокраски
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Навигация</h4>
          <nav className="footer-nav">
            <Link to="/" className="footer-link">
              Главная
            </Link>
            <Link to="/color-match" className="footer-link">
              Подбор краски
            </Link>
            <Link to="/catalog" className="footer-link">
              Каталог
            </Link>
            <Link to="/contacts" className="footer-link">
              Контакты
            </Link>
          </nav>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Контакты</h4>
          <p className="footer-text">г. Москва, ул. Автомобильная, д. 15</p>
          <p className="footer-text">+7 (495) 123-45-67</p>
          <p className="footer-text">info@autocolorlab.ru</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 AutoColor Lab. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;

