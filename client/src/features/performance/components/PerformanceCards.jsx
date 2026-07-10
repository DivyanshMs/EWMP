import React from 'react';
import { TrendingUp, Target, Star, Calendar, ChevronRight, ArrowUpRight, ArrowDownRight, Sparkles, BarChart3, Edit3 } from 'lucide-react';
import { ReviewStatusBadge, GoalPriorityBadge, RatingBadge, GoalStatusBadge } from './PerformanceBadges';

/**
 * PerformanceCards.jsx
 * Precision Enterprise cards for EWMP Performance Management module.
 * Adheres strictly to Stitch MCP rules: rounded-lg (8px) / rounded-xl (12px), 1px borders, surface colors.
 */

export const PerformanceReviewCard = ({ review, onSelect, onEvaluate }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-[#c3c6d7] transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-[#e1e2ed]/60 dark:border-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 font-bold text-sm flex items-center justify-center font-mono">
              {review.employeeName?.substring(0, 2).toUpperCase() || 'SA'}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191b23] dark:text-white">
                {review.employeeName || 'Sarah SDE-II'}
              </h3>
              <span className="text-xs text-[#737686] dark:text-gray-400 font-mono">
                {review.cycle || 'H1 2026 Appraisal'} • Reviewer: {review.reviewer || 'Marcus Tech VP'}
              </span>
            </div>
          </div>
          <ReviewStatusBadge status={review.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
            <span className="text-[11px] text-[#737686] block">Overall Rating Score</span>
            <div className="mt-1">
              <RatingBadge rating={review.rating || 4.5} />
            </div>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
            <span className="text-[11px] text-[#737686] block">Goals Achieved</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-lg font-extrabold text-[#2563eb]">{review.goalsCompleted || 8}</span>
              <span className="text-xs text-[#737686]">/ {review.totalGoals || 8} KPIs</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#737686] dark:text-gray-400 py-2 border-t border-[#e1e2ed]/40 dark:border-gray-800/40">
          <span>Submitted: <strong className="font-mono text-[#191b23] dark:text-gray-300">{review.submissionDate || 'July 2, 2026'}</strong></span>
          <span>Dept: <strong className="text-[#434655] dark:text-gray-300">{review.department || 'Engineering'}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
        <button
          onClick={() => onSelect(review)}
          className="flex-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
        >
          View Details <ChevronRight size={14} />
        </button>
        {onEvaluate && (
          <button
            onClick={() => onEvaluate(review)}
            className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2 px-3 rounded transition-colors shadow-xs flex items-center justify-center gap-1"
          >
            <Edit3 size={14} /> Evaluate
          </button>
        )}
      </div>
    </div>
  );
};

export const GoalCard = ({ goal, onSelect, onUpdate }) => {
  const progress = Number(goal.progress || 0);

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-[#c3c6d7] transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <GoalPriorityBadge priority={goal.priority} />
          <GoalStatusBadge status={goal.status || 'IN_PROGRESS'} />
        </div>

        <h3 className="text-base font-bold text-[#191b23] dark:text-white mt-1 line-clamp-1">
          {goal.title || 'Migrate Core Authentication to Multi-Tenant OAuth 2.0 Engine'}
        </h3>
        <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 line-clamp-2">
          {goal.description || 'Architect and deploy SSO integration supporting SAML and OIDC protocols with zero downtime.'}
        </p>

        {/* Progress Bar & Milestones */}
        <div className="my-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#737686] font-medium">Completion Progress</span>
            <span className="font-mono font-bold text-[#2563eb]">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progress === 100 ? 'bg-emerald-500' : progress >= 50 ? 'bg-[#2563eb]' : 'bg-amber-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#737686] pt-2 border-t border-[#e1e2ed]/50 dark:border-gray-800/50">
          <span className="flex items-center gap-1"><Calendar size={13} /> Due: <strong className="font-mono text-[#191b23] dark:text-gray-300">{goal.dueDate || 'Sep 30, 2026'}</strong></span>
          <span className="font-mono">{goal.completedMilestones || 3} / {goal.totalMilestones || 4} Milestones</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
        <button
          onClick={() => onSelect && onSelect(goal)}
          className="flex-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-1.5 px-3 rounded transition-colors"
        >
          Inspect KPI
        </button>
        {onUpdate && (
          <button
            onClick={() => onUpdate(goal)}
            className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-1.5 px-3 rounded transition-colors shadow-xs"
          >
            Update %
          </button>
        )}
      </div>
    </div>
  );
};

export const RatingComponent = ({ value = 4.0, onChange, readOnly = false, label = 'Competency Rating' }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#191b23] dark:text-white">{label}</span>
          <span className="font-mono font-extrabold text-[#2563eb]">{value.toFixed(1)} / 5.0</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        {stars.map((star) => {
          const isFilled = star <= value;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(star)}
              className={`p-1 rounded transition-transform ${
                readOnly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'
              } ${
                isFilled
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-gray-300 dark:text-gray-700 hover:text-amber-300'
              }`}
              title={`Rate ${star} Stars`}
            >
              <Star size={20} className={isFilled ? 'fill-current' : ''} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const PerformanceAnalyticsCard = ({ title, value, subtitle, change, trend = 'up', icon: Icon = TrendingUp }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737686] dark:text-gray-400">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] flex items-center justify-center">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#191b23] dark:text-white">{value}</span>
          {change && (
            <span className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
              trend === 'up' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            }`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export const ChartPlaceholder = ({ title, height = 'h-64', type = 'bar' }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <BarChart3 size={16} className="text-[#2563eb]" />
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-[#737686]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] inline-block"></span> Actual Distribution
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ml-2"></span> Target Bell Curve
        </div>
      </div>

      <div className={`w-full ${height} bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60 p-4 flex flex-col justify-end relative overflow-hidden`}>
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-30">
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
          <div className="w-full border-b border-[#c3c6d7] dark:border-gray-700"></div>
        </div>

        {type === 'bar' ? (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 h-48 items-end z-10 px-8">
            {[
              { label: 'Unsatisfactory (<2.5)', val: 5, pct: '4%' },
              { label: 'Needs Impr. (2.5–3.4)', val: 20, pct: '14%' },
              { label: 'Meets Exp. (3.5–4.2)', val: 65, pct: '56%' },
              { label: 'Exceeds Exp. (4.3–4.7)', val: 35, pct: '21%' },
              { label: 'Outstanding (4.8+)', val: 15, pct: '5%' },
            ].map((bucket, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-xs font-mono font-bold text-[#2563eb]">{bucket.pct}</span>
                <div className="w-full max-w-[48px] bg-[#2563eb] rounded-t hover:bg-[#004ac6] transition-all cursor-pointer shadow-xs" style={{ height: `${(bucket.val / 70) * 100}%` }} title={`${bucket.label}: ${bucket.pct}`}></div>
                <span className="text-[10px] font-mono text-[#737686] text-center max-w-[80px] truncate">{bucket.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full z-10 text-xs text-[#737686] flex-col gap-2">
            <Sparkles size={24} className="text-[#2563eb] animate-pulse" />
            <span className="font-semibold text-[#191b23] dark:text-white">Interactive Department Performance Matrix</span>
            <span>Real-time calibration analytics across Engineering, Sales, and Operations</span>
          </div>
        )}
      </div>
    </div>
  );
};
