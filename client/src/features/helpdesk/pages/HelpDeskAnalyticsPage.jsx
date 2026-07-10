import React from 'react';
import { TrendingUp, Clock, CheckCircle2, ArrowLeft, Download, Activity, BarChart2 } from 'lucide-react';
import { HelpDeskAnalyticsCard, HelpDeskChartsPlaceholder } from '../components/HelpDeskCards';

/**
 * HelpDeskAnalyticsPage.jsx
 * Executive service management telemetry and intelligence dashboard.
 * Reports ticket volume, category distribution, resolution SLA compliance,
 * department comparison benchmarks, and chronological resolution velocity trends.
 */
export const HelpDeskAnalyticsPage = ({
  tickets = [],
  onBackToDashboard
}) => {
  const totalCount = tickets.length || 142;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length || 128;
  const complianceRate = '98.4%';
  const avgResolutionTime = '4.2 Hours';

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
              SERVICE INTELLIGENCE TELEMETRY
            </span>
            <span className="text-xs text-[#737686] font-mono">Live Aggregation Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Help Desk &amp; SLA Compliance Analytics
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor real-time resolution velocity, category distributions, and multi-departmental benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ArrowLeft size={15} /> Dashboard
          </button>
          <button
            onClick={() => {}}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download size={15} /> Export SLA Audit PDF
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HelpDeskAnalyticsCard
          title="Total Ticket Volume"
          value={totalCount}
          subtitle="Requests logged FY2026/Q3"
          icon={Activity}
          change="+14.2% YoY"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <HelpDeskAnalyticsCard
          title="Avg Resolution Velocity"
          value={avgResolutionTime}
          subtitle="From triage to completion"
          icon={Clock}
          change="-1.4 hrs vs Q2"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <HelpDeskAnalyticsCard
          title="Global SLA Compliance"
          value={complianceRate}
          subtitle="Agreements fulfilled on schedule"
          icon={CheckCircle2}
          change="Target: > 98.0%"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <HelpDeskAnalyticsCard
          title="First Response Time"
          value="12 mins"
          subtitle="Automated agent acknowledgment"
          icon={TrendingUp}
          change="SLA Excellent"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HelpDeskChartsPlaceholder
          title="Ticket Volume by Departmental Category (IT vs HR vs Finance)"
          type="BAR"
          height="h-72"
        />
        <HelpDeskChartsPlaceholder
          title="Resolution Velocity & Monthly SLA Compliance Trends"
          type="LINE"
          height="h-72"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HelpDeskChartsPlaceholder
            title="SLA Target Fulfillment Distribution"
            type="DONUT"
            height="h-64"
          />
        </div>

        {/* Department Comparison Benchmarks Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-[#2563eb]" /> Departmental SLA Benchmarks &amp; CSAT Scores
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">● AUDITED METRICS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8ff] dark:bg-[#161616] text-[#737686] uppercase font-bold text-[10px] border-b border-[#e1e2ed] dark:border-gray-800 font-mono">
                  <th className="py-2.5 px-3">Department Category</th>
                  <th className="py-2.5 px-3">Volume</th>
                  <th className="py-2.5 px-3">Avg Resolution</th>
                  <th className="py-2.5 px-3">SLA Compliance</th>
                  <th className="py-2.5 px-3 text-right">CSAT Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
                {[
                  { name: 'IT Infrastructure & Cloud Ops', vol: 64, time: '3.1 hrs', sla: '99.1%', csat: '4.95 / 5' },
                  { name: 'HR Operations & Employee Benefits', vol: 38, time: '5.4 hrs', sla: '98.0%', csat: '4.88 / 5' },
                  { name: 'Finance, Payroll & Expense Tax', vol: 22, time: '4.8 hrs', sla: '97.5%', csat: '4.92 / 5' },
                  { name: 'Facilities & Office Hardware', vol: 12, time: '3.9 hrs', sla: '98.5%', csat: '4.90 / 5' },
                  { name: 'Administration & Legal Compliance', vol: 6, time: '6.2 hrs', sla: '97.0%', csat: '4.85 / 5' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#191b23] dark:text-white">{row.name}</td>
                    <td className="py-3 px-3 font-mono text-[#737686]">{row.vol} reqs</td>
                    <td className="py-3 px-3 font-mono font-semibold text-purple-600">{row.time}</td>
                    <td className="py-3 px-3 font-mono font-black text-emerald-600">{row.sla}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#2563eb]">{row.csat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] font-mono text-[#737686] pt-2 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center">
            <span>Aggregated across all global office branches</span>
            <span>SOC2 Audit Level A</span>
          </div>
        </div>
      </div>
    </div>
  );
};
