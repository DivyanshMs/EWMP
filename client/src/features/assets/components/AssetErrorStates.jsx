import React from 'react';
import { ShieldAlert, WifiOff, AlertTriangle, RefreshCw, Lock } from 'lucide-react';

/**
 * AssetErrorStates.jsx
 * Error boundary cards for asset management views.
 */

export const PermissionDenied = ({ onBack }) => (
  <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900/60 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4 font-sans">
    <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
      <Lock size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">403 — Asset Registry Access Restricted</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      You do not have IT Administrator or Organization Admin permissions to access, edit, or retire this asset record. Contact your IT Admin for elevated asset management access.
    </p>
    {onBack && (
      <button onClick={onBack} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5">
        Return to Asset Dashboard
      </button>
    )}
  </div>
);

export const NetworkError = ({ onRetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900/60 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4 font-sans">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
      <AlertTriangle size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">Asset Inventory Sync Timeout</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      Unable to reach the EWMP Asset Management Gateway. Your last inventory snapshot is being served from the local cache. Sync will resume automatically on reconnect.
    </p>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5">
        <RefreshCw size={14} /> Retry Connection
      </button>
    )}
  </div>
);

export const ValidationError = ({ message = 'Invalid asset registration parameters or missing required fields.' }) => (
  <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-center gap-3 text-xs font-mono text-rose-800 dark:text-rose-200">
    <ShieldAlert size={18} className="text-rose-600 shrink-0" />
    <div>
      <strong className="font-bold uppercase font-sans block">Validation Error</strong>
      <span>{message}</span>
    </div>
  </div>
);

export const NoInternet = () => (
  <div className="bg-amber-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-sans shadow-md mb-4">
    <div className="flex items-center gap-2 font-semibold">
      <WifiOff size={16} />
      <span>Offline Mode: Displaying cached asset inventory and allocation records.</span>
    </div>
    <span className="bg-amber-800/60 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono">Sync Suspended</span>
  </div>
);
