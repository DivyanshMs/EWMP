import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, Laptop, Users, DollarSign, Building2, Briefcase, PlayCircle, PauseCircle, CheckCircle, XCircle, Flame } from 'lucide-react';

/**
 * HelpDeskBadges.jsx
 * Enterprise standardized badges for service ticket priorities, statuses, SLA compliance, and department categories.
 */

export const TicketPriorityBadge = ({ priority = 'MEDIUM', size = 'md' }) => {
  const styles = {
    CRITICAL: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 border-rose-200 dark:border-rose-800 animate-pulse font-extrabold',
    HIGH:     'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200 dark:border-amber-800 font-bold',
    MEDIUM:   'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border-blue-200 dark:border-blue-800 font-semibold',
    LOW:      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 font-medium',
  };

  const icons = {
    CRITICAL: <Flame size={size === 'sm' ? 11 : 13} className="text-rose-600 shrink-0" />,
    HIGH:     <AlertTriangle size={size === 'sm' ? 11 : 13} className="text-amber-600 shrink-0" />,
    MEDIUM:   <Clock size={size === 'sm' ? 11 : 13} className="text-[#2563eb] shrink-0" />,
    LOW:      null,
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-mono tracking-tight uppercase ${styles[priority] || styles.MEDIUM} ${sizeClass}`}>
      {icons[priority]}
      <span>{priority}</span>
    </span>
  );
};

export const TicketStatusBadge = ({ status = 'OPEN', size = 'md' }) => {
  const config = {
    OPEN:             { label: 'Open',              bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border-blue-200 dark:border-blue-800 font-bold', icon: PlayCircle },
    IN_PROGRESS:      { label: 'In Progress',       bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 border-indigo-200 dark:border-indigo-800 font-bold', icon: Clock },
    PENDING_CUSTOMER: { label: 'Pending Customer',  bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200 dark:border-amber-800 font-semibold', icon: PauseCircle },
    ESCALATED:        { label: 'Escalated',         bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 border-purple-200 dark:border-purple-800 font-extrabold animate-pulse', icon: ShieldAlert },
    RESOLVED:         { label: 'Resolved',          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border-emerald-200 dark:border-emerald-800 font-bold', icon: CheckCircle2 },
    CLOSED:           { label: 'Closed & Archived', bg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 font-medium', icon: CheckCircle },
  };

  const item = config[status] || config.OPEN;
  const Icon = item.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight ${item.bg} ${sizeClass}`}>
      <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{item.label}</span>
    </span>
  );
};

export const TicketSLABadge = ({ status = 'ON_TRACK', size = 'md' }) => {
  const config = {
    ON_TRACK: { label: 'SLA On Track', bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border-emerald-200 dark:border-emerald-800 font-semibold', icon: CheckCircle2 },
    AT_RISK:  { label: 'SLA At Risk',  bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200 dark:border-amber-800 font-bold animate-pulse', icon: AlertTriangle },
    BREACHED: { label: 'SLA Breached', bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 border-rose-200 dark:border-rose-800 font-extrabold animate-pulse', icon: XCircle },
  };

  const item = config[status] || config.ON_TRACK;
  const Icon = item.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight ${item.bg} ${sizeClass}`}>
      <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{item.label}</span>
    </span>
  );
};

export const TicketCategoryBadge = ({ category = 'IT', size = 'md' }) => {
  const config = {
    IT:         { label: 'IT Support',      bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border-blue-200 dark:border-blue-800', icon: Laptop },
    HR:         { label: 'HR Services',     bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 border-purple-200 dark:border-purple-800', icon: Users },
    FINANCE:    { label: 'Finance & Tax',   bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border-emerald-200 dark:border-emerald-800', icon: DollarSign },
    FACILITIES: { label: 'Facilities Ops',  bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200 dark:border-amber-800', icon: Building2 },
    ADMIN:      { label: 'Administration',  bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700', icon: Briefcase },
  };

  const item = config[category?.toUpperCase()] || config.IT;
  const Icon = item.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight ${item.bg} ${sizeClass}`}>
      <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{item.label}</span>
    </span>
  );
};
