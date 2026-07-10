import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, DollarSign, Users, Download, BarChart3 } from 'lucide-react';
import { AnalyticsCard, KPICard, TrendCard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, LineChartMock, AreaChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * ExecutiveAnalyticsPage.jsx
 * High-level executive business intelligence scorecard inspired by Power BI and SAP Analytics Cloud.
 * Features Cross-module KPIs, Organization Health Score (94/100), Department Comparison matrix, and AI Insight Placeholder.
 */
export const ExecutiveAnalyticsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/20 backdrop-blur-xs border border-white/30 uppercase tracking-widest">
              EXECUTIVE BOARD BRIEFING
            </span>
            <span className="text-xs font-mono text-blue-100">Live Cross-Module Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Enterprise Cross-Module Intelligence &amp; Org Health Scorecard
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Consolidated macroscopic analysis fusing attendance adherence, payroll efficiency, talent retention, project milestone burn, and asset utilization into an executive wellness metric.
          </p>
        </div>

        {/* Org Health Score Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-5 flex items-center gap-5 z-10 shrink-0 shadow-xl">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 block font-bold">
              Org Health Score
            </span>
            <strong className="text-3xl sm:text-4xl font-black text-white block mt-0.5">
              94<span className="text-xl text-blue-200 font-bold">/100</span>
            </strong>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/80 text-white font-mono text-[10px] font-bold block w-fit">
              EXCELLENT RATING
            </span>
            <span className="text-xs text-blue-100 font-mono block">+2.4 pts YoY</span>
          </div>
        </div>
      </div>

      {/* AI Insight Placeholder Strip */}
      <div className="bg-gradient-to-r from-purple-900/10 via-blue-900/10 to-indigo-900/10 dark:from-purple-950/40 dark:via-blue-950/40 dark:to-indigo-950/40 border border-purple-300 dark:border-purple-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md shrink-0 animate-pulse">
            <Sparkles size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider font-mono">
                AI EXECUTIVE INSIGHT TELEMETRY (GEMINI 3.1 PRO ENGINE)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                AUTOMATED INFERENCE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#191b23] dark:text-gray-200 leading-relaxed font-medium">
              <strong className="text-purple-600 dark:text-purple-400 font-bold">Cross-Module Correlation Detected:</strong> Overtime expenditure in Engineering R&amp;D increased by <strong className="underline">4.2%</strong> over the last 30 days while overall attendance remained stellar at <strong className="underline">98.4%</strong>. This directly correlates with sprint delivery acceleration on <strong className="font-bold">PRJ-101 (Cloud Migration)</strong>. Recommend authorizing a temporary contractor allocation to prevent staff burnout before Q4 release.
            </p>
          </div>
        </div>
        <button
          onClick={() => onExportReport && onExportReport('AI Executive Briefing Document')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-all flex items-center gap-1.5"
        >
          <Download size={14} /> Export AI Brief
        </button>
      </div>

      {/* Cross-Module Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Revenue / Employee Index"
          value="$342,000"
          subtitle="Annualized productivity ROI"
          icon={TrendingUp}
          change="+8.4% vs industry peer group"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Overall Labor Cost Ratio"
          value="42.8%"
          subtitle="Payroll spend as % of revenue"
          icon={DollarSign}
          change="Optimal efficiency tier"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Talent Retention Index"
          value="94.2%"
          subtitle="Voluntary retention rate"
          icon={Users}
          change="Top 5% enterprise rank"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard
          title="Audit Compliance Score"
          value="100%"
          subtitle="SOC2 & statutory tax adherence"
          icon={ShieldCheck}
          change="Zero findings reported"
          trend="up"
          color="text-indigo-600"
          bg="bg-indigo-50 dark:bg-indigo-950/60"
        />
      </div>

      {/* Cross-Module Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Cross-Module Productivity vs Labor Spend Correlation Curve"
          subtitle="Comparing total payroll & compensation capital against completed project story points"
          onExport={onExportReport}
          height="h-72"
          legends={[
            { label: 'Milestone Velocity Index', color: 'bg-[#2563eb]', value: '+14.2%' },
            { label: 'Total Labor Cost ($M)', color: 'bg-emerald-500', value: '$2.84M' }
          ]}
        >
          <AreaChartMock
            series1={[40, 50, 58, 65, 75, 84, 92]}
            series2={[45, 48, 50, 52, 55, 58, 60]}
          />
        </ChartContainer>

        <ChartContainer
          title="Enterprise Composite Health Score Trajectory"
          subtitle="Chronological tracking of the composite 100-point organizational health scorecard"
          onExport={onExportReport}
          height="h-72"
          legends={[
            { label: 'Board Target Score (90.0)', color: 'bg-gray-400', value: 'Target' },
            { label: 'Actual Composite Score', color: 'bg-purple-600', value: '94.0' }
          ]}
        >
          <LineChartMock
            points={[88, 89, 90, 91, 92, 92, 93, 93, 94]}
            color="#9333ea"
            gradientFrom="rgba(147, 51, 234, 0.3)"
          />
        </ChartContainer>
      </div>

      {/* Business Summary Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Attendance & Punctuality"
          value="98.4%"
          target="95.0%"
          progress={98}
          departmentLeader="IT Infrastructure"
          status="EXCEEDING"
          color="bg-emerald-600"
        />
        <KPICard
          title="Project Deadline Delivery"
          value="94.6%"
          target="90.0%"
          progress={95}
          departmentLeader="Engineering R&D"
          status="ON TRACK"
          color="bg-[#2563eb]"
        />
        <KPICard
          title="Recruitment Offer Acceptance"
          value="92.8%"
          target="85.0%"
          progress={93}
          departmentLeader="Sales & Growth"
          status="TOP TIER"
          color="bg-purple-600"
        />
      </div>

      {/* Departmental Cross-Module Comparison Matrix Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
          <BarChart3 size={18} className="text-[#2563eb]" /> Executive Departmental Comparison Matrix
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
