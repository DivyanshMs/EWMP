import React from 'react';
import { Calendar, FileText, Search, PlusCircle, CheckCircle2 } from 'lucide-react';

/**
 * LeaveEmptyStates.jsx
 * Precision Enterprise empty states for EWMP Leave Management module.
 */

export const NoLeaveRequests = ({ onApply }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] flex items-center justify-center mb-4">
        <Calendar size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Leave Requests Found</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mb-6">
        You have not applied for any leave during this period or academic year. All your allocated balances are currently intact.
      </p>
      {onApply && (
        <button
          onClick={onApply}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-5 rounded inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <PlusCircle size={15} /> Apply for Leave
        </button>
      )}
    </div>
  );
};

export const NoPendingApprovals = () => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
        <CheckCircle2 size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">All Clear! No Pending Approvals</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm">
        You have reviewed and processed all employee leave requests in your approval queue. There are no items waiting for authorization.
      </p>
    </div>
  );
};

export const NoLeaveTypes = ({ onCreate }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-4">
        <FileText size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Leave Policies Configured</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mb-6">
        Configure organizational leave policies such as Annual, Sick, Maternity, and Casual leave allocations with carry-forward rules.
      </p>
      {onCreate && (
        <button
          onClick={onCreate}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-5 rounded inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <PlusCircle size={15} /> Create New Leave Type
        </button>
      )}
    </div>
  );
};

export const NoLeaveResults = ({ onReset }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
        <Search size={28} />
      </div>
      <h3 className="text-base font-bold text-[#191b23] dark:text-white mb-1">No Matching Results</h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 max-w-sm mb-6">
        No leave requests or balance records match your search criteria, department filter, or date range. Try clearing your filters.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-2 px-4 rounded transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
