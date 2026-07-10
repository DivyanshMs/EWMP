/**
 * shared/EmptyState.jsx
 * Precision Enterprise Design System — Shared Empty State & Error State Components
 * 
 * Centralized tokens: Slate neutral scale, Level 0/1 container styling.
 * WCAG 2.1 AA compliant with role="alert" for error states and React.memo optimization.
 * 
 * Components: EmptyState | ErrorState
 */
import React, { memo } from 'react';
import { Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

const renderIcon = (icon, fallback) => {
  const resolved = icon || fallback;

  if (React.isValidElement(resolved)) {
    return resolved;
  }

  if (resolved && (typeof resolved === 'function' || typeof resolved === 'object')) {
    const IconComponent = resolved;
    return <IconComponent size={24} />;
  }

  return null;
};

export const EmptyState = memo(function EmptyState({
  icon: IconComponent = Users,
  icon,
  title = 'No records found',
  subtitle = '',
  action,
  className = '',
  compact = false,
}) {
  return (
    <div
      role="region"
      aria-label={title}
      className={[
        'flex flex-col items-center justify-center text-center select-none bg-white dark:bg-[#111111] rounded-lg border border-[#e2e8f0] dark:border-slate-800',
        compact ? 'py-8 px-4' : 'py-16 px-6',
        className,
      ].join(' ')}
    >
      <div className="w-14 h-14 rounded-full bg-[#f8fafc] dark:bg-slate-800/80 flex items-center justify-center text-[#434655] dark:text-slate-400 mb-4 border border-[#e2e8f0]/40 dark:border-slate-700">
        {renderIcon(icon, IconComponent)}
      </div>
      <h3 className="text-base font-semibold text-[#191b23] dark:text-white mb-1 tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-[#434655] dark:text-slate-400 max-w-sm leading-relaxed mb-5">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
});

export const ErrorState = memo(function ErrorState({
  title = 'Something went wrong',
  subtitle = 'We encountered an error loading this data. Please try again.',
  error,
  onRetry,
  className = '',
  compact = false,
}) {
  return (
    <div
      role="alert"
      className={[
        'flex flex-col items-center justify-center text-center select-none bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/50',
        compact ? 'py-8 px-4' : 'py-16 px-6',
        className,
      ].join(' ')}
    >
      <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
        <AlertTriangle size={26} />
      </div>
      <h3 className="text-base font-semibold text-[#191b23] dark:text-white mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-[#434655] dark:text-slate-400 max-w-md leading-relaxed mb-4">
        {error ? (typeof error === 'string' ? error : error.message || subtitle) : subtitle}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} className="text-[#2563eb]" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
});

export default EmptyState;
