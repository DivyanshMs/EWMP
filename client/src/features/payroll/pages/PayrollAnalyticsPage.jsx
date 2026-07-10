import React, { useState } from 'react';
import { BarChart3, PieChart, Clock, Users, DollarSign, Download, Sparkles, Building2 } from 'lucide-react';
import { PayrollAnalyticsCard, ChartPlaceholder } from '../components/PayrollCards';
import { TaxComponentBadge } from '../components/PayrollBadges';

/**
 * PayrollAnalyticsPage.jsx
 * Executive financial intelligence and metrics visualization dashboard for EWMP Payroll Management.
 */

export const PayrollAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('FY_2026');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-[#2563eb]" />
            FINANCIAL INTELLIGENCE & PAYROLL COST ANALYTICS
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Monitor organizational salary disbursal trends, department budget utilization, overtime costs, and tax withholdings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded px-3 py-2 font-mono font-bold"
          >
            <option value="FY_2026">Financial Year 2026 (CY)</option>
            <option value="Q3_2026">Q3 2026 (Jul–Sep)</option>
            <option value="Q2_2026">Q2 2026 (Apr–Jun)</option>
            <option value="FY_2025">Financial Year 2025</option>
          </select>

          <button
            onClick={() => alert('Generating PDF Executive Financial Intelligence Report...')}
            className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download size={14} /> Export Financial Report
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PayrollAnalyticsCard
          title="YTD Total Payroll Expenditure"
          value="₹3.28 Cr"
          subtitle="Jan–Jul 2026 cumulative disbursal"
          icon={DollarSign}
          change="+8.4% vs FY25"
          trend="up"
        />
        <PayrollAnalyticsCard
          title="Average Cost Per Employee"
          value="₹1.41L"
          subtitle="Monthly gross CTC benchmark"
          icon={Users}
          change="+4.2% growth"
          trend="up"
        />
        <PayrollAnalyticsCard
          title="Overtime Disbursal Cost"
          value="₹4.85L"
          subtitle="July 2026 operational overtime"
          icon={Clock}
          change="-12% vs June"
          trend="down"
        />
        <PayrollAnalyticsCard
          title="Statutory Tax & PF Withheld"
          value="₹1.18 Cr"
          subtitle="YTD remitted to Govt treasuries"
          icon={PieChart}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Monthly Payroll Expenditure Trend (Gross vs Net vs Taxes)" height="h-72" type="bar" />
        <ChartPlaceholder title="Salary Distribution by Grade (Executive vs Engineering vs Ops)" height="h-72" type="sparkle" />
      </div>

      {/* Department Cost & Allowance Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Cost Comparison (2 Cols) */}
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Building2 size={16} className="text-[#2563eb]" />
              DEPARTMENT PAYROLL COST & OVERTIME COMPARISON
            </h3>
            <span className="text-xs font-mono text-[#737686]">July 2026 Run Total: ₹48.50L</span>
          </div>

          <div className="space-y-4">
            {[
              { dept: 'Engineering & Technology', headcount: 185, cost: '₹28,50,000', share: 58, ot: '₹2,10,000' },
              { dept: 'Sales & Revenue Marketing', headcount: 95, cost: '₹11,20,000', share: 23, ot: '₹1,20,000' },
              { dept: 'Operations & Customer Support', headcount: 62, cost: '₹8,80,000', share: 19, ot: '₹1,55,000' },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <strong className="font-bold text-[#191b23] dark:text-white">{row.dept}</strong>
                    <span className="text-[#737686] ml-2">({row.headcount} staff)</span>
                  </div>
                  <div className="font-mono">
                    <span className="font-bold text-[#2563eb]">{row.cost}</span>
                    <span className="text-[#737686] ml-2 font-normal">({row.share}% • OT: {row.ot})</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563eb]" style={{ width: `${row.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deduction Analysis & Tax Remittances (1 Col) */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                DEDUCTION & TAX ANALYSIS
              </h3>
              <span className="text-xs font-mono text-[#737686]">July 2026 Share</span>
            </div>

            <div className="space-y-3">
              {[
                { type: 'PF', name: 'Provident Fund (12%)', amount: '₹5,80,000', share: '46%' },
                { type: 'TDS', name: 'TDS Income Tax Withholding', amount: '₹4,20,000', share: '33%' },
                { type: 'ESI', name: 'Employee State Insurance', amount: '₹1,10,000', share: '9%' },
                { type: 'PT', name: 'Professional Tax (Statutory)', amount: '₹68,400', share: '5%' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TaxComponentBadge type={item.type} />
                    </div>
                    <span className="text-[11px] text-[#737686]">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-[#191b23] dark:text-white block">{item.amount}</span>
                    <span className="text-[10px] font-mono text-[#737686]">{item.share} of deductions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-xs text-[#737686] text-center">
            All statutory tax deductions are remitted to Government accounts within <strong className="text-emerald-600 font-mono font-bold">100% SLA compliance</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
