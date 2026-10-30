// Local demo service layer. Replace these implementations with real API calls
// when a backend is added; this file keeps UI code separate from data access.
import { products } from './products.js';

export async function fetchProducts() {
  return products;
}

export async function fetchProduct(idOrSlug) {
  return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug) || null;
}

export async function fetchInventory(productId) {
  return products.find((product) => product.id === productId)?.inventory ?? 0;
}

export async function submitOrder() {
  return {
    demo: true,
    reference: `DEMO-${Date.now().toString().slice(-6)}`,
    message: 'Demo only. No order was submitted or payment processed.',
  };
}

export async function subscribeNewsletter() {
  return { demo: true, message: 'Demo only. Your email was not saved and no email was sent.' };
}

export async function submitContact() {
  return { demo: true, message: 'Demo only. Your message was not saved or sent.' };
}
