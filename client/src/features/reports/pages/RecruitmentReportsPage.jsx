import React from 'react';
import { Clock, CheckCircle2, TrendingUp, Download, Briefcase } from 'lucide-react';
import { AnalyticsCard, TrendCard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, DonutChartMock, AreaChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * RecruitmentReportsPage.jsx
 * Talent acquisition and hiring analytics suite inspired by Workday and Looker.
 * Covers hiring funnel conversion velocity, average time-to-hire, offer acceptance ratios, and sourcing channel ROI.
 */
export const RecruitmentReportsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-200">
              TALENT ACQUISITION BI
            </span>
            <span className="text-xs font-mono text-[#737686]">Recruitment Pipeline Telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Hiring Funnel Conversion, Time-to-Hire &amp; Offer Acceptance Reports
          </h2>
        </div>

        <button
          onClick={() => onExportReport && onExportReport('Recruitment Master Suite')}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} /> Export Hiring Audit
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Avg Time-to-Hire"
          value="24.5 Days"
          subtitle="Application to signed offer"
          icon={Clock}
          change="-3.2 days vs industry average"
          trend="up"
          color="text-indigo-600"
          bg="bg-indigo-50 dark:bg-indigo-950/60"
        />
        <AnalyticsCard
          title="Offer Acceptance Rate"
          value="92.8%"
          subtitle="Offers accepted by candidates"
          icon={CheckCircle2}
          change="+4.1% YoY improvement"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Active Requisitions"
          value="18 Open Roles"
          subtitle="Across Engineering & Sales"
          icon={Briefcase}
          change="High Priority Queue"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Cost Per Hire"
          value="$4,250"
          subtitle="Agency & sourcing spend avg"
          icon={TrendingUp}
          change="Under $5k target cap"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
      </div>

      {/* Visual Funnel & Sourcing Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Recruitment Conversion Funnel Velocity"
            subtitle="Candidate progression from initial application screening to final onboarding"
            onExport={onExportReport}
            height="h-72"
          >
            <BarChartMock
              data={[
                { label: '1. Total Applied', value1: 100, value2: 100, color1: 'bg-indigo-600', color2: 'bg-indigo-300' },
                { label: '2. HR Screened', value1: 64, value2: 60, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
                { label: '3. Tech Interview', value1: 32, value2: 28, color1: 'bg-purple-600', color2: 'bg-purple-300' },
                { label: '4. Offer Extended', value1: 12, value2: 10, color1: 'bg-amber-500', color2: 'bg-amber-300' },
                { label: '5. Signed & Hired', value1: 11, value2: 9, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
              ]}
              showComparison={false}
            />
          </ChartContainer>
        </div>

        <div className="lg:col-span-1">
          <ChartContainer
            title="Hiring Sourcing Channel ROI"
            subtitle="Origin of successful hires"
            onExport={onExportReport}
            height="h-72"
          >
            <DonutChartMock
              centerValue="92.8%"
              centerLabel="OFFER ACCEPTANCE"
              slices={[
                { label: 'Employee Referral', value: 45.0, hex: '#059669', color: 'bg-emerald-600' },
                { label: 'LinkedIn / Sourcing', value: 30.0, hex: '#4f46e5', color: 'bg-indigo-600' },
                { label: 'Direct Career Site', value: 15.0, hex: '#2563eb', color: 'bg-[#2563eb]' },
                { label: 'External Agency', value: 10.0, hex: '#f59e0b', color: 'bg-amber-500' },
              ]}
            />
          </ChartContainer>
        </div>
      </div>

      {/* Monthly Recruitment Trend Chart */}
      <ChartContainer
        title="Monthly Candidate Volume & Time-to-Hire Reduction Trajectory"
        subtitle="Tracking candidate flow velocity across Q1 through Q3 fiscal quarters"
        onExport={onExportReport}
        height="h-64"
      >
        <AreaChartMock
          series1={[30, 45, 52, 60, 68, 80, 92]}
          series2={[40, 42, 45, 48, 50, 52, 55]}
        />
      </ChartContainer>

      {/* Departmental Hiring Audit Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Recruitment Requisitions &amp; Hiring ROI Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
