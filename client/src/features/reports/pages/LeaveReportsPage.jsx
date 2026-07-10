import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { AnalyticsCard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, DonutChartMock, LineChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * LeaveReportsPage.jsx
 * Leave utilization and time-off analytics suite inspired by Workday and Looker.
 * Covers leave utilization ratios, departmental balance comparisons, approval statistics, and seasonal absence trends.
 */
export const LeaveReportsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200">
              LEAVE &amp; ABSENCE BI
            </span>
            <span className="text-xs font-mono text-[#737686]">Time-Off Utilization Telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Leave Utilization, Approval Velocity &amp; Balance Reports
          </h2>
        </div>

        <button
          onClick={() => onExportReport && onExportReport('Leave Master Suite')}
          className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} /> Export Time-Off Audit
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Avg Leave Utilization"
          value="68.4%"
          subtitle="Annual PTO quota consumed"
          icon={Calendar}
          change="Optimal Work/Life Balance"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
        <AnalyticsCard
          title="Pending Approvals"
          value="18 requests"
          subtitle="Awaiting manager sign-off"
          icon={Clock}
          change="Avg 4.2 hr turnaround"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Approval Rate"
          value="96.2%"
          subtitle="Approved vs rejected requests"
          icon={CheckCircle2}
          change="+1.2% YoY consistency"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Unscheduled Absence"
          value="1.4%"
          subtitle="Emergency sick leave frequency"
          icon={AlertCircle}
          change="Low operational risk"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
      </div>

      {/* Visual Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartContainer
            title="Leave Utilization by Category"
            subtitle="Breakdown of consumed PTO"
            onExport={onExportReport}
            height="h-64"
          >
            <DonutChartMock
              centerValue="68.4%"
              centerLabel="PTO CONSUMED"
              slices={[
                { label: 'Annual Vacation', value: 62.0, hex: '#f59e0b', color: 'bg-amber-500' },
                { label: 'Sick / Medical Leave', value: 24.5, hex: '#2563eb', color: 'bg-[#2563eb]' },
                { label: 'Parental & Family Care', value: 13.5, hex: '#059669', color: 'bg-emerald-600' },
              ]}
            />
          </ChartContainer>
        </div>

        <div className="lg:col-span-2">
          <ChartContainer
            title="Monthly Leave Volume & Seasonal Peak Analysis"
            subtitle="Chronological tracking of scheduled vacations and summer/holiday absences"
            onExport={onExportReport}
            height="h-64"
          >
            <LineChartMock
              points={[45, 50, 48, 62, 70, 88, 95, 90, 75]}
              color="#f59e0b"
              gradientFrom="rgba(245, 158, 11, 0.3)"
            />
          </ChartContainer>
        </div>
      </div>

      {/* Department Comparison Bar Chart */}
      <ChartContainer
        title="Departmental Leave Utilization & Unused Balance Reserves"
        subtitle="Comparing consumed PTO days against remaining employee balances"
        onExport={onExportReport}
        height="h-64"
      >
        <BarChartMock
          data={[
            { label: 'Engineering R&D', value1: 65, value2: 35, color1: 'bg-amber-500', color2: 'bg-amber-200' },
            { label: 'Sales & Growth', value1: 78, value2: 22, color1: 'bg-[#2563eb]', color2: 'bg-blue-200' },
            { label: 'HR Operations', value1: 82, value2: 18, color1: 'bg-purple-600', color2: 'bg-purple-200' },
            { label: 'Finance & Tax', value1: 58, value2: 42, color1: 'bg-emerald-600', color2: 'bg-emerald-200' },
          ]}
        />
      </ChartContainer>

      {/* Leave Balance Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Leave Balance &amp; Approval Statistics Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
