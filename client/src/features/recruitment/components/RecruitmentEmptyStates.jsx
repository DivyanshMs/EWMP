import React from 'react';
import { Briefcase, Users, Calendar, DollarSign, Search, PlusCircle, RefreshCw } from 'lucide-react';

/**
 * RecruitmentEmptyStates.jsx
 * Zero-data placeholders for EWMP Recruitment Management module.
 */

export const NoJobs = ({ onCreate }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center mb-4">
      <Briefcase size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Open Job Positions</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      There are currently no active job requisitions or published openings for this department.
    </p>
    {onCreate && (
      <button
        onClick={onCreate}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <PlusCircle size={15} /> Create Job Requisition
      </button>
    )}
  </div>
);

export const NoCandidates = ({ onAdd }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-purple-500/10 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
      <Users size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Candidates Found</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      The candidate directory or pipeline stage is currently empty. Add candidate resumes or publish openings to attract applicants.
    </p>
    {onAdd && (
      <button
        onClick={onAdd}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <PlusCircle size={15} /> Add Candidate Profile
      </button>
    )}
  </div>
);

export const NoInterviews = ({ onSchedule }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4">
      <Calendar size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Scheduled Interviews Today</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      Your interview calendar is clear for this timeframe. You can schedule screening rounds or technical panels at any time.
    </p>
    {onSchedule && (
      <button
        onClick={onSchedule}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <PlusCircle size={15} /> Schedule Interview
      </button>
    )}
  </div>
);

export const NoOffers = ({ onGenerate }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
      <DollarSign size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Pending Offers</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      No formal employment offer letters are currently pending acceptance or draft review.
    </p>
    {onGenerate && (
      <button
        onClick={onGenerate}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <PlusCircle size={15} /> Generate Offer Letter
      </button>
    )}
  </div>
);

export const NoResults = ({ onReset }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-[#737686] flex items-center justify-center mb-4">
      <Search size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Matching Records</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      No jobs, candidates, or interview schedules matched your filter criteria. Try broadening your search.
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
