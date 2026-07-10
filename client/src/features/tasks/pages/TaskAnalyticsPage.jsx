import React from 'react';
import { TrendingUp, Clock, AlertCircle, Download, Users, Activity } from 'lucide-react';
import { AnalyticsCard, ChartPlaceholder } from '../components/TaskCards';

/**
 * TaskAnalyticsPage.jsx
 * Portfolio Intelligence & Telemetry Center for EWMP Task Management.
 * Features: Task Completion Trend, Priority Distribution, Overdue Analysis, Team Productivity, Average Completion Time, Department Comparison, and Charts Placeholders.
 */

export const TaskAnalyticsPage = ({ onExport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Controls Row */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 border border-purple-200">
              EXECUTIVE TELEMETRY
            </span>
            <span className="text-xs text-[#737686] font-mono">Q3 Portfolio Intelligence Report</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Task Management Analytics & SLA Velocity
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Audit completion velocities, priority distribution, overdue escalations, and cross-department team productivity benchmarks.
          </p>
        </div>

        <button
          onClick={() => onExport && onExport()}
          className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 shrink-0"
        >
          <Download size={16} /> Export Analytics Dossier (.PDF)
        </button>
      </div>

      {/* KPI Overview Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <AnalyticsCard 
          title="Avg Completion Time" 
          value="18.5h" 
          subtitle="From To-Do to Verified QA"
          icon={Clock}
          change="-2.4h Q3 improvement"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard 
          title="Team Productivity Rate" 
          value="94.2%" 
          subtitle="SLA deliverable success"
          icon={TrendingUp}
          change="+4.1% MoM velocity"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard 
          title="Overdue Analysis Risk" 
          value="3.6%" 
          subtitle="Tasks exceeding target dates"
          icon={AlertCircle}
          change="-1.2% reduction in escalations"
          trend="down"
          color="text-rose-600"
          bg="bg-rose-50 dark:bg-rose-950/60"
        />
        <AnalyticsCard 
          title="Critical P0 Share" 
          value="11.0%" 
          subtitle="Urgent priority distribution"
          icon={Activity}
          change="Balanced sprint backlog"
          trend="neutral"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
      </div>

      {/* Primary Chart Row: Completion Trend vs Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Task Completion Velocity Trend (Q3 Sprint 24)" type="BAR" height="h-80" />
        <ChartPlaceholder title="Task Priority Level Distribution (P0 - P3)" type="DONUT" height="h-80" />
      </div>

      {/* Secondary Chart Row: Department Comparison vs Overdue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Department Comparison & Workstream SLA Efficiency" type="BAR" height="h-80" />
        <ChartPlaceholder title="Overdue Escalation Resolution Timeline" type="LINE" height="h-80" />
      </div>

      {/* Department SLA Comparison Table */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs space-y-4">
        <div className="p-5 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <Users size={18} className="text-[#2563eb]" /> Departmental SLA Comparison & Velocity Benchmarks
          </h3>
          <span className="text-xs font-mono text-emerald-600 font-bold">● AUDITED METRICS</span>
        </div>

        <div className="overflow-x-auto font-sans text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase font-bold text-[11px] select-none font-mono">
                <th className="py-3.5 px-5">Department / Workstream</th>
                <th className="py-3.5 px-4">Total Tasks</th>
                <th className="py-3.5 px-4">Completed Rate</th>
                <th className="py-3.5 px-4">Avg Turnaround</th>
                <th className="py-3.5 px-4">Overdue Rate</th>
                <th className="py-3.5 px-5 text-right">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono">
              {[
                { dept: 'Engineering & Core DevOps', total: 42, done: '95.2%', turnaround: '16.2h', overdue: '2.1%', status: 'EXCELLENT' },
                { dept: 'InfoSec & Compliance', total: 18, done: '88.9%', turnaround: '22.0h', overdue: '5.5%', status: 'OPTIMAL' },
                { dept: 'Product Management & QA', total: 24, done: '91.7%', turnaround: '19.4h', overdue: '3.0%', status: 'OPTIMAL' },
                { dept: 'HR & Operations', total: 14, done: '100.0%', turnaround: '12.0h', overdue: '0.0%', status: 'BENCHMARK' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors font-sans">
                  <td className="py-4 px-5 font-bold text-sm text-[#191b23] dark:text-white font-mono">{row.dept}</td>
                  <td className="py-4 px-4 font-mono font-bold">{row.total}</td>
                  <td className="py-4 px-4 font-mono font-extrabold text-emerald-600">{row.done}</td>
                  <td className="py-4 px-4 font-mono">{row.turnaround}</td>
                  <td className="py-4 px-4 font-mono text-rose-600 font-bold">{row.overdue}</td>
                  <td className="py-4 px-5 text-right font-mono font-bold">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border border-emerald-200 text-xs">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
