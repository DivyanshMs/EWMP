import React from 'react';

/**
 * AssetLoadingStates.jsx
 * Skeleton loaders for all asset management views.
 */

export const SkeletonAssetCards = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ededf9] dark:bg-gray-800" />
            <div className="h-3.5 bg-[#ededf9] dark:bg-gray-800 rounded w-16" />
          </div>
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded-full w-20" />
        </div>
        <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-1/2" />
        <div className="space-y-1.5 pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-full" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonAssetTable = ({ rows = 8 }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs animate-pulse">
    <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between">
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-40" />
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
    </div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <div className="w-4 h-4 rounded bg-[#ededf9] dark:bg-gray-800 shrink-0" />
          <div className="flex items-center gap-2 w-40">
            <div className="w-7 h-7 rounded-lg bg-[#ededf9] dark:bg-gray-800 shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-full" />
              <div className="h-3.5 bg-[#ededf9] dark:bg-gray-800 rounded w-4/5" />
            </div>
          </div>
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded-full w-20" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-28" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded-full w-20" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded-full w-24" />
          <div className="flex items-center gap-2 w-28">
            <div className="w-6 h-6 rounded-full bg-[#ededf9] dark:bg-gray-800 shrink-0" />
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded flex-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonAnalytics = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
            <div className="w-10 h-10 rounded-lg bg-[#ededf9] dark:bg-gray-800" />
          </div>
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-28" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl h-80 p-5" />
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl h-80 p-5" />
    </div>
  </div>
);

export const SkeletonTimeline = ({ rows = 5 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[#ededf9] dark:bg-gray-800 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-56" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
        </div>
      </div>
    ))}
  </div>
);
