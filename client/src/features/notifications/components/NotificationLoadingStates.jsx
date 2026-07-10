import React from 'react';

/**
 * NotificationLoadingStates.jsx
 * Skeleton loaders for notification feeds and announcement broadcasts.
 */

export const SkeletonNotificationCard = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
    <div className="space-y-1.5">
      <div className="w-full h-3.5 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-5/6 h-3.5 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="w-36 h-3.5 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
  </div>
);

export const SkeletonNotificationFeed = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonNotificationCard key={i} />
    ))}
  </div>
);

export const SkeletonAnnouncementCard = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 animate-pulse space-y-4">
    <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-28 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="w-2/3 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
    <div className="space-y-2">
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-11/12 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
      <div className="w-40 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="flex gap-2">
        <div className="w-24 h-7 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  </div>
);
