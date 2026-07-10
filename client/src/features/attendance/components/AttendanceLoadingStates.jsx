import React from 'react';

/**
 * AttendanceLoadingStates.jsx
 * Enterprise-grade loading skeletons for the EWMP Attendance Management module.
 * Provides WCAG AA accessible pulse animations for:
 * 1. Skeleton Tables (Roster & Correction Requests)
 * 2. Skeleton Cards (KPI summary & Working Hours)
 * 3. Calendar Loader (Monthly grid view)
 * 4. Analytics Loader (Charts & Heatmaps)
 */

export const AttendanceTableSkeleton = ({ rows = 6, columns = 8 }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm animate-pulse font-sans">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-3 w-72 bg-gray-100 dark:bg-gray-800/60 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[800px] space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-gray-50 dark:bg-[#161616] rounded-2xl">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-3.5 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4"></div>
            ))}
          </div>

          {/* Data Rows */}
          {Array.from({ length: rows }).map((_, rIdx) => (
            <div
              key={rIdx}
              className="grid grid-cols-8 gap-4 px-4 py-4 items-center border-b border-gray-100 dark:border-gray-800/50 last:border-0"
            >
              <div className="flex items-center gap-3 col-span-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                  <div className="h-2.5 w-20 bg-gray-100 dark:bg-gray-800/60 rounded-md"></div>
                </div>
              </div>
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded-md w-24"></div>
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded-md w-16"></div>
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded-md w-16"></div>
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded-md w-20"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="flex justify-end gap-1">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AttendanceCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse font-sans">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-3 w-36 bg-gray-100 dark:bg-gray-800/70 rounded-md"></div>
          </div>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AttendanceCalendarLoader = () => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm animate-pulse font-sans space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="space-y-1">
          <div className="h-6 w-44 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-3 w-64 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-2 text-center pb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md mx-auto w-12"></div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-24 sm:h-28 bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-gray-800 rounded-2xl p-2.5 space-y-2 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-6 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AttendanceAnalyticsLoader = () => {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs h-64 flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-32 bg-gray-100 dark:bg-[#161616] rounded-2xl flex items-end justify-between p-4 gap-2">
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-t h-1/3"></div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-t h-2/3"></div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-t h-full"></div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-t h-1/2"></div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-t h-4/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs h-80 space-y-4">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-60 bg-gray-50 dark:bg-[#161616] rounded-2xl w-full"></div>
      </div>
    </div>
  );
};

export default {
  AttendanceTableSkeleton,
  AttendanceCardSkeleton,
  AttendanceCalendarLoader,
  AttendanceAnalyticsLoader,
};
