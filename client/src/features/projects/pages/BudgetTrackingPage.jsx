import React, { useState } from 'react';
import { DollarSign, Download, ShieldAlert, Layers } from 'lucide-react';
import { BudgetCard, ChartPlaceholder, ProgressBar } from '../components/ProjectCards';
import { ExpenseCategoryBadge } from '../components/ProjectBadges';

/**
 * BudgetTrackingPage.jsx (Page 6)
 * Dedicated financial oversight and expense categorization center for EWMP Projects.
 * Displays Budget Summary, Allocated Budget, Spent Budget, Remaining Budget, Expense Categories, and Charts Placeholders.
 */

const BudgetTrackingPage = ({ onExport }) => {
  const [selectedDept, setSelectedDept] = useState('ALL');

  const expenses = [
    { id: 'EXP-901', title: 'Q3 Distributed DevOps & SRE Team Labor Billing', category: 'LABOR', amount: 485000, project: 'PRJ-101 (EWMP Core)', date: 'July 5, 2026', status: 'AUDITED' },
    { id: 'EXP-902', title: 'AWS EC2 Reserved Instances & ElastiCache Redis Cluster', category: 'INFRA', amount: 142000, project: 'PRJ-101 (EWMP Core)', date: 'July 3, 2026', status: 'AUDITED' },
    { id: 'EXP-903', title: 'Okta Enterprise Auth Gateway Annual SaaS License', category: 'SOFTWARE', amount: 88000, project: 'PRJ-104 (Cloud Security)', date: 'July 2, 2026', status: 'AUDITED' },
    { id: 'EXP-904', title: 'External Penetration Testing Cyber Security Firm', category: 'CONTRACTOR', amount: 65000, project: 'PRJ-104 (Cloud Security)', date: 'June 28, 2026', status: 'PENDING_APPROVAL' },
    { id: 'EXP-905', title: 'Executive Client On-Site Technical Architecture Workshop', category: 'TRAVEL', amount: 18500, project: 'PRJ-102 (Global CRM)', date: 'June 25, 2026', status: 'AUDITED' },
  ];

  const categorySummary = [
    { name: 'Engineering & Labor', code: 'LABOR', spent: 640000, allocated: 900000, color: 'bg-indigo-600' },
    { name: 'Cloud & Infrastructure', code: 'INFRA', spent: 210000, allocated: 350000, color: 'bg-purple-600' },
    { name: 'SaaS & Software Licenses', code: 'SOFTWARE', spent: 145000, allocated: 250000, color: 'bg-[#2563eb]' },
    { name: 'External Contractors', code: 'CONTRACTOR', spent: 95000, allocated: 200000, color: 'bg-amber-500' },
    { name: 'Client Travel & Ops', code: 'TRAVEL', spent: 30000, allocated: 150000, color: 'bg-emerald-600' },
  ];

  const totalAllocated = categorySummary.reduce((acc, c) => acc + c.allocated, 0);
  const totalSpent = categorySummary.reduce((acc, c) => acc + c.spent, 0);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            <DollarSign size={22} className="text-[#2563eb]" /> Enterprise Project Budget Tracking & Financial Oversight
          </h1>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor allocated vs spent capital, analyze departmental burn rates, audit contractor expenses, and forecast Q3 runway.
          </p>
        </div>

        <button
          onClick={onExport}
          className="px-4 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Download size={14} className="text-[#2563eb]" /> Export Financial Report
        </button>
      </div>

      {/* Primary Financial Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BudgetCard
            title="Consolidated Enterprise Project Portfolio Budget (Q3 2026)"
            allocated={totalAllocated}
            spent={totalSpent}
            remaining={totalAllocated - totalSpent}
          />
        </div>

        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col justify-between font-mono">
          <div>
            <span className="text-xs font-bold text-[#737686] uppercase tracking-wider block font-sans">Monthly Burn Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-[#191b23] dark:text-white">${Math.round(totalSpent / 3).toLocaleString()}</span>
              <span className="text-xs text-[#737686]">/ month avg</span>
            </div>
            <p className="text-xs text-emerald-600 font-sans mt-1">● Runway remaining: ~5.2 months at current velocity</p>
          </div>

          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 mt-4 font-sans text-xs">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold mb-1">
              <ShieldAlert size={15} className="text-amber-600" /> Financial Governance Notice
            </div>
            <p className="text-[#434655] dark:text-gray-300">
              Any contractor expense exceeding $50,000 requires dual sign-off from Finance and the Organization Admin.
            </p>
          </div>
        </div>
      </div>

      {/* Expense Categories Breakdown & Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bars */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2 font-sans">
            <Layers size={16} className="text-[#2563eb]" /> Expense Allocation Categories Breakdown
          </h3>

          <div className="space-y-4">
            {categorySummary.map((cat, idx) => {
              const pct = Math.round((cat.spent / cat.allocated) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} /> {cat.name}
                    </span>
                    <span className="font-mono text-[#737686]">
                      ${cat.spent.toLocaleString()} / <strong className="text-[#191b23] dark:text-white">${cat.allocated.toLocaleString()}</strong> ({pct}%)
                    </span>
                  </div>
                  <ProgressBar progress={pct} size="sm" showLabel={false} color={cat.color} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Placeholder (Pie / Distribution) */}
        <ChartPlaceholder title="Q3 Expense Category Distribution & Portfolio ROI" type="PIE" height="h-full min-h-[340px]" />
      </div>

      {/* Recent Expense Ledger Table */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
            <DollarSign size={16} className="text-[#2563eb]" /> Itemized Project Expense Ledger
          </h3>
          <span className="text-xs font-mono text-[#737686]">Audited against EWMP Finance Gateway</span>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase">
                <th className="py-3 px-4">Expense ID & Title</th>
                <th className="py-3 px-4">Expense Category</th>
                <th className="py-3 px-4">Associated Project</th>
                <th className="py-3 px-4">Billing Date</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40">
                  <td className="py-3.5 px-4 font-bold text-[#191b23] dark:text-white">
                    <span className="font-mono text-[10px] text-[#2563eb] block">{exp.id}</span>
                    {exp.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <ExpenseCategoryBadge category={exp.category} />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#191b23] dark:text-gray-300">{exp.project}</td>
                  <td className="py-3.5 px-4 font-mono text-[#737686]">{exp.date}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${exp.status === 'AUDITED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#191b23] dark:text-white">
                    ${exp.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetTrackingPage;
