import React, { useState } from 'react';
import { BarChart3, Filter, Download, Sparkles, Clock, Users } from 'lucide-react';

import { AnalyticsCard, ChartsPlaceholder } from '../components/AttendanceCards';

/**
 * AttendanceAnalyticsPage.jsx
 * Page 6: Advanced workforce attendance intelligence and analytics reporting for EWMP.
 * Features Attendance Trends, Department Comparison, Late Arrival Statistics,
 * Overtime Trends, Working Hours Analysis, and interactive Monthly Heatmap placeholders.
 */

export const AttendanceAnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [department, setDepartment] = useState('All Departments');

  const handleExportAnalytics = () => {
    alert(`Exporting executive attendance intelligence package for (${timeframe} • ${department}) to verified PDF / Excel...`);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* 1. Header Banner & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Workforce Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="text-blue-600 dark:text-blue-400 shrink-0" size={30} />
            Attendance Analytics &amp; Heatmaps
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Analyze organization-wide check-in compliance, department attendance comparisons, late arrival frequencies, overtime stabilization trends, and monthly biometric heatmaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            <option value="Last 30 Days">Last 30 Business Days</option>
            <option value="Current Quarter (Q3)">Current Quarter (Q3)</option>
            <option value="Year-to-Date (2026)">Year-to-Date (2026)</option>
          </select>

          <button
            onClick={handleExportAnalytics}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Overall Attendance SLA"
          value="96.4%"
          subtitle="vs 95.0% organizational target"
          chartType="bar"
          metric="+1.4% above SLA"
          isPositive={true}
        />
        <AnalyticsCard
          title="Late Arrival Statistics"
          value="2.8%"
          subtitle="Avg 14 mins delay per incident"
          chartType="line"
          metric="-0.8% decrease vs last month"
          isPositive={true}
        />
        <AnalyticsCard
          title="Overtime Trends"
          value="342 hrs"
          subtitle="Across 4 active divisions"
          chartType="bar"
          metric="-14.2% shift stabilization"
          isPositive={true}
        />
        <AnalyticsCard
          title="Remote / WFH Ratio"
          value="18.5%"
          subtitle="Geofence verified IP check-in"
          chartType="pie"
          metric="Stable hybrid distribution"
          isPositive={true}
        />
      </div>

      {/* 3. Main Interactive Heatmap & Trend Placeholder */}
      <div className="space-y-6">
        <ChartsPlaceholder
          title="Organization-Wide Monthly Attendance Heatmap & Trend Analysis"
          subtitle="Visual simulation of biometric kiosk logs, shift compliance, and geofenced check-in distribution across all 1,350 personnel"
          height="h-96"
        />
      </div>

      {/* 4. Department Comparison & Working Hours Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Department Comparison Box */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Department Attendance Comparison
            </h4>
            <span className="text-xs font-mono text-gray-400 font-bold">July 2026</span>
          </div>

          <div className="space-y-4">
            {[
              { dept: 'Engineering', rate: 98.2, late: '1.2%', ot: '140h', color: 'bg-blue-600' },
              { dept: 'Human Resources', rate: 99.1, late: '0.4%', ot: '12h', color: 'bg-purple-600' },
              { dept: 'Global Sales', rate: 92.4, late: '4.8%', ot: '85h', color: 'bg-emerald-500' },
              { dept: 'Finance & Audit', rate: 97.5, late: '1.5%', ot: '45h', color: 'bg-teal-500' },
              { dept: 'Operations & IT', rate: 91.8, late: '5.2%', ot: '60h', color: 'bg-amber-500' },
            ].map((d, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-gray-800 dark:text-gray-200">{d.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Late: {d.late}</span>
                    <span className="text-teal-600">OT: {d.ot}</span>
                    <strong className="text-gray-900 dark:text-white font-extrabold">{d.rate}%</strong>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.rate}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] font-mono text-gray-400 flex items-center justify-between">
            <span>Organizational SLA Threshold: <strong className="text-gray-700 dark:text-gray-300">90.0%</strong></span>
            <span className="text-emerald-600 font-bold">✓ All departments compliant</span>
          </div>
        </div>

        {/* Working Hours Analysis Box */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-purple-600" />
              Working Hours Analysis &amp; Shifts
            </h4>
            <span className="text-xs font-mono text-gray-400 font-bold">30 Day Rolling Avg</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center font-mono">
            <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 block uppercase font-bold">Standard Shift Hours</span>
              <strong className="text-2xl text-gray-900 dark:text-white block mt-1">8h 12m</strong>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Avg per active employee</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 block uppercase font-bold">Avg Break Duration</span>
              <strong className="text-2xl text-amber-600 block mt-1">48 mins</strong>
              <span className="text-[10px] text-gray-400 mt-1 block">Within 60m SLA limit</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
            <strong className="text-purple-900 dark:text-purple-300 font-bold block mb-1">
              ✨ EWMP AI Workforce Insight:
            </strong>
            Over the past 30 days, employees on the **Standard Morning Shift** demonstrated a **3.4% higher biometric sync compliance** than evening rosters. Automated shift reminders have reduced late arrivals by **18 incidents**.
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] font-mono text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1"><Sparkles size={13} className="text-blue-500" /> Real-time HRIS Sync Active</span>
            <span>Ref: ANA-202607-001</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalyticsPage;
