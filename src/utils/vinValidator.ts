/**
 * Валидация VIN-кода
 * VIN должен содержать 17 символов (цифры и буквы, кроме I, O, Q)
 */
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  const normalizedVIN = vin.toUpperCase().trim();

  if (!normalizedVIN) {
    return { isValid: false, error: "VIN-код не может быть пустым" };
  }

  if (normalizedVIN.length !== 17) {
    return { isValid: false, error: "VIN-код должен содержать 17 символов" };
  }

  // Проверка на недопустимые символы (I, O, Q)
  const invalidChars = /[IOQ]/;
  if (invalidChars.test(normalizedVIN)) {
    return {
      isValid: false,
      error: "VIN-код содержит недопустимые символы (I, O, Q)",
    };
  }

  // Проверка формата (только буквы и цифры)
  const validFormat = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!validFormat.test(normalizedVIN)) {
    return { isValid: false, error: "VIN-код содержит недопустимые символы" };
  }

  return { isValid: true };
}
