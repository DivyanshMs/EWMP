import React from 'react';
import { Award, Target, AlertTriangle, Download, Star } from 'lucide-react';
import { AnalyticsCard, KPICard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, LineChartMock, AreaChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * PerformanceReportsPage.jsx
 * Talent intelligence and performance analytics suite inspired by Workday and Looker.
 * Covers review rating distributions, OKR/goal completion rates, departmental performance benchmarks, and low performance trends.
 */
export const PerformanceReportsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200">
              PERFORMANCE &amp; OKR BI
            </span>
            <span className="text-xs font-mono text-[#737686]">Talent Intelligence Telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Performance Review Ratings, Goal Completion &amp; Talent Benchmarks
          </h2>
        </div>

        <button
          onClick={() => onExportReport && onExportReport('Performance Master Suite')}
          className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} /> Export Talent Audit
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Avg Review Rating"
          value="4.25 / 5.0"
          subtitle="FY26 Mid-Year appraisal cycle"
          icon={Star}
          change="+0.15 YoY improvement"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard
          title="OKR Completion Velocity"
          value="88.4%"
          subtitle="Enterprise goal achievement"
          icon={Target}
          change="Exceeding Q3 target"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Top Performer Tier"
          value="24.5%"
          subtitle="Employees rated Exceeds/Outstanding"
          icon={Award}
          change="High retention cohort"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Low Performance Risk"
          value="3.2%"
          subtitle="Staff requiring active coaching PIPs"
          icon={AlertTriangle}
          change="-0.8% reduction"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Visual Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Performance Review Rating Distribution (Bell Curve)"
          subtitle="Breakdown of FY26 appraisals from 1.0 (Needs Improvement) to 5.0 (Outstanding)"
          onExport={onExportReport}
          height="h-72"
        >
          <BarChartMock
            data={[
              { label: '5★ Outstanding', value1: 24, value2: 20, color1: 'bg-purple-600', color2: 'bg-purple-300' },
              { label: '4★ Exceeds', value1: 42, value2: 38, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
              { label: '3★ Meets Target', value1: 26, value2: 30, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
              { label: '2★ Developing', value1: 6, value2: 9, color1: 'bg-amber-500', color2: 'bg-amber-300' },
              { label: '1★ Action PIP', value1: 2, value2: 3, color1: 'bg-rose-600', color2: 'bg-rose-300' },
            ]}
            showComparison={false}
          />
        </ChartContainer>

        <ChartContainer
          title="Chronological OKR & Goal Achievement Velocity"
          subtitle="Quarter-over-quarter progress toward corporate strategic objectives"
          onExport={onExportReport}
          height="h-72"
          legends={[
            { label: 'Strategic Target (85%)', color: 'bg-gray-400', value: 'Goal Benchmark' },
            { label: 'Actual Achievement', color: 'bg-purple-600', value: '88.4%' }
          ]}
        >
          <LineChartMock
            points={[65, 72, 70, 78, 82, 85, 88, 87, 91]}
            color="#9333ea"
            gradientFrom="rgba(147, 51, 234, 0.3)"
          />
        </ChartContainer>
      </div>

      {/* Top Performers vs Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Departmental Performance Score & Goal Completion Averages"
            subtitle="Comparison of average appraisal ratings across all business units"
            onExport={onExportReport}
            height="h-64"
          >
            <BarChartMock
              data={[
                { label: 'Engineering', value1: 90, value2: 85, color1: 'bg-purple-600', color2: 'bg-purple-300' },
                { label: 'Sales & Growth', value1: 86, value2: 80, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
                { label: 'Finance & Tax', value1: 92, value2: 88, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
                { label: 'HR & Operations', value1: 88, value2: 84, color1: 'bg-amber-500', color2: 'bg-amber-300' },
              ]}
            />
          </ChartContainer>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <KPICard
            title="Engineering Excellence"
            value="4.45 / 5"
            target="4.20"
            progress={94}
            departmentLeader="Cloud Infrastructure"
            status="TOP UNIT"
            color="bg-purple-600"
          />
          <KPICard
            title="Sales OKR Attainment"
            value="92.4%"
            target="90.0%"
            progress={92}
            departmentLeader="Enterprise Account Execs"
            status="EXCEEDING"
            color="bg-[#2563eb]"
          />
        </div>
      </div>

      {/* Performance Benchmarks Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Talent Appraisal &amp; Goal Completion Audit Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
