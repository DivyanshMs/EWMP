import React from 'react';

/**
 * LeaveLoadingStates.jsx
 * Skeleton cards, tables, calendar loaders, and analytics loaders for EWMP Leave Management.
 */

export const SkeletonCards = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 h-48 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="w-16 h-5 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-2 my-4">
            <div className="w-24 h-8 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="w-full h-8 rounded bg-gray-200 dark:bg-gray-800 pt-2" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden animate-pulse shadow-xs">
      <div className="h-11 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800" />
      <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="space-y-1 w-full">
                <div className="w-3/4 h-4 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="w-1/2 h-3 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
            <div className="w-1/6 h-6 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="w-1/6 h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="w-1/6 h-6 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="w-20 h-8 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarLoader = () => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
        <div className="w-48 h-8 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="w-64 h-8 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, idx) => (
          <div key={idx} className="h-24 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2">
            <div className="w-6 h-4 rounded bg-gray-200 dark:bg-gray-800 mb-2" />
            {idx % 3 === 0 && <div className="w-full h-4 rounded bg-blue-100 dark:bg-blue-900/30" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 h-80" />
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 h-80" />
      </div>
    </div>
  );
};
