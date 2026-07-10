import React from 'react';
import { CheckCircle2, Clock, XCircle, HelpCircle, Ban, Calendar } from 'lucide-react';

/**
 * LeaveBadges.jsx
 * Precision Enterprise status chips and tags for EWMP Leave Management.
 * Follows Stitch MCP styling rules: pill border radius (rounded-full),
 * WCAG AA color contrast, and 11px uppercase bold typography.
 */

export const LeaveStatusBadge = ({ status = 'PENDING' }) => {
  const statusConfig = {
    APPROVED: {
      label: 'Approved',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    PENDING: {
      label: 'Pending Approval',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: Clock
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      icon: XCircle
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      icon: Ban
    },
    INFO_REQUESTED: {
      label: 'Info Requested',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: HelpCircle
    },
    HOLIDAY: {
      label: 'Company Holiday',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      icon: Calendar
    }
  };

  const config = statusConfig[status.toUpperCase()] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${config.bg} ${config.text} ${config.border}`}>
      <Icon size={12} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export const LeaveTypeBadge = ({ type = 'ANNUAL' }) => {
  const typeMap = {
    ANNUAL: { label: 'Annual Leave', bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
    SICK: { label: 'Sick Leave', bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300' },
    CASUAL: { label: 'Casual Leave', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
    COMPENSATORY: { label: 'Compensatory Leave', bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
    MATERNITY: { label: 'Maternity / Paternity', bg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300' },
    BEREAVEMENT: { label: 'Bereavement', bg: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300' },
    UNPAID: { label: 'Leave Without Pay', bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300' }
  };

  const config = typeMap[type.toUpperCase()] || { label: type, bg: 'bg-slate-50 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${config.bg}`}>
      {config.label}
    </span>
  );
};

export const LeaveDurationBadge = ({ days = 1, isHalfDay = false }) => {
  return (
    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono font-medium border border-slate-200 dark:border-slate-700">
      <Clock size={11} />
      <span>{isHalfDay ? '0.5 Day (Half Day)' : `${days} ${days === 1 ? 'Day' : 'Days'}`}</span>
    </span>
  );
};
