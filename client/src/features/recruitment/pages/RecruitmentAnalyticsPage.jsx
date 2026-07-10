import React, { useState } from 'react';
import { TrendingUp, Sparkles, Clock, DollarSign, Users, Award, Download } from 'lucide-react';
import { PerformanceAnalyticsCard, ChartPlaceholder } from '../components/RecruitmentCards';

/**
 * RecruitmentAnalyticsPage.jsx
 * Executive talent intelligence, hiring funnel metrics, and source analysis for EWMP Recruitment.
 */

export default function RecruitmentAnalyticsPage() {
  const [period, setPeriod] = useState('Q3_2026');
  const [department, setDepartment] = useState('ALL');

  const metrics = [
    { title: 'Average Time to Hire', value: '18 Days', subtitle: 'From application to offer sign-off', icon: Clock, change: '↓ 4 days faster vs SLA', trend: 'up' },
    { title: 'Offer Acceptance Rate', value: '92.4%', subtitle: '15 Accepted / 1 Declined', icon: Award, change: '+5.2% YoY growth', trend: 'up' },
    { title: 'Cost Per Hire (Avg)', value: '$3,420', subtitle: 'Agency fees & job board spend', icon: DollarSign, change: '↓ $450 under budget', trend: 'up' },
    { title: 'Candidate Net Promoter', value: '78 / 100', subtitle: 'Post-interview candidate NPS', icon: Users, change: '+12 pts vs industry', trend: 'up' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp size={24} className="text-[#2563eb]" /> Recruitment & Talent Acquisition Intelligence
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Analyze full-funnel conversion efficiency, monitor time-to-hire SLAs across departments, and audit recruitment marketing ROI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="HR & Ops">HR & Operations</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="Q3_2026">Q3 2026 (Live Cycle)</option>
            <option value="Q2_2026">Q2 2026 (Prior Quarter)</option>
            <option value="FY_2026">Consolidated FY 2026</option>
          </select>

          <button
            onClick={() => alert('Exporting complete Recruitment Analytics PDF / Excel report...')}
            className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <PerformanceAnalyticsCard key={idx} {...m} />
        ))}
      </div>

      {/* Two Column Section: Hiring Funnel Conversion & Source Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full Hiring Funnel */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#2563eb]" /> Complete Hiring Funnel Conversion Rates
              </h3>
              <span className="text-xs text-[#737686]">Stage-by-stage drop-off analytics for 342 active candidates</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-bold">Optimal Flow</span>
          </div>

          <div className="space-y-4 my-2 font-mono">
            {[
              { stage: '1. Applied / Ingested', count: '342', rate: '100%', bar: 'w-full bg-blue-500' },
              { stage: '2. HR Initial Screening', count: '210', rate: '61.4%', bar: 'w-[61%] bg-indigo-500' },
              { stage: '3. Manager Interview Panel', count: '124', rate: '36.2%', bar: 'w-[36%] bg-purple-500' },
              { stage: '4. Tech / Case Study Round', count: '58', rate: '16.9%', bar: 'w-[17%] bg-amber-500' },
              { stage: '5. Final HR Round & Calibration', count: '28', rate: '8.1%', bar: 'w-[8%] bg-teal-500' },
              { stage: '6. Offer Extended', count: '18', rate: '5.2%', bar: 'w-[5%] bg-emerald-500' },
              { stage: '★ Hired Onboarded', count: '15', rate: '4.3%', bar: 'w-[4%] bg-emerald-600 font-extrabold' },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#191b23] dark:text-white font-sans font-medium">{s.stage}</span>
                  <span className="text-[#737686]">{s.count} Candidates ({s.rate})</span>
                </div>
                <div className="w-full h-2.5 bg-[#faf8ff] dark:bg-[#161616] rounded-full overflow-hidden">
                  <div className={`h-full ${s.bar} rounded-full transition-all`} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-xs text-[#737686] font-mono flex justify-between">
            <span>Overall Funnel Yield: <strong className="text-emerald-600">4.3%</strong></span>
            <span>Avg Interview Rounds Per Hire: <strong className="text-[#191b23] dark:text-white">3.4 Rounds</strong></span>
          </div>
        </div>

        {/* Source Analysis & Department Hiring Breakdown */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
              <span>Recruitment Marketing Channel & Source Analysis</span>
              <span className="text-xs font-mono text-[#2563eb]">Top ROI: Employee Referrals</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {[
                { source: 'LinkedIn Recruiter & Direct InMail', share: '48.2%', count: '165 candidates', color: 'bg-[#0077b5]' },
                { source: 'Internal Employee Referrals (Bounty)', share: '32.1%', count: '110 candidates', color: 'bg-emerald-600' },
                { source: 'EWMP Public Career Portal', share: '12.5%', count: '43 candidates', color: 'bg-[#2563eb]' },
                { source: 'Agency Recruitment Partners', share: '7.2%', count: '24 candidates', color: 'bg-purple-600' },
              ].map((src, i) => (
                <div key={i} className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${src.color}`} />
                    <strong className="font-sans text-[#191b23] dark:text-white font-bold">{src.source}</strong>
                  </div>
                  <div className="text-right">
                    <strong className="text-sm block text-[#191b23] dark:text-white">{src.share}</strong>
                    <span className="text-[10px] text-[#737686]">{src.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
              <span>Department Hiring Allocation</span>
              <span className="text-xs font-mono text-[#737686]">24 Total Positions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-center">
              {[
                { dept: 'Engineering & Product', hires: '11 Hired', open: '14 Open', color: 'border-blue-300 bg-blue-50/40 dark:bg-blue-950/20 text-[#2563eb]' },
                { dept: 'Sales & Revenue', hires: '3 Hired', open: '6 Open', color: 'border-purple-300 bg-purple-50/40 dark:bg-purple-950/20 text-purple-600' },
                { dept: 'People HR & Ops', hires: '1 Hired', open: '2 Open', color: 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600' },
                { dept: 'Finance & Legal', hires: '0 Hired', open: '2 Open', color: 'border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 text-amber-600' },
              ].map((d, i) => (
                <div key={i} className={`p-3 rounded-lg border ${d.color}`}>
                  <strong className="font-sans font-bold block text-[#191b23] dark:text-white">{d.dept}</strong>
                  <div className="flex justify-center gap-2 mt-1 text-[11px]">
                    <span className="font-bold">{d.hires}</span>
                    <span className="opacity-40">•</span>
                    <span>{d.open}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Monthly Hiring Velocity & Onboarding Trend" height="h-72" />
        <ChartPlaceholder title="Time-to-Hire Distribution by Seniority Band" height="h-72" />
      </div>
    </div>
  );
}
