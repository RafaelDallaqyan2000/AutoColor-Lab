import React from 'react';
import { CarInfo } from '../../types/car';
import './CarInfoDisplay.css';

interface CarInfoDisplayProps {
  carInfo: CarInfo;
}

const CarInfoDisplay: React.FC<CarInfoDisplayProps> = ({ carInfo }) => {
  return (
    <div className="car-info-display">
      <h3 className="car-info-title">Информация об автомобиле</h3>
      <div className="car-info-grid">
        <div className="car-info-item">
          <span className="car-info-label">Марка:</span>
          <span className="car-info-value">{carInfo.make}</span>
        </div>
        <div className="car-info-item">
          <span className="car-info-label">Модель:</span>
          <span className="car-info-value">{carInfo.model}</span>
        </div>
        <div className="car-info-item">
          <span className="car-info-label">Год:</span>
          <span className="car-info-value">{carInfo.year}</span>
        </div>
        <div className="car-info-item">
          <span className="car-info-label">Цвет:</span>
          <span className="car-info-value">{carInfo.color}</span>
        </div>
        {carInfo.colorCode && (
          <div className="car-info-item">
            <span className="car-info-label">Код цвета:</span>
            <span className="car-info-value">{carInfo.colorCode}</span>
          </div>
        )}
        {carInfo.engine && (
          <div className="car-info-item">
            <span className="car-info-label">Двигатель:</span>
            <span className="car-info-value">{carInfo.engine}</span>
          </div>
        )}
        {carInfo.bodyType && (
          <div className="car-info-item">
            <span className="car-info-label">Тип кузова:</span>
            <span className="car-info-value">{carInfo.bodyType}</span>
          </div>
        )}
        <div className="car-info-item">
          <span className="car-info-label">VIN:</span>
          <span className="car-info-value vin-code">{carInfo.vin}</span>
        </div>
      </div>
    </div>
  );
};

export default CarInfoDisplay;

