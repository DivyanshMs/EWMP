/**
 * shared/Button.jsx
 * Precision Enterprise Design System — Shared Button & IconButton Components
 * 
 * Centralized tokens: #2563EB primary fill, Slate-200 borders, Inter typography, Level 1 beveled stroke.
 * WCAG 2.1 AA compliant with visible focus rings, ARIA support, and React.memo optimization.
 * 
 * Variants: primary | secondary | ghost | danger | primary-danger
 * Sizes: xs | sm | md (default) | lg
 */
import React, { memo } from 'react';

const variantClasses = {
  primary:
    'bg-[#2563eb] text-white border-transparent hover:bg-[#1d4ed8] active:bg-[#1e40af] focus:ring-[#2563eb] shadow-sm font-medium',
  secondary:
    'bg-white dark:bg-[#111111] text-[#191b23] dark:text-[#f8fafc] border border-[#e2e8f0] dark:border-slate-800 hover:bg-[#f8fafc] dark:hover:bg-[#1a1a1a] active:bg-slate-100 dark:active:bg-[#222222] focus:ring-[#2563eb] font-medium',
  ghost:
    'bg-transparent text-[#434655] dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-[#191b23] dark:hover:text-white active:bg-slate-200 dark:active:bg-slate-800 focus:ring-[#2563eb] font-medium',
  danger:
    'bg-white dark:bg-[#111111] text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/10 active:bg-rose-100 dark:active:bg-rose-500/20 focus:ring-rose-500 font-medium',
  'primary-danger':
    'bg-rose-600 text-white border-transparent hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-sm font-medium',
  outlined:
    'bg-transparent text-[#2563eb] dark:text-[#60a5fa] border border-[#2563eb] dark:border-[#60a5fa] hover:bg-blue-50 dark:hover:bg-blue-950/30 focus:ring-[#2563eb] font-medium',
  filled:
    'bg-slate-100 dark:bg-slate-800 text-[#191b23] dark:text-[#f8fafc] border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-[#2563eb] font-medium',
};

const sizeClasses = {
  xs: 'px-2.5 py-1 text-xs rounded gap-1 h-7',
  sm: 'px-3 py-1.5 text-xs rounded gap-1.5 h-8',
  md: 'px-4 py-2 text-sm rounded gap-2 h-9',
  lg: 'px-5 py-2.5 text-base rounded-md gap-2 h-11',
};

const iconSizeClasses = {
  xs: 'p-1 w-7 h-7 rounded text-xs',
  sm: 'p-1.5 w-8 h-8 rounded text-xs',
  md: 'p-2 w-9 h-9 rounded text-sm',
  lg: 'p-2.5 w-11 h-11 rounded-md text-base',
};

export const Button = memo(function Button({
  variant = 'secondary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={[
        'inline-flex items-center justify-center transition-all duration-150 select-none',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0a0a0a]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        variantClasses[variant] || variantClasses.secondary,
        sizeClasses[size] || sizeClasses.md,
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
});

export const IconButton = memo(function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel,
  title,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={ariaLabel || title || 'Icon button'}
      title={title || ariaLabel}
      className={[
        'inline-flex items-center justify-center transition-all duration-150 select-none shrink-0',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0a0a0a]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        variantClasses[variant] || variantClasses.ghost,
        iconSizeClasses[size] || iconSizeClasses.md,
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      )}
    </button>
  );
});

export default Button;
