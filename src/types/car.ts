export interface CarInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  colorCode?: string;
  engine?: string;
  bodyType?: string;
}

export interface VINData {
  vin: string;
  isValid: boolean;
  carInfo?: CarInfo;
}
