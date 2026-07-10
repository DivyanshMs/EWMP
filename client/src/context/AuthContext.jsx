import { createContext, useContext, useState, useEffect, useRef } from 'react';
import authService from '../features/auth/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Guard to ensure initAuth runs exactly once, even in React StrictMode
  const initCalled = useRef(false);

  useEffect(() => {
    // Strict guard: Only initialize once per application lifecycle.
    // React StrictMode double-invokes effects in dev, but the ref persists.
    if (initCalled.current) return;
    initCalled.current = true;

    const initAuth = async () => {
      try {
        // Restore the session from the secure refresh cookie only.
        // Access tokens stay in memory and are never persisted in browser storage.
        const response = await authService.getCurrentUser();
        if (response?.data) {
          setUser(response.data);
        }
      } catch {
        // No active session. User is unauthenticated. No redirect needed here.
        // The axios interceptor ONLY redirects if a refresh token request also fails.
        // On first load without any session this is expected and silent.
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);  // Empty dependency array: runs once on mount only.

  const login = async (credentials) => {
    // authService.login returns the server envelope `{ success,message,data }`
    // but keep compatibility if it ever returns the raw payload or axios response.
    const response = await authService.login(credentials);
    const envelope = response && response.data ? response : response;
    const payload = envelope.data || envelope;
    const { accessToken, user: userData } = payload;
    // Store access token in memory only.
    window.__ewmp_access_token = accessToken;
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout API errors — proceed with local session clearance
    } finally {
      window.__ewmp_access_token = null;
      setUser(null);
      // Use window.location for a full-page reload to clear all module state
      window.location.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
