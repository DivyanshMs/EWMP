import React from 'react';
import { ShieldAlert, WifiOff, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

/**
 * RecruitmentErrorStates.jsx
 * Error boundary cards and role access control states for EWMP Recruitment.
 */

export const PermissionDenied = () => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-rose-200 dark:border-rose-900 rounded-lg p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
      <ShieldAlert size={24} />
    </div>
    <h3 className="font-bold text-base text-[#191b23] dark:text-white">403 Forbidden — HR Recruiter Access Required</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
      You do not have the required role privileges (HR Manager, Recruiter, or Hiring Manager) to access salary structures, offer governance, or private candidate notes.
    </p>
  </div>
);

export const NetworkError = ({ onRetry }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-8 text-center max-w-md mx-auto my-8 shadow-xs">
    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto mb-3">
      <AlertTriangle size={24} />
    </div>
    <h3 className="font-bold text-sm text-[#191b23] dark:text-white">Recruitment Gateway Timeout</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 mb-4">
      Unable to synchronize applicant telemetry or interview schedules with the backend server.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-2xs transition-colors"
      >
        <RefreshCw size={14} /> Reconnect
      </button>
    )}
  </div>
);

export const ValidationError = ({ message = 'Please fill out all mandatory fields before publishing the requisition.', onClose }) => (
  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg p-4 flex items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300">
    <div className="flex items-center gap-2">
      <XCircle size={16} className="text-rose-600 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
    {onClose && (
      <button onClick={onClose} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900 rounded text-rose-700">
        ✕
      </button>
    )}
  </div>
);

export const NoInternet = () => (
  <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-between shadow-sm animate-pulse mb-4">
    <span className="flex items-center gap-2">
      <WifiOff size={15} /> You are currently offline. Changes to candidate pipeline stages or interview notes will be queued locally.
    </span>
    <span className="text-[10px] uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded font-mono">Offline Mode</span>
  </div>
);
