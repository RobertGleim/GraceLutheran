// Shared API helpers

// Default to the supplied backend; Vite override via VITE_API_URL supported.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://gracelutheranbacke.onrender.com').replace(/\/$/, '');

// short in-memory cache to avoid hammering endpoints that return 404
const _failureCache = new Map(); // url -> expiry timestamp (ms)
const FAILURE_TTL = 60 * 1000; // 60s

/**
 * apiFetch(pathOrUrl, options)
 * - pathOrUrl: relative path (e.g. '/users/login') or absolute URL
 * - options: fetch options (body may be object or string)
 * Automatically prefixes API_URL for relative paths, attaches Authorization header if token present,
 * stringifies JS objects to JSON, sets Content-Type when sending a JSON body, and logs failing responses.
 */
export async function apiFetch(pathOrUrl, options = {}) {
  const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
  const url = isAbsolute ? pathOrUrl : `${API_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;

  // if this endpoint recently returned 404, short-circuit to avoid repeated failing calls
  const cached = _failureCache.get(url);
  if (cached && Date.now() < cached) {
    // return a synthetic 404 Response so callers handle it consistently
    // build a small JSON body for downstream consumers
    const body = JSON.stringify({ message: 'Endpoint previously returned 404 (cached).', url });
    // Response constructor is available in browsers; if not, throw to let caller handle
    try {
      return new Response(body, { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'application/json' } });
    } catch  {
      // fallback: throw to let caller handle the condition
      throw new Error(`Endpoint ${url} recently returned 404 (cached)`);
    }
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = Object.assign({}, options.headers || {});

  // If body is an object, stringify it and set JSON header
  let body = options.body;
  if (body !== undefined && body !== null) {
    if (typeof body === 'object' && !(body instanceof FormData)) {
      try {
        body = JSON.stringify(body);
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      } catch  {
        // leave body as-is if it cannot be stringified
      }
    } else if (typeof body === 'string') {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
  }

  if (token) {
    headers.Authorization = headers.Authorization || `Bearer ${token}`;
  }

  const opts = { ...options, body, headers };

  const res = await fetch(url, opts);

  // helpful logging and failure caching
  if (!res.ok) {
    // attempt to parse JSON body for debug info
    let debugBody = null;
    try {
      debugBody = await res.clone().json();
    } catch {
      debugBody = await res.clone().text().catch(()=>null);
    }
    
    console.warn(`[apiFetch] ${res.status} ${res.statusText} ${opts.method||'GET'} ${url}`, debugBody);

    // if 404, cache it briefly and print a hint
    if (res.status === 404) {
      _failureCache.set(url, Date.now() + FAILURE_TTL);
     
      console.info(`[apiFetch] Endpoint returned 404 and is cached for ${FAILURE_TTL/1000}s: ${url}`);
      if (url.endsWith('/pastor-messages/active')) {
        // targeted hint for this known missing endpoint
       
        console.info(`[apiFetch] /pastor-messages/active returned 404. Verify this backend route exists and the API_URL (${API_URL}) is correct.`);
      }
    }
  }

  return res;
}
