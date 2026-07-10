import React from 'react';
import { ShieldAlert, AlertTriangle, WifiOff, RefreshCw, ArrowLeft, Database } from 'lucide-react';

/**
 * ReportErrorStates.jsx
 * Enterprise error boundaries for permission denied, network timeouts, data query failures, and offline mode.
 */

export const PermissionDenied = ({ onBack }) => (
  <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans animate-fade-in my-6">
    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-xs">
      <ShieldAlert size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        403 Permission Denied — Access Restricted
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        You do not have administrative privilege or auditor authorization to view this specific executive business intelligence report.
      </p>
    </div>
    {onBack && (
      <button
        onClick={onBack}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
      >
        <ArrowLeft size={15} /> Return to Reports Dashboard
      </button>
    )}
  </div>
);

export const NetworkError = ({ onRetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans animate-fade-in my-6">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-xs">
      <AlertTriangle size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        BI Data Gateway Connection Timeout
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        We encountered a delay communicating with the AWS / Redshift analytics warehouse. Please check your network connection and retry.
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
      >
        <RefreshCw size={15} className="animate-spin" /> Retry Connection
      </button>
    )}
  </div>
);

export const NoDataError = ({ query, onReset }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans animate-fade-in my-6">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center shadow-xs">
      <Database size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        Zero Aggregation Results Found
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        The database query returned 0 rows for "{query || 'Selected Scope'}". Verify historical data availability for this date range.
      </p>
    </div>
    {onReset && (
      <button
        onClick={onReset}
        className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
      >
        Reset Filters
      </button>
    )}
  </div>
);

export const NoInternet = () => (
  <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs font-mono font-bold text-[#737686] shadow-2xs">
    <div className="flex items-center gap-2">
      <WifiOff size={16} className="text-amber-500" />
      <span>Offline Mode — Viewing cached BI report snapshot from local IndexedDB storage.</span>
    </div>
    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded uppercase font-bold">
      READ ONLY
    </span>
  </div>
);
