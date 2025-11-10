import { Product } from "./product";

export interface ColorMatch {
  id: string;
  colorName: string;
  colorCode: string;
  matchPercentage: number;
  products: Product[];
  hexColor?: string;
}

export interface ColorOption {
  id: string;
  name: string;
  code: string;
  hexColor: string;
  price: number;
  productId: string;
}
