import React from 'react';
import { Skeleton, SkeletonTable, SkeletonCard } from '../../../components/shared';

/**
 * OrganizationLoadingStates.jsx
 * Enterprise loading skeletons for tables, location cards, hierarchy charts, and calendar previews
 * in the EWMP Organization Management module. Consumes standard shared skeletons.
 */

export const OrganizationTableSkeleton = ({ rows = 5, columns = 5 }) => {
  return <SkeletonTable rows={rows} columns={columns} />;
};

export const OrganizationCardGridSkeleton = ({ count = 6 }) => {
  return <SkeletonCard count={count} />;
};

export const OrganizationCalendarSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded flex items-center justify-center font-mono text-xs text-[#434655] dark:text-slate-400">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800/80 rounded-lg p-2 flex flex-col justify-between"
          >
            <Skeleton className="h-3 w-5 self-end" />
            {i % 4 === 0 && <Skeleton className="h-4 w-full" />}
          </div>
        ))}
      </div>
    </div>
  );
};

