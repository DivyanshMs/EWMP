import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <ShieldAlert size={48} className="text-red-600 dark:text-red-500" />
        </div>
        
        <div>
          <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 tracking-tighter">403</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">Access Denied</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">
            You do not have the required role or permissions to access this page. Please contact your Organization Administrator if you believe this is a mistake.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go back
          </button>
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
