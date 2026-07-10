import React from 'react';
import { CheckCircle2, Clock, XCircle, CreditCard, ShieldCheck, FileText, Ban } from 'lucide-react';

/**
 * PayrollBadges.jsx
 * Precision Enterprise status chips and tags for EWMP Payroll Management.
 * Follows Stitch MCP styling rules: pill border radius (rounded-full),
 * WCAG AA color contrast, and 11px uppercase bold typography.
 */

export const PayrollStatusBadge = ({ status = 'PENDING_APPROVAL' }) => {
  const statusConfig = {
    DRAFT: {
      label: 'Draft Run',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      icon: FileText
    },
    PENDING_APPROVAL: {
      label: 'Pending Approval',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: Clock
    },
    APPROVED: {
      label: 'Approved by Finance',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-[#2563eb] dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: ShieldCheck
    },
    PROCESSING: {
      label: 'Bank Processing',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      icon: CreditCard
    },
    PAID: {
      label: 'Paid & Disbursed',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    REJECTED: {
      label: 'Rejected / Revision Required',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      icon: XCircle
    },
    CANCELLED: {
      label: 'Cancelled Run',
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

export const PaymentMethodBadge = ({ method = 'BANK_TRANSFER' }) => {
  const methodMap = {
    BANK_TRANSFER: { label: 'Bank NEFT / RTGS', bg: 'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
    IMPS: { label: 'Instant IMPS Transfer', bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
    CHEQUE: { label: 'Corporate Cheque', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
    INTERNATIONAL_WIRE: { label: 'SWIFT Wire Transfer', bg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300' },
    CASH: { label: 'Petty Cash Disbursed', bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300' }
  };

  const config = methodMap[method.toUpperCase()] || { label: method, bg: 'bg-slate-50 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${config.bg}`}>
      <CreditCard size={11} />
      <span>{config.label}</span>
    </span>
  );
};

export const TaxComponentBadge = ({ type = 'PF' }) => {
  const typeMap = {
    PF: { label: 'Provident Fund (12%)', color: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
    ESI: { label: 'ESI Contribution', color: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
    PT: { label: 'Professional Tax', color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
    TDS: { label: 'TDS Income Tax', color: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300' },
    HRA: { label: 'HRA Exemption', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' }
  };

  const config = typeMap[type.toUpperCase()] || { label: type, color: 'text-gray-700 bg-gray-50 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${config.color}`}>
      {config.label}
    </span>
  );
};
