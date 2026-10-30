export const CONFIG = {
  brand: 'kaya candles',
  currency: 'INR',
  locale: 'en-IN',
  freeShippingThreshold: 1500,
  shippingFlatRate: 99,
  whatsappNumber: '919376755713',
};

export const money = (amount) =>
  new Intl.NumberFormat(CONFIG.locale, {
    style: 'currency',
    currency: CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(amount);
