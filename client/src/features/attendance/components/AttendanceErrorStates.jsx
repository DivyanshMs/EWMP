import React from 'react';
import { WifiOff, AlertTriangle, RefreshCw, X, Lock } from 'lucide-react';

/**
 * AttendanceErrorStates.jsx
 * Enterprise alert components for the EWMP Attendance Management module.
 * Covers 3 required failure modes:
 * 1. Permission Denied (RBAC / Geofence restriction)
 * 2. Network Error (API gateway timeout / sync drop)
 * 3. No Internet (Offline kiosk fallback)
 */

export const AttendanceErrorAlert = ({
  type = 'network', // 'permission' | 'network' | 'offline' | 'validation'
  title,
  message,
  onRetry,
  onDismiss,
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'permission':
        return {
          icon: Lock,
          bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300',
          badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
          defaultTitle: 'Geofence or RBAC Permission Denied',
          defaultMsg: 'Your current IP address or GPS location is outside the approved organizational geofence boundary, or your security clearance prohibits editing this attendance record.',
          retryLabel: 'Request Override Authorization',
        };
      case 'offline':
        return {
          icon: WifiOff,
          bg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300',
          badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
          defaultTitle: 'No Internet Connection — Offline Kiosk Mode Active',
          defaultMsg: 'Biometric kiosk and clock-in logs are being cached locally in IndexedDB storage. Records will automatically regularize and sync with the EWMP cloud node once connection is restored.',
          retryLabel: 'Force Cloud Sync Now',
        };
      case 'network':
      default:
        return {
          icon: AlertTriangle,
          bg: 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300',
          badge: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
          defaultTitle: 'Attendance Telemetry Sync Error',
          defaultMsg: 'The attendance regularization service encountered a network timeout while querying today’s biometric logs. Please check your network connection and retry.',
          retryLabel: 'Retry Telemetry Sync',
        };
    }
  };

  const config = getErrorConfig();
  const IconComp = config.icon;

  return (
    <div
      role="alert"
      className={`p-5 rounded-3xl border shadow-sm transition-all animate-fade-in font-sans relative overflow-hidden ${config.bg}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-2xl shrink-0 font-bold ${config.badge}`}>
          <IconComp size={22} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-extrabold text-sm sm:text-base tracking-tight truncate">
              {title || config.defaultTitle}
            </h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                title="Dismiss Alert"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm leading-relaxed opacity-90">
            {message || config.defaultMsg}
          </p>

          {/* Actions */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-xs shadow-2xs border border-gray-200/60 dark:border-gray-700 transition-all active:scale-95"
              >
                <RefreshCw size={13} className="animate-spin-once" />
                <span>{config.retryLabel}</span>
              </button>
            )}
            <span className="text-[11px] font-mono opacity-70 flex items-center gap-1">
              Ref ID: <strong className="font-bold">ATT-ERR-{Math.floor(1000 + Math.random() * 9000)}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceErrorAlert;
