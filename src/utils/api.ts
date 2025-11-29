import { CarInfo } from "../types/car";
import { ColorMatch } from "../types/color";
import { Product } from "../types/product";
import { findCarByVIN } from "../data/carDatabase";
import { getColorMatches } from "../data/colorMatches";
import { products } from "../data/products";
import { apiCache } from "./cache";

// Конфигурация API
const API_CONFIG = {
  // Использовать бекенд API (по умолчанию true, можно отключить через .env)
  useBackend: process.env.REACT_APP_USE_BACKEND !== "false",
  backendUrl: process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/api",
  // Использовать внешний VIN API (по умолчанию false)
  useRealVINAPI: process.env.REACT_APP_USE_VIN_API === "true",
  vinApiUrl:
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
    let url = `${API_CONFIG.vinApiUrl}/DecodeVinValues/${vin}?format=json`;
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
 * Использует бекенд API, внешний VIN API или моковые данные
 */
export async function fetchCarByVIN(vin: string): Promise<CarInfo | null> {
  // Если включен бекенд API
  if (API_CONFIG.useBackend) {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/cars/vin/${vin}`);

      if (response.ok) {
        const carInfo = await response.json();
        return carInfo;
      } else if (response.status === 404) {
        // Автомобиль не найден в БД, пробуем внешний VIN API если включен
        if (API_CONFIG.useRealVINAPI) {
          const carInfo = await fetchCarByVINFromAPI(vin);
          if (carInfo && carInfo.make) {
            // Сохраняем в бекенд для будущего использования
            try {
              await fetch(`${API_CONFIG.backendUrl}/cars`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(carInfo),
              });
            } catch (error) {
              console.warn("Не удалось сохранить автомобиль в БД:", error);
            }
            return carInfo;
          }
        }
        // Если внешний API не вернул данные, используем моковые данные
        console.warn("Автомобиль не найден, используем моковые данные");
        return findCarByVIN(vin);
      }
    } catch (error) {
      console.error("Ошибка при запросе к бекенду:", error);
      // Fallback на моковые данные
      return findCarByVIN(vin);
    }
  }

  // Если бекенд не используется, пробуем внешний VIN API
  if (API_CONFIG.useRealVINAPI) {
    const carInfo = await fetchCarByVINFromAPI(vin);
    if (carInfo && carInfo.make) {
      return carInfo;
    }
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
  if (!API_CONFIG.useRealVINAPI || vins.length === 0) {
    return [];
  }

  try {
    // Формируем строку для пакетного запроса: vin,year; vin,year; ...
    const batchString = vins
      .map((item) => `${item.vin}${item.year ? `,${item.year}` : ""}`)
      .join("; ");

    const url = `${API_CONFIG.vinApiUrl}/DecodeVINValuesBatch/`;

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
 * API запрос для подбора цветов
 */
export async function fetchColorMatches(
  colorCode: string,
  brand: string
): Promise<ColorMatch[]> {
  // Если включен бекенд API
  if (API_CONFIG.useBackend) {
    try {
      const params = new URLSearchParams({
        colorCode,
        brand,
      });
      const response = await fetch(
        `${API_CONFIG.backendUrl}/color-matches?${params.toString()}`
      );

      if (response.ok) {
        const matches = await response.json();
        // Преобразуем ID и ID продуктов из числа в строку, price в число
        return matches.map((match: any) => ({
          ...match,
          id: String(match.id),
          products:
            match.products?.map((product: any) => ({
              ...product,
              id: String(product.id),
              price:
                typeof product.price === "string"
                  ? parseFloat(product.price)
                  : product.price,
            })) || [],
        }));
      } else {
        console.warn(
          "Ошибка при получении совпадений цветов, используем моковые данные"
        );
      }
    } catch (error) {
      console.error("Ошибка при запросе к бекенду:", error);
    }
  }

  // Fallback на моковые данные
  await new Promise((resolve) => setTimeout(resolve, 800));
  return getColorMatches(colorCode, brand);
}

/**
 * API запрос для получения товаров
 */
export async function fetchProducts(): Promise<Product[]> {
  const cacheKey = "products";

  // Проверяем кэш
  const cached = apiCache.get<Product[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Если включен бекенд API
  if (API_CONFIG.useBackend) {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/products`);

      if (response.ok) {
        const productsData = await response.json();
        // Преобразуем ID из числа в строку и price в число для совместимости
        const transformedProducts = productsData.map((product: any) => ({
          ...product,
          id: String(product.id),
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
        }));

        // Сохраняем в кэш на 5 минут
        apiCache.set(cacheKey, transformedProducts, 5 * 60 * 1000);
        return transformedProducts;
      } else {
        console.warn(
          "Ошибка при получении продуктов, используем моковые данные"
        );
      }
    } catch (error) {
      console.error("Ошибка при запросе к бекенду:", error);
    }
  }

  // Fallback на моковые данные
  await new Promise((resolve) => setTimeout(resolve, 300));
  return products;
}

/**
 * API запрос для получения товара по ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  // Если включен бекенд API
  if (API_CONFIG.useBackend) {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/products/${id}`);

      if (response.ok) {
        const product = await response.json();
        // Преобразуем ID из числа в строку и price в число для совместимости
        return {
          ...product,
          id: String(product.id),
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
        };
      } else if (response.status === 404) {
        return null;
      } else {
        console.warn(
          "Ошибка при получении продукта, используем моковые данные"
        );
      }
    } catch (error) {
      console.error("Ошибка при запросе к бекенду:", error);
    }
  }

  // Fallback на моковые данные
  await new Promise((resolve) => setTimeout(resolve, 300));
  return products.find((p) => p.id === id) || null;
}

/**
 * API запрос для создания нового продукта (админка)
 */
export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  if (API_CONFIG.useBackend) {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при создании продукта");
      }

      const createdProduct = await response.json();
      const transformedProduct = {
        ...createdProduct,
        id: String(createdProduct.id),
        price:
          typeof createdProduct.price === "string"
            ? parseFloat(createdProduct.price)
            : createdProduct.price,
      };

      // Инвалидируем кэш продуктов
      apiCache.delete("products");

      return transformedProduct;
    } catch (error) {
      console.error("Ошибка при создании продукта:", error);
      throw error;
    }
  }
  throw new Error("Бекенд не настроен");
}

/**
 * API запрос для обновления продукта (админка)
 */
export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id">>
): Promise<Product> {
  if (API_CONFIG.useBackend) {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при обновлении продукта");
      }

      const updatedProduct = await response.json();
      const transformedProduct = {
        ...updatedProduct,
        id: String(updatedProduct.id),
        price:
          typeof updatedProduct.price === "string"
            ? parseFloat(updatedProduct.price)
            : updatedProduct.price,
      };

      // Инвалидируем кэш продуктов
      apiCache.delete("products");

      return transformedProduct;
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
      throw error;
    }
  }
  throw new Error("Бекенд не настроен");
}

/**
 * API запрос для удаления продукта (админка)
 */
export async function deleteProduct(id: string): Promise<void> {
  if (API_CONFIG.useBackend) {
    try {
      const response = await fetch(`${API_CONFIG.backendUrl}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при удалении продукта");
      }

      // Инвалидируем кэш продуктов
      apiCache.delete("products");
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      throw error;
    }
  } else {
    throw new Error("Бекенд не настроен");
  }
}
