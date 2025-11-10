import { CarInfo } from "../types/car";

// Моковая база данных автомобилей по VIN
// В реальном приложении это будет API запрос
export const carDatabase: Record<string, CarInfo> = {
  WBA3A5C58EF123456: {
    vin: "WBA3A5C58EF123456",
    make: "BMW",
    model: "3 Series",
    year: 2014,
    color: "Черный",
    colorCode: "668",
    engine: "2.0L",
    bodyType: "Седан",
  },
  WDDNG8GB8BA123456: {
    vin: "WDDNG8GB8BA123456",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2011,
    color: "Серебристый",
    colorCode: "744",
    engine: "1.8L",
    bodyType: "Седан",
  },
  WAUZZZ8T6DA123456: {
    vin: "WAUZZZ8T6DA123456",
    make: "Audi",
    model: "A4",
    year: 2013,
    color: "Белый перламутр",
    colorCode: "LY7W",
    engine: "2.0L",
    bodyType: "Седан",
  },
  JTDBR32E123456789: {
    vin: "JTDBR32E123456789",
    make: "Toyota",
    model: "Camry",
    year: 2015,
    color: "Серый",
    colorCode: "1G3",
    engine: "2.5L",
    bodyType: "Седан",
  },
  WVWZZZ1KZCW123456: {
    vin: "WVWZZZ1KZCW123456",
    make: "Volkswagen",
    model: "Passat",
    year: 2012,
    color: "Синий",
    colorCode: "LC9A",
    engine: "1.8L",
    bodyType: "Седан",
  },
  "1FAHP2D80DG123456": {
    vin: "1FAHP2D80DG123456",
    make: "Ford",
    model: "Focus",
    year: 2013,
    color: "Красный",
    colorCode: "U3",
    engine: "2.0L",
    bodyType: "Хэтчбек",
  },
  LSJA16E3XCG067514: {
    vin: "LSJA16E3XCG067514",
    make: "Lada",
    model: "Granta",
    year: 2012,
    color: "Белый",
    colorCode: "040",
    engine: "1.6L",
    bodyType: "Седан",
  },
};

export function findCarByVIN(vin: string): CarInfo | null {
  const normalizedVIN = vin.toUpperCase().trim();
  return carDatabase[normalizedVIN] || null;
}
