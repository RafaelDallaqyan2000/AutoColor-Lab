import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (path: string) => location.pathname === path;
  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Показываем header вверху страницы
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Прокрутка вниз - скрываем
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Прокрутка вверх - показываем
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${isVisible ? "header-visible" : "header-hidden"}`}>
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
          <Link
            to="/admin"
            className={`header-nav-link admin-link ${
              isAdminPath ? "active" : ""
            }`}
          >
            Админ
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

