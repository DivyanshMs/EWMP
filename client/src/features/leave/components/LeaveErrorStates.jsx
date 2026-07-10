import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, AlertCircle, Lock } from 'lucide-react';

/**
 * LeaveErrorStates.jsx
 * Precision Enterprise error displays for EWMP Leave Management.
 */

export const PermissionDeniedError = ({ onBack }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-rose-200 dark:border-rose-900/60 rounded-lg p-8 text-center max-w-md mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <Lock size={24} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1.5">Permission Denied (403 Forbidden)</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 mb-6 leading-relaxed">
        Your current role does not have authorization to access or modify organizational leave policies or approve queue records. Contact your Super Administrator.
      </p>
      {onBack && (
        <button
          onClick={onBack}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 px-4 rounded transition-colors"
        >
          Return to Leave Dashboard
        </button>
      )}
    </div>
  );
};

export const ValidationErrorBanner = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg p-3.5 flex items-center justify-between gap-3 my-3 text-xs text-rose-800 dark:text-rose-200">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-rose-600 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-rose-600 hover:text-rose-800 font-bold">&times;</button>
      )}
    </div>
  );
};

export const NetworkErrorState = ({ onRetry }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-amber-200 dark:border-amber-900/60 rounded-lg p-8 text-center max-w-md mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1.5">Network Communication Error</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 mb-6">
        We encountered a temporary issue connecting to the Leave API server. Please check your network connection and retry.
      </p>
      <button
        onClick={onRetry || (() => window.location.reload())}
        className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2 px-4 rounded inline-flex items-center gap-1.5 transition-colors shadow-xs"
      >
        <RefreshCw size={14} /> Retry Connection
      </button>
    </div>
  );
};

export const NoInternetBanner = () => {
  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-center gap-2 font-mono">
      <WifiOff size={14} className="text-rose-400 animate-pulse" />
      <span>Offline Mode — Changes to leave requests will be synced automatically once network connection is restored.</span>
    </div>
  );
};
