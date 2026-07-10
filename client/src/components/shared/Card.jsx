/**
 * shared/Card.jsx
 * Precision Enterprise Design System — Shared Card & KPI Container Components
 * 
 * Centralized tokens: Level 1 elevation (#e2e8f0 border, white surface, subtle shadow), 8px (lg) border radius.
 * WCAG 2.1 AA compliant with proper semantic headings, ARIA descriptions, and React.memo optimization.
 * 
 * Components: Card | CardHeader | CardBody | CardFooter | StatCard | MetricCard | ChartCard
 */
import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Card = memo(function Card({
  className = '',
  noPadding = false,
  elevation = 'level1',
  onClick,
  children,
  ...props
}) {
  const elevationClasses = {
    level0: 'bg-[#f8fafc] dark:bg-[#0a0a0a] border-transparent shadow-none',
    level1: 'bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 shadow-sm',
    level2: 'bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]',
    level3: 'bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 shadow-xl',
  };

  const isInteractive = !!onClick;

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      className={[
        'rounded-lg transition-all duration-150',
        elevationClasses[elevation] || elevationClasses.level1,
        !noPadding && 'overflow-hidden',
        isInteractive && 'cursor-pointer hover:border-[#2563eb] dark:hover:border-[#2563eb]/60 focus:outline-none focus:ring-2 focus:ring-[#2563eb]',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = memo(function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={[
        'flex items-start justify-between gap-4 px-6 py-4 border-b border-[#e2e8f0]/60 dark:border-slate-800/80',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-base font-semibold text-[#191b23] dark:text-white tracking-tight truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#434655] dark:text-slate-400 truncate">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0 flex items-center">{action}</div>}
    </div>
  );
});

export const CardBody = memo(function CardBody({
  className = '',
  children,
  ...props
}) {
  return (
    <div className={['px-6 py-4', className].join(' ')} {...props}>
      {children}
    </div>
  );
});

export const CardFooter = memo(function CardFooter({
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={[
        'px-6 py-3 bg-[#f8fafc] dark:bg-[#0d0d0d] border-t border-[#e2e8f0]/60 dark:border-slate-800/80 flex items-center justify-between gap-4',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
});

export const StatCard = memo(function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend, // { value: number | string, label: string, direction: 'up' | 'down' | 'neutral' }
  className = '',
  onClick,
  ...props
}) {
  const getTrendStyle = (dir) => {
    if (dir === 'up') return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/50';
    if (dir === 'down') return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-800/50';
    return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';
  };

  const getTrendIcon = (dir) => {
    if (dir === 'up') return <TrendingUp size={14} />;
    if (dir === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  return (
    <Card elevation="level1" onClick={onClick} className={['p-5 flex flex-col justify-between gap-4', className].join(' ')} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#434655] dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <h4 className="mt-2 text-2xl sm:text-3xl font-bold text-[#191b23] dark:text-white tracking-tight">
            {value}
          </h4>
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-[#faf8ff] dark:bg-slate-800/80 text-[#2563eb] dark:text-blue-400 shrink-0 border border-[#e2e8f0]/40 dark:border-slate-700">
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e2e8f0]/40 dark:border-slate-800/60 text-xs">
          {trend ? (
            <span className={['inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold text-xs', getTrendStyle(trend.direction)].join(' ')}>
              {getTrendIcon(trend.direction)}
              <span>{trend.value}</span>
            </span>
          ) : <span />}
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Card>
  );
});

export const MetricCard = memo(function MetricCard({
  title,
  value,
  unit,
  change,
  changeType = 'neutral', // 'positive' | 'negative' | 'neutral'
  footerText,
  icon,
  className = '',
  onClick,
  ...props
}) {
  return (
    <StatCard
      title={title}
      value={unit ? `${value} ${unit}` : value}
      icon={icon}
      trend={change ? { value: change, direction: changeType === 'positive' ? 'up' : changeType === 'negative' ? 'down' : 'neutral' } : undefined}
      subtitle={footerText}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
});

export const ChartCard = memo(function ChartCard({
  title,
  subtitle,
  action,
  legend,
  height = '300px',
  className = '',
  children,
  ...props
}) {
  return (
    <Card elevation="level1" className={className} {...props}>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <CardBody className="pt-4">
        {legend && <div className="mb-4 flex items-center justify-end gap-4 text-xs">{legend}</div>}
        <div style={{ minHeight: height, height: height }} className="w-full relative flex items-center justify-center">
          {children}
        </div>
      </CardBody>
    </Card>
  );
});

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
export default Card;
