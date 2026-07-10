import React from 'react';
import { Lock, AlertTriangle, ShieldAlert, WifiOff, RefreshCw, UploadCloud } from 'lucide-react';

/**
 * DocumentErrorStates.jsx
 * Error boundaries: Permission Denied, Network Error, Validation Error, Upload Failed, No Internet.
 */

export const PermissionDenied = ({ onBack }) => (
  <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900/60 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4 font-sans">
    <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
      <Lock size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">403 — Document Repository Access Restricted</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      You do not have sufficient permissions (HR Manager, Organization Admin, or IT Admin) to access, verify, or delete this confidential document.
    </p>
    {onBack && (
      <button
        onClick={onBack}
        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5"
      >
        Return to Document Dashboard
      </button>
    )}
  </div>
);

export const NetworkError = ({ onRetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900/60 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4 font-sans">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
      <AlertTriangle size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">Document Gateway Sync Timeout</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      Unable to reach AWS S3 or the EWMP Document Gateway. Your last metadata index is being served from the local cache.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5"
      >
        <RefreshCw size={14} /> Retry Connection
      </button>
    )}
  </div>
);

export const ValidationError = ({ message = 'Invalid document metadata or missing required verification fields.' }) => (
  <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-center gap-3 text-xs font-mono text-rose-800 dark:text-rose-200">
    <ShieldAlert size={18} className="text-rose-600 shrink-0" />
    <div>
      <strong className="font-bold uppercase font-sans block">Validation Error</strong>
      <span>{message}</span>
    </div>
  </div>
);

export const UploadFailed = ({ fileName = 'Confidential_Agreement.pdf', onRetry }) => (
  <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-5 flex items-center justify-between gap-4 text-xs font-sans">
    <div className="flex items-center gap-3 min-w-0">
      <div className="p-2.5 rounded-lg bg-rose-600 text-white shrink-0">
        <UploadCloud size={20} />
      </div>
      <div className="min-w-0">
        <strong className="font-bold text-rose-900 dark:text-rose-100 block truncate">Upload Failed: {fileName}</strong>
        <span className="text-rose-700 dark:text-rose-300 font-mono text-[11px]">Error 504: AWS S3 Multipart stream interrupted.</span>
      </div>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 text-xs"
      >
        <RefreshCw size={13} /> Retry Upload
      </button>
    )}
  </div>
);

export const NoInternet = () => (
  <div className="bg-amber-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-sans shadow-md mb-4">
    <div className="flex items-center gap-2 font-semibold">
      <WifiOff size={16} />
      <span>Offline Mode: Displaying cached document library and verification status.</span>
    </div>
    <span className="bg-amber-800/60 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono">Sync Suspended</span>
  </div>
);
