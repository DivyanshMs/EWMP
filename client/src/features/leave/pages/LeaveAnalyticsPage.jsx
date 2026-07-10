import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Clock, Building2, Calendar, Download, Sparkles } from 'lucide-react';
import { LeaveAnalyticsCard, ChartPlaceholder } from '../components/LeaveCards';
import { LeaveTypeBadge } from '../components/LeaveBadges';

/**
 * LeaveAnalyticsPage.jsx
 * Executive intelligence and metrics visualization dashboard for EWMP Leave Management.
 */

export const LeaveAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('CY_2026');
  const [selectedDept, setSelectedDept] = useState('ALL');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-[#2563eb]" />
            LEAVE INTELLIGENCE & UTILIZATION ANALYTICS
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Monitor organizational absenteeism trends, departmental balance utilization, and managerial turnaround times.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded px-3 py-2 font-mono font-bold"
          >
            <option value="CY_2026">Current Year (2026)</option>
            <option value="Q3_2026">Q3 2026 (Jul–Sep)</option>
            <option value="Q2_2026">Q2 2026 (Apr–Jun)</option>
            <option value="FY_2025">Previous Year (2025)</option>
          </select>

          <button
            onClick={() => alert('Generating PDF Executive Intelligence Report...')}
            className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download size={14} /> Export Analytics Report
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LeaveAnalyticsCard
          title="Organization Utilization"
          value="42.8%"
          subtitle="Of total annual leave allocated"
          icon={TrendingUp}
          change="+4.2% vs Q2"
          trend="up"
        />
        <LeaveAnalyticsCard
          title="Average Approval Time"
          value="4.2 Hrs"
          subtitle="Manager turnaround speed"
          icon={Clock}
          change="-1.5 hrs improvement"
          trend="up"
        />
        <LeaveAnalyticsCard
          title="Unplanned Absence Rate"
          value="3.1%"
          subtitle="Emergency & sick leave ratio"
          icon={PieChart}
          change="-0.4% vs benchmark"
          trend="up"
        />
        <LeaveAnalyticsCard
          title="Peak Absenteeism Month"
          value="May / Dec"
          subtitle="Vacation clustering periods"
          icon={Calendar}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Monthly Leave Volume Trends (Requests vs Approvals)" height="h-72" type="bar" />
        <ChartPlaceholder title="Leave Policy Distribution (Annual vs Sick vs Casual)" height="h-72" type="sparkle" />
      </div>

      {/* Department Comparison & Most Used Types Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Utilization Comparison (2 Cols) */}
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Building2 size={16} className="text-[#2563eb]" />
              DEPARTMENT LEAVE UTILIZATION COMPARISON
            </h3>
            <span className="text-xs font-mono text-[#737686]">Active Headcount: 4,820</span>
          </div>

          <div className="space-y-4">
            {[
              { dept: 'Engineering & Product', headcount: 1850, utilization: 48, avgDays: 9.6, leader: 'Sarah Tech VP' },
              { dept: 'Sales & Marketing', headcount: 1200, utilization: 42, avgDays: 8.4, leader: 'Marcus Chief Revenue' },
              { dept: 'Customer Support & Ops', headcount: 950, utilization: 55, avgDays: 11.0, leader: 'Priya CS Head' },
              { dept: 'Human Resources & Admin', headcount: 320, utilization: 35, avgDays: 7.0, leader: 'Emily HR Director' },
              { dept: 'Finance & Legal', headcount: 500, utilization: 30, avgDays: 6.0, leader: 'David CFO' },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <strong className="font-bold text-[#191b23] dark:text-white">{row.dept}</strong>
                    <span className="text-[#737686] ml-2">({row.headcount} employees)</span>
                  </div>
                  <div className="font-mono">
                    <span className="font-bold text-[#2563eb]">{row.utilization}%</span>
                    <span className="text-[#737686] ml-2 font-normal">Avg: {row.avgDays}d/emp</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563eb]" style={{ width: `${row.utilization}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used Leave Policies (1 Col) */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                MOST USED POLICIES
              </h3>
              <span className="text-xs font-mono text-[#737686]">YTD Share</span>
            </div>

            <div className="space-y-3">
              {[
                { code: 'ANNUAL', name: 'Annual Leave', share: '64%', count: '2,840 requests' },
                { code: 'SICK', name: 'Sick Leave', share: '21%', count: '920 requests' },
                { code: 'CASUAL', name: 'Casual Leave', share: '10%', count: '450 requests' },
                { code: 'COMPENSATORY', name: 'Compensatory Leave', share: '5%', count: '210 requests' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <LeaveTypeBadge type={item.code} />
                    </div>
                    <span className="text-[11px] text-[#737686]">{item.count}</span>
                  </div>
                  <span className="text-base font-mono font-extrabold text-[#191b23] dark:text-white">{item.share}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-xs text-[#737686] text-center">
            Statutory compliance rate across all policies is currently at <strong className="text-emerald-600 font-mono font-bold">99.8%</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
