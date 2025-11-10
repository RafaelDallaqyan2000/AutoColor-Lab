import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import { fetchProductById } from '../../utils/api';
import { formatPrice } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProductById(productId);
      if (data) {
        setProduct(data);
      } else {
        setError('Товар не найден');
      }
    } catch (err) {
      setError('Ошибка при загрузке товара');
      console.error('Error loading product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="product-details-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка товара...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <p>{error || 'Товар не найден'}</p>
        <Button variant="primary" onClick={() => navigate('/catalog')}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      base: 'Базовая',
      metallic: 'Металлик',
      pearl: 'Перламутр',
      solid: 'Сплошная',
      primer: 'Грунт',
      clearcoat: 'Лак',
    };
    return labels[type] || type;
  };

  return (
    <div className="product-details">
      <Button
        variant="outline"
        onClick={() => navigate('/catalog')}
        className="product-details-back"
      >
        ← Назад к каталогу
      </Button>

      <div className="product-details-content">
        <div className="product-details-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-details-placeholder">
              <span>{product.brand}</span>
            </div>
          )}
        </div>

        <div className="product-details-info">
          <div className="product-details-header">
            <span className="product-details-brand">{product.brand}</span>
            <span className="product-details-type">{getTypeLabel(product.type)}</span>
          </div>

          <h1 className="product-details-name">{product.name}</h1>

          <div className="product-details-price">
            {formatPrice(product.price)}
          </div>

          <div className="product-details-status">
            {product.inStock ? (
              <span className="status-in-stock">✓ В наличии</span>
            ) : (
              <span className="status-out-of-stock">✗ Нет в наличии</span>
            )}
            {product.quantity && product.inStock && (
              <span className="product-quantity">
                Остаток: {product.quantity} шт.
              </span>
            )}
          </div>

          <div className="product-details-specs">
            <div className="spec-item">
              <span className="spec-label">Цвет:</span>
              <span className="spec-value">{product.color}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Код цвета:</span>
              <span className="spec-value code">{product.colorCode}</span>
            </div>
            {product.specifications && product.specifications.length > 0 && (
              <>
                {product.specifications.map((spec, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-label">{spec.name}:</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {product.description && (
            <div className="product-details-description">
              <h3 className="description-title">Описание</h3>
              <p className="description-text">{product.description}</p>
            </div>
          )}

          <div className="product-details-actions">
            <Button
              variant="primary"
              size="large"
              disabled={!product.inStock}
              className="action-button"
            >
              {product.inStock ? 'Связаться с нами' : 'Нет в наличии'}
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate('/color-match')}
              className="action-button"
            >
              Подобрать по VIN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

