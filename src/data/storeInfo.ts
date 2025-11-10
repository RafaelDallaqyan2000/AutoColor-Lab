export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: {
    weekdays: string;
    saturday?: string;
    sunday?: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  socialMedia?: {
    vk?: string;
    telegram?: string;
    instagram?: string;
  };
}

export const storeInfo: StoreInfo = {
  name: "AutoColor Lab",
  address: "г. Москва, ул. Автомобильная, д. 15",
  phone: "+7 (495) 123-45-67",
  email: "info@autocolorlab.ru",
  workingHours: {
    weekdays: "Пн-Пт: 9:00 - 20:00",
    saturday: "Сб: 10:00 - 18:00",
    sunday: "Вс: выходной",
  },
  coordinates: {
    lat: 55.7558,
    lng: 37.6173,
  },
  socialMedia: {
    vk: "https://vk.com/autocolorlab",
    telegram: "https://t.me/autocolorlab",
  },
};
