import React from 'react';
import { DollarSign, CheckCircle2, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { AnalyticsCard, KPICard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, AreaChartMock, LineChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * ProjectReportsPage.jsx
 * Enterprise project portfolio and productivity analytics suite inspired by Looker and Tableau.
 * Covers project milestone progress, budget burn-down trajectories, team productivity velocity, and deadline risk analysis.
 */
export const ProjectReportsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200">
              PROJECT PORTFOLIO BI
            </span>
            <span className="text-xs font-mono text-[#737686]">Project Management Telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Project Milestone Progress, Budget Burn-Down &amp; Productivity Reports
          </h2>
        </div>

        <button
          onClick={() => onExportReport && onExportReport('Project Master Suite')}
          className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} /> Export Portfolio Audit
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="On-Time Delivery"
          value="94.6%"
          subtitle="Projects meeting target deadline"
          icon={CheckCircle2}
          change="+2.4% vs last quarter"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Total Portfolio Budget"
          value="$4.20M"
          subtitle="Allocated FY26 project capital"
          icon={DollarSign}
          change="68% consumed (On Track)"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Team Productivity Index"
          value="114 / 100"
          subtitle="Story points & task velocity"
          icon={TrendingUp}
          change="High Efficiency Tier"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard
          title="Deadline Risk Alerts"
          value="2 Flagged"
          subtitle="Projects requiring schedule buffer"
          icon={AlertCircle}
          change="Low Criticality"
          trend="up"
          color="text-rose-600"
          bg="bg-rose-50 dark:bg-rose-950/60"
        />
      </div>

      {/* Visual Budget Burn-Down & Milestone Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Project Budget Burn-Down vs Milestone Completion Correlation"
            subtitle="Comparing capital expenditure against actual sprint story point delivery"
            onExport={onExportReport}
            height="h-72"
            legends={[
              { label: 'Milestone Progress (%)', color: 'bg-[#2563eb]', value: '88%' },
              { label: 'Budget Burn (% consumed)', color: 'bg-emerald-500', value: '68%' }
            ]}
          >
            <AreaChartMock
              series1={[15, 30, 45, 60, 72, 80, 88]}
              series2={[12, 25, 38, 50, 58, 64, 68]}
            />
          </ChartContainer>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <KPICard
            title="Cloud Migration (PRJ-101)"
            value="92% Complete"
            target="100% by Aug 15"
            progress={92}
            departmentLeader="IT Infrastructure"
            status="ON TRACK"
            color="bg-emerald-600"
          />
          <KPICard
            title="AI Engine V3 (PRJ-102)"
            value="74% Complete"
            target="80% Q3 Target"
            progress={74}
            departmentLeader="Engineering R&D"
            status="MONITORING"
            color="bg-[#2563eb]"
          />
        </div>
      </div>

      {/* Deadline Analysis Bar Chart */}
      <ChartContainer
        title="Project Deadline Analysis & Buffer Consumption by Initiative"
        subtitle="Evaluating remaining timeline buffer days across active corporate initiatives"
        onExport={onExportReport}
        height="h-64"
      >
        <BarChartMock
          data={[
            { label: 'PRJ-101 (Cloud)', value1: 95, value2: 85, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
            { label: 'PRJ-102 (AI V3)', value1: 74, value2: 70, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
            { label: 'PRJ-103 (SOC2)', value1: 98, value2: 95, color1: 'bg-purple-600', color2: 'bg-purple-300' },
            { label: 'PRJ-104 (iOS App)', value1: 62, value2: 55, color1: 'bg-amber-500', color2: 'bg-amber-300' },
          ]}
        />
      </ChartContainer>

      {/* Project Status Audit Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Project Status &amp; Financial Budget Consumption Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
