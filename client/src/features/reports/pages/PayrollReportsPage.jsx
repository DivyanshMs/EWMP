import React from 'react';
import { DollarSign, TrendingUp, ShieldCheck, Download, Briefcase } from 'lucide-react';
import { AnalyticsCard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, AreaChartMock, PieChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * PayrollReportsPage.jsx
 * Financial Business Intelligence suite inspired by Workday and SAP Analytics Cloud.
 * Covers total payroll costs, department cost allocations, salary distributions, overtime expense, tax summaries, allowances, and deductions.
 */
export const PayrollReportsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
              PAYROLL &amp; COMPENSATION BI
            </span>
            <span className="text-xs font-mono text-[#737686]">Audited Financial Ledger</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Payroll Expenditure, Taxation &amp; Department Allocation Reports
          </h2>
        </div>

        <button
          onClick={() => onExportReport && onExportReport('Payroll Master Suite')}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} /> Export Financial Ledger
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Payroll Spend"
          value="$2.84M"
          subtitle="Monthly gross compensation"
          icon={DollarSign}
          change="On target budget"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Overtime Spend"
          value="$42,500"
          subtitle="1.5% of total gross payroll"
          icon={TrendingUp}
          change="-4.2% YoY reduction"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Total Tax withheld"
          value="$681,600"
          subtitle="Federal, state & local withholding"
          icon={ShieldCheck}
          change="100% compliant"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard
          title="Allowances & Benefits"
          value="$312,400"
          subtitle="Health, housing & travel allowances"
          icon={Briefcase}
          change="Within policy cap"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Visual Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Monthly Payroll Expenditure & Variance Trajectory"
            subtitle="Gross compensation correlation vs budgeted departmental forecasts"
            onExport={onExportReport}
            height="h-72"
            legends={[
              { label: 'Budget Ceiling', color: 'bg-gray-400', value: '$3.00M' },
              { label: 'Actual Gross Spend', color: 'bg-emerald-600', value: '$2.84M' }
            ]}
          >
            <AreaChartMock
              series1={[240, 250, 255, 260, 275, 280, 284]}
              series2={[260, 260, 270, 270, 290, 290, 300]}
            />
          </ChartContainer>
        </div>

        <div className="lg:col-span-1">
          <ChartContainer
            title="Department Cost Allocation"
            subtitle="Percentage of gross payroll"
            onExport={onExportReport}
            height="h-72"
          >
            <PieChartMock />
          </ChartContainer>
        </div>
      </div>

      {/* Salary Distribution & Deductions Bar Chart */}
      <ChartContainer
        title="Compensation Tier & Salary Distribution Curve Across All Roles"
        subtitle="Breakdown of base salaries vs performance bonuses and benefits"
        onExport={onExportReport}
        height="h-64"
      >
        <BarChartMock
          data={[
            { label: '$50k-$80k Tier', value1: 45, value2: 40, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
            { label: '$80k-$120k Tier', value1: 85, value2: 75, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
            { label: '$120k-$180k Tier', value1: 60, value2: 55, color1: 'bg-purple-600', color2: 'bg-purple-300' },
            { label: '$180k-$250k Tier', value1: 30, value2: 28, color1: 'bg-amber-500', color2: 'bg-amber-300' },
            { label: '$250k+ Exec Tier', value1: 15, value2: 14, color1: 'bg-indigo-600', color2: 'bg-indigo-300' },
          ]}
        />
      </ChartContainer>

      {/* Detailed Financial Ledger Comparison Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Payroll Ledger &amp; Tax Withholding Breakdown Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
