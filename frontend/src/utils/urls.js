/**
 * Utility: Get the base URL for accessing uploaded files in /storage/.
 * 
 * In development, Vite proxy handles /storage/ → backend.
 * In production (same domain), /storage/ is served directly.
 * If VITE_API_URL is set (cross-domain), derive storage URL from it.
 */
const STORAGE_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : '';

/**
 * Returns a full URL to a storage file.
 * @param {string} path — relative path like "jenjang/logo_tk.png"
 * @returns {string} — e.g. "/storage/jenjang/logo_tk.png"
 */
export function getStorageUrl(path) {
  if (!path) return '';
  // If path already starts with http, return as-is
  if (path.startsWith('http')) return path;
  // Strip leading slash from path
  const cleanPath = path.replace(/^\//, '');
  return `${STORAGE_BASE}/storage/${cleanPath}`;
}

/**
 * Returns the Midtrans Snap JS URL based on environment.
 * @returns {string}
 */
export function getMidtransSnapUrl() {
  const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
  return isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
}
