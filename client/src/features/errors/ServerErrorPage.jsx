import { ServerCrash, RefreshCcw } from 'lucide-react';

const ServerErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
          <ServerCrash size={48} className="text-orange-600 dark:text-orange-500" />
        </div>
        
        <div>
          <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 tracking-tighter">500</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">Internal Server Error</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">
            Our servers encountered an unexpected issue while processing your request. We have been notified and are actively working on a fix.
          </p>
        </div>
        
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm"
          >
            <RefreshCcw size={18} className="mr-2" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
