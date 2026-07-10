import React from 'react';
import { DollarSign, FileText, CheckCircle2, CreditCard, Search, PlusCircle } from 'lucide-react';

/**
 * PayrollEmptyStates.jsx
 * Precision Enterprise empty states for EWMP Payroll Management module.
 */

export const NoPayrollRuns = ({ onRun }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] flex items-center justify-center mb-4">
        <DollarSign size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Payroll Runs Generated Yet</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mb-6">
        There are no payroll execution batches recorded for this month or academic year. Generate a new run to calculate employee salary disbursals.
      </p>
      {onRun && (
        <button
          onClick={onRun}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-5 rounded inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <PlusCircle size={15} /> Execute Monthly Payroll Run
        </button>
      )}
    </div>
  );
};

export const NoPayslips = () => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-4">
        <FileText size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Payslips Available</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm">
        Payslips will be automatically generated and made available for viewing and download once the monthly payroll run is authorized and marked as paid.
      </p>
    </div>
  );
};

export const NoPendingApprovals = () => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
        <CheckCircle2 size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">All Clear! No Pending Payroll Approvals</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm">
        All generated payroll calculation runs have been audited and authorized by Finance and Organization Executive Administrators.
      </p>
    </div>
  );
};

export const NoPaymentHistory = () => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
        <CreditCard size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Disbursed Payment Batches</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm">
        No bank settlement or NEFT/RTGS disbursal transaction records match the selected date span or payment filter.
      </p>
    </div>
  );
};

export const NoPayrollResults = ({ onReset }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center mb-4">
        <Search size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Matching Records Found</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mb-6">
        No payroll runs, employee records, or payslips match your active search keyword or departmental filter settings.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-2 px-4 rounded transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};
