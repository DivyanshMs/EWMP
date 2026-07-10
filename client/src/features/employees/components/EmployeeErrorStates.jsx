import React from 'react';
import { AlertTriangle, ShieldAlert, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * EmployeeErrorStates.jsx
 * Enterprise error components for Network Failures, RBAC Permission Denials, and
 * Multi-Step Form Validation Errors across the EWMP Employee Management module.
 */

export const EmployeeNetworkError = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[440px] p-8 text-center bg-white dark:bg-[#111111] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-sm animate-fade-in my-4 font-sans">
      <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-5">
        <AlertTriangle size={34} className="stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        HR Gateway Synchronization Error
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        {error || 'Unable to synchronize employee lifecycle records with the EWMP MongoDB Atlas backend cluster. Please check your network connection or verify authentication tokens.'}
      </p>

      {onRetry && (
        <div className="mt-6">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm rounded-2xl shadow-sm transition-all duration-200"
          >
            <RefreshCw size={16} />
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
};

export const EmployeePermissionError = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[440px] p-8 text-center bg-white dark:bg-[#111111] rounded-3xl border border-amber-200 dark:border-amber-900/40 shadow-sm animate-fade-in my-4 font-sans">
      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-5">
        <ShieldAlert size={34} className="stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        HR Access Privileges Required
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        You do not possess the required Role-Based Access Control (RBAC) permissions to inspect confidential employee salary structures, bank disbursement accounts, or permanent archive vaults.
      </p>

      <div className="mt-6">
        <button
          onClick={onBack || (() => window.history.back())}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm rounded-2xl transition-all duration-200"
        >
          <ArrowLeft size={16} />
          Return to Employee Directory
        </button>
      </div>
    </div>
  );
};

export const EmployeeValidationError = ({ errors = [], onDismiss }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 animate-fade-in font-sans my-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Please resolve the following form validation errors before proceeding:</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Dismiss
          </button>
        )}
      </div>
      <ul className="mt-2 list-disc list-inside space-y-1 text-xs sm:text-sm pl-5 font-medium opacity-90">
        {errors.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    </div>
  );
};

export default {
  EmployeeNetworkError,
  EmployeePermissionError,
  EmployeeValidationError,
};
