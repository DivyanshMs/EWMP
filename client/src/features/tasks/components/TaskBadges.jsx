import React from 'react';
import { AlertCircle, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle, CheckCircle2, Circle, ShieldAlert, PlayCircle, RefreshCw, Layers } from 'lucide-react';

/**
 * TaskBadges.jsx
 * Linear, Jira, and Asana inspired priority and status chips for EWMP Task Management.
 * Follows strict EWMP Enterprise Design System ("Precision Enterprise") tokens.
 */

export const PriorityBadge = ({ priority = 'MEDIUM', size = 'md' }) => {
  const configs = {
    CRITICAL: {
      label: 'Urgent / P0',
      icon: AlertCircle,
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      dot: 'bg-rose-600 animate-pulse'
    },
    HIGH: {
      label: 'High / P1',
      icon: ArrowUpCircle,
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500'
    },
    MEDIUM: {
      label: 'Medium / P2',
      icon: ArrowRightCircle,
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-[#2563eb] dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-[#2563eb]'
    },
    LOW: {
      label: 'Low / P3',
      icon: ArrowDownCircle,
      bg: 'bg-slate-50 dark:bg-gray-800',
      text: 'text-slate-600 dark:text-gray-300',
      border: 'border-slate-200 dark:border-gray-700',
      dot: 'bg-slate-400'
    }
  };

  const config = configs[priority?.toUpperCase()] || configs.MEDIUM;
  const IconComp = config.icon;

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2 py-0.5 text-xs gap-1.5',
    lg: 'px-2.5 py-1 text-xs font-semibold gap-1.5'
  }[size] || 'px-2 py-0.5 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-bold rounded border ${config.bg} ${config.text} ${config.border} ${sizeStyles} transition-colors shadow-2xs`}>
      <IconComp size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export const StatusBadge = ({ status = 'TO_DO', size = 'md' }) => {
  const configs = {
    BACKLOG: {
      label: 'Backlog',
      icon: Layers,
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-300 dark:border-gray-700',
      dot: 'bg-gray-400'
    },
    TO_DO: {
      label: 'To Do',
      icon: Circle,
      bg: 'bg-slate-100 dark:bg-slate-900',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      dot: 'bg-slate-500'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      icon: PlayCircle,
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-[#2563eb] dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-[#2563eb] animate-pulse'
    },
    REVIEW: {
      label: 'In Review / QA',
      icon: RefreshCw,
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      dot: 'bg-purple-600'
    },
    BLOCKED: {
      label: 'Blocked',
      icon: ShieldAlert,
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      dot: 'bg-rose-600 animate-bounce'
    },
    COMPLETED: {
      label: 'Completed',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-600'
    }
  };

  const config = configs[status?.toUpperCase()] || configs.TO_DO;
  const IconComp = config.icon;

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-xs font-semibold gap-1.5'
  }[size] || 'px-2 py-0.5 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-bold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeStyles} transition-colors shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <IconComp size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export const TagChip = ({ tag, onRemove }) => {
  const tagColors = [
    'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800',
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800',
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800'
  ];

  // Deterministic color selection based on tag string
  const colorIndex = Math.abs(tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % tagColors.length;
  const colorClass = tagColors[colorIndex];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-semibold rounded border ${colorClass} transition-all`}>
      <span>#{tag}</span>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 text-current font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
};
