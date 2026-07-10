import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, PlayCircle, PauseCircle, Flag, TrendingUp, DollarSign, ShieldAlert, CheckCircle } from 'lucide-react';

/**
 * ProjectBadges.jsx
 * Systematic status chips, health tags, priority indicators, and expense badges for EWMP Project Management.
 * Follows Stitch MCP "Precision Enterprise" tokens (#2563eb, rounded-full, Inter typography).
 */

export const ProjectStatusBadge = ({ status = 'ACTIVE' }) => {
  const configs = {
    ACTIVE: { label: 'Active', bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-[#2563eb] dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', icon: PlayCircle },
    COMPLETED: { label: 'Completed', bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
    DELAYED: { label: 'Delayed', bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', icon: AlertTriangle },
    PLANNING: { label: 'Planning', bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', icon: Clock },
    ON_HOLD: { label: 'On Hold', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', icon: PauseCircle },
  };

  const c = configs[status] || configs.ACTIVE;
  const IconComp = c.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border shadow-2xs ${c.bg} ${c.text} ${c.border}`}>
      <IconComp size={12} className="shrink-0" />
      <span>{c.label}</span>
    </span>
  );
};

export const ProjectHealthBadge = ({ health = 'ON_TRACK' }) => {
  const configs = {
    ON_TRACK: { label: 'On Track', bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200', icon: CheckCircle },
    AT_RISK: { label: 'At Risk', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200', icon: AlertTriangle },
    OFF_TRACK: { label: 'Off Track', bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200', icon: ShieldAlert },
    EXCEEDED: { label: 'Exceeded SLA', bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200', icon: TrendingUp },
  };

  const c = configs[health] || configs.ON_TRACK;
  const IconComp = c.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <IconComp size={12} />
      <span>{c.label}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority = 'MEDIUM' }) => {
  const configs = {
    CRITICAL: { label: 'Critical', bg: 'bg-rose-600 text-white font-extrabold shadow-2xs', border: 'border-rose-700' },
    HIGH: { label: 'High Priority', bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold', border: 'border-rose-200' },
    MEDIUM: { label: 'Medium', bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-300 font-bold', border: 'border-blue-200' },
    LOW: { label: 'Low', bg: 'bg-gray-100 dark:bg-gray-800 text-[#737686] dark:text-gray-300 font-semibold', border: 'border-gray-200' },
  };

  const c = configs[priority] || configs.MEDIUM;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${c.bg} ${c.border}`}>
      <Flag size={10} />
      <span>{c.label}</span>
    </span>
  );
};

export const MilestoneStatusBadge = ({ status = 'IN_PROGRESS' }) => {
  const configs = {
    COMPLETED: { label: 'Milestone Met', bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700', border: 'border-emerald-200' },
    IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50 dark:bg-blue-950 text-[#2563eb]', border: 'border-blue-200' },
    PENDING: { label: 'Not Started', bg: 'bg-gray-100 dark:bg-gray-800 text-[#737686]', border: 'border-gray-200' },
    BLOCKED: { label: 'Dependency Blocked', bg: 'bg-rose-50 dark:bg-rose-950 text-rose-700', border: 'border-rose-200' },
  };

  const c = configs[status] || configs.IN_PROGRESS;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${c.bg} ${c.border}`}>
      {c.label}
    </span>
  );
};

export const ExpenseCategoryBadge = ({ category = 'LABOR' }) => {
  const configs = {
    LABOR: { label: 'Engineering & Labor', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
    SOFTWARE: { label: 'Cloud & SaaS Licenses', color: 'bg-blue-100 text-[#2563eb] dark:bg-blue-950 dark:text-blue-300' },
    INFRA: { label: 'AWS & Infrastructure', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    CONTRACTOR: { label: 'External Contractors', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    TRAVEL: { label: 'Client Travel & Ops', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  };

  const c = configs[category] || configs.LABOR;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${c.color}`}>
      <DollarSign size={10} />
      <span>{c.label}</span>
    </span>
  );
};
