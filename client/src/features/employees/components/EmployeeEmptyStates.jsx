import React from 'react';
import { Users, SearchX, FileText, History, UserPlus, RefreshCw, Upload } from 'lucide-react';

/**
 * EmployeeEmptyStates.jsx
 * Standardized enterprise empty state illustrations for No Employees, No Search Results,
 * No Documents, and No Timeline events in EWMP.
 */

export const EmployeeEmptyState = ({
  type = 'directory',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const configMap = {
    directory: {
      icon: Users,
      defaultTitle: 'No Employees Registered',
      defaultDesc:
        'Your enterprise workforce database currently has no active employee records. Onboard your first team member or bulk import employee profiles from CSV/HRIS to begin lifecycle tracking.',
      defaultAction: 'Onboard First Employee',
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    },
    search: {
      icon: SearchX,
      defaultTitle: 'No Matching Employee Records Found',
      defaultDesc:
        'We couldn’t find any employee profiles matching your current search keywords or active department/designation filters. Try adjusting your filter parameters or clearing your search query.',
      defaultAction: 'Clear Search & Filters',
      color: 'amber',
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    },
    documents: {
      icon: FileText,
      defaultTitle: 'No Employee Documents Uploaded',
      defaultDesc:
        'There are no digital contracts, government ID verifications, tax withholdings, or background check certificates attached to this employee profile yet.',
      defaultAction: 'Upload Document',
      color: 'indigo',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    },
    timeline: {
      icon: History,
      defaultTitle: 'No Lifecycle Audit Events Recorded',
      defaultDesc:
        'No historical milestone events such as department transfers, promotion letters, salary revisions, or attendance regularizations have occurred for this record yet.',
      defaultAction: 'Log Manual Milestone',
      color: 'purple',
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    },
    archive: {
      icon: Users,
      defaultTitle: 'No Archived Employees Found',
      defaultDesc:
        'The employee archive vault is currently empty. Former employees who have resigned, retired, or separated will be preserved here with immutable exit records.',
      defaultAction: 'Return to Active Directory',
      color: 'emerald',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    },
  };

  const current = configMap[type] || configMap.directory;
  const IconComponent = current.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[440px] p-8 text-center bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm animate-fade-in my-4 font-sans">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner ${current.bg}`}>
        <IconComponent size={40} className="stroke-[1.5]" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {title || current.defaultTitle}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        {description || current.defaultDesc}
      </p>

      {onAction && (
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#111]"
          >
            {type === 'search' ? <RefreshCw size={18} /> : type === 'documents' ? <Upload size={18} /> : <UserPlus size={18} />}
            {actionLabel || current.defaultAction}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeEmptyState;
