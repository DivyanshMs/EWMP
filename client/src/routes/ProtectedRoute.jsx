import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute.jsx
 * Guards authenticated routes. Shows a loading state while auth initializes,
 * redirects to /login if unauthenticated, and to /403 if unauthorized for the route.
 * Saves the attempted URL in state so LoginPage can redirect back after successful login.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Auth is still initializing — show a centered spinner. Must render ONCE.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#faf8ff] dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-6 h-6 text-blue-600" fill="none">
                <rect width="40" height="40" rx="8" fill="currentColor" opacity=".15" />
                <path d="M10 20h20M20 10v20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute -inset-1 border-2 border-blue-500 rounded-xl border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium tracking-tight">
            Authenticating session…
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login, preserving the attempted URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but lacking the required role — show 403
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
