import { ColorMatch } from "../types/color";
import { products } from "./products";

export function getColorMatches(
  colorCode: string,
  brand: string
): ColorMatch[] {
  // Моковая функция подбора цветов
  // В реальном приложении это будет API запрос

  const matchingProducts = products.filter(
    (p) => p.colorCode === colorCode || p.brand === brand
  );

  if (matchingProducts.length === 0) {
    return [];
  }

  return [
    {
      id: "1",
      colorName: matchingProducts[0].color,
      colorCode: matchingProducts[0].colorCode,
      matchPercentage: 100,
      products: matchingProducts,
      hexColor: getHexColorByCode(matchingProducts[0].colorCode),
    },
    {
      id: "2",
      colorName: "Альтернативный вариант",
      colorCode: matchingProducts[0].colorCode + "-ALT",
      matchPercentage: 95,
      products: products
        .filter((p) => p.type === matchingProducts[0].type && p.brand === brand)
        .slice(0, 2),
      hexColor: getHexColorByCode(matchingProducts[0].colorCode),
    },
  ];
}

function getHexColorByCode(colorCode: string): string {
  // Простая функция для получения hex цвета по коду
  const colorMap: Record<string, string> = {
    "668": "#000000", // Черный
    "744": "#C0C0C0", // Серебристый
    LY7W: "#FFFFFF", // Белый
    "1G3": "#808080", // Серый
    LC9A: "#0000FF", // Синий
    U3: "#FF0000", // Красный
    "040": "#FFFFFF", // Белый (Lada)
  };
  return colorMap[colorCode] || "#CCCCCC";
}
