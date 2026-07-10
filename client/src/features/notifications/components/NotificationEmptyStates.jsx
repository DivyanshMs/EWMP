import React from 'react';
import { BellOff, MegaphoneOff, SearchX, Sparkles } from 'lucide-react';

/**
 * NotificationEmptyStates.jsx
 * Illustrated zero-data placeholders for empty notification feeds and announcement broadcasts.
 */

export const NoNotifications = ({ onResetFilter }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in my-4 shadow-xs">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center shadow-xs">
      <BellOff size={32} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Notifications in Queue
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        You're all caught up! There are no unread system alerts, payroll notices, or attendance reminders matching your view.
      </p>
    </div>
    {onResetFilter && (
      <button
        onClick={onResetFilter}
        className="px-4 py-2 bg-[#faf8ff] dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#2563eb] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold font-mono transition-colors shadow-2xs"
      >
        Reset Feed Filters
      </button>
    )}
  </div>
);

export const NoAnnouncements = ({ onCreateClick }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in my-4 shadow-xs">
    <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-xs">
      <MegaphoneOff size={32} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Active Broadcast Announcements
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        There are no organization-wide or departmental announcements currently active or pinned.
      </p>
    </div>
    {onCreateClick && (
      <button
        onClick={onCreateClick}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
      >
        <Sparkles size={14} /> Create Broadcast Announcement
      </button>
    )}
  </div>
);

export const NoSearchResults = ({ query, onClear }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 animate-fade-in my-4 shadow-xs">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-xs">
      <SearchX size={28} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white">
        No Matches for "{query}"
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        Try adjusting your keywords or clearing category and priority filters.
      </p>
    </div>
    {onClear && (
      <button
        onClick={onClear}
        className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
      >
        Clear Search &amp; Filters
      </button>
    )}
  </div>
);
