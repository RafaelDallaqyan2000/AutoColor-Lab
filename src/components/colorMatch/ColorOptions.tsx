import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorMatch } from '../../types/color';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';
import './ColorOptions.css';

interface ColorOptionsProps {
  colorMatches: ColorMatch[];
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ colorMatches }) => {
  const navigate = useNavigate();

  if (colorMatches.length === 0) {
    return (
      <div className="color-options-empty">
        <p>К сожалению, подходящие варианты краски не найдены.</p>
      </div>
    );
  }

  return (
    <div className="color-options">
      <h3 className="color-options-title">Подобранные варианты краски</h3>
      <div className="color-options-grid">
        {colorMatches.map((match) => (
          <div key={match.id} className="color-option-card">
            <div className="color-option-header">
              <div className="color-option-info">
                <h4 className="color-option-name">{match.colorName}</h4>
                <span className="color-option-code">Код: {match.colorCode}</span>
              </div>
              <div className="color-option-match">
                <span className="match-percentage">{match.matchPercentage}%</span>
                <span className="match-label">совпадение</span>
              </div>
            </div>
            {match.hexColor && (
              <div
                className="color-preview"
                style={{ backgroundColor: match.hexColor }}
              ></div>
            )}
            <div className="color-option-products">
              <p className="products-count">
                Найдено товаров: {match.products.length}
              </p>
              <div className="products-list">
                {match.products.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-item-info">
                      <span className="product-item-name">{product.name}</span>
                      <span className="product-item-price">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => navigate(`/catalog/${product.id}`)}
                    >
                      Подробнее
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="primary"
              size="medium"
              onClick={() => navigate('/catalog', { state: { colorCode: match.colorCode } })}
              className="view-all-button"
            >
              Посмотреть все варианты
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorOptions;

