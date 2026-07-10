import React from 'react';

/**
 * AILoadingStates.jsx
 * Animated shimmer skeleton loaders for EWMP AI Assistant Workspace.
 * Covers ChatSkeleton, RecommendationSkeleton, InsightSkeleton, and WorkflowSkeleton.
 */

export const ChatSkeleton = () => (
  <div className="space-y-4 animate-pulse my-4">
    <div className="flex items-start gap-3 max-w-2xl">
      <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-800 shrink-0" />
      <div className="flex-1 space-y-2 bg-white dark:bg-[#111111] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
    </div>
  </div>
);

export const RecommendationSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse my-4">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        </div>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" />
      </div>
    ))}
  </div>
);

export const InsightSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse my-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      </div>
    ))}
  </div>
);

export const WorkflowSkeleton = () => (
  <div className="space-y-4 animate-pulse my-4">
    <div className="h-16 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 w-full" />
    <div className="space-y-3 pl-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 w-full" />
      ))}
    </div>
  </div>
);
