import React from 'react';
import { ShieldAlert, WifiOff, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

/**
 * PerformanceErrorStates.jsx
 * Comprehensive error banners and access displays for EWMP Performance Management.
 */

export const PermissionDenied = ({ onBack }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border-2 border-rose-200 dark:border-rose-900/60 rounded-xl p-8 text-center max-w-lg mx-auto my-12 shadow-lg">
    <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
      <ShieldAlert size={32} />
    </div>
    <h3 className="text-lg font-bold text-[#191b23] dark:text-white">Executive Authorization Required</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-2 leading-relaxed">
      You do not have permission to view or calibrate performance appraisals for this department or employee grade. Please contact your Organization Admin or HR Director.
    </p>
    {onBack && (
      <button
        onClick={onBack}
        className="mt-6 px-5 py-2.5 bg-[#191b23] hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold rounded shadow-xs transition-colors"
      >
        Return to Dashboard
      </button>
    )}
  </div>
);

export const NetworkError = ({ onRetry }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-amber-200 dark:border-amber-900/60 rounded-lg p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
    <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-4">
      <AlertTriangle size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">Performance Gateway Timeout</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
      We were unable to synchronize employee KPI scores and appraisal ratings with the cloud database.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <RefreshCw size={14} /> Reconnect & Synchronize
      </button>
    )}
  </div>
);

export const ValidationError = ({ message = 'Please complete all mandatory self-assessment questions before submitting.' }) => (
  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300 animate-shake">
    <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
    <div className="flex-1">
      <strong className="font-bold block">Evaluation Validation Failed</strong>
      <span>{message}</span>
    </div>
  </div>
);

export const NoInternet = ({ onRetry }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center mx-auto mb-4">
      <WifiOff size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">Offline Status Detected</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
      Your internet connection is offline. Appraisal drafts and KPI progress edits are saved locally in your browser cache.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-5 px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
      >
        <RefreshCw size={14} /> Check Connection
      </button>
    )}
  </div>
);
