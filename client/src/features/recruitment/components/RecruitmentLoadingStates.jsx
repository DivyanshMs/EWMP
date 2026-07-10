import React from 'react';

/**
 * RecruitmentLoadingStates.jsx
 * Skeleton placeholders and spinners for EWMP Recruitment Management module.
 */

export const SkeletonCards = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-24 h-4 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
          <div className="w-8 h-8 bg-[#ededf9] dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="w-32 h-7 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
        <div className="w-48 h-3 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div className="h-10 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800"></div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#ededf9] dark:bg-gray-800 rounded-full shrink-0"></div>
            <div className="space-y-2">
              <div className="w-36 h-4 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
              <div className="w-24 h-3 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="w-28 h-4 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
          <div className="w-20 h-6 bg-[#ededf9] dark:bg-gray-800 rounded-full"></div>
          <div className="w-24 h-8 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const PipelineLoader = () => (
  <div className="flex gap-4 overflow-x-auto pb-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="w-72 shrink-0 bg-[#faf8ff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-3 space-y-3">
        <div className="h-8 bg-white dark:bg-[#161616] rounded border border-[#e1e2ed]/50"></div>
        <div className="h-28 bg-white dark:bg-[#161616] rounded border border-[#e1e2ed]/50"></div>
        <div className="h-28 bg-white dark:bg-[#161616] rounded border border-[#e1e2ed]/50"></div>
      </div>
    ))}
  </div>
);

export const AnalyticsLoader = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 h-72 flex flex-col justify-between">
      <div className="w-48 h-5 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
      <div className="w-full h-44 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
    </div>
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 h-72 flex flex-col justify-between">
      <div className="w-48 h-5 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
      <div className="w-full h-44 bg-[#ededf9] dark:bg-gray-800 rounded"></div>
    </div>
  </div>
);
