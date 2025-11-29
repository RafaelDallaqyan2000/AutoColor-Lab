import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Product, PaintType } from "../../types/product";
import { fetchProducts, deleteProduct } from "../../utils/api";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import Button from "../../components/common/Button/Button";
import { formatPrice } from "../../utils/formatters";
import "./AdminPage.css";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("Ошибка при загрузке товаров");
      console.error("Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (deleteConfirm !== id) {
        setDeleteConfirm(id);
        return;
      }

      try {
        await deleteProduct(id);
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      } catch (err) {
        setError(`Ошибка при удалении товара "${name}"`);
        console.error("Error deleting product:", err);
        setDeleteConfirm(null);
      }
    },
    [deleteConfirm]
  );

  const getTypeLabel = useCallback((type: PaintType): string => {
    const labels: Record<PaintType, string> = {
      base: "Базовая",
      metallic: "Металлик",
      pearl: "Перламутр",
      solid: "Сплошная",
      primer: "Грунт",
      clearcoat: "Лак",
    };
    return labels[type] || type;
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка товаров...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Панель администратора</h1>
        <div className="admin-page-actions">
          <Button
            variant="primary"
            onClick={() => navigate("/admin/products/new")}
          >
            + Добавить товар
          </Button>
          <Button variant="secondary" onClick={() => navigate("/catalog")}>
            Вернуться в каталог
          </Button>
        </div>
      </div>

      {error && (
        <div className="admin-page-error">
          <p>{error}</p>
          <Button variant="error" onClick={() => setError(null)}>
            Закрыть
          </Button>
        </div>
      )}

      {/* Таблица для десктопа */}
      <div className="admin-products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Бренд</th>
              <th>Тип</th>
              <th>Цвет</th>
              <th>Код цвета</th>
              <th>Цена</th>
              <th>В наличии</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty-message">
                  Товары не найдены
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{getTypeLabel(product.type)}</td>
                  <td>{product.color}</td>
                  <td>
                    <span className="color-code">{product.colorCode}</span>
                  </td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span
                      className={`stock-status ${
                        product.inStock ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {product.inStock ? "✓ Да" : "✗ Нет"}
                    </span>
                  </td>
                  <td>{product.quantity || 0}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          navigate(`/admin/products/${product.id}/edit`)
                        }
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="error"
                        size="small"
                        onClick={() => handleDelete(product.id, product.name)}
                        className={
                          deleteConfirm === product.id ? "delete-confirm" : ""
                        }
                      >
                        {deleteConfirm === product.id
                          ? "Подтвердить?"
                          : "Удалить"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Карточки для мобильных устройств */}
      <div className="admin-products-cards">
        {products.length === 0 ? (
          <div
            className="empty-message"
            style={{ padding: "2rem", textAlign: "center" }}
          >
            Товары не найдены
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="admin-product-card">
              <div className="admin-product-card-header">
                <div>
                  <div className="admin-product-card-id">ID: {product.id}</div>
                  <div className="admin-product-card-title">{product.name}</div>
                </div>
                <span
                  className={`stock-status ${
                    product.inStock ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.inStock ? "✓ В наличии" : "✗ Нет"}
                </span>
              </div>
              <div className="admin-product-card-info">
                <div className="admin-product-card-field">
                  <div className="admin-product-card-label">Бренд</div>
                  <div className="admin-product-card-value">
                    {product.brand}
                  </div>
                </div>
                <div className="admin-product-card-field">
                  <div className="admin-product-card-label">Тип</div>
                  <div className="admin-product-card-value">
                    {getTypeLabel(product.type)}
                  </div>
                </div>
                <div className="admin-product-card-field">
                  <div className="admin-product-card-label">Цвет</div>
                  <div className="admin-product-card-value">
                    {product.color}
                  </div>
                </div>
                <div className="admin-product-card-field">
                  <div className="admin-product-card-label">Код цвета</div>
                  <div className="admin-product-card-value">
                    <span className="color-code">{product.colorCode}</span>
                  </div>
                </div>
                <div className="admin-product-card-field">
                  <div className="admin-product-card-label">Цена</div>
                  <div className="admin-product-card-value">
                    {formatPrice(product.price)}
                  </div>
                </div>
                <div className="admin-product-card-field">
                  <div className="admin-product-card-label">Количество</div>
                  <div className="admin-product-card-value">
                    {product.quantity || 0} шт.
                  </div>
                </div>
              </div>
              <div className="admin-product-card-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                >
                  Редактировать
                </Button>
                <Button
                  variant="error"
                  size="small"
                  onClick={() => handleDelete(product.id, product.name)}
                  className={
                    deleteConfirm === product.id ? "delete-confirm" : ""
                  }
                >
                  {deleteConfirm === product.id ? "Подтвердить?" : "Удалить"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;
