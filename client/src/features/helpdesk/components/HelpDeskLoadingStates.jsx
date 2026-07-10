import React from 'react';

/**
 * HelpDeskLoadingStates.jsx
 * Skeleton loaders for ticket tables, cards, conversation threads, and analytics charts.
 */

export const SkeletonTicketCard = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 animate-pulse space-y-3.5">
    <div className="flex justify-between items-center">
      <div className="w-24 h-5 bg-gray-200 dark:bg-gray-800 rounded-md" />
      <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
    </div>
    <div className="space-y-1.5">
      <div className="w-11/12 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-2/3 h-3.5 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="flex justify-between pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
      <div className="w-28 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
  </div>
);

export const SkeletonTicketTable = ({ rows = 6 }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse shadow-xs">
    <div className="h-11 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex items-center px-4 gap-6">
      <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-40 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-32 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 flex items-center px-4 gap-6">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-56 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-28 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonConversationLoader = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 animate-pulse space-y-4">
    <div className="flex justify-between items-center pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
      <div className="w-48 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="space-y-4">
      <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] rounded-2xl space-y-2">
        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      <div className="p-4 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl space-y-2 ml-8">
        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-5/6 h-12 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonAnalyticsLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 h-32 flex flex-col justify-between">
        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="w-32 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    ))}
  </div>
);
