import React from 'react';
import { CheckCircle2, XCircle, Clock, Home, CalendarDays, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * AttendanceBadges.jsx
 * Enterprise status pills and avatar markers for the EWMP Attendance Management module.
 * Adheres to HSL-tokenized Tailwind palettes with WCAG AA contrast compliance.
 * Supports: Present, Absent, Late Arrival, Early Exit, WFH, Overtime, On Leave, and Correction statuses.
 */

export const AttendanceStatusBadge = ({ status = 'Present', size = 'md', showIcon = true }) => {
  const getBadgeStyle = () => {
    const s = status?.toLowerCase() || '';
    if (s.includes('present') || s.includes('ontime') || s.includes('on time') || s === 'approved') {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300',
        icon: CheckCircle2,
        dot: 'bg-emerald-500',
        label: status || 'Present',
      };
    }
    if (s.includes('absent') || s === 'rejected' || s.includes('missing')) {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300',
        icon: XCircle,
        dot: 'bg-rose-500',
        label: status || 'Absent',
      };
    }
    if (s.includes('late') || s.includes('delay') || s.includes('early exit')) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300',
        icon: Clock,
        dot: 'bg-amber-500',
        label: status || 'Late Arrival',
      };
    }
    if (s.includes('wfh') || s.includes('home') || s.includes('remote')) {
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/40 text-indigo-800 dark:text-indigo-300',
        icon: Home,
        dot: 'bg-indigo-500',
        label: status || 'Work From Home',
      };
    }
    if (s.includes('leave') || s.includes('vacation') || s.includes('pto') || s.includes('sick')) {
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/40 text-purple-800 dark:text-purple-300',
        icon: CalendarDays,
        dot: 'bg-purple-500',
        label: status || 'On Leave',
      };
    }
    if (s.includes('overtime') || s.includes('ot') || s.includes('extended')) {
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800/40 text-teal-800 dark:text-teal-300',
        icon: TrendingUp,
        dot: 'bg-teal-500',
        label: status || 'Overtime',
      };
    }
    if (s.includes('pending') || s.includes('review') || s.includes('requested')) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-300',
        icon: AlertCircle,
        dot: 'bg-blue-500 animate-pulse',
        label: status || 'Pending Review',
      };
    }
    return {
      bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300',
      icon: Clock,
      dot: 'bg-gray-400',
      label: status || 'Scheduled',
    };
  };

  const style = getBadgeStyle();
  const IconComp = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 rounded-lg',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-xl',
    lg: 'px-3.5 py-1.5 text-sm gap-2 rounded-2xl font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-bold border transition-all shrink-0 ${style.bg} ${
        sizeClasses[size] || sizeClasses.md
      }`}
    >
      {showIcon ? (
        <IconComp size={size === 'sm' ? 12 : size === 'lg' ? 16 : 13.5} className="shrink-0 opacity-80" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      )}
      <span className="truncate">{style.label}</span>
    </span>
  );
};

export const CorrectionStatusBadge = ({ status = 'Pending Review', size = 'md' }) => {
  return <AttendanceStatusBadge status={status} size={size} showIcon={true} />;
};

export const AttendanceEmployeeAvatar = ({ name = 'Employee', photoUrl = null, size = 'md', status = null }) => {
  const getInitials = (n) => {
    if (!n) return 'EMP';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const dotClasses = {
    Present: 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-900',
    Absent: 'bg-rose-500 ring-rose-100 dark:ring-rose-900',
    Late: 'bg-amber-500 ring-amber-100 dark:ring-amber-900',
    WFH: 'bg-indigo-500 ring-indigo-100 dark:ring-indigo-900',
    Leave: 'bg-purple-500 ring-purple-100 dark:ring-purple-900',
  };

  return (
    <div className="relative inline-block shrink-0 font-sans">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl object-cover shadow-2xs border border-gray-200 dark:border-gray-800`}
        />
      ) : (
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center shadow-2xs select-none`}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          title={`Status: ${status}`}
          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-[#111111] ${
            dotClasses[status] || 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};

export default {
  AttendanceStatusBadge,
  CorrectionStatusBadge,
  AttendanceEmployeeAvatar,
};
