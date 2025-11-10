import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/catalog/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">
            <span>{product.brand}</span>
          </div>
        )}
        {!product.inStock && (
          <div className="product-card-badge out-of-stock">Нет в наличии</div>
        )}
      </div>
      <div className="product-card-content">
        <div className="product-card-header">
          <span className="product-card-brand">{product.brand}</span>
          <span className="product-card-type">{getTypeLabel(product.type)}</span>
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-info">
          <span className="product-card-color">Цвет: {product.color}</span>
          <span className="product-card-code">Код: {product.colorCode}</span>
        </div>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.inStock && (
            <span className="product-card-stock">В наличии</span>
          )}
        </div>
      </div>
    </Link>
  );
};

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    base: 'Базовая',
    metallic: 'Металлик',
    pearl: 'Перламутр',
    solid: 'Сплошная',
    primer: 'Грунт',
    clearcoat: 'Лак',
  };
  return labels[type] || type;
}

export default ProductCard;

