/**
 * axios.js
 * Configured Axios Instance with Request/Response Interceptors
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.2 (lib/)
 *            API_SPECIFICATION.md Section 4.4 (Request Headers)
 *            DEVELOPMENT_ORDER.md Section 11 (Step 1)
 */

import axios from 'axios';

// ─── Axios Instance ─────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required for HTTP-only refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach access token from memory (stored by AuthContext) to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Access token is retrieved from the AuthContext singleton at request time.
    // This pattern avoids storing the token in localStorage (XSS risk).
    const token = window.__ewmp_access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Intercepts 401 responses, attempts token refresh, and retries the original request.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT attempt token refresh for authentication endpoints (login, refresh, logout).
    // If login fails with 401, it is invalid credentials—not an expired session.
    // If refresh fails with 401, there is no session to restore.
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh using the HTTP-only cookie
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.data?.accessToken;
        if (newToken) {
          // Store new token in memory
          window.__ewmp_access_token = newToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed — clear token in memory
        window.__ewmp_access_token = null;

        // Avoid infinite reload loops! NEVER force a browser reload (window.location.href = '/login')
        // when we are already on a public authentication path (such as /login, /forgot-password, /reset-password)
        // or an error page. When initAuth() checks /auth/me on initial app startup without cookies, 401 is expected.
        const publicPaths = ['/login', '/forgot-password', '/reset-password', '/403', '/500'];
        const isPublicPage = publicPaths.some((path) => window.location.pathname.startsWith(path));

        if (!isPublicPage) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
