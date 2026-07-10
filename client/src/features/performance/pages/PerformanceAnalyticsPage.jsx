import React, { useState } from 'react';
import { BarChart3, Award, Target, Download, AlertCircle, Star, CheckCircle2 } from 'lucide-react';
import { PerformanceAnalyticsCard, ChartPlaceholder } from '../components/PerformanceCards';
import { RatingBadge } from '../components/PerformanceBadges';

/**
 * PerformanceAnalyticsPage.jsx
 * Executive Calibration Intelligence & Performance Metrics Dashboard for EWMP.
 * Displays Bell Curve distribution, Department comparisons, Top Performers, Low Performance trends, and completion rates.
 */

export const PerformanceAnalyticsPage = () => {
  const [cycleFilter, setCycleFilter] = useState('H1_2026');

  const topPerformers = [
    { name: 'Sarah Jenkins', id: 'EMP-0142', designation: 'Senior Software Engineer (SDE-II)', dept: 'Engineering', score: 4.8, goals: '8/8 (100%)', promo: 'Recommended' },
    { name: 'Emily Vance', id: 'EMP-0034', designation: 'HR Specialist', dept: 'People HR & Ops', score: 4.8, goals: '5/5 (100%)', promo: 'Recommended' },
    { name: 'Samantha Wu', id: 'EMP-0045', designation: 'Product Manager', dept: 'Product', score: 4.7, goals: '9/9 (100%)', promo: 'Recommended' },
    { name: 'David Miller', id: 'EMP-0012', designation: 'Finance Manager', dept: 'Finance', score: 4.6, goals: '6/6 (100%)', promo: 'Recommended' },
  ];

  const lowPerformanceTrends = [
    { dept: 'Sales & Revenue Marketing', issue: 'At-Risk Quota Attainment Goals', count: '14 Staff (<3.0 rating)', action: 'PIP & Sales Enablement Coaching initiated' },
    { dept: 'Operations Support', issue: 'Ticket SLA Resolution Time Degradation', count: '6 Staff (<2.8 rating)', action: 'Refresher training on Zendesk & workflow SLAs' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-[#2563eb]" />
            EXECUTIVE CALIBRATION INTELLIGENCE & APPRAISAL ANALYTICS
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Monitor organizational bell curve alignment, compare department rating averages, track top performers, and identify PIP trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={cycleFilter}
            onChange={(e) => setCycleFilter(e.target.value)}
            className="text-xs bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded px-3 py-2 font-mono font-bold"
          >
            <option value="H1_2026">H1 2026 Appraisal (Current)</option>
            <option value="FY_2025">Annual FY 2025 Comprehensive</option>
            <option value="H1_2025">H1 2025 Appraisal</option>
          </select>

          <button
            onClick={() => alert('Generating Executive Calibration & Bell Curve Report PDF...')}
            className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download size={14} /> Export Calibration Report
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceAnalyticsCard
          title="Review Completion Rate"
          value="87.7%"
          subtitle="300 of 342 reviews finished"
          icon={CheckCircle2}
          change="+12.4% vs last week"
          trend="up"
        />
        <PerformanceAnalyticsCard
          title="Goal Completion Rate"
          value="84.2%"
          subtitle="1,420 of 1,686 KPIs achieved"
          icon={Target}
          change="+6.8% YoY growth"
          trend="up"
        />
        <PerformanceAnalyticsCard
          title="Organization Average Rating"
          value="4.22"
          subtitle="Target benchmark: 4.0 / 5.0"
          icon={Star}
          change="+0.18 improvement"
          trend="up"
        />
        <PerformanceAnalyticsCard
          title="Promotion Nominations"
          value="38"
          subtitle="11.1% of active headcount"
          icon={Award}
          change="HR Calibration stage"
          trend="up"
        />
      </div>

      {/* Charts Grid: Bell Curve vs Department Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Organization Bell Curve Calibration (Actual vs Target %)" height="h-72" type="bar" />
        <ChartPlaceholder title="Department Calibration Matrix & Competency Heatmap" height="h-72" type="sparkle" />
      </div>

      {/* Two Column Table Section: Top Performers vs Low Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers Table (2 Cols) */}
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#191b23] dark:text-white flex items-center gap-1.5">
              <Award size={15} className="text-amber-500" /> Top Performing Employees (H1 2026 Leaders)
            </h3>
            <span className="font-mono text-xs text-[#2563eb] font-bold">38 Total Nominated</span>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Employee / ID</th>
                  <th>Department & Role</th>
                  <th>KPIs Met</th>
                  <th>Calibrated Score</th>
                  <th className="text-right">Nomination</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="font-bold text-xs">{row.name}</div>
                      <span className="font-mono text-[11px] text-[#737686]">{row.id}</span>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-[#191b23] dark:text-white">{row.dept}</div>
                      <span className="text-[11px] text-[#737686] block max-w-[150px] truncate">{row.designation}</span>
                    </td>
                    <td className="font-mono font-bold text-xs text-emerald-600">{row.goals}</td>
                    <td><RatingBadge rating={row.score} /></td>
                    <td className="text-right">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-mono font-bold text-[11px] rounded border border-purple-200">
                        {row.promo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Performance & PIP Trends (1 Col) */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <AlertCircle size={16} className="text-rose-600" />
                LOW PERFORMANCE & PIP TRENDS
              </h3>
              <span className="text-xs font-mono font-bold text-rose-600">20 Staff</span>
            </div>

            <div className="space-y-4">
              {lowPerformanceTrends.map((trend, idx) => (
                <div key={idx} className="p-3 bg-rose-50/30 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/60 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="font-bold text-[#191b23] dark:text-white">{trend.dept}</strong>
                    <span className="font-mono font-bold text-rose-600 bg-white dark:bg-[#161616] px-2 py-0.5 rounded border border-rose-200">{trend.count}</span>
                  </div>
                  <p className="text-[#434655] dark:text-gray-300">{trend.issue}</p>
                  <div className="pt-1 text-[11px] font-mono text-rose-700 dark:text-rose-400 font-semibold">
                    Action: {trend.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-center text-xs text-[#737686]">
            HR Business Partners are actively conducting 1-on-1 coaching check-ins with all employees below <strong className="text-rose-600 font-mono">3.0 rating</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
