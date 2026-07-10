import React from 'react';
import { BarChart3, Play, Download, Calendar, Users, DollarSign, Activity, ArrowRight, Clock, Briefcase, Laptop, Award, UserCheck } from 'lucide-react';
import { AnalyticsCard, ReportCard, TrendCard } from '../components/ReportCards';
import { ChartContainer, DonutChartMock, AreaChartMock, BarChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * ReportsDashboardPage.jsx
 * Master Business Intelligence command center inspired by Power BI, Looker, and Tableau.
 * Presents Overall Workforce Summary KPIs, domain report catalog cards, and department variance tables.
 */
export const ReportsDashboardPage = ({
  onNavigate,
  onGenerateReport,
  onExportReport,
  onScheduleReport
}) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner & Quick Actions */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
              EXECUTIVE BI COMMAND CENTER
            </span>
            <span className="text-xs text-[#737686] font-mono">SOC2 Audited Data Warehouse</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Reports &amp; Analytics Dashboard
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Real-time business intelligence telemetry across attendance, payroll, leave, performance, recruitment, projects, and assets.
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onScheduleReport && onScheduleReport('Executive Master Brief')}
            className="px-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold font-mono transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Calendar size={15} className="text-[#2563eb]" /> Schedule Report
          </button>
          <button
            onClick={() => onExportReport && onExportReport('Master BI Summary')}
            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download size={15} /> Export Report
          </button>
          <button
            onClick={() => onGenerateReport && onGenerateReport('Custom BI Analysis')}
            className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Play size={15} className="fill-current" /> Generate Report
          </button>
        </div>
      </div>

      {/* Overall Workforce Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Active Headcount"
          value="284"
          subtitle="Full-time & contracted staff"
          icon={Users}
          change="+12 this quarter"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Monthly Payroll Spend"
          value="$2.84M"
          subtitle="FY2026/Q3 burn rate"
          icon={DollarSign}
          change="On budget target"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Annual Retention Rate"
          value="94.2%"
          subtitle="Top 10% industry tier"
          icon={UserCheck}
          change="+1.8% YoY"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard
          title="Org Health Index"
          value="94 / 100"
          subtitle="Composite BI wellness score"
          icon={Activity}
          change="Excellent Rating"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Visual Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartContainer
            title="Workforce Allocation by Department"
            subtitle="Current headcount distribution"
            onExport={onExportReport}
            height="h-64"
          >
            <DonutChartMock centerValue="284" centerLabel="TOTAL STAFF" />
          </ChartContainer>
        </div>

        <div className="lg:col-span-2">
          <ChartContainer
            title="Monthly Payroll Spend & Productivity Velocity Trends"
            subtitle="Correlation between compensation expenditure and project milestone delivery"
            onExport={onExportReport}
            height="h-64"
            legends={[
              { label: 'Productivity Index', color: 'bg-[#2563eb]', value: '+14.2%' },
              { label: 'Payroll Spend', color: 'bg-emerald-500', value: '$2.84M' }
            ]}
          >
            <AreaChartMock />
          </ChartContainer>
        </div>
      </div>

      {/* Domain BI Reports Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
              Domain Report Suites &amp; Automated Catalogs
            </h3>
            <p className="text-xs text-[#737686]">Select a domain to access specialized charts, heatmaps, and audit tables.</p>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold">● ALL 8 DOMAINS ONLINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportCard
            title="Attendance Summary"
            description="Daily/weekly/monthly heatmaps, late arrivals, overtime tracking, and absenteeism rates."
            category="ATTENDANCE"
            frequency="Daily Sync"
            lastRun="Today, 08:00 AM"
            icon={Clock}
            onGenerate={() => onNavigate && onNavigate('attendance')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Payroll Summary"
            description="Department cost allocation, salary distribution curves, tax deductions, and allowance summaries."
            category="PAYROLL"
            frequency="Bi-Weekly"
            lastRun="Jul 01, 2026"
            icon={DollarSign}
            onGenerate={() => onNavigate && onNavigate('payroll')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Leave Summary"
            description="Leave utilization ratios, department balance comparisons, approval statistics, and seasonal trends."
            category="LEAVE"
            frequency="Weekly"
            lastRun="Jul 06, 2026"
            icon={Calendar}
            onGenerate={() => onNavigate && onNavigate('leave')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Performance Summary"
            description="Review rating bell curves, goal completion velocity, top performers, and low performance analysis."
            category="PERFORMANCE"
            frequency="Quarterly"
            lastRun="Jun 30, 2026"
            icon={Award}
            onGenerate={() => onNavigate && onNavigate('performance')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Recruitment Summary"
            description="Hiring funnel conversion rates, time-to-hire metrics, offer acceptance percentages, and sourcing ROI."
            category="RECRUITMENT"
            frequency="Monthly"
            lastRun="Jul 05, 2026"
            icon={UserCheck}
            onGenerate={() => onNavigate && onNavigate('recruitment')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Project Summary"
            description="Project milestone progress, budget burn-down, team productivity index, and deadline risk analysis."
            category="PROJECTS"
            frequency="Weekly"
            lastRun="Today, 09:30 AM"
            icon={Briefcase}
            onGenerate={() => onNavigate && onNavigate('projects')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Asset Summary"
            description="Hardware allocation inventory, maintenance costs, department utilization, and warranty expiration alerts."
            category="ASSETS"
            frequency="Monthly"
            lastRun="Jul 02, 2026"
            icon={Laptop}
            onGenerate={() => onNavigate && onNavigate('assets')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
          <ReportCard
            title="Executive Analytics"
            description="Cross-module KPI scorecards, Organization Health Score, departmental benchmarking, and AI insights."
            category="GENERAL BI"
            frequency="Live Telemetry"
            lastRun="Real-time"
            icon={Activity}
            onGenerate={() => onNavigate && onNavigate('executive')}
            onExport={onExportReport}
            onSchedule={onScheduleReport}
          />
        </div>
      </div>

      {/* Department Comparison Variance Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-[#2563eb]" /> Departmental Financial &amp; Operational Benchmarks
          </h3>
          <button
            onClick={() => onExportReport && onExportReport('Departmental BI Comparison')}
            className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 font-mono"
          >
            Export Complete Audit Table <ArrowRight size={14} />
          </button>
        </div>
        <ComparisonTable />
      </div>
    </div>
  );
};
