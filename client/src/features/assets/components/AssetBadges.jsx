import React from 'react';
import { Laptop, Monitor, Keyboard, Mouse, Smartphone, Printer, Network, FileCode, HardDrive, Package, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * AssetBadges.jsx
 * Reusable status chips, condition badges, and category icons for EWMP Asset Management.
 * Follows strict Precision Enterprise design tokens.
 */

// ─── Category Config ────────────────────────────────────────────────────────
const CATEGORY_CONFIGS = {
  LAPTOP:   { label: 'Laptop',           icon: Laptop,     color: 'text-[#2563eb]',  bg: 'bg-blue-50 dark:bg-blue-950/60',   border: 'border-blue-200 dark:border-blue-800' },
  DESKTOP:  { label: 'Desktop',          icon: HardDrive,  color: 'text-purple-700', bg: 'bg-purple-50 dark:bg-purple-950/60', border: 'border-purple-200 dark:border-purple-800' },
  MONITOR:  { label: 'Monitor',          icon: Monitor,    color: 'text-indigo-700', bg: 'bg-indigo-50 dark:bg-indigo-950/60', border: 'border-indigo-200 dark:border-indigo-800' },
  KEYBOARD: { label: 'Keyboard',         icon: Keyboard,   color: 'text-slate-700',  bg: 'bg-slate-100 dark:bg-slate-900',   border: 'border-slate-300 dark:border-slate-700' },
  MOUSE:    { label: 'Mouse',            icon: Mouse,      color: 'text-slate-700',  bg: 'bg-slate-100 dark:bg-slate-900',   border: 'border-slate-300 dark:border-slate-700' },
  PHONE:    { label: 'Mobile Phone',     icon: Smartphone, color: 'text-emerald-700',bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200 dark:border-emerald-800' },
  PRINTER:  { label: 'Printer',          icon: Printer,    color: 'text-amber-700',  bg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-200 dark:border-amber-800' },
  NETWORKING:{ label: 'Networking',      icon: Network,    color: 'text-cyan-700',   bg: 'bg-cyan-50 dark:bg-cyan-950/60',   border: 'border-cyan-200 dark:border-cyan-800' },
  SOFTWARE: { label: 'Software License', icon: FileCode,   color: 'text-violet-700', bg: 'bg-violet-50 dark:bg-violet-950/60', border: 'border-violet-200 dark:border-violet-800' },
  OTHER:    { label: 'Other Equipment',  icon: Package,    color: 'text-gray-600',   bg: 'bg-gray-100 dark:bg-gray-800',     border: 'border-gray-200 dark:border-gray-700' },
};

export const CategoryBadge = ({ category = 'OTHER', size = 'md', showLabel = true }) => {
  const cfg = CATEGORY_CONFIGS[category?.toUpperCase()] || CATEGORY_CONFIGS.OTHER;
  const Icon = cfg.icon;
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-xs font-semibold gap-1.5'
  }[size] || 'px-2 py-0.5 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-bold rounded border ${cfg.bg} ${cfg.color} ${cfg.border} ${sizeStyles} transition-colors`}>
      <Icon size={size === 'sm' ? 11 : 13} className="shrink-0" />
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
};

// ─── Asset Status Badge ──────────────────────────────────────────────────────
const STATUS_CONFIGS = {
  AVAILABLE:    { label: 'Available',    dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200 dark:border-emerald-800' },
  ASSIGNED:     { label: 'Assigned',     dot: 'bg-[#2563eb]',   text: 'text-[#2563eb] dark:text-blue-300',    bg: 'bg-blue-50 dark:bg-blue-950/60',       border: 'border-blue-200 dark:border-blue-800' },
  MAINTENANCE:  { label: 'Maintenance',  dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-200 dark:border-amber-800' },
  RETIRED:      { label: 'Retired',      dot: 'bg-gray-400',    text: 'text-gray-600 dark:text-gray-400',     bg: 'bg-gray-100 dark:bg-gray-800',         border: 'border-gray-300 dark:border-gray-700' },
  LOST:         { label: 'Lost / Stolen',dot: 'bg-rose-600 animate-bounce', text: 'text-rose-700 dark:text-rose-300',  bg: 'bg-rose-50 dark:bg-rose-950/60',   border: 'border-rose-200 dark:border-rose-800' },
  DAMAGED:      { label: 'Damaged',      dot: 'bg-orange-500',  text: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/60',   border: 'border-orange-200 dark:border-orange-800' },
};

export const AssetStatusBadge = ({ status = 'AVAILABLE', size = 'md' }) => {
  const cfg = STATUS_CONFIGS[status?.toUpperCase()] || STATUS_CONFIGS.AVAILABLE;
  const sizeStyles = { sm: 'px-1.5 py-0.5 text-[10px] gap-1', md: 'px-2 py-0.5 text-xs gap-1.5', lg: 'px-3 py-1 text-xs font-semibold gap-2' }[size] || 'px-2 py-0.5 text-xs gap-1.5';
  return (
    <span className={`inline-flex items-center font-mono font-bold rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      <span>{cfg.label}</span>
    </span>
  );
};

// ─── Condition Badge ─────────────────────────────────────────────────────────
const CONDITION_CONFIGS = {
  NEW:          { label: 'New',           icon: CheckCircle2,  text: 'text-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200' },
  EXCELLENT:    { label: 'Excellent',     icon: ShieldCheck,   text: 'text-[#2563eb]',   bg: 'bg-blue-50 dark:bg-blue-950/60',       border: 'border-blue-200' },
  GOOD:         { label: 'Good',          icon: CheckCircle2,  text: 'text-teal-700',    bg: 'bg-teal-50 dark:bg-teal-950/60',       border: 'border-teal-200' },
  FAIR:         { label: 'Fair',          icon: Clock,         text: 'text-amber-700',   bg: 'bg-amber-50 dark:bg-amber-950/60',     border: 'border-amber-200' },
  POOR:         { label: 'Poor',          icon: AlertTriangle, text: 'text-orange-700',  bg: 'bg-orange-50 dark:bg-orange-950/60',   border: 'border-orange-200' },
  DAMAGED:      { label: 'Damaged',       icon: ShieldAlert,   text: 'text-rose-700',    bg: 'bg-rose-50 dark:bg-rose-950/60',       border: 'border-rose-200' },
  DECOMMISSIONED:{ label: 'Decommissioned', icon: XCircle,   text: 'text-gray-600',    bg: 'bg-gray-100 dark:bg-gray-800',         border: 'border-gray-300' },
};

export const ConditionBadge = ({ condition = 'GOOD', size = 'md' }) => {
  const cfg = CONDITION_CONFIGS[condition?.toUpperCase()] || CONDITION_CONFIGS.GOOD;
  const Icon = cfg.icon;
  const sizeStyles = { sm: 'px-1.5 py-0.5 text-[10px] gap-1', md: 'px-2 py-0.5 text-xs gap-1.5', lg: 'px-3 py-1 text-xs font-semibold gap-1.5' }[size] || 'px-2 py-0.5 text-xs gap-1.5';
  return (
    <span className={`inline-flex items-center font-mono font-bold rounded border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeStyles}`}>
      <Icon size={size === 'sm' ? 11 : 13} className="shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

// ─── Maintenance Status ──────────────────────────────────────────────────────
export const MaintenanceBadge = ({ status = 'SCHEDULED' }) => {
  const configs = {
    SCHEDULED:  { label: 'Scheduled',  bg: 'bg-blue-50 dark:bg-blue-950/60',   text: 'text-[#2563eb]',   border: 'border-blue-200',   dot: 'bg-[#2563eb]' },
    IN_PROGRESS:{ label: 'In Progress',bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700',   border: 'border-amber-200',  dot: 'bg-amber-500 animate-pulse' },
    COMPLETED:  { label: 'Completed',  bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600' },
    OVERDUE:    { label: 'Overdue',    bg: 'bg-rose-50 dark:bg-rose-950/60',   text: 'text-rose-700',    border: 'border-rose-200',   dot: 'bg-rose-600 animate-bounce' },
    CANCELLED:  { label: 'Cancelled',  bg: 'bg-gray-100 dark:bg-gray-800',     text: 'text-gray-600',    border: 'border-gray-300',   dot: 'bg-gray-400' },
  };
  const cfg = configs[status?.toUpperCase()] || configs.SCHEDULED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-bold rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export { CATEGORY_CONFIGS };
