import React, { useState } from 'react';
import { BarChart2, DollarSign, CheckCircle2, Users, Download, Layers, Clock, ShieldAlert } from 'lucide-react';
import { AnalyticsCard, ChartPlaceholder, ProgressBar } from '../components/ProjectCards';

/**
 * ProjectAnalyticsPage.jsx (Page 8)
 * Executive project telemetry and portfolio analytics center for EWMP Projects.
 * Displays Completion Rate, Budget Utilization, Department Projects, Resource Allocation, Risk Distribution, Deadline Performance, and Charts Placeholders.
 */

const ProjectAnalyticsPage = ({ onExport }) => {
  const [timeframe, setTimeframe] = useState('Q3_2026');

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            <BarChart2 size={22} className="text-[#2563eb]" /> Enterprise Project Analytics & Portfolio Telemetry
          </h1>
          <p className="text-xs text-[#737686] mt-0.5">
            Real-time portfolio intelligence covering project completion rates, budget utilization efficiency, departmental allocation, and SLA deadline adherence.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="py-2 px-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-semibold text-[#191b23] dark:text-white font-mono"
          >
            <option value="Q3_2026">Q3 2026 Telemetry</option>
            <option value="Q2_2026">Q2 2026 (Audited)</option>
            <option value="FY_2026">Full Year FY2026</option>
          </select>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors font-sans"
          >
            <Download size={14} /> Export Executive Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Project Completion Rate"
          value="78.4%"
          subtitle="Target: &gt;75% quarterly SLA"
          icon={CheckCircle2}
          change="+4.2% vs Q2 benchmark"
          trend="up"
        />
        <AnalyticsCard
          title="Budget Utilization"
          value="60.5%"
          subtitle="$1.12M spent of $1.85M cap"
          icon={DollarSign}
          change="39.5% remaining buffer"
          trend="up"
        />
        <AnalyticsCard
          title="Deadline Adherence"
          value="91.2%"
          subtitle="Milestones delivered on-time"
          icon={Clock}
          change="+3.0% SLA improvement"
          trend="up"
        />
        <AnalyticsCard
          title="Active Risk Escalations"
          value="3 Open"
          subtitle="1 High, 2 Medium severity"
          icon={ShieldAlert}
          change="-2 mitigated this week"
          trend="down"
        />
      </div>

      {/* Primary Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="Departmental Initiative Allocation & Completion Velocity"
          type="BAR"
          height="h-80"
        />
        <ChartPlaceholder
          title="Capital Expense & Labor Category Budget Distribution"
          type="PIE"
          height="h-80"
        />
      </div>

      {/* Detailed Telemetry Breakdown Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Department Projects Matrix */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <Layers size={16} className="text-[#2563eb]" /> Department Projects & Share
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {[
              { name: 'Engineering & Product', count: 4, share: 50, color: 'bg-[#2563eb]' },
              { name: 'Security & GRC', count: 2, share: 25, color: 'bg-purple-600' },
              { name: 'Sales & Revenue Tech', count: 1, share: 12.5, color: 'bg-emerald-600' },
              { name: 'People Ops & HR Tech', count: 1, share: 12.5, color: 'bg-amber-500' },
            ].map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-sans text-xs">
                  <span className="font-bold text-[#191b23] dark:text-white">{d.name}</span>
                  <span className="font-mono text-[#737686]">{d.count} Projects ({d.share}%)</span>
                </div>
                <ProgressBar progress={d.share} size="sm" showLabel={false} color={d.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Resource Allocation & Bandwidth */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <Users size={16} className="text-[#2563eb]" /> Resource Allocation Efficiency
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/60 flex justify-between items-center font-sans">
              <div>
                <span className="text-[11px] text-[#737686] block">Average Team Workload</span>
                <strong className="text-sm font-bold text-[#191b23] dark:text-white font-mono">79.2% Capacity</strong>
              </div>
              <span className="text-emerald-600 font-extrabold text-xs">● Optimal Range</span>
            </div>

            <div className="space-y-2 pt-1 font-sans text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#737686]">Optimal Capacity (60–85%):</span>
                <strong className="text-emerald-600 font-mono font-bold">12 Engineers (75%)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737686]">Overallocated (&gt;90%):</span>
                <strong className="text-rose-600 font-mono font-bold">3 Engineers (18%)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737686]">Underutilized (&lt;50%):</span>
                <strong className="text-amber-600 font-mono font-bold">1 Engineer (7%)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution & SLA Performance */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-600" /> Risk Distribution & SLA Severity
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded border border-rose-200">
                <span className="text-[10px] text-rose-700 block uppercase">High Severity</span>
                <strong className="text-lg font-extrabold text-rose-800 dark:text-white">1 Open</strong>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded border border-amber-200">
                <span className="text-[10px] text-amber-700 block uppercase">Medium Sev</span>
                <strong className="text-lg font-extrabold text-amber-800 dark:text-white">2 Open</strong>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded border border-blue-200">
                <span className="text-[10px] text-[#2563eb] block uppercase">Low Sev</span>
                <strong className="text-lg font-extrabold text-[#2563eb]">0 Open</strong>
              </div>
            </div>

            <p className="text-xs text-[#737686] font-sans leading-relaxed pt-1">
              Primary risk vector is concentrated in technical database infrastructure (PostgreSQL partitioning) and third-party biometric hardware APIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalyticsPage;
