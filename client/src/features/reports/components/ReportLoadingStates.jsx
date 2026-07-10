import React from 'react';

/**
 * ReportLoadingStates.jsx
 * Skeleton loaders for BI charts, executive KPI cards, and data comparison tables.
 */

export const SkeletonCharts = ({ count = 2 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse font-sans">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 h-80 flex flex-col justify-between">
        <div className="flex justify-between items-center pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <div className="w-48 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-24 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
        <div className="flex-1 flex items-end justify-around py-6 gap-4">
          {[40, 70, 50, 85, 60, 95].map((val, j) => (
            <div key={j} style={{ height: `${val}%` }} className="w-8 bg-gray-200 dark:bg-gray-800 rounded-t-lg" />
          ))}
        </div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    ))}
  </div>
);

export const SkeletonCards = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse font-sans">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 h-36 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-20 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded mt-2" />
      </div>
    ))}
  </div>
);

export const TableLoader = ({ rows = 6 }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse shadow-xs font-sans">
    <div className="h-11 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex items-center px-4 gap-6">
      <div className="w-32 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 flex items-center px-4 gap-6">
          <div className="w-40 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-28 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);
