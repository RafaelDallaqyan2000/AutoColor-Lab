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
  address: "д. Гетаовит, ул.19, переулок 1, д. 8",
  phone: "+374 98 87 58 25",
  email: "info@autocolorlab.ru",
  workingHours: {
    weekdays: "Пн-Вс: 11:00 - 24:00 (без выходных)",
  },
  coordinates: {
    lat: 40.904409,
    lng: 45.144666,
  },
  socialMedia: {
    vk: "",
    telegram: "",
  },
};
