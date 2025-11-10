import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/catalog/SearchBar';
import FilterPanel from '../components/catalog/FilterPanel';
import ProductGrid from '../components/catalog/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Product, ProductFilter, SortOption, PaintType } from '../types/product';
import { fetchProducts } from '../utils/api';
import './CatalogPage.css';

const CatalogPage: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilter>(() => {
    // Получаем цвет из state, если перешли с страницы подбора
    const state = location.state as { colorCode?: string } | null;
    return state?.colorCode ? { color: state.colorCode } : {};
  });
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.colorCode.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    // Фильтры
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }
    if (filters.type) {
      filtered = filtered.filter((p) => p.type === filters.type);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.color) {
      filtered = filtered.filter((p) => p.colorCode === filters.color);
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name, 'ru');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'ru');
        case 'popularity':
          // Простая логика популярности (можно улучшить)
          return (b.quantity || 0) - (a.quantity || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, filters, sortOption]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map((p) => p.brand));
    return Array.from(uniqueBrands).sort();
  }, [products]);

  const types = useMemo(() => {
    const uniqueTypes = new Set(products.map((p) => p.type));
    return Array.from(uniqueTypes) as PaintType[];
  }, [products]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 0);
  }, [products]);

  if (isLoading) {
    return (
      <div className="catalog-page-loading">
        <LoadingSpinner size="large" />
        <p>Загрузка каталога...</p>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="catalog-page-header">
        <h1 className="catalog-page-title">Каталог товаров</h1>
        <p className="catalog-page-description">
          Найдите подходящую краску для вашего автомобиля
        </p>
      </div>

      <div className="catalog-page-search">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="catalog-page-content">
        <aside className="catalog-page-sidebar">
          <FilterPanel
            filters={filters}
            sortOption={sortOption}
            onFilterChange={setFilters}
            onSortChange={setSortOption}
            brands={brands}
            types={types}
            maxPrice={maxPrice}
          />
        </aside>
        <main className="catalog-page-main">
          <div className="catalog-page-results">
            <p className="results-count">
              Найдено товаров: {filteredAndSortedProducts.length}
            </p>
          </div>
          <ProductGrid products={filteredAndSortedProducts} />
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;

