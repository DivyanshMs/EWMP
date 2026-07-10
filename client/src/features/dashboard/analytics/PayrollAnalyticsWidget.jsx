import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp 
} from 'lucide-react';
import { ProgressChartPlaceholder } from '../charts/ChartsPlaceholders';

/**
 * PayrollAnalyticsWidget.jsx
 * Executive Payroll & Financial Telemetry Widget.
 * Tracks monthly payroll expenditure, upcoming disbursement runs, salary distribution, and finance approvals.
 */

export const PayrollAnalyticsWidget = () => {
  const { data: payrollRes } = useQuery({
    queryKey: ['_reports_payroll'],
    queryFn: () => api.get('/reports/payroll?export=true').then(res => res.data)
  });
  const rawData = payrollRes?.data || [];
  const total = rawData.length || 1;
  
  const processedCount = rawData.filter(r => r.payrollStatus === 'Processed').length;
  const processedPct = Math.round((processedCount / total) * 100);
  

  const salaryDist = [
    { label: 'Eng ($580k)', value: 41, color: 'bg-indigo-600' },
    { label: 'Sales ($320k)', value: 23, color: 'bg-blue-500' },
    { label: 'Ops ($240k)', value: 17, color: 'bg-emerald-500' },
    { label: 'HR & Fin ($180k)', value: 13, color: 'bg-purple-500' },
    { label: 'Exec ($100k)', value: 6, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <DollarSign size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Payroll & Compensation Expenditure
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Monthly burn rate, upcoming disbursement cycles & tax liabilities
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800/40 font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} /> June Cycle Dispersed
          </span>
        </div>
      </div>

      {/* Grid: Financial Overview & Upcoming Run */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Expenditure & Salary distribution */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-mono">Total Monthly Gross</span>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">$1,420,850</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-0.5 mt-1">
                <TrendingUp size={12} /> +3.1% vs previous month
              </span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-mono">Tax & Deductions</span>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">$312,400</div>
              <span className="text-[11px] text-gray-400 font-mono mt-1 block">22.0% effective withholding</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-mono">Net Bank Dispersal</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">$1,108,450</div>
              <span className="text-[11px] text-gray-400 font-mono mt-1 block">2,845 active accounts</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-900 dark:text-white">Department Salary Distribution</span>
              <span className="text-xs font-mono text-gray-500">100% Allocated</span>
            </div>
            <ProgressChartPlaceholder items={salaryDist} />
          </div>
        </div>

        {/* Right: Upcoming Payroll Run Card */}
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-md flex flex-col justify-between h-full min-h-[240px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                Next Cycle Run
              </span>
              <Clock size={16} className="text-indigo-300 animate-pulse" />
            </div>
            <h4 className="text-xl font-bold font-sans">July 2026 Payroll Cycle</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scheduled execution date is <strong className="text-white">July 28, 2026</strong>. Automated calculation engine is staging attendance regularizations and tax withholdings.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-indigo-500/20">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Pending Approvals:</span>
              <span className="text-amber-400 font-bold">14 Regularizations</span>
            </div>
            <button
              onClick={() => window.location.assign('/payroll')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              Simulate July Run
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollAnalyticsWidget;
