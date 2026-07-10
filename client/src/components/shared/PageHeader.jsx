/**
 * shared/PageHeader.jsx
 * Precision Enterprise Design System — Shared Page Header & Section Header Components
 * 
 * Centralized tokens: Slate neutral scale (#191b23 / #434655), Level 1 border separation (#e2e8f0).
 * WCAG 2.1 AA compliant with semantic headings, breadcrumb navigation, and React.memo optimization.
 * 
 * Components: PageHeader | SectionHeader
 */
import React, { memo } from 'react';

export const PageHeader = memo(function PageHeader({
  title,
  description,
  breadcrumb,
  primaryAction,
  secondaryAction,
  filters,
  className = '',
}) {
  return (
    <div className={['mb-6 select-none', className].join(' ')}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-2 text-xs text-[#434655] dark:text-slate-400">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg viewBox="0 0 16 16" className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" fill="none" aria-hidden="true">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                </svg>
              )}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-[#191b23] dark:hover:text-white transition-colors focus:outline-none focus:underline">
                  {crumb.label}
                </a>
              ) : (
                <span className={i === breadcrumb.length - 1 ? 'text-[#191b23] dark:text-white font-semibold' : ''} aria-current={i === breadcrumb.length - 1 ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191b23] dark:text-white truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[#434655] dark:text-slate-400 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-2.5 shrink-0">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </div>

      {filters && (
        <div className="mt-4 pt-4 border-t border-[#e2e8f0] dark:border-slate-800">
          {filters}
        </div>
      )}
    </div>
  );
});

export const SectionHeader = memo(function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
  divider = false,
}) {
  return (
    <div
      className={[
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 select-none',
        divider ? 'pb-3 border-b border-[#e2e8f0] dark:border-slate-800' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold tracking-tight text-[#191b23] dark:text-white truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#434655] dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center">{action}</div>}
    </div>
  );
});

export default PageHeader;
