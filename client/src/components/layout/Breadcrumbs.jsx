import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ customItems }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If customItems are provided, use them instead of auto-generating from URL
  const items = customItems || pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    // Capitalize and format text
    const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
    return { label, to };
  });

  return (
    <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home size={16} />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.to} className="flex items-center">
            <ChevronRight size={16} className="mx-2 flex-shrink-0 text-gray-400 dark:text-gray-600" />
            {isLast ? (
              <span className="text-gray-900 dark:text-white" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.to} 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
