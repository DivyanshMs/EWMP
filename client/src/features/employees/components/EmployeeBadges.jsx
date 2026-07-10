import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, Briefcase, FolderTree } from 'lucide-react';

/**
 * EmployeeBadges.jsx
 * Reusable enterprise badges for Employee Status, Employment Type, Department, and
 * standardized Employee Avatars with photo fallback and live status dot.
 */

export const StatusBadge = ({ status = 'Active', size = 'md' }) => {
  const config = {
    Active: {
      bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40',
      icon: CheckCircle2,
    },
    Probation: {
      bg: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/40',
      icon: Clock,
    },
    Notice: {
      bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40',
      icon: AlertCircle,
    },
    Terminated: {
      bg: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40',
      icon: XCircle,
    },
    Archived: {
      bg: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
      icon: XCircle,
    },
  };

  const current = config[status] || config.Active;
  const IconComp = current.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${current.bg} ${sizeClasses} font-sans shrink-0`}
    >
      <IconComp size={size === 'sm' ? 11 : 13} />
      <span>{status}</span>
    </span>
  );
};

export const EmploymentBadge = ({ type = 'Full-Time', size = 'md' }) => {
  const config = {
    'Full-Time': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/40',
    'Part-Time': 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/40',
    'Contractor': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40',
    'Intern': 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200/50 dark:border-teal-800/40',
  };

  const bgClass = config[type] || config['Full-Time'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-bold rounded-lg border ${bgClass} ${sizeClasses} shrink-0`}
    >
      <Briefcase size={size === 'sm' ? 10 : 12} className="opacity-70" />
      <span>{type}</span>
    </span>
  );
};

export const DepartmentBadge = ({ department = 'Engineering', code = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-xl bg-gray-100 dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-gray-800 ${sizeClasses} font-sans shrink-0`}
    >
      <FolderTree size={size === 'sm' ? 11 : 13} className="text-blue-500 shrink-0" />
      <span className="truncate max-w-[140px]">{department}</span>
      {code && <span className="font-mono text-[10px] text-gray-400 font-bold">({code})</span>}
    </span>
  );
};

export const EmployeeAvatar = ({
  name = 'Employee User',
  photoUrl = null,
  size = 'md',
  status = 'Active',
  showStatus = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const dotMap = {
    sm: 'w-2 h-2 -right-0 -bottom-0',
    md: 'w-2.5 h-2.5 -right-0.5 -bottom-0.5',
    lg: 'w-3.5 h-3.5 right-0 bottom-0',
    xl: 'w-4 h-4 right-1 bottom-1',
  };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'EMP';

  // Generate a stable color based on name initials
  const colors = [
    'bg-blue-600 text-white',
    'bg-indigo-600 text-white',
    'bg-purple-600 text-white',
    'bg-emerald-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
    'bg-teal-600 text-white',
  ];
  const charCode = name.charCodeAt(0) || 0;
  const colorClass = colors[charCode % colors.length];

  return (
    <div className={`relative inline-block shrink-0 ${sizeMap[size] || sizeMap.md}`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800"
        />
      ) : (
        <div
          className={`w-full h-full rounded-2xl flex items-center justify-center font-extrabold font-mono shadow-sm ${colorClass}`}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute rounded-full border-2 border-white dark:border-[#111111] ${
            status === 'Active'
              ? 'bg-emerald-500'
              : status === 'Probation'
              ? 'bg-blue-500'
              : status === 'Notice'
              ? 'bg-amber-500'
              : 'bg-rose-500'
          } ${dotMap[size] || dotMap.md}`}
          title={`Status: ${status}`}
        ></span>
      )}
    </div>
  );
};

export default {
  StatusBadge,
  EmploymentBadge,
  DepartmentBadge,
  EmployeeAvatar,
};
