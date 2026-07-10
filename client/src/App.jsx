import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * App.jsx
 * Root application component.
 * 
 * Provider ordering (outermost → innermost):
 *   QueryClientProvider → BrowserRouter → AuthProvider → AppRouter
 * 
 * IMPORTANT: AuthProvider MUST be inside BrowserRouter so that hooks that
 * use useNavigate() (for auth redirects) work correctly. Placing AuthProvider
 * outside BrowserRouter would cause "useNavigate() may be used only in the
 * context of a <Router>" errors.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-[#1a1a1a] dark:text-white border dark:border-gray-800 shadow-sm rounded-lg text-sm font-medium',
              duration: 4000,
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
