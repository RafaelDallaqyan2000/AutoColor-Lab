export interface Product {
  id: string;
  name: string;
  brand: string;
  type: PaintType;
  color: string;
  colorCode: string;
  price: number;
  description: string;
  image?: string;
  inStock: boolean;
  quantity?: number;
  specifications?: ProductSpecification[];
}

export type PaintType =
  | "base"
  | "metallic"
  | "pearl"
  | "solid"
  | "primer"
  | "clearcoat";

export interface ProductCategory {
  id: string;
  name: string;
  paintType: PaintType;
}

export interface ProductFilter {
  search?: string;
  brand?: string;
  type?: PaintType;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "popularity";
