import React from 'react';
import { ProductFilter, PaintType, SortOption } from '../../types/product';
import Input from '../common/Input';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: ProductFilter;
  sortOption: SortOption;
  onFilterChange: (filters: ProductFilter) => void;
  onSortChange: (sort: SortOption) => void;
  brands: string[];
  types: PaintType[];
  maxPrice: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  sortOption,
  onFilterChange,
  onSortChange,
  brands,
  types,
  maxPrice,
}) => {
  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const typeLabels: Record<PaintType, string> = {
    base: 'Базовая',
    metallic: 'Металлик',
    pearl: 'Перламутр',
    solid: 'Сплошная',
    primer: 'Грунт',
    clearcoat: 'Лак',
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3 className="filter-panel-title">Фильтры</h3>
        <button
          type="button"
          onClick={clearFilters}
          className="filter-clear-button"
        >
          Сбросить
        </button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Сортировка</label>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="filter-select"
        >
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
          <option value="name-asc">Название: А-Я</option>
          <option value="name-desc">Название: Я-А</option>
          <option value="popularity">Популярность</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Бренд</label>
        <select
          value={filters.brand || ''}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="filter-select"
        >
          <option value="">Все бренды</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Тип краски</label>
        <select
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value as PaintType)}
          className="filter-select"
        >
          <option value="">Все типы</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {typeLabels[type]}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Цена</label>
        <div className="price-range">
          <Input
            type="number"
            placeholder="От"
            value={filters.minPrice?.toString() || ''}
            onChange={(e) =>
              handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="price-input"
          />
          <span className="price-separator">—</span>
          <Input
            type="number"
            placeholder="До"
            value={filters.maxPrice?.toString() || ''}
            onChange={(e) =>
              handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="price-input"
          />
        </div>
        <div className="price-hint">Макс: {maxPrice.toLocaleString('ru-RU')} ₽</div>
      </div>
    </div>
  );
};

export default FilterPanel;

