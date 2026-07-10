import React from 'react';
import { ShieldAlert, Lock, AlertCircle, WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * AdminErrorStates.jsx
 * Enterprise error states for the Settings & Administration Module.
 */

export const PermissionDenied = ({ requiredRole = 'SUPER_ADMIN', onGoBack }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900/50 rounded-lg p-10 text-center my-6 max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-400">
        <ShieldAlert size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Access Restricted: RBAC Policy Guardrail</h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Your current role credentials do not satisfy the enterprise governance policy required to inspect or modify this administrative domain. This action has been logged in the audit registry.
      </p>
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-3 text-left mb-6 font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between mb-1">
          <span>Required Privilege Level:</span>
          <strong className="text-purple-600 dark:text-purple-400">{requiredRole}</strong>
        </div>
        <div className="flex justify-between">
          <span>Enforced By:</span>
          <span>EWMP Security Kernel v3.4</span>
        </div>
      </div>
      <button 
        onClick={onGoBack || (() => window.history.back())}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
      >
        <ArrowLeft size={14} /> Return to Permitted Workspace
      </button>
    </div>
  );
};

export const Unauthorized = ({ onLoginRedirect }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900/50 rounded-lg p-10 text-center my-6 max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
        <Lock size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Session Expired or Unauthorized</h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
        Your cryptographic authentication token has expired or was revoked by an organization administrator. Please re-authenticate using MFA to restore your active session.
      </p>
      <button 
        onClick={onLoginRedirect || (() => window.location.href = '/login')}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
      >
        Re-Authenticate Session
      </button>
    </div>
  );
};

export const ValidationError = ({ errors = [], onRetry }) => {
  return (
    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800/50 rounded-lg p-4 my-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">Configuration Validation Failed</h4>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
            Please resolve the following constraint violations before applying changes to the enterprise registry:
          </p>
          <ul className="list-disc list-inside text-xs text-rose-600 dark:text-rose-300/90 mt-2 space-y-1">
            {errors.length > 0 ? (
              errors.map((err, i) => <li key={i}>{err}</li>)
            ) : (
              <li>Required system parameters cannot be left null or empty.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const NetworkError = ({ onRetry }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-10 text-center my-6 max-w-md mx-auto shadow-sm">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <WifiOff size={32} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Service Communication Timeout</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Unable to synchronize with the EWMP central parameter database. Verify network routing or firewall policies.
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw size={14} /> Retry Synchronization
        </button>
      )}
    </div>
  );
};
