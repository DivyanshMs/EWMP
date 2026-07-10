import React from 'react';
import { Clock, CalendarX2, Search, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

/**
 * AttendanceEmptyStates.jsx
 * Interactive zero-data vectors for the EWMP Attendance Management module.
 * Renders 3 required states:
 * 1. No Attendance Records (Clock In prompt)
 * 2. No Corrections (All clean / verified)
 * 3. No Search Results (Filter clear trigger)
 */

export const AttendanceEmptyState = ({
  type = 'records', // 'records' | 'corrections' | 'search' | 'history'
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'records':
        return {
          icon: Clock,
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
          defaultTitle: 'No Attendance Records Found',
          defaultDesc: 'There are no clock-in or biometric kiosk logs recorded for the selected timeframe. Clock in now or adjust your filter parameters.',
          defaultAction: 'Clock In Now',
          showAction: true,
        };
      case 'corrections':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
          defaultTitle: 'No Pending Correction Requests',
          defaultDesc: 'All employee attendance logs, overtime claims, and regularization requests have been reviewed and verified by managers.',
          defaultAction: 'Refresh Queue',
          showAction: true,
        };
      case 'search':
        return {
          icon: Search,
          bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
          defaultTitle: 'No Matching Attendance Logs',
          defaultDesc: 'We could not find any attendance rosters or employee logs matching your search keywords or filter criteria.',
          defaultAction: 'Reset All Filters',
          showAction: true,
        };
      case 'history':
      default:
        return {
          icon: CalendarX2,
          bg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
          defaultTitle: 'No Historical Timeline Logs',
          defaultDesc: 'No audit logs or shift timelines are available for this specific employee record in the selected month.',
          defaultAction: 'View Current Month',
          showAction: true,
        };
    }
  };

  const config = getEmptyConfig();
  const IconComp = config.icon;

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-10 sm:p-14 text-center font-sans shadow-2xs animate-fade-in flex flex-col items-center max-w-3xl mx-auto my-6">
      {/* Decorative Icon Container */}
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border shadow-sm mb-6 ${config.bg} transition-transform hover:scale-105 duration-200`}
      >
        <IconComp size={40} className="animate-pulse" />
      </div>

      {/* Typography */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        {title || config.defaultTitle}
      </h3>
      <p className="mt-2.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        {description || config.defaultDesc}
      </p>

      {/* Action Button */}
      {config.showAction && onAction && (
        <button
          onClick={onAction}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <RefreshCw size={15} />
          <span>{actionLabel || config.defaultAction}</span>
        </button>
      )}

      {/* Micro-Telemetry Badge */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2 text-[11px] font-mono text-gray-400">
        <Sparkles size={13} className="text-blue-500" />
        <span>EWMP Zero-Trust Biometric &amp; Geofencing Sync Active</span>
      </div>
    </div>
  );
};

export default AttendanceEmptyState;
