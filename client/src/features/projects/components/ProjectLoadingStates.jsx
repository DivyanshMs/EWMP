import React from 'react';

/**
 * ProjectLoadingStates.jsx
 * Skeleton cards, table skeleton loaders, timeline loaders, and analytics pulse states for EWMP Projects.
 */

export const SkeletonCards = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded-full w-16" />
        </div>
        <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-1/2" />
        <div className="h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full w-full mt-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded" />
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTables = ({ rows = 5 }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs animate-pulse">
    <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between">
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
    </div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-48" />
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
          </div>
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
          <div className="h-6 bg-[#ededf9] dark:bg-gray-800 rounded-full w-20" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-16" />
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const TimelineLoader = () => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs animate-pulse space-y-6">
    <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
      <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-48" />
      <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-[#faf8ff] dark:bg-gray-900 rounded-lg border border-[#e1e2ed]" />
      ))}
    </div>
    <div className="space-y-3 pt-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 bg-[#faf8ff] dark:bg-gray-900 rounded-lg border border-[#e1e2ed]" />
      ))}
    </div>
  </div>
);

export const AnalyticsLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 space-y-3">
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl h-80 p-5" />
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl h-80 p-5" />
    </div>
  </div>
);
