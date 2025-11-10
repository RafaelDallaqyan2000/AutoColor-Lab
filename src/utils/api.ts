import { CarInfo } from "../types/car";
import { ColorMatch } from "../types/color";
import { Product } from "../types/product";
import { findCarByVIN } from "../data/carDatabase";
import { getColorMatches } from "../data/colorMatches";
import { products } from "../data/products";

// Конфигурация API (можно вынести в .env)
const API_CONFIG = {
  useRealAPI: true, // Переключить на true для использования реального API
  apiUrl:
    process.env.REACT_APP_VIN_API_URL ||
    "https://vpic.nhtsa.dot.gov/api/vehicles",
};

/**
 * Интерфейс для ответа NHTSA API
 * Results - это массив объектов с плоской структурой, где каждое поле - это переменная
 */
interface NHTSAResult {
  [key: string]: string; // Динамические поля: Make, Model, Model Year, и т.д.
}

interface NHTSAResponse {
  Count: number;
  Message: string;
  Results: NHTSAResult[];
  SearchCriteria?: string;
}

/**
 * Запрос к NHTSA API для декодирования VIN
 * Использует эндпоинт: GET /vehicles/DecodeVinValues/{VIN}?format=json&modelyear=YYYY
 */
async function fetchCarByVINFromAPI(
  vin: string,
  year?: number
): Promise<CarInfo | null> {
  try {
    // NHTSA API не требует API ключа
    // Формируем URL с опциональным годом модели
    let url = `${API_CONFIG.apiUrl}/DecodeVinValues/${vin}?format=json`;
    if (year) {
      url += `&modelyear=${year}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: NHTSAResponse = await response.json();

    if (!data.Results || data.Results.length === 0) {
      console.warn("NHTSA API returned no results");
      return null;
    }

    // Берем первый результат (обычно он один)
    const result = data.Results[0];

    // Вспомогательная функция для получения значения поля
    const getValue = (key: string): string => {
      const value = result[key] || "";
      return value && value !== "Not Applicable" && value !== "" ? value : "";
    };

    // Извлекаем нужные данные из ответа NHTSA
    const make = getValue("Make") || "";
    const model = getValue("Model") || "";
    const modelYear = getValue("ModelYear") || "";
    const bodyClass = getValue("BodyClass") || "";
    const engineCylinders = getValue("EngineCylinders") || "";
    const engineDisplacement = getValue("DisplacementL") || "";
    const engineConfiguration = getValue("EngineConfiguration") || "";
    const engineHP = getValue("EngineHP") || "";
    const fuelType = getValue("FuelTypePrimary") || "";
    const driveType = getValue("DriveType") || "";

    // Проверяем наличие ошибки в VIN (ErrorCode и ErrorText)
    const errorCode = getValue("ErrorCode");
    const errorText = getValue("ErrorText");
    if (errorCode && errorCode !== "0" && errorCode !== "") {
      console.warn(
        `NHTSA API warning for VIN ${vin}: ${errorText || errorCode}`
      );
    }

    // Формируем строку двигателя
    let engine = "";
    if (engineDisplacement || engineCylinders || engineHP) {
      const parts: string[] = [];
      if (engineDisplacement) parts.push(`${engineDisplacement}L`);
      if (engineCylinders) parts.push(`${engineCylinders} cyl`);
      if (engineHP) parts.push(`${engineHP} HP`);
      if (engineConfiguration) parts.push(engineConfiguration);
      if (fuelType) parts.push(fuelType);
      engine = parts.join(", ");
    }

    // Преобразование данных NHTSA в формат CarInfo
    return {
      vin: getValue("VIN") || vin,
      make: make,
      model: model,
      year: modelYear ? parseInt(modelYear) : new Date().getFullYear(),
      color: "", // NHTSA не предоставляет информацию о цвете
      colorCode: "", // NHTSA не предоставляет код цвета
      engine: engine || undefined,
      bodyType: bodyClass || undefined,
    };
  } catch (error) {
    console.error("Error fetching car data from NHTSA API:", error);
    return null;
  }
}

/**
 * API запрос для поиска автомобиля по VIN
 * Использует реальный API если настроен, иначе моковые данные
 */
export async function fetchCarByVIN(vin: string): Promise<CarInfo | null> {
  // Если включен реальный API
  if (API_CONFIG.useRealAPI) {
    const carInfo = await fetchCarByVINFromAPI(vin);
    if (carInfo && carInfo.make) {
      // Если API вернул данные, используем их
      return carInfo;
    }
    // Если API не вернул данные, используем fallback на моковые данные
    console.warn(
      "NHTSA API request failed or returned incomplete data, using mock data as fallback"
    );
  }

  // Используем моковые данные
  await new Promise((resolve) => setTimeout(resolve, 500));
  return findCarByVIN(vin);
}

/**
 * Пакетный запрос к NHTSA API для декодирования нескольких VIN
 * Использует эндпоинт: POST /vehicles/DecodeVINValuesBatch/
 * Формат: vin,year; vin,year; ... (до 50 VIN)
 */
export async function fetchCarsByVINBatch(
  vins: Array<{ vin: string; year?: number }>
): Promise<CarInfo[]> {
  if (!API_CONFIG.useRealAPI || vins.length === 0) {
    return [];
  }

  try {
    // Формируем строку для пакетного запроса: vin,year; vin,year; ...
    const batchString = vins
      .map((item) => `${item.vin}${item.year ? `,${item.year}` : ""}`)
      .join("; ");

    const url = `${API_CONFIG.apiUrl}/DecodeVINValuesBatch/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vins: batchString,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: NHTSAResponse = await response.json();

    if (!data.Results || data.Results.length === 0) {
      return [];
    }

    // Группируем результаты по VIN
    // В пакетном запросе каждый результат соответствует одному VIN
    const resultsByVin: Record<string, NHTSAResult> = {};
    data.Results.forEach((result, index) => {
      const vin = result.VIN || vins[index]?.vin || "";
      if (vin) {
        resultsByVin[vin] = result;
      }
    });

    // Преобразуем результаты в массив CarInfo
    const cars: CarInfo[] = [];
    for (const vinItem of vins) {
      const result = resultsByVin[vinItem.vin];
      if (result) {
        const getValue = (key: string): string => {
          const value = result[key] || "";
          return value && value !== "Not Applicable" && value !== ""
            ? value
            : "";
        };

        const make = getValue("Make") || "";
        const model = getValue("Model") || "";
        const modelYear = getValue("ModelYear") || "";
        const bodyClass = getValue("BodyClass") || "";
        const engineCylinders = getValue("EngineCylinders") || "";
        const engineDisplacement = getValue("DisplacementL") || "";
        const engineHP = getValue("EngineHP") || "";
        const engineConfiguration = getValue("EngineConfiguration") || "";
        const fuelType = getValue("FuelTypePrimary") || "";

        // Формируем строку двигателя
        let engine = "";
        if (engineDisplacement || engineCylinders || engineHP) {
          const parts: string[] = [];
          if (engineDisplacement) parts.push(`${engineDisplacement}L`);
          if (engineCylinders) parts.push(`${engineCylinders} cyl`);
          if (engineHP) parts.push(`${engineHP} HP`);
          if (engineConfiguration) parts.push(engineConfiguration);
          if (fuelType) parts.push(fuelType);
          engine = parts.join(", ");
        }

        if (make) {
          cars.push({
            vin: vinItem.vin,
            make: make,
            model: model,
            year: modelYear ? parseInt(modelYear) : new Date().getFullYear(),
            color: "",
            colorCode: "",
            engine: engine || undefined,
            bodyType: bodyClass || undefined,
          });
        }
      }
    }

    return cars;
  } catch (error) {
    console.error("Error fetching cars data from NHTSA API (batch):", error);
    return [];
  }
}

/**
 * Имитация API запроса для подбора цветов
 */
export async function fetchColorMatches(
  colorCode: string,
  brand: string
): Promise<ColorMatch[]> {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 800));
  return getColorMatches(colorCode, brand);
}

/**
 * Имитация API запроса для получения товаров
 */
export async function fetchProducts(): Promise<Product[]> {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 300));
  return products;
}

/**
 * Имитация API запроса для получения товара по ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 300));
  return products.find((p) => p.id === id) || null;
}
