import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, CreditCard, FileText, UserCheck, MessageSquare } from 'lucide-react';
import { PayrollStatusBadge } from './PayrollBadges';

/**
 * PayrollTimelines.jsx
 * Audit trail and bank payment settlement timeline visualizers for EWMP Payroll Management.
 */

export const AuditTimeline = ({ steps = [] }) => {
  const defaultSteps = [
    {
      title: 'Payroll Run Generated (Draft)',
      actor: 'System Automation / HR Operations',
      timestamp: 'July 1, 2026 at 06:00 AM',
      status: 'COMPLETED',
      comment: 'Aggregated attendance records, unpaid leave deductions (LOP), and overtime bonuses for 342 employees.',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Finance & Tax Verification',
      actor: 'David Finance Mgr (Finance Controller)',
      timestamp: 'July 2, 2026 at 11:30 AM',
      status: 'COMPLETED',
      comment: 'Verified TDS tax withholdings, PF/ESI statutory contributions, and net bank disbursal totals.',
      icon: ShieldCheck,
      color: 'emerald'
    },
    {
      title: 'Executive Authorization',
      actor: 'Divyansh Super Admin (Org Admin)',
      timestamp: 'July 3, 2026 at 04:15 PM',
      status: 'COMPLETED',
      comment: 'Final approval authorized for ₹48,50,000 net payout across 342 staff members.',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      title: 'Bank Disbursal & Settlement',
      actor: 'ICICI Corporate Banking Gateway',
      timestamp: 'July 5, 2026 at 09:00 AM',
      status: 'PENDING',
      comment: 'Batch NACH file submitted to bank server. Awaiting UTR confirmation codes.',
      icon: CreditCard,
      color: 'amber'
    }
  ];

  const timelineSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs">
      <h3 className="text-sm font-bold text-[#191b23] dark:text-white mb-6 pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-[#2563eb]" />
          PAYROLL AUDIT TRAIL & APPROVAL WORKFLOW
        </span>
        <span className="text-xs font-mono text-[#737686] font-normal">3 of 4 stages complete</span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e1e2ed] dark:before:bg-gray-800">
        {timelineSteps.map((step, idx) => {
          const IconComp = step.icon || CheckCircle2;
          
          const iconColors = {
            blue: 'bg-[#2563eb] text-white border-blue-100 dark:border-blue-900',
            emerald: 'bg-emerald-600 text-white border-emerald-100 dark:border-emerald-900',
            amber: 'bg-amber-500 text-white border-amber-100 dark:border-amber-900',
            rose: 'bg-rose-600 text-white border-rose-100 dark:border-rose-900',
          };

          const colorStyle = iconColors[step.color] || iconColors.emerald;

          return (
            <div key={idx} className="relative group">
              <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-2xs ${colorStyle}`}>
                <IconComp size={12} />
              </div>

              <div className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 transition-all hover:border-[#c3c6d7]">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#191b23] dark:text-white">{step.title}</h4>
                    <span className="text-xs font-medium text-[#2563eb] dark:text-blue-400">{step.actor}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#737686] dark:text-gray-400 bg-white dark:bg-[#161616] px-2 py-0.5 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
                    {step.timestamp}
                  </span>
                </div>

                {step.comment && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#e1e2ed]/60 dark:border-gray-800/60 flex items-start gap-2">
                    <MessageSquare size={14} className="text-[#737686] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#434655] dark:text-gray-300 italic bg-white dark:bg-[#161616] p-2.5 rounded w-full border border-[#e1e2ed]/40 dark:border-gray-800/40">
                      "{step.comment}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PaymentTimeline = ({ batchId = 'BATCH-2026-07-01' }) => {
  const settlementSteps = [
    { title: 'Payment File Created', time: 'Jul 5, 09:15 AM', desc: 'NEFT / RTGS batch file formatted with ICICI Corporate Banking specifications.', done: true },
    { title: 'Bank Server Acknowledgement', time: 'Jul 5, 10:02 AM', desc: 'Batch verified by bank server. Total records: 342. Total Amount: ₹48.50L.', done: true },
    { title: 'RTGS / NEFT Clearing in Progress', time: 'Jul 5, 11:30 AM', desc: 'Funds debit initiated from Corporate Operating Account #****8921.', done: true },
    { title: 'Employee Accounts Credited & Payslips Sent', time: 'Estimated 04:00 PM Today', desc: 'Automated SMS and email notification dispatch with encrypted PDF payslips.', done: false },
  ];

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
        <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <CreditCard size={16} className="text-purple-600" />
          Disbursal Batch Tracking ({batchId})
        </h4>
        <span className="text-xs font-mono text-[#737686]">Gateway: ICICI CMS</span>
      </div>

      <div className="space-y-3">
        {settlementSteps.map((st, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 dark:border-gray-800/50">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${st.done ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'}`}>
              {st.done ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs">
                <strong className={`font-bold ${st.done ? 'text-[#191b23] dark:text-white' : 'text-amber-700 dark:text-amber-400'}`}>{st.title}</strong>
                <span className="font-mono text-[11px] text-[#737686]">{st.time}</span>
              </div>
              <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
