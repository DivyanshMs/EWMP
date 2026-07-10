import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, FileText, FileSpreadsheet, FileCode, Archive, ShieldCheck, Briefcase, FileCheck, Landmark, HeartPulse, Award, File, Lock, Globe } from 'lucide-react';

/**
 * DocumentBadges.jsx
 * Enterprise standardized badges for verification status, document category, and file types.
 * Adheres to EWMP Precision Enterprise design system (#2563eb primary, Inter, monospace badges).
 */

export const DocumentStatusBadge = ({ status = 'PENDING', size = 'md' }) => {
  const configs = {
    VERIFIED: {
      label: 'Verified',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    },
    PENDING: {
      label: 'Pending Verification',
      icon: Clock,
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500 animate-pulse',
    },
    REJECTED: {
      label: 'Rejected',
      icon: XCircle,
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      dot: 'bg-rose-500',
    },
    EXPIRED: {
      label: 'Expired / Action Req.',
      icon: AlertTriangle,
      bg: 'bg-rose-100 dark:bg-rose-900/80',
      text: 'text-rose-800 dark:text-rose-200',
      border: 'border-rose-300 dark:border-rose-700',
      dot: 'bg-rose-600 animate-ping',
    },
    DRAFT: {
      label: 'Draft',
      icon: FileText,
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-[#2563eb] dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-[#2563eb]',
    },
    ARCHIVED: {
      label: 'Archived',
      icon: Archive,
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-700',
      dot: 'bg-gray-500',
    },
  };

  const cfg = configs[status] || configs.PENDING;
  const Icon = cfg.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase rounded-md border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses} transition-all shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      <Icon size={size === 'sm' ? 11 : 13} className="shrink-0" />
      <span className="tracking-wide">{cfg.label}</span>
    </span>
  );
};

export const DocumentCategoryBadge = ({ category = 'OTHER', size = 'md' }) => {
  const configs = {
    POLICY:      { label: 'Policy & SLA',        icon: ShieldCheck,  color: 'text-[#2563eb]', bg: 'bg-blue-50 dark:bg-blue-950/60', border: 'border-blue-200' },
    CONTRACT:    { label: 'Legal Contract',      icon: Briefcase,    color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/60', border: 'border-purple-200' },
    COMPLIANCE:  { label: 'Compliance Audit',    icon: FileCheck,    color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200' },
    ID_PROOF:    { label: 'ID Verification',     icon: Lock,         color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-200' },
    TAX:         { label: 'Tax & Financial',     icon: Landmark,     color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/60', border: 'border-indigo-200' },
    MEDICAL:     { label: 'Medical & Health',    icon: HeartPulse,   color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/60', border: 'border-rose-200' },
    PAYSLIP:     { label: 'Payroll Document',    icon: FileSpreadsheet, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/60', border: 'border-teal-200' },
    CERTIFICATE: { label: 'Certification',       icon: Award,        color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/60', border: 'border-cyan-200' },
    TEMPLATE:    { label: 'Standard Template',   icon: FileCode,     color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300' },
    ANNOUNCEMENT:{ label: 'Announcement Notice', icon: Globe,        color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/60', border: 'border-orange-200' },
    OTHER:       { label: 'General Document',    icon: File,         color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-200' },
  };

  const cfg = configs[category] || configs.OTHER;
  const Icon = cfg.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans font-semibold rounded-lg border ${cfg.bg} ${cfg.color} ${cfg.border} ${sizeClasses}`}>
      <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};

export const FileTypeBadge = ({ fileType = 'PDF', size = 'sm' }) => {
  const configs = {
    PDF:  { label: 'PDF',  bg: 'bg-rose-600', text: 'text-white' },
    DOCX: { label: 'DOCX', bg: 'bg-[#2563eb]', text: 'text-white' },
    XLSX: { label: 'XLSX', bg: 'bg-emerald-600', text: 'text-white' },
    PPTX: { label: 'PPTX', bg: 'bg-amber-600', text: 'text-white' },
    PNG:  { label: 'PNG',  bg: 'bg-purple-600', text: 'text-white' },
    JPG:  { label: 'JPG',  bg: 'bg-indigo-600', text: 'text-white' },
    ZIP:  { label: 'ZIP',  bg: 'bg-gray-700', text: 'text-white' },
    TXT:  { label: 'TXT',  bg: 'bg-slate-600', text: 'text-white' },
  };

  const cfg = configs[fileType?.toUpperCase()] || { label: fileType || 'FILE', bg: 'bg-gray-600', text: 'text-white' };
  const sizeClasses = size === 'xs' ? 'px-1 py-0.2 text-[9px]' : size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';

  return (
    <span className={`inline-block font-mono font-extrabold uppercase tracking-wider rounded ${cfg.bg} ${cfg.text} ${sizeClasses} shadow-2xs`}>
      {cfg.label}
    </span>
  );
};
