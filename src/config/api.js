/**
 * Dynamic API Configuration for Seha SportsMed Platform
 *
 * Automatically adapts across servers (local development, staging, production):
 * - In Development: Uses relative '/api' via Vite proxy (configured in vite.config.js from .env).
 * - In Production: Uses relative '/api' via reverse-proxy (Nginx / Cloudflare) OR absolute VITE_API_BASE_URL.
 */

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const FALLBACK_PROXY_TARGET = import.meta.env.VITE_BACKEND_PROXY_TARGET || '';

/**
 * Returns full API URL for a given path.
 * e.g., getApiUrl('/api/v1/auth/login') -> '/api/v1/auth/login' (or 'https://server.domain/api/v1/auth/login')
 */
export const getApiUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!RAW_BASE_URL) {
    return cleanPath;
  }
  return `${RAW_BASE_URL.replace(/\/+$/, '')}${cleanPath}`;
};

/**
 * Fallback URL in case relative proxy fails during local development without reverse proxy.
 */
export const getFallbackApiUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (FALLBACK_PROXY_TARGET) {
    return `${FALLBACK_PROXY_TARGET.replace(/\/+$/, '')}${cleanPath}`;
  }
  return getApiUrl(path);
};

export default {
  getApiUrl,
  getFallbackApiUrl,
};
