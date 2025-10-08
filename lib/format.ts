/**
 * Formatte un nombre avec des espaces comme séparateurs de milliers
 * Version cohérente entre serveur et client
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Formatte un prix en dollars
 */
export function formatPrice(price: number): string {
  return `$${price}`;
}

/**
 * Formatte un montant avec décimales
 */
export function formatDecimal(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}
