import React from 'react';
import { FileText, Target, UserCheck, BarChart3, Search, PlusCircle, RefreshCw } from 'lucide-react';

/**
 * PerformanceEmptyStates.jsx
 * Zero-data placeholders for EWMP Performance Management module.
 */

export const NoReviews = ({ onCreate }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center mb-4">
      <FileText size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Appraisal Reviews Launched</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      There are currently no active or historical performance review cycles for this department or employee group.
    </p>
    {onCreate && (
      <button
        onClick={onCreate}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <PlusCircle size={15} /> Launch Review Cycle
      </button>
    )}
  </div>
);

export const NoGoals = ({ onAssign }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4">
      <Target size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Goals or KPIs Assigned</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      Employee goal lists and key performance indicators have not been locked for this review cycle yet.
    </p>
    {onAssign && (
      <button
        onClick={onAssign}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <PlusCircle size={15} /> Assign New Goal
      </button>
    )}
  </div>
);

export const NoAssessments = () => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-purple-500/10 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
      <UserCheck size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Pending Assessments</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      All mandatory self-evaluations and managerial feedback questionnaires have been submitted and calibrated.
    </p>
  </div>
);

export const NoAnalytics = () => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
      <BarChart3 size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">Calibration Intelligence Data Unavailable</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      Performance distribution charts require at least 10 completed employee appraisals to generate statistically valid bell curves.
    </p>
  </div>
);

export const NoResults = ({ onReset }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-[#737686] flex items-center justify-center mb-4">
      <Search size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Matching Performance Records</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      No employees, review cycles, or departments matched your filter criteria. Try broadening your search.
    </p>
    {onReset && (
      <button
        onClick={onReset}
        className="mt-5 px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
      >
        <RefreshCw size={14} /> Reset All Filters
      </button>
    )}
  </div>
);
