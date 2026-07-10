import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <FileQuestion size={48} className="text-blue-600 dark:text-blue-500" />
        </div>
        
        <div>
          <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 tracking-tighter">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">Page not found</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
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
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
