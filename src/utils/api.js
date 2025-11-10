// Shared API helpers

// Default to the supplied backend; Vite override via VITE_API_URL supported.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://gracelutheranbacke.onrender.com').replace(/\/$/, '');

/**
 * apiFetch(pathOrUrl, options)
 * - pathOrUrl: relative path (e.g. '/users/login') or absolute URL
 * - options: fetch options (body should be a string if sending JSON)
 * Automatically prefixes API_URL for relative paths and attaches Authorization header if token present.
 */
export async function apiFetch(pathOrUrl, options = {}) {
  const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
  const url = isAbsolute ? pathOrUrl : `${API_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = Object.assign(
    {},
    options.headers || {},
    // add JSON header if there's a body string or object
    (!options.headers && options.body !== undefined) ? { 'Content-Type': 'application/json' } : {}
  );

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const opts = { ...options, headers };

  return fetch(url, opts);
}
