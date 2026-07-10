import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  CalendarOff, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Users 
} from 'lucide-react';
import { DonutChartPlaceholder, BarChartPlaceholder } from '../charts/ChartsPlaceholders';

/**
 * LeaveAnalyticsWidget.jsx
 * Executive Leave & Time-Off Analytics Widget.
 * Summarizes organization-wide leave balances, pending approval queues, and department leave distribution.
 */

export const LeaveAnalyticsWidget = () => {
  const { data: leaveRes } = useQuery({
    queryKey: ['_reports_leave'],
    queryFn: () => api.get('/reports/leave?export=true').then(res => res.data)
  });
  const rawData = leaveRes?.data || [];
  const total = rawData.length || 1;
  
  const pendingCount = rawData.filter(r => r.status === 'Pending').length;
  const approvedCount = rawData.filter(r => r.status === 'Approved').length;
  const approvedPct = Math.round((approvedCount / total) * 100);
  const dynamicDeptLeave = [{ label: 'All', val1: approvedPct, val2: 100 - approvedPct, color1: 'bg-amber-500', color2: 'bg-blue-400' }];
  

  

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <CalendarOff size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Leave & Absence Management
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Active PTO utilization, planned holidays & manager approval queues
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800/40 text-xs font-mono font-semibold flex items-center gap-1">
            <Clock size={13} /> {pendingCount} Pending Approvals
          </span>
        </div>
      </div>

      {/* Grid: Donut & Dept Leave Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="bg-gray-50/50 dark:bg-[#161616]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center mb-3">
            Organization Leave Utilization
          </h4>
          <DonutChartPlaceholder
            percentage={68}
            label="PTO Utilized"
            segments={[
              { name: 'Annual Vacation', value: '42%', color: 'bg-amber-500' },
              { name: 'Sick / Medical', value: '16%', color: 'bg-blue-500' },
              { name: 'Unpaid / Other', value: '10%', color: 'bg-rose-500' },
            ]}
          />
        </div>

        <div className="lg:col-span-2 p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">Department Leave Utilization</span>
              <p className="text-[11px] text-gray-500">Comparing Annual Vacation vs Sick Leave taken</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-amber-600"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Vacation</span>
              <span className="flex items-center gap-1 text-blue-500"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Sick Leave</span>
            </div>
          </div>
          <BarChartPlaceholder bars={dynamicDeptLeave} height="h-44" maxVal={80} />
        </div>
      </div>

      {/* Bottom summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase font-mono">Total Leave Days Taken</span>
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">1,840</div>
            <span className="text-[11px] text-gray-400">Across all employees (YTD)</span>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
            <Users size={20} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase font-mono">Average Leave Balance</span>
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">14.2 Days</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Healthy reserve pool</span>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase font-mono">Manager Queue SLA</span>
            <div className="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">1.4 Days Avg</div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">3 requests pending &gt; 3 days</span>
          </div>
          <button
            onClick={() => window.location.assign('/leave')}
            className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
          >
            Review Approval Queue
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveAnalyticsWidget;
