import React, { useState } from 'react';
import { Download, Cpu, Filter } from 'lucide-react';
import { Card, CardBody, Button, Badge } from '../../../components/shared';
import { InsightCard, StatusBadge } from '../components/AICards';
import { NoInsights } from '../components/AIEmptyStates';

/**
 * InsightsDashboardPage.jsx
 * AI Insights - Executive AI analytics intelligence board for EWMP.
 * Fuses telemetry from Attendance, Payroll, Leave, Department, Performance, Recruitment, Project, and Asset modules.
 * Following Stitch Precision Enterprise Design System.
 */
export const InsightsDashboardPage = ({ onNavigate, onToast }) => {
  const [selectedModule, setSelectedModule] = useState('ALL');

  const insights = [
    {
      id: 1,
      title: 'Overtime & Sprint Burn Velocity Correlation',
      summary: 'Cross-module telemetry between Attendance check-ins and Jira/Project story points reveals that Engineering teams working >8 hrs weekly overtime exhibit a 15% drop in code review quality after week 3. Rebalance sprint goals immediately.',
      module: 'PROJECTS',
      confidence: '99.4%',
      metrics: [
        { label: 'Quality Drop Threshold', value: 'Week 3 (>8h OT)' },
        { label: 'Recommended Action', value: 'Reassign 2 Devs' }
      ]
    },
    {
      id: 2,
      title: 'Q3 Payroll Compensation vs Tech Median Gap',
      summary: 'Payroll ledger data correlated with external labor market feeds indicates EWMP base compensation for Mid-Level Data Scientists has slipped 4.8% below the tech median. Addressing this gap will prevent voluntary attrition.',
      module: 'PAYROLL',
      confidence: '98.1%',
      metrics: [
        { label: 'Market Variance Gap', value: '-4.8% Median' },
        { label: '2-Yr Retention ROI', value: '+12.5% Retained' }
      ]
    },
    {
      id: 3,
      title: 'Summer Vacation Leave Overlap Prediction',
      summary: 'Historical predictive modeling of PTO requests forecasts a 28% simultaneous absence overlap in Customer Support representatives between August 1 and August 14. Recommend activating automated cross-shift backfilling.',
      module: 'LEAVE',
      confidence: '96.8%',
      metrics: [
        { label: 'Predicted Overlap', value: '28% Support Staff' },
        { label: 'SLA Adherence Risk', value: 'High without backfill' }
      ]
    },
    {
      id: 4,
      title: 'Departmental Punctuality vs Transit Schedule Shift',
      summary: 'Attendance shift adherence logs show a localized 5-minute late arrival anomaly among warehouse staff starting at 06:00. This correlates 100% with a recent city bus route modification. Adjust shift start to 06:15.',
      module: 'ATTENDANCE',
      confidence: '99.9%',
      metrics: [
        { label: 'Root Cause Identified', value: 'Bus Route #42 Delay' },
        { label: 'Infraction Reduction', value: '-92% False Flags' }
      ]
    },
    {
      id: 5,
      title: 'Performance Bell Curve Normalization Audit',
      summary: 'FY26 Mid-Year review appraisal ratings in Sales & Growth show a slight positive skew (Avg 4.45/5.0) compared to the corporate normal bell curve target (Avg 4.20/5.0). Recommend calibration session.',
      module: 'PERFORMANCE',
      confidence: '95.2%',
      metrics: [
        { label: 'Current Department Avg', value: '4.45 / 5.0 Rating' },
        { label: 'Target Bell Curve', value: '4.20 Normal Target' }
      ]
    },
    {
      id: 6,
      title: 'Sourcing Channel ROI for Senior Engineering Requisitions',
      summary: 'Recruitment funnel conversion telemetry indicates agency referrals yield a 3x higher offer acceptance rate and a 14-day faster time-to-hire than direct career portal applications for Level 5 cloud roles.',
      module: 'RECRUITMENT',
      confidence: '97.5%',
      metrics: [
        { label: 'Agency Conversion Rate', value: '3x Higher Acceptance' },
        { label: 'Time-to-Hire Savings', value: '-14 Days Faster' }
      ]
    },
    {
      id: 7,
      title: 'CMDB Hardware Depreciation & Battery Health Alert',
      summary: 'IT Asset Management telemetry flags 14 Apple MacBook Pro devices assigned to core backend architects reaching their 3-year depreciation limit with battery health below 80%. Initiate hardware refresh.',
      module: 'ASSETS',
      confidence: '99.0%',
      metrics: [
        { label: 'Flagged Workstations', value: '14 MacBook Pro Units' },
        { label: 'Estimated Productivity Gain', value: '+45 mins / dev / mo' }
      ]
    },
    {
      id: 8,
      title: 'Departmental Labor Efficiency Ratio Benchmark',
      summary: 'Macroscopic analysis of total department compensation expenditure divided by completed milestone revenue value ranks Engineering R&D as the top efficiency unit (Score: 114/100).',
      module: 'DEPARTMENT',
      confidence: '98.8%',
      metrics: [
        { label: 'Top Department Score', value: '114 / 100 Index' },
        { label: 'Labor Cost Efficiency', value: 'Top 5% Tier' }
      ]
    }
  ];

  const modules = ['ALL', 'ATTENDANCE', 'PAYROLL', 'LEAVE', 'DEPARTMENT', 'PERFORMANCE', 'RECRUITMENT', 'PROJECTS', 'ASSETS'];

  const filtered = selectedModule === 'ALL'
    ? insights
    : insights.filter(i => i.module === selectedModule);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Executive Summary Macro Scorecard Banner */}
      <Card elevation="level2" className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#4f46e5] text-white border-none overflow-hidden">
        <CardBody className="p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="space-y-2 z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="bg-white/20 backdrop-blur-xs border-white/30 text-white">
                EXECUTIVE TELEMETRY BOARD
              </Badge>
              <span className="text-xs font-mono text-blue-100 flex items-center gap-1 font-bold">
                <Cpu size={13} className="text-emerald-300" /> Synthesized Across 8 Domains
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Cross-Module Insights &amp; Correlation Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
              Macroscopic intelligence engine correlating shift adherence, compensation ledgers, leave utilization, project velocity, and hardware depreciation to uncover hidden organizational bottlenecks.
            </p>
          </div>

          {/* AI Health & Insight Counter Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-5 flex items-center gap-5 z-10 shrink-0 shadow-xl">
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 block font-bold">
                Active Insights
              </span>
              <strong className="text-3xl sm:text-4xl font-black text-white block mt-0.5">
                8 <span className="text-lg text-emerald-300 font-bold">LIVE</span>
              </strong>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/80 text-white font-mono text-[10px] font-bold block w-fit">
                98.4% AVG CONFIDENCE
              </span>
              <span className="text-xs text-blue-100 font-mono block">Zero Anomaly Lags</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Module Slicer Strip */}
      <Card elevation="level1" className="p-4 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-mono font-bold text-[#737686] flex items-center gap-1 mr-2">
            <Filter size={14} className="text-[#2563eb]" /> Filter Domain:
          </span>
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedModule === mod
                  ? 'bg-[#2563eb] text-white shadow-2xs'
                  : 'bg-[#faf8ff] dark:bg-[#161616] text-[#737686] hover:text-[#191b23] dark:hover:text-white border border-[#e1e2ed] dark:border-gray-800'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
        <button
          onClick={() => onToast && onToast('Exporting executive insights dossier to PDF...')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <Download size={13} /> Export Dossier
        </button>
      </Card>

      {/* Insights Grid */}
      {filtered.length === 0 ? (
        <NoInsights onRunTelemetry={() => { setSelectedModule('ALL'); onToast && onToast('Synthesizing executive telemetry... Done!'); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <InsightCard
              key={item.id}
              {...item}
              onExplore={() => {
                if (onNavigate) onNavigate('chat');
                if (onToast) onToast(`Opening interactive telemetry session for "${item.title}".`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
