/**
 * shared/Badge.jsx
 * Precision Enterprise Design System — Shared Badge & Chip Components
 * 
 * Centralized tokens: 10% opacity backgrounds with 100% text opacity, full rounded pill shape.
 * WCAG 2.1 AA compliant, screen reader support, keyboard interactive chips, and React.memo optimization.
 * 
 * Semantic variants: active | inactive | pending | warning | error | compliant | suspended | info | admin | locked | ai | success | danger | ghost | outlined | filled
 */
import React, { memo } from 'react';
import { X } from 'lucide-react';

const variantMap = {
  active:     'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50',
  compliant:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50',
  online:     'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50',
  success:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50',
  info:       'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800/50',
  operational:'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800/50',
  admin:      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-800/50',
  ai:         'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-800/50',
  locked:     'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-800/50',
  warning:    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800/50',
  at_risk:    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800/50',
  pending:    'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  inactive:   'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  draft:      'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  error:      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
  danger:     'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
  suspended:  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
  blocked:    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
  critical:   'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
  ghost:      'bg-transparent text-slate-600 dark:text-slate-400 border-transparent',
  outlined:   'bg-transparent text-[#2563eb] dark:text-blue-400 border-blue-400 dark:border-blue-500',
  filled:     'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-transparent',
};

const sizeMap = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1',
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-0.5 text-xs gap-1.5',
  lg: 'px-3 py-1 text-sm gap-1.5',
};

export const Badge = memo(function Badge({
  variant = 'pending',
  size = 'md',
  dot = true,
  className = '',
  children,
  ...props
}) {
  const normalizedVariant = variant?.toLowerCase().replace(/[\s-]/g, '_') || 'pending';
  const style = variantMap[normalizedVariant] || variantMap.pending;

  return (
    <span
      role="status"
      className={[
        'inline-flex items-center font-semibold rounded-full border transition-colors duration-150 select-none',
        style,
        sizeMap[size] || sizeMap.md,
        className,
      ].join(' ')}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
    </span>
  );
});

export const Chip = memo(function Chip({
  label,
  variant = 'pending',
  size = 'md',
  icon,
  onRemove,
  onClick,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const normalizedVariant = variant?.toLowerCase().replace(/[\s-]/g, '_') || 'pending';
  const style = variantMap[normalizedVariant] || variantMap.pending;
  const isInteractive = !!onClick || !!onRemove;
  const content = label || children;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(e);
    }
    if (e.key === 'Backspace' || (e.key === 'Delete' && onRemove)) {
      e.preventDefault();
      onRemove(e);
    }
  };

  return (
    <span
      role={onClick ? 'button' : 'group'}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      onClick={!disabled && onClick ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      className={[
        'inline-flex items-center font-medium rounded-full border transition-all duration-150 select-none max-w-full',
        style,
        sizeMap[size] || sizeMap.md,
        isInteractive && !disabled ? 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#2563eb]' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="truncate">{content}</span>
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          aria-label={`Remove ${typeof content === 'string' ? content : 'chip'}`}
          className="shrink-0 ml-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-current transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
});

export default Badge;
