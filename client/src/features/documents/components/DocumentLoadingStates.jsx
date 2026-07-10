import React from 'react';

/**
 * DocumentLoadingStates.jsx
 * Skeleton loaders for document cards, tables, preview modals, and telemetry dashboards.
 */

export const SkeletonDocumentCards = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="w-10 h-5 bg-[#ededf9] dark:bg-gray-800 rounded" />
          <div className="w-6 h-6 bg-[#ededf9] dark:bg-gray-800 rounded-full" />
        </div>
        <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
        </div>
        <div className="pt-2 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#ededf9] dark:bg-gray-800" />
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          </div>
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-12" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDocumentTable = ({ rows = 8 }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs animate-pulse">
    <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between">
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-40" />
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
    </div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <div className="w-4 h-4 rounded bg-[#ededf9] dark:bg-gray-800 shrink-0" />
          <div className="flex items-center gap-2.5 w-48">
            <div className="w-8 h-5 bg-[#ededf9] dark:bg-gray-800 rounded shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="h-3.5 bg-[#ededf9] dark:bg-gray-800 rounded w-full" />
              <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-2/3" />
            </div>
          </div>
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
          <div className="flex items-center gap-2 w-36">
            <div className="w-6 h-6 rounded-full bg-[#ededf9] dark:bg-gray-800 shrink-0" />
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded flex-1" />
          </div>
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-12" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-16" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded-full w-24" />
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-12 ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonPreviewLoader = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs animate-pulse space-y-6 max-w-4xl mx-auto">
    <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
      <div className="space-y-2">
        <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-64" />
        <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-40" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-[#ededf9] dark:bg-gray-800 rounded-lg" />
        <div className="h-8 w-24 bg-[#ededf9] dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
    <div className="h-96 bg-[#faf8ff] dark:bg-[#161616] rounded-xl flex items-center justify-center">
      <div className="h-10 w-48 bg-[#ededf9] dark:bg-gray-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
      <div className="h-12 bg-[#ededf9] dark:bg-gray-800 rounded-xl" />
      <div className="h-12 bg-[#ededf9] dark:bg-gray-800 rounded-xl" />
      <div className="h-12 bg-[#ededf9] dark:bg-gray-800 rounded-xl" />
    </div>
  </div>
);

export const SkeletonAnalyticsLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
            <div className="w-10 h-10 rounded-xl bg-[#ededf9] dark:bg-gray-800" />
          </div>
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-40" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl h-80 p-5" />
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl h-80 p-5" />
    </div>
  </div>
);
