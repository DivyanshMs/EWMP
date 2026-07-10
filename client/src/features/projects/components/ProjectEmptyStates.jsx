import React from 'react';
import { FolderKanban, Users, Calendar, BarChart3, Search, PlusCircle, RefreshCw } from 'lucide-react';

/**
 * ProjectEmptyStates.jsx
 * Systematic zero-data placeholders for EWMP Project Management.
 */

export const NoProjects = ({ onCreate }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center mb-4">
      <FolderKanban size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Active Projects Found</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      There are currently no active initiatives or workspaces assigned to this filter scope. Publish a new project to get started.
    </p>
    {onCreate && (
      <button
        onClick={onCreate}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-colors"
      >
        <PlusCircle size={15} /> Create New Project
      </button>
    )}
  </div>
);

export const NoTeamMembers = ({ onAssign }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-purple-500/10 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
      <Users size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Assigned Team Members</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      This project currently has zero assigned engineers or specialists. Assign team members to allocate capacity and track workload.
    </p>
    {onAssign && (
      <button
        onClick={onAssign}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-colors"
      >
        <PlusCircle size={15} /> Assign Team Members
      </button>
    )}
  </div>
);

export const NoMilestones = ({ onCreate }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4">
      <Calendar size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Milestones Defined</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      No delivery milestones or phase deadlines are established for this project schedule.
    </p>
    {onCreate && (
      <button
        onClick={onCreate}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-colors"
      >
        <PlusCircle size={15} /> Create Milestone
      </button>
    )}
  </div>
);

export const NoAnalytics = ({ onRefresh }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
      <BarChart3 size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">Insufficient Analytics Data</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      Telemetry is still synchronizing with assigned projects. Try refreshing or broadening your date range filter.
    </p>
    {onRefresh && (
      <button
        onClick={onRefresh}
        className="mt-5 px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
      >
        <RefreshCw size={14} /> Synchronize Telemetry
      </button>
    )}
  </div>
);

export const NoResults = ({ onReset }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-[#737686] flex items-center justify-center mb-4">
      <Search size={28} />
    </div>
    <h3 className="text-base font-bold text-[#191b23] dark:text-white">No Matching Projects Found</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm">
      No projects, clients, or managers matched your search and filter criteria. Try resetting your query.
    </p>
    {onReset && (
      <button
        onClick={onReset}
        className="mt-5 px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
      >
        <RefreshCw size={14} /> Reset Filters
      </button>
    )}
  </div>
);
