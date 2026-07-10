import React from 'react';
import { ShieldAlert, WifiOff, AlertTriangle, RefreshCw, Lock } from 'lucide-react';

/**
 * TaskErrorStates.jsx
 * Systematic error boundary cards and offline alerts for EWMP Task Management.
 */

export const PermissionDenied = ({ onBack }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-rose-200 dark:border-rose-900/60 rounded-xl p-10 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4 font-sans">
    <div className="w-14 h-14 rounded-full bg-rose-500/10 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
      <Lock size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">403 Access Restricted</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
      You do not have organizational permissions to delete executive project tasks, reallocate department budgets, or edit confidential milestones. Contact your Project Manager or Organization Admin.
    </p>
    {onBack && (
      <button
        onClick={onBack}
        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5"
      >
        Return to Authorized Dashboard
      </button>
    )}
  </div>
);

export const NetworkError = ({ onRetry }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-amber-200 dark:border-amber-900/60 rounded-xl p-10 text-center shadow-xs max-w-lg mx-auto my-8 space-y-4 font-sans">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
      <AlertTriangle size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">Task Telemetry Sync Timeout</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
      Unable to reach EWMP task gateways. Your column moves and checklist updates are cached locally and will synchronize automatically once live telemetry resumes.
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

export const ValidationError = ({ message = 'Invalid task form parameters or missing required project link.' }) => (
  <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-center gap-3 text-xs font-mono text-rose-800 dark:text-rose-200">
    <ShieldAlert size={18} className="text-rose-600 shrink-0" />
    <div>
      <strong className="font-bold uppercase font-sans block">Validation Error</strong>
      <span>{message}</span>
    </div>
  </div>
);

export const NoInternet = () => (
  <div className="bg-amber-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-mono shadow-md mb-4 animate-slide-down">
    <div className="flex items-center gap-2 font-semibold font-sans">
      <WifiOff size={16} />
      <span>Offline Mode Activated: Displaying cached Kanban boards & task checklists.</span>
    </div>
    <span className="bg-amber-800/60 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono">Sync Suspended</span>
  </div>
);
