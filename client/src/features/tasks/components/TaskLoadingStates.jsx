import React from 'react';

/**
 * TaskLoadingStates.jsx
 * Skeleton tables, skeleton cards, Kanban loader, calendar loader, and analytics loader for EWMP Task Management.
 */

export const SkeletonCards = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-14" />
        </div>
        <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-4/5" />
        <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-3/5" />
        <div className="h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full w-full mt-3" />
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-16" />
          <div className="h-6 w-6 bg-[#ededf9] dark:bg-gray-800 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTables = ({ rows = 6 }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs animate-pulse">
    <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between">
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
      <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
    </div>
    <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-56" />
            <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
          </div>
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-28" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-5 bg-[#ededf9] dark:bg-gray-800 rounded-full w-24" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-16" />
          <div className="h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full w-24" />
        </div>
      ))}
    </div>
  </div>
);

export const KanbanLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-[#faf8ff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-3 space-y-3 h-[520px] flex flex-col">
        <div className="flex justify-between items-center pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-20" />
          <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded-full w-6" />
        </div>
        <div className="space-y-2.5 flex-1">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="bg-white dark:bg-[#161616] p-3 rounded-lg border border-[#e1e2ed] dark:border-gray-800 space-y-2">
              <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-16" />
              <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-full" />
              <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const CalendarLoader = () => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs animate-pulse space-y-6">
    <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
      <div className="h-6 bg-[#ededf9] dark:bg-gray-800 rounded w-48" />
      <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-36" />
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="h-24 bg-[#faf8ff] dark:bg-gray-900 rounded-lg border border-[#e1e2ed] dark:border-gray-800 p-2 space-y-1">
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-6" />
          {i % 3 === 0 && <div className="h-4 bg-[#ededf9] dark:bg-gray-800 rounded w-full" />}
        </div>
      ))}
    </div>
  </div>
);

export const AnalyticsLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 space-y-3">
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-24" />
          <div className="h-8 bg-[#ededf9] dark:bg-gray-800 rounded w-28" />
          <div className="h-3 bg-[#ededf9] dark:bg-gray-800 rounded w-32" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl h-80 p-5" />
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl h-80 p-5" />
    </div>
  </div>
);
