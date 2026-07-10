import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Target, ShieldCheck, FileText, Ban, Star } from 'lucide-react';

/**
 * PerformanceBadges.jsx
 * Precision Enterprise status chips and tags for EWMP Performance Management.
 * Follows Stitch MCP styling rules: pill border radius (rounded-full),
 * WCAG AA color contrast, and 11px uppercase bold typography.
 */

export const ReviewStatusBadge = ({ status = 'MANAGER_REVIEW_PENDING' }) => {
  const statusConfig = {
    DRAFT: {
      label: 'Draft Review',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      icon: FileText
    },
    SELF_REVIEW_PENDING: {
      label: 'Self Assessment Pending',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: Clock
    },
    MANAGER_REVIEW_PENDING: {
      label: 'Manager Review Pending',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-[#2563eb] dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Clock
    },
    HR_REVIEW_PENDING: {
      label: 'HR Audit & Calibration',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      icon: ShieldCheck
    },
    COMPLETED: {
      label: 'Appraisal Completed',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    OVERDUE: {
      label: 'Submission Overdue',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      icon: AlertCircle
    },
    CANCELLED: {
      label: 'Cycle Cancelled',
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700',
      icon: Ban
    }
  };

  const config = statusConfig[status.toUpperCase()] || statusConfig.DRAFT;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${config.bg} ${config.text} ${config.border}`}>
      <Icon size={12} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export const GoalPriorityBadge = ({ priority = 'HIGH' }) => {
  const priorityMap = {
    HIGH: { label: 'High Priority', bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' },
    MEDIUM: { label: 'Medium Priority', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
    LOW: { label: 'Low Priority', bg: 'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' }
  };

  const config = priorityMap[priority.toUpperCase()] || priorityMap.MEDIUM;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${config.bg}`}>
      <Target size={11} />
      <span>{config.label}</span>
    </span>
  );
};

export const RatingBadge = ({ rating = 4.5, label }) => {
  const num = Number(rating);
  let style = 'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
  let defaultLabel = 'Meets Expectations';

  if (num >= 4.5) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
    defaultLabel = 'Outstanding / Exceeds';
  } else if (num >= 3.5) {
    style = 'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
    defaultLabel = 'Strong Performer';
  } else if (num >= 2.5) {
    style = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
    defaultLabel = 'Needs Improvement';
  } else {
    style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
    defaultLabel = 'Unsatisfactory';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono font-extrabold text-xs border ${style}`}>
      <Star size={13} className="fill-current" />
      <span>{num.toFixed(1)}</span>
      <span className="font-sans font-semibold text-[11px] opacity-80">({label || defaultLabel})</span>
    </span>
  );
};

export const GoalStatusBadge = ({ status = 'IN_PROGRESS' }) => {
  const map = {
    NOT_STARTED: { label: 'Not Started', bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300' },
    IN_PROGRESS: { label: 'On Track', bg: 'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
    AT_RISK: { label: 'At Risk / Delayed', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
    COMPLETED: { label: 'Achieved & Verified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' }
  };

  const config = map[status.toUpperCase()] || map.IN_PROGRESS;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase border ${config.bg}`}>
      {config.label}
    </span>
  );
};
