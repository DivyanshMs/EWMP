import React from 'react';
import { ShieldAlert, AlertTriangle, WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * HelpDeskErrorStates.jsx
 * Enterprise error boundaries for permission denied, network timeouts, offline mode, and validation failures.
 */

export const HelpDeskPermissionDenied = ({ onBack }) => (
  <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans animate-fade-in my-6">
    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-xs">
      <ShieldAlert size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        403 Permission Denied — Access Restricted
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        You do not have administrative privilege or department routing authorization to access this specific Help Desk triage queue.
      </p>
    </div>
    {onBack && (
      <button
        onClick={onBack}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
      >
        <ArrowLeft size={15} /> Return to My Tickets
      </button>
    )}
  </div>
);

export const HelpDeskNetworkError = ({ onRetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans animate-fade-in my-6">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-xs">
      <AlertTriangle size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        Service Center Connection Timeout
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        We encountered a delay communicating with the ServiceNow / AWS API Gateway. Please check your network and retry.
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

export const HelpDeskOfflineMode = () => (
  <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs font-mono font-bold text-[#737686] shadow-2xs">
    <div className="flex items-center gap-2">
      <WifiOff size={16} className="text-amber-500" />
      <span>Offline Mode — Viewing cached ticket snapshot from local IndexedDB.</span>
    </div>
    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded uppercase">
      READ ONLY
    </span>
  </div>
);
