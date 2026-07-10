import React, { useState } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { AnalyticsCard, TrendCard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, HeatmapMock, LineChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * AttendanceReportsPage.jsx
 * Comprehensive attendance telemetry suite inspired by Workday and SAP Analytics Cloud.
 * Features daily/weekly/monthly trends, late arrival statistics, overtime analysis, absenteeism rates, and an interactive heatmap.
 */
export const AttendanceReportsPage = ({ onExportReport }) => {
  const [timeframe, setTimeframe] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly'

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
              ATTENDANCE BI SUITE
            </span>
            <span className="text-xs font-mono text-[#737686]">Real-time shift telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Attendance, Shift Adherence &amp; Overtime Reports
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-[#faf8ff] dark:bg-[#161616] p-1 rounded-xl border border-[#e1e2ed] dark:border-gray-800 text-xs font-mono font-bold">
            {['Daily', 'Weekly', 'Monthly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <button
            onClick={() => onExportReport && onExportReport('Attendance Master Suite')}
            className="p-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Download size={14} /> Export Suite
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Avg Attendance Rate"
          value="98.4%"
          subtitle="Enterprise-wide adherence"
          icon={CheckCircle2}
          change="+0.4% vs last period"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Overtime Logged"
          value="820 hrs"
          subtitle="Total departmental overtime"
          icon={Clock}
          change="-45 hrs vs target"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Absenteeism Rate"
          value="1.6%"
          subtitle="Unscheduled absence frequency"
          icon={AlertCircle}
          change="-0.2% YoY improvement"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard
          title="Late Arrival Incidents"
          value="14"
          subtitle="Grace period breaches"
          icon={Calendar}
          change="Low Risk Tier"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Interactive Heatmap & Overtime Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Departmental Attendance & Punctuality Heatmap"
            subtitle="Daily adherence intensity matrix across standard working days (Mon - Fri)"
            onExport={onExportReport}
            height="h-auto py-2"
          >
            <HeatmapMock />
          </ChartContainer>
        </div>

        <div className="lg:col-span-1">
          <ChartContainer
            title="Overtime Distribution by Department"
            subtitle="Total logged extra hours"
            onExport={onExportReport}
            height="h-72"
          >
            <BarChartMock
              data={[
                { label: 'Engineering', value1: 85, value2: 60, color1: 'bg-[#2563eb]', color2: 'bg-blue-200' },
                { label: 'Sales & Ops', value1: 50, value2: 45, color1: 'bg-purple-600', color2: 'bg-purple-200' },
                { label: 'Facilities', value1: 70, value2: 65, color1: 'bg-emerald-600', color2: 'bg-emerald-200' },
                { label: 'Finance', value1: 30, value2: 25, color1: 'bg-amber-500', color2: 'bg-amber-200' },
              ]}
              showComparison={false}
            />
          </ChartContainer>
        </div>
      </div>

      {/* Attendance Trend Line Chart */}
      <ChartContainer
        title="Chronological Attendance Velocity & Absenteeism Trend Analysis"
        subtitle="Year-to-date tracking of daily login timestamps and biometric shift verifications"
        onExport={onExportReport}
        height="h-64"
        legends={[
          { label: 'Attendance Target (95%)', color: 'bg-gray-400', value: 'Benchmark' },
          { label: 'Actual Attendance', color: 'bg-[#2563eb]', value: '98.4%' }
        ]}
      >
        <LineChartMock points={[94, 96, 95, 98, 97, 99, 98, 98, 99]} color="#2563eb" />
      </ChartContainer>

      {/* Department Comparison Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Attendance Audit &amp; Overtime Spend Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
