import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          AutoColor Lab
        </Link>
        <nav className="header-nav">
          <Link
            to="/"
            className={`header-nav-link ${isActive("/") ? "active" : ""}`}
          >
            Главная
          </Link>
          <Link
            to="/color-match"
            className={`header-nav-link ${
              isActive("/color-match") ? "active" : ""
            }`}
          >
            Подбор краски
          </Link>
          <Link
            to="/catalog"
            className={`header-nav-link ${
              isActive("/catalog") ? "active" : ""
            }`}
          >
            Каталог
          </Link>
          <Link
            to="/contacts"
            className={`header-nav-link ${
              isActive("/contacts") ? "active" : ""
            }`}
          >
            Контакты
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
