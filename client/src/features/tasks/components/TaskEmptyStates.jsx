import React from 'react';
import { 
  CheckSquare, Users, FolderKanban, Search, PlusCircle, RefreshCw 
} from 'lucide-react';

/**
 * TaskEmptyStates.jsx
 * Systematic zero-data placeholders for EWMP Task Management:
 * NoTasks, NoAssignedTasks, NoProjects, NoSearchResults.
 */

export const NoTasks = ({ onCreate }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 font-sans">
    <div className="w-14 h-14 rounded-full bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center mb-4 shadow-inner">
      <CheckSquare size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Tasks Created</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm leading-relaxed">
      There are currently no deliverables or action items scheduled in this workspace. Create a new task or import from Jira/Linear to begin tracking.
    </p>
    {onCreate && (
      <button
        onClick={onCreate}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102"
      >
        <PlusCircle size={15} /> Create First Task
      </button>
    )}
  </div>
);

export const NoAssignedTasks = ({ onBrowse }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 font-sans">
    <div className="w-14 h-14 rounded-full bg-purple-500/10 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4 shadow-inner">
      <Users size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Assigned Tasks in Your Queue</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm leading-relaxed">
      You currently have zero pending deliverables assigned to your engineering profile. Your workload is at 0% saturation.
    </p>
    {onBrowse && (
      <button
        onClick={onBrowse}
        className="mt-5 px-4 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-[#e1e2ed] transition-colors"
      >
        Browse Team Backlog
      </button>
    )}
  </div>
);

export const NoProjects = ({ onNavigateProjects }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 font-sans">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
      <FolderKanban size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Associated Projects Found</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm leading-relaxed">
      Tasks require an active project association to inherit billing rates and department SLAs. Please initialize a project first.
    </p>
    {onNavigateProjects && (
      <button
        onClick={onNavigateProjects}
        className="mt-5 px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102"
      >
        <FolderKanban size={15} /> Go to Project Management
      </button>
    )}
  </div>
);

export const NoSearchResults = ({ onReset }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 font-sans">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-[#737686] flex items-center justify-center mb-4 shadow-inner">
      <Search size={28} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Matching Tasks Found</h3>
    <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 max-w-sm leading-relaxed">
      No tasks, projects, or assignees matched your multi-parameter filter criteria. Try broadening or resetting your search.
    </p>
    {onReset && (
      <button
        onClick={onReset}
        className="mt-5 px-4 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-[#e1e2ed] transition-colors"
      >
        <RefreshCw size={14} /> Reset Filters
      </button>
    )}
  </div>
);
