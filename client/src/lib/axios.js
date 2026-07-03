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

    if (error.response?.status === 401 && !originalRequest._retry) {
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
      } catch {
        // Refresh failed — clear token and redirect to login
        window.__ewmp_access_token = null;
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
