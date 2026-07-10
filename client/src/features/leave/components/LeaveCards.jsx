import React from 'react';
import { Calendar, CheckCircle2, XCircle, HelpCircle, ArrowUpRight, ArrowDownRight, ChevronRight, BarChart3, Sparkles } from 'lucide-react';
import { LeaveStatusBadge, LeaveTypeBadge, LeaveDurationBadge } from './LeaveBadges';

/**
 * LeaveCards.jsx
 * Precision Enterprise cards for EWMP Leave Management module.
 * Adheres to Stitch MCP rules: rounded-lg (8px) / rounded-xl (12px), 1px borders, soft backgrounds.
 */

export const LeaveBalanceCard = ({ title, total = 20, used = 5, pending = 2, icon: Icon = Calendar, colorScheme = 'blue', onApply, onAdjust }) => {
  const remaining = Math.max(0, total - used - pending);
  const percentageUsed = Math.min(100, Math.round((used / total) * 100)) || 0;

  const colorStyles = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-[#2563eb] dark:text-blue-400', bar: 'bg-[#2563eb]', border: 'border-blue-100 dark:border-blue-900/40' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500', border: 'border-rose-100 dark:border-rose-900/40' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500', border: 'border-amber-100 dark:border-amber-900/40' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500', border: 'border-purple-100 dark:border-purple-900/40' },
  };

  const style = colorStyles[colorScheme] || colorStyles.blue;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#c3c6d7] dark:hover:border-gray-700">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.bg} ${style.text}`}>
              <Icon size={18} />
            </div>
            <h3 className="text-sm font-semibold text-[#191b23] dark:text-white">{title}</h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#ededf9] dark:bg-gray-800 text-[#434655] dark:text-gray-300">
            Total: {total}d
          </span>
        </div>

        <div className="my-4">
          <div className="flex items-baseline justify-between mb-1">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#191b23] dark:text-white">{remaining}</span>
              <span className="text-xs font-medium text-[#737686] dark:text-gray-400 ml-1.5">days available</span>
            </div>
            <span className="text-xs font-semibold text-[#737686] dark:text-gray-400 font-mono">{percentageUsed}% used</span>
          </div>
          <div className="w-full h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div className={`h-full ${style.bar} transition-all duration-500`} style={{ width: `${percentageUsed}%` }} title={`Used: ${used}d`} />
            {pending > 0 && (
              <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${Math.min(100 - percentageUsed, Math.round((pending / total) * 100))}%` }} title={`Pending: ${pending}d`} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60 font-medium text-[#434655] dark:text-gray-400">
          <div className="flex items-center justify-between px-2 py-1 bg-[#faf8ff] dark:bg-gray-900/50 rounded">
            <span>Used:</span>
            <span className="font-mono font-bold text-[#191b23] dark:text-white">{used}d</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-amber-50/60 dark:bg-amber-950/20 rounded">
            <span>Pending:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{pending}d</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
        <button
          onClick={onApply}
          className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2 px-3 rounded transition-colors shadow-xs"
        >
          Apply Leave
        </button>
        {onAdjust && (
          <button
            onClick={onAdjust}
            className="px-2.5 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-medium rounded transition-colors"
            title="Adjust Leave Balance (HR/Admin)"
          >
            Adjust
          </button>
        )}
      </div>
    </div>
  );
};

export const LeaveRequestCard = ({ request, onSelect, onCancel }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs hover:border-[#c3c6d7] transition-all">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LeaveTypeBadge type={request.type} />
            <LeaveDurationBadge days={request.days} isHalfDay={request.isHalfDay} />
          </div>
          <h4 className="text-sm font-bold text-[#191b23] dark:text-white">
            {request.startDate} — {request.endDate}
          </h4>
        </div>
        <LeaveStatusBadge status={request.status} />
      </div>

      <p className="text-xs text-[#434655] dark:text-gray-300 line-clamp-2 my-2 bg-[#faf8ff] dark:bg-gray-900/50 p-2 rounded border border-[#e1e2ed]/50 dark:border-gray-800/50 italic">
        "{request.reason || 'No specific reason provided'}"
      </p>

      <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#e1e2ed]/60 dark:border-gray-800/60 text-xs text-[#737686] dark:text-gray-400">
        <span>Submitted: <strong className="font-mono">{request.submittedAt}</strong></span>
        <div className="flex items-center gap-2">
          {request.status === 'PENDING' && onCancel && (
            <button 
              onClick={() => onCancel(request)}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium underline"
            >
              Cancel Request
            </button>
          )}
          <button
            onClick={() => onSelect(request)}
            className="text-[#2563eb] hover:text-[#004ac6] dark:text-blue-400 font-semibold flex items-center gap-0.5"
          >
            Details <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ApprovalCard = ({ request, onApprove, onReject, onRequestInfo }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-[#c3c6d7] transition-all">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-[#e1e2ed]/60 dark:border-gray-800/60 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ededf9] dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-[#2563eb]">
              {request.employeeName?.substring(0, 2).toUpperCase() || 'EMP'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#191b23] dark:text-white leading-tight">{request.employeeName}</h4>
              <span className="text-[11px] text-[#737686] dark:text-gray-400 font-medium">{request.department} • {request.designation}</span>
            </div>
          </div>
          <LeaveStatusBadge status={request.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 bg-[#faf8ff] dark:bg-gray-900/40 p-2.5 rounded border border-[#e1e2ed]/50 dark:border-gray-800/50">
          <div>
            <span className="text-[11px] text-[#737686] block">Leave Type</span>
            <LeaveTypeBadge type={request.type} />
          </div>
          <div>
            <span className="text-[11px] text-[#737686] block">Duration</span>
            <LeaveDurationBadge days={request.days} isHalfDay={request.isHalfDay} />
          </div>
          <div className="col-span-2 pt-1 border-t border-[#e1e2ed]/40 dark:border-gray-800/40">
            <span className="text-[11px] text-[#737686] block">Dates Requested</span>
            <span className="text-xs font-mono font-bold text-[#191b23] dark:text-white">{request.startDate} — {request.endDate}</span>
          </div>
        </div>

        <div className="text-xs">
          <span className="text-[#737686] font-medium">Reason for Leave:</span>
          <p className="text-[#191b23] dark:text-gray-200 mt-0.5 italic bg-white dark:bg-[#161616] p-2 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
            "{request.reason}"
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
        <button
          onClick={() => onApprove(request)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1 shadow-2xs"
        >
          <CheckCircle2 size={14} /> Approve
        </button>
        <button
          onClick={() => onReject(request)}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1 shadow-2xs"
        >
          <XCircle size={14} /> Reject
        </button>
        <button
          onClick={() => onRequestInfo(request)}
          className="px-2.5 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-medium rounded transition-colors flex items-center gap-1"
          title="Request More Information"
        >
          <HelpCircle size={14} /> Info
        </button>
      </div>
    </div>
  );
};

export const LeaveAnalyticsCard = ({ title, value, subtitle, change, trend = 'up', icon: Icon = BarChart3 }) => {
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#c3c6d7] inline-block ml-2"></span> Previous Year
        </div>
      </div>

      <div className={`w-full ${height} bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60 p-4 flex flex-col justify-end relative overflow-hidden`}>
        {/* Grid lines background */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-30">
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
        </div>

        {/* Simulated Bars or Lines */}
        {type === 'bar' ? (
          <div className="grid grid-cols-12 gap-2 h-48 items-end z-10">
            {[45, 60, 35, 80, 50, 90, 75, 40, 65, 85, 70, 55].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#2563eb] rounded-t hover:bg-[#004ac6] transition-all cursor-pointer" style={{ height: `${val}%` }} title={`Month ${idx+1}: ${val} requests`}></div>
                <span className="text-[10px] font-mono text-[#737686]">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full z-10 text-xs text-[#737686] flex-col gap-2">
            <Sparkles size={24} className="text-[#2563eb] animate-pulse" />
            <span className="font-semibold text-[#191b23] dark:text-white">Interactive Visualized Distribution</span>
            <span>Real-time leave analytics chart rendering engine</span>
          </div>
        )}
      </div>
    </div>
  );
};
