import React from 'react';

/**
 * EmployeeLoadingStates.jsx
 * Standardized WCAG AA compliant skeleton loaders for Employee Table, Employee Cards,
 * and detailed Employee Profile views in EWMP.
 */

export const EmployeeTableSkeleton = ({ rows = 8, columns = 7 }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm animate-pulse my-4 font-sans">
      {/* Table Header Skeleton */}
      <div className="bg-gray-50 dark:bg-[#161616] p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-1/3">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-32"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-24"></div>
        </div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/3 min-w-0">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded-md shrink-0"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800/60 rounded w-1/2"></div>
              </div>
            </div>
            {Array.from({ length: columns - 2 }).map((_, cIdx) => (
              <div key={cIdx} className="hidden sm:block flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5 mx-auto"></div>
              </div>
            ))}
            <div className="w-20 flex justify-end gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EmployeeCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse my-4 font-sans">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-800 shrink-0"></div>
              <div className="space-y-2 min-w-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-36"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded w-24"></div>
              </div>
            </div>
            <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0"></div>
          </div>

          <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-2xl space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-28"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmployeeProfileLoader = () => {
  return (
    <div className="space-y-6 animate-pulse my-4 font-sans max-w-7xl mx-auto">
      {/* Profile Header Skeleton */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-gray-200 dark:bg-gray-800 shrink-0"></div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
              <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-56"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800/60 rounded w-72"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="w-28 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="w-28 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Tabs Row Skeleton */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        ))}
      </div>

      {/* Content Body Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="h-64 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6"></div>
          <div className="h-48 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6"></div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-80 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6"></div>
          <div className="h-60 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6"></div>
        </div>
      </div>
    </div>
  );
};

export default {
  EmployeeTableSkeleton,
  EmployeeCardSkeleton,
  EmployeeProfileLoader,
};
