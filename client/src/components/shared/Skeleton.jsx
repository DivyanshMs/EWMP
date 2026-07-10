/**
 * shared/Skeleton.jsx
 * Precision Enterprise Design System — Shared Skeleton Loader & Spinner Components
 * 
 * Centralized tokens: Slate-100 / Slate-800 shimmer pulse, #2563eb spinner ring, Level 3 backdrop blur.
 * WCAG 2.1 AA compliant with aria-hidden="true" for skeletons and role="status" for live loaders.
 * 
 * Components: Skeleton | SkeletonCard | SkeletonTable | SkeletonForm | Spinner | LoadingOverlay | PageLoader | SkeletonLoader
 */
import React, { memo } from 'react';
import { Building2 } from 'lucide-react';

export const Skeleton = memo(function Skeleton({ className = '', style }) {
  return (
    <div
      className={['animate-pulse bg-slate-100 dark:bg-slate-800 rounded transition-colors', className].join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
});

export const SkeletonCard = memo(function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-lg p-5 animate-pulse flex flex-col justify-between h-36"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div>
            <Skeleton className="h-7 w-1/2 mb-2" />
            <Skeleton className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
});

export const SkeletonTable = memo(function SkeletonTable({ rows = 6, columns = 5 }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#111111]" aria-hidden="true">
      <div className="flex gap-4 px-4 py-3.5 bg-[#ededf9] dark:bg-[#161616] border-b border-[#e2e8f0] dark:border-slate-800">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 px-4 py-3.5 border-b border-[#e2e8f0]/60 dark:border-[#1e1e1e] animate-pulse"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              className={['h-3.5 flex-1', j === 0 ? 'max-w-[140px]' : ''].join(' ')}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export const SkeletonForm = memo(function SkeletonForm({ fields = 4 }) {
  return (
    <div className="space-y-5" aria-hidden="true">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
});

export const Spinner = memo(function Spinner({ size = 'md', className = '', label = 'Loading...' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  return (
    <div role="status" aria-label={label} className={['inline-flex items-center justify-center', className].join(' ')}>
      <div
        className={[
          'rounded-full border-[#2563eb] border-t-transparent animate-spin',
          sizeMap[size] || sizeMap.md,
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
});

export const LoadingOverlay = memo(function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-label={message}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm transition-opacity duration-150"
    >
      <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#111111] rounded-xl shadow-xl border border-[#e2e8f0] dark:border-slate-800 max-w-xs text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center animate-pulse">
            <Building2 className="text-[#2563eb] dark:text-blue-400" size={24} />
          </div>
          <div className="absolute -inset-1 border-2 border-[#2563eb] rounded-xl border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-[#191b23] dark:text-slate-200">{message}</p>
      </div>
    </div>
  );
});

export const PageLoader = memo(function PageLoader({ message = 'Fetching data...' }) {
  return (
    <div role="status" aria-label={message} className="flex flex-col items-center justify-center h-64 w-full gap-3">
      <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#434655] dark:text-slate-400 font-medium">{message}</p>
    </div>
  );
});

export const SkeletonLoader = memo(function SkeletonLoader({ type = 'text', count = 1, className = '' }) {
  if (type === 'card') {
    return <SkeletonCard count={count} />;
  }
  if (type === 'table') {
    return <SkeletonTable rows={count} />;
  }
  const elements = Array.from({ length: count });
  return (
    <div className={['space-y-3 w-full', className].join(' ')} aria-hidden="true">
      {elements.map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
          style={{ width: `${Math.max(40, 100 - i * 15)}%` }}
        />
      ))}
    </div>
  );
});

export default Skeleton;
