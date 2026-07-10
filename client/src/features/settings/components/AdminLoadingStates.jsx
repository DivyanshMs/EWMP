import React from 'react';

/**
 * AdminLoadingStates.jsx
 * Enterprise skeleton and loading states for the Settings & Administration Module.
 */

export const SkeletonCards = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-5 animate-pulse space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800/80 rounded w-40"></div>
              </div>
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-100 dark:bg-slate-800/80 rounded w-full"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800/80 rounded w-3/4"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonTables = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 bg-slate-50 dark:bg-[#161616] border-b border-slate-200 dark:border-slate-800 flex justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-36"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-20"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProfileLoader = () => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded w-36"></div>
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-56"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded w-80"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-5"></div>
        <div className="h-64 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-5"></div>
      </div>
    </div>
  );
};
