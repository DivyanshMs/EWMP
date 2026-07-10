import React from 'react';
import { CheckCircle2, SearchX, Plus, Inbox } from 'lucide-react';

/**
 * HelpDeskEmptyStates.jsx
 * Illustrated zero-data placeholders for service ticket queues and search filters.
 */

export const NoTickets = ({ onCreateClick }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in my-4 shadow-xs font-sans">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center shadow-xs">
      <Inbox size={32} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Service Tickets Found
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        You have no active support requests or service tickets in this directory queue.
      </p>
    </div>
    {onCreateClick && (
      <button
        onClick={onCreateClick}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
      >
        <Plus size={15} /> Create Support Ticket
      </button>
    )}
  </div>
);

export const NoOpenTickets = () => (
  <div className="bg-white dark:bg-[#111111] border border-emerald-200 dark:border-emerald-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in my-4 shadow-xs font-sans">
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-xs">
      <CheckCircle2 size={32} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        All Queues Clear — Zero Open Tickets!
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        Great work! All IT, HR, Finance, and Facilities support requests have been resolved within SLA targets.
      </p>
    </div>
  </div>
);

export const NoTicketSearchResults = ({ query, onClear }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 animate-fade-in my-4 shadow-xs font-sans">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-xs">
      <SearchX size={28} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white">
        No Tickets Matching "{query}"
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        Try modifying your search text or clearing department, status, and priority filters.
      </p>
    </div>
    {onClear && (
      <button
        onClick={onClear}
        className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
      >
        Clear All Filters &amp; Search
      </button>
    )}
  </div>
);
