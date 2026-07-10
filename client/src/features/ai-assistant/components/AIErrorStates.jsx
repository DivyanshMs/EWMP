import React from 'react';
import { ShieldAlert, AlertTriangle, WifiOff, RefreshCw, Cpu, ArrowLeft } from 'lucide-react';

/**
 * AIErrorStates.jsx
 * Enterprise error boundaries for EWMP AI Assistant Workspace.
 * Covers AIOffline, ProviderError, PermissionDenied, Timeout, and NetworkError.
 */

export const AIOffline = ({ onRetry }) => (
  <div className="bg-[#faf8ff] dark:bg-[#161616] border border-amber-300 dark:border-amber-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs font-sans my-4">
    <WifiOff size={28} className="text-amber-500" />
    <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white">
      AI Assistant in Offline Read-Only Mode
    </h4>
    <p className="text-xs text-[#737686] max-w-md">
      Live conversational inference is paused. You can review AI history once the database service is reachable again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold font-mono transition-all"
      >
        Reconnect to AI Gateway
      </button>
    )}
  </div>
);

export const ProviderError = ({ provider = 'Gemini 3.1 Pro Engine', onRetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans my-4">
    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-2xs">
      <Cpu size={28} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        AI Provider Telemetry Exception ({provider})
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        We received a 503 Service Temporarily Unavailable response from the upstream LLM provider. Upstream circuit breaker is active.
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
      >
        <RefreshCw size={14} className="animate-spin" /> Retry Inference
      </button>
    )}
  </div>
);

export const PermissionDenied = ({ onBack }) => (
  <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans my-4">
    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-2xs">
      <ShieldAlert size={28} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        Prompt Security Guardrail Violation — Access Restricted
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        Your prompt or requested action exceeded RBAC authorization thresholds or triggered automated DLP privacy filters.
      </p>
    </div>
    {onBack && (
      <button
        onClick={onBack}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
      >
        <ArrowLeft size={14} /> Return to AI Workspace
      </button>
    )}
  </div>
);

export const TimeoutError = ({ onRetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xs font-sans my-4">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-2xs">
      <AlertTriangle size={28} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        Inference Request Timeout
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        The AI calculation exceeded the 30-second execution window while processing complex cross-module database correlations.
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
      >
        <RefreshCw size={14} /> Re-run Query
      </button>
    )}
  </div>
);
