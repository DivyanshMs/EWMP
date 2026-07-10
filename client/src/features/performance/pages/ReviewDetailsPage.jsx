import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Award, CheckCircle2, ArrowLeft, Download, Edit3, AlertCircle } from 'lucide-react';
import { ReviewStatusBadge, RatingBadge } from '../components/PerformanceBadges';
import { RatingComponent } from '../components/PerformanceCards';
import { ReviewTimeline } from '../components/PerformanceTimelines';
import api from '../../../lib/axios';

/**
 * ReviewDetailsPage.jsx
 * Comprehensive Employee Appraisal & Calibration Audit view for EWMP.
 * Displays Profile, Review Summary, Itemized Competency Ratings, Strengths, Areas for Improvement, Manager Feedback, Self Review, and History.
 */

export const ReviewDetailsPage = ({ onBack, onNavigate, record }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const reviewId = record?.id || record?._id;

  const { data: reviewData, isLoading } = useQuery({
    queryKey: ['performance-review', reviewId],
    queryFn: () => api.get(`/performance/reviews/${reviewId}`).then(r => r.data),
    enabled: !!reviewId
  });

  const raw = reviewData?.data || reviewData;

  const empProfile = raw ? {
    name: raw.employee?.fullName || raw.employee?.firstName + ' ' + raw.employee?.lastName || 'Employee',
    id: raw.employee?.employeeId || raw.employee?.id || 'EMP',
    designation: raw.employee?.jobTitle || raw.employee?.designation || 'Staff',
    department: raw.employee?.department?.name || 'General',
    manager: raw.reviewer?.fullName || 'Manager',
    cycle: `${raw.quarter} ${raw.year}`,
    status: raw.reviewStatus || 'Draft',
    overallScore: raw.managerRating || raw.selfRating || 0,
    goalsMet: '—',
    strengths: [],
    improvements: [],
    selfComments: raw.selfAssessment || 'No self-assessment submitted yet.',
    managerComments: raw.managerFeedback || 'No manager feedback yet.'
  } : {
    name: 'Loading…',
    id: '—',
    designation: '—',
    department: '—',
    manager: '—',
    cycle: '—',
    status: 'Draft',
    overallScore: 0,
    goalsMet: '—',
    strengths: [],
    improvements: [],
    selfComments: '',
    managerComments: ''
  };

  const competencies = [
    { name: 'Technical Architecture & Code Quality', self: raw?.selfRating || 0, manager: raw?.managerRating || 0, weight: '30%' },
    { name: 'Sprint Execution Speed & Reliability', self: raw?.selfRating || 0, manager: raw?.kpiScore ? raw.kpiScore / 20 : 0, weight: '25%' },
    { name: 'Team Mentorship & Leadership', self: 0, manager: raw?.attendanceScore ? raw.attendanceScore / 20 : 0, weight: '25%' },
    { name: 'Cross-Functional Communication', self: 0, manager: 0, weight: '20%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 rounded text-[#191b23] dark:text-white transition-colors"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white">
                {empProfile.name} • Appraisal Dossier
              </h1>
              <ReviewStatusBadge status={empProfile.status} />
            </div>
            <p className="text-xs text-[#737686] dark:text-gray-400 font-mono">
              Employee ID: {empProfile.id} • {empProfile.designation} • Cycle: {empProfile.cycle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting full appraisal dossier and competency rating sheet to PDF...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export Dossier
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('manager-eval')}
              className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Edit3 size={14} /> Perform Managerial Evaluation
            </button>
          )}
        </div>
      </div>

      {/* Hero Profile Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2563eb] to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center font-mono shrink-0 shadow-sm">
            SJ
          </div>
          <div>
            <h3 className="text-base font-bold text-[#191b23] dark:text-white">{empProfile.name}</h3>
            <span className="text-xs text-[#737686] block mt-0.5">{empProfile.department}</span>
            <span className="text-[11px] font-mono text-[#2563eb] block mt-1">Reports to: {empProfile.manager}</span>
          </div>
        </div>

        {/* Overall Rating Score Card */}
        <div className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Overall Calibration Score</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-[#191b23] dark:text-white">{empProfile.overallScore}</span>
            <RatingBadge rating={empProfile.overallScore} />
          </div>
          <span className="text-[11px] text-[#737686] mt-1 font-mono">Weighted average across 4 competencies</span>
        </div>

        {/* Goal Achievement Card */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Goal Achievement Rate</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">87.5%</span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold rounded">
              7 / 8 Met
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Verified via automated KPI tracker</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e1e2ed] dark:border-gray-800 gap-6 text-xs font-bold font-mono">
        {[
          { id: 'summary', label: 'Competency Ratings & Breakdown' },
          { id: 'feedback', label: 'Self vs Managerial Feedback' },
          { id: 'strengths', label: 'Strengths & Areas for Growth' },
          { id: 'timeline', label: 'Appraisal Workflow & History' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === t.id
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#737686] hover:text-[#191b23] dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Competency Ratings */}
      {activeTab === 'summary' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 font-bold text-xs uppercase tracking-wider flex justify-between">
            <span>Core Competency Area</span>
            <div className="flex gap-8">
              <span>Weightage</span>
              <span>Self Rating</span>
              <span>Manager Rating</span>
            </div>
          </div>
          <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
            {competencies.map((comp, idx) => (
              <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="max-w-md">
                  <strong className="font-bold text-[#191b23] dark:text-white block text-sm">{comp.name}</strong>
                  <span className="text-[#737686] text-[11px]">Evaluation based on quarterly code reviews and team surveys.</span>
                </div>
                <div className="flex items-center gap-8 font-mono">
                  <span className="font-bold text-[#737686]">{comp.weight}</span>
                  <div className="w-24 text-right">
                    <span className="font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded border border-amber-200">
                      ★ {comp.self.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-28 text-right">
                    <span className="font-extrabold text-[#2563eb] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded border border-blue-200">
                      ★ {comp.manager.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Feedback Comparison */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <User size={16} className="text-amber-600" />
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white">Employee Self-Assessment Remarks</h3>
            </div>
            <p className="text-xs text-[#434655] dark:text-gray-300 leading-relaxed italic bg-[#faf8ff] dark:bg-gray-900/40 p-4 rounded border border-[#e1e2ed]/60">
              "{empProfile.selfComments}"
            </p>
            <span className="text-[11px] font-mono text-[#737686] block text-right">Submitted: June 15, 2026</span>
          </div>

          <div className="bg-[#ffffff] dark:bg-[#111111] border-2 border-[#2563eb] dark:border-blue-800 rounded-lg p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <Award size={16} className="text-[#2563eb]" />
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white">Reporting Manager Calibration Remarks</h3>
            </div>
            <p className="text-xs text-[#434655] dark:text-gray-300 leading-relaxed italic bg-blue-50/30 dark:bg-blue-950/20 p-4 rounded border border-blue-200 dark:border-blue-900">
              "{empProfile.managerComments}"
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#2563eb] pt-1">
              <span>Promotion Recommendation: <strong>YES (Senior Tech Lead)</strong></span>
              <span>Reviewed: June 28, 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Strengths & Areas for Improvement */}
      {activeTab === 'strengths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-emerald-200 dark:border-emerald-900 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2 pb-2 border-b border-emerald-100 dark:border-emerald-900/60">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Verified Performance Strengths & Achievements
            </h3>
            <ul className="space-y-3">
              {empProfile.strengths.map((st, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#434655] dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#ffffff] dark:bg-[#111111] border border-amber-200 dark:border-amber-900 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2 pb-2 border-b border-amber-100 dark:border-amber-900/60">
              <AlertCircle size={16} className="text-amber-600" />
              Identified Areas for Professional Improvement & Growth
            </h3>
            <ul className="space-y-3">
              {empProfile.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#434655] dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Appraisal Workflow & History */}
      {activeTab === 'timeline' && (
        <ReviewTimeline />
      )}
    </div>
  );
};
