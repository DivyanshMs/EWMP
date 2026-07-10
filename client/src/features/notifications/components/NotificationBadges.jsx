import React from 'react';
import {
  Bell, DollarSign, Clock, Calendar, CheckSquare,
  Sparkles, AlertTriangle, ShieldAlert, Info, ArrowUpRight
} from 'lucide-react';

/**
 * NotificationBadges.jsx
 * Enterprise standardized badges for notification categorization and priorities.
 */

export const NotificationPriorityBadge = ({ priority = 'NORMAL', size = 'md' }) => {
  const styles = {
    URGENT: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 border-rose-200 dark:border-rose-800 animate-pulse font-extrabold',
    HIGH: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200 dark:border-amber-800 font-bold',
    NORMAL: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border-blue-200 dark:border-blue-800 font-semibold',
    LOW: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 font-medium',
  };

  const icons = {
    URGENT: <ShieldAlert size={size === 'sm' ? 11 : 13} className="text-rose-600 shrink-0" />,
    HIGH: <AlertTriangle size={size === 'sm' ? 11 : 13} className="text-amber-600 shrink-0" />,
    NORMAL: <Info size={size === 'sm' ? 11 : 13} className="text-[#2563eb] shrink-0" />,
    LOW: null,
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-mono tracking-tight uppercase ${styles[priority] || styles.NORMAL} ${sizeClass}`}>
      {icons[priority]}
      <span>{priority}</span>
    </span>
  );
};

export const NotificationCategoryBadge = ({ category = 'SYSTEM', size = 'md' }) => {
  const config = {
    SYSTEM:      { label: 'System Alert',       bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700', icon: Bell },
    PAYROLL:     { label: 'Payroll & Finance',  bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border-emerald-200 dark:border-emerald-800', icon: DollarSign },
    ATTENDANCE:  { label: 'Attendance Audit',   bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 border-purple-200 dark:border-purple-800', icon: Clock },
    LEAVE:       { label: 'Leave Request',      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200 dark:border-amber-800', icon: Calendar },
    TASK:        { label: 'Task Assignment',    bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 border-indigo-200 dark:border-indigo-800', icon: CheckSquare },
    AI_REC:      { label: 'AI Recommendation',  bg: 'bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-950/60 dark:to-fuchsia-950/60 text-violet-800 dark:text-violet-200 border-violet-300 dark:border-violet-700 font-bold', icon: Sparkles },
    BROADCAST:   { label: 'Org Broadcast',      bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border-blue-200 dark:border-blue-800 font-bold', icon: ArrowUpRight },
  };

  const item = config[category] || config.SYSTEM;
  const Icon = item.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight ${item.bg} ${sizeClass}`}>
      <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{item.label}</span>
    </span>
  );
};

export const UnreadDot = ({ isUnread = false }) => {
  if (!isUnread) return null;
  return (
    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563eb] ring-4 ring-blue-100 dark:ring-blue-950 shrink-0 animate-pulse" title="Unread Notification" />
  );
};
