import React, { useState } from 'react';
import VINInput from '../VINInput/VINInput';
import CarInfoDisplay from '../CarInfoDisplay/CarInfoDisplay';
import ColorOptions from '../ColorOptions/ColorOptions';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { CarInfo } from '../../../types/car';
import { ColorMatch } from '../../../types/color';
import { fetchCarByVIN, fetchColorMatches } from '../../../utils/api';
import './ColorMatcher.css';

const ColorMatcher: React.FC = () => {
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [colorMatches, setColorMatches] = useState<ColorMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVINSubmit = async (vin: string) => {
    setIsLoading(true);
    setError(null);
    setCarInfo(null);
    setColorMatches([]);

    try {
      const car = await fetchCarByVIN(vin);
      
      if (!car) {
        setError('Автомобиль с таким VIN-кодом не найден в базе данных.');
        setIsLoading(false);
        return;
      }

      setCarInfo(car);

      // Получаем подбор цветов
      const matches = await fetchColorMatches(car.colorCode || '', car.make);
      setColorMatches(matches);
    } catch (err) {
      setError('Произошла ошибка при поиске. Попробуйте еще раз.');
      console.error('Error fetching car data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="color-matcher">
      <div className="color-matcher-header">
        <h1 className="color-matcher-title">Подбор краски по VIN-коду</h1>
        <p className="color-matcher-description">
          Введите VIN-код вашего автомобиля, и мы подберем подходящую краску
        </p>
      </div>

      <VINInput onVINSubmit={handleVINSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="color-matcher-loading">
          <LoadingSpinner size="large" />
          <p>Поиск информации об автомобиле...</p>
        </div>
      )}

      {error && (
        <div className="color-matcher-error">
          <p>{error}</p>
        </div>
      )}

      {carInfo && !isLoading && (
        <>
          <CarInfoDisplay carInfo={carInfo} />
          <ColorOptions colorMatches={colorMatches} />
        </>
      )}
    </div>
  );
};

export default ColorMatcher;

