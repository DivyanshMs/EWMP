import React from 'react';
import { DollarSign, CheckCircle2, ArrowUpRight, ArrowDownRight, Download, ChevronRight, FileText, ShieldCheck, BarChart3, Sparkles } from 'lucide-react';
import { PayrollStatusBadge, PaymentMethodBadge, TaxComponentBadge } from './PayrollBadges';

/**
 * PayrollCards.jsx
 * Precision Enterprise cards for EWMP Payroll Management module.
 * Adheres strictly to Stitch MCP rules: rounded-lg (8px) / rounded-xl (12px), 1px borders, surface colors.
 */

export const PayrollRunCard = ({ run, onSelect, onApprove, onMarkPaid }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-[#c3c6d7] transition-all">
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#e1e2ed]/60 dark:border-gray-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] flex items-center justify-center font-bold text-sm font-mono">
              {run.month?.substring(0, 3).toUpperCase() || 'JUL'}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191b23] dark:text-white">
                {run.month} {run.year} Payroll
              </h3>
              <span className="text-xs text-[#737686] dark:text-gray-400 font-mono">
                Run ID: {run.id || 'PR-2026-07'} • {run.generatedBy || 'System Auto'}
              </span>
            </div>
          </div>
          <PayrollStatusBadge status={run.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
            <span className="text-[11px] text-[#737686] block">Total Payroll Disbursal</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-[#191b23] dark:text-white mt-0.5 block">
              ₹{(run.totalCost || 4850000).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
            <span className="text-[11px] text-[#737686] block">Employees Processed</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-extrabold font-mono text-[#2563eb]">
                {run.empCount || 342}
              </span>
              <span className="text-xs text-[#737686]">staff records</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#737686] dark:text-gray-400 py-2 border-t border-[#e1e2ed]/40 dark:border-gray-800/40">
          <span>Generated: <strong className="font-mono text-[#191b23] dark:text-gray-300">{run.generatedDate}</strong></span>
          <span>Net TDS: <strong className="font-mono text-rose-600">₹{(run.tds || 420000).toLocaleString('en-IN')}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
        <button
          onClick={() => onSelect(run)}
          className="flex-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
        >
          View Ledger <ChevronRight size={14} />
        </button>
        {run.status === 'PENDING_APPROVAL' && onApprove && (
          <button
            onClick={() => onApprove(run)}
            className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2 px-3 rounded transition-colors shadow-xs flex items-center justify-center gap-1"
          >
            <ShieldCheck size={14} /> Authorize Run
          </button>
        )}
        {run.status === 'APPROVED' && onMarkPaid && (
          <button
            onClick={() => onMarkPaid(run)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded transition-colors shadow-xs flex items-center justify-center gap-1"
          >
            <CheckCircle2 size={14} /> Mark Paid
          </button>
        )}
      </div>
    </div>
  );
};

export const SalaryBreakdownCard = ({ employeeName = 'Sarah SDE-II', basic = 85000, allowances = 45000, deductions = 12500, tax = 8500, net = 109000 }) => {
  const gross = basic + allowances;
  const totalDeductions = deductions + tax;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-1.5">
            <DollarSign size={16} className="text-[#2563eb]" /> Salary Structure Breakdown
          </h4>
          <span className="text-xs text-[#737686]">{employeeName} • Monthly Disbursal</span>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
          Net Payable: ₹{net.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Earnings Column */}
        <div className="space-y-2 bg-[#faf8ff] dark:bg-gray-900/40 p-3.5 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
          <h5 className="font-bold text-[#191b23] dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between">
            <span>Gross Earnings</span>
            <span className="font-mono text-[#2563eb]">₹{gross.toLocaleString('en-IN')}</span>
          </h5>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">Basic Salary (50%)</span>
            <span className="font-mono font-semibold text-[#191b23] dark:text-white">₹{basic.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">House Rent Allowance (HRA)</span>
            <span className="font-mono font-semibold text-[#191b23] dark:text-white">₹{(allowances * 0.5).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">Special & Communication Allowance</span>
            <span className="font-mono font-semibold text-[#191b23] dark:text-white">₹{(allowances * 0.35).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">Performance & Medical Bonus</span>
            <span className="font-mono font-semibold text-[#191b23] dark:text-white">₹{(allowances * 0.15).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Deductions Column */}
        <div className="space-y-2 bg-rose-50/30 dark:bg-rose-950/10 p-3.5 rounded border border-rose-100 dark:border-rose-900/30">
          <h5 className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider text-[11px] pb-1 border-b border-rose-200 dark:border-rose-800 flex justify-between">
            <span>Deductions & Taxes</span>
            <span className="font-mono text-rose-600">-₹{totalDeductions.toLocaleString('en-IN')}</span>
          </h5>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">Provident Fund (PF - 12%)</span>
            <span className="font-mono font-semibold text-rose-700 dark:text-rose-400">₹{(deductions * 0.8).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">Employee State Insurance (ESI)</span>
            <span className="font-mono font-semibold text-rose-700 dark:text-rose-400">₹{(deductions * 0.15).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#434655] dark:text-gray-300">Professional Tax (PT)</span>
            <span className="font-mono font-semibold text-rose-700 dark:text-rose-400">₹{(deductions * 0.05).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-1 font-bold pt-1 border-t border-rose-200 dark:border-rose-800">
            <span className="text-rose-800 dark:text-rose-300">TDS Income Tax Withholding</span>
            <span className="font-mono text-rose-600">₹{tax.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PayslipMiniCard = ({ payslip, onView, onDownload }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex items-center justify-between gap-4 hover:border-[#c3c6d7] transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 font-bold text-xs flex items-center justify-center font-mono">
          {payslip.month?.substring(0, 3) || 'JUL'}
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#191b23] dark:text-white">{payslip.employeeName || 'Sarah SDE-II'}</h4>
          <span className="text-xs text-[#737686] font-mono">{payslip.period || 'July 2026'} • Net: ₹{(payslip.net || 109000).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onView(payslip)}
          className="px-3 py-1.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
        >
          <FileText size={13} /> View
        </button>
        <button
          onClick={() => onDownload(payslip)}
          className="p-1.5 text-[#2563eb] hover:bg-[#ededf9] dark:hover:bg-gray-800 rounded transition-colors"
          title="Download PDF Payslip"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export const PayrollAnalyticsCard = ({ title, value, subtitle, change, trend = 'up', icon: Icon = DollarSign }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737686] dark:text-gray-400">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] flex items-center justify-center">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#191b23] dark:text-white">{value}</span>
          {change && (
            <span className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
              trend === 'up' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            }`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export const ChartPlaceholder = ({ title, height = 'h-64', type = 'bar' }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <BarChart3 size={16} className="text-[#2563eb]" />
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-[#737686]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] inline-block"></span> Current Year
          <span className="w-2.5 h-2.5 rounded-full bg-[#c3c6d7] inline-block ml-2"></span> Budget Target
        </div>
      </div>

      <div className={`w-full ${height} bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60 p-4 flex flex-col justify-end relative overflow-hidden`}>
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-30">
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
        </div>

        {type === 'bar' ? (
          <div className="grid grid-cols-12 gap-2 h-48 items-end z-10">
            {[42, 44, 45, 46, 47, 48, 48.5, 49, 50, 51, 52, 53].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb] rounded-t hover:bg-[#004ac6] transition-all cursor-pointer" style={{ height: `${(val / 60) * 100}%` }} title={`Month ${idx+1}: ₹${val}L`}></div>
                <span className="text-[10px] font-mono text-[#737686]">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full z-10 text-xs text-[#737686] flex-col gap-2">
            <Sparkles size={24} className="text-[#2563eb] animate-pulse" />
            <span className="font-semibold text-[#191b23] dark:text-white">Interactive Visualized Disbursal Breakdown</span>
            <span>Real-time enterprise payroll analytics engine</span>
          </div>
        )}
      </div>
    </div>
  );
};
