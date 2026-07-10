import React from 'react';
import { HelpCircle, MessageSquare, Paperclip, TrendingUp, TrendingDown, Minus, BarChart2, PieChart, Activity } from 'lucide-react';
import { TicketPriorityBadge, TicketStatusBadge, TicketSLABadge, TicketCategoryBadge } from './HelpDeskBadges';

/**
 * HelpDeskCards.jsx
 * Enterprise UI cards for service tickets, KPI analytics metrics, and visual chart placeholders.
 */

export const TicketCard = ({
  ticket,
  onSelect,
  onAssign,
  onResolve
}) => {
  const {
    id,
    title,
    category = 'IT',
    priority = 'MEDIUM',
    status = 'OPEN',
    slaStatus = 'ON_TRACK',
    assignedTo = 'Unassigned',
    createdBy = 'Alex Turner',
    department = 'Engineering',
    updatedDate = 'Just now',
    commentsCount = 2,
    attachmentsCount = 1
  } = ticket;

  return (
    <div
      onClick={() => onSelect && onSelect(ticket)}
      className="group bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 transition-all shadow-2xs hover:shadow-md hover:border-[#2563eb] cursor-pointer space-y-3.5 flex flex-col justify-between"
    >
      {/* Top Strip */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-xs text-[#2563eb] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
            {id}
          </span>
          <TicketCategoryBadge category={category} size="sm" />
        </div>
        <TicketPriorityBadge priority={priority} size="sm" />
      </div>

      {/* Main Title & Dept */}
      <div className="space-y-1">
        <h4 className="text-sm font-extrabold text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors line-clamp-2">
          {title}
        </h4>
        <p className="text-[11px] font-mono text-[#737686] flex items-center justify-between">
          <span>Dept: <strong className="text-gray-700 dark:text-gray-300 font-sans">{department}</strong></span>
          <span>By: <strong className="text-gray-700 dark:text-gray-300 font-sans">{createdBy}</strong></span>
        </p>
      </div>

      {/* SLA & Status Row */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <TicketStatusBadge status={status} size="sm" />
        <TicketSLABadge status={slaStatus} size="sm" />
      </div>

      {/* Assignee & Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#e1e2ed] dark:border-gray-800 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            {assignedTo.charAt(0)}
          </div>
          <span className="text-[11px] font-mono text-[#737686] truncate">
            {assignedTo}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#737686] font-mono text-[11px] shrink-0">
          {commentsCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={13} /> {commentsCount}
            </span>
          )}
          {attachmentsCount > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip size={13} /> {attachmentsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const HelpDeskAnalyticsCard = ({
  title,
  value,
  subtitle,
  icon: Icon = HelpCircle,
  change,
  trend = 'neutral',
  color = 'text-[#2563eb]',
  bg = 'bg-blue-50 dark:bg-blue-950/60'
}) => {
  const trendIcon =
    trend === 'up' ? <TrendingUp size={14} className="text-emerald-600" /> :
    trend === 'down' ? <TrendingDown size={14} className="text-rose-600" /> :
    <Minus size={14} className="text-[#737686]" />;

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-[#737686] uppercase tracking-wider font-mono block">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#191b23] dark:text-white mt-1 font-mono tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${bg} ${color} border border-current/10 shadow-2xs`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-xs">
        <span className="text-[#737686] font-sans truncate">{subtitle}</span>
        {change && (
          <span className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-md bg-[#faf8ff] dark:bg-gray-800 text-[#191b23] dark:text-white shrink-0">
            {trendIcon}
            <span>{change}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export const HelpDeskChartsPlaceholder = ({
  title,
  type = 'BAR',
  height = 'h-64'
}) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
        <div className="flex items-center gap-2">
          {type === 'BAR' && <BarChart2 size={18} className="text-[#2563eb]" />}
          {type === 'DONUT' && <PieChart size={18} className="text-purple-600" />}
          {type === 'LINE' && <Activity size={18} className="text-emerald-600" />}
          <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white">{title}</h4>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#faf8ff] dark:bg-gray-800 text-[#737686] uppercase">
          LIVE TELEMETRY
        </span>
      </div>

      {/* Illustrated Chart Area */}
      <div className={`${height} w-full bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-dashed border-[#c3c6d7] dark:border-gray-800 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
        {type === 'BAR' && (
          <div className="flex items-end justify-center gap-3 w-full h-36 px-8">
            <div className="w-12 bg-blue-200 dark:bg-blue-900 rounded-t-lg h-24 group-hover:bg-[#2563eb] transition-all" />
            <div className="w-12 bg-purple-200 dark:bg-purple-900 rounded-t-lg h-32 group-hover:bg-purple-600 transition-all" />
            <div className="w-12 bg-emerald-200 dark:bg-emerald-900 rounded-t-lg h-20 group-hover:bg-emerald-600 transition-all" />
            <div className="w-12 bg-amber-200 dark:bg-amber-900 rounded-t-lg h-28 group-hover:bg-amber-500 transition-all" />
            <div className="w-12 bg-rose-200 dark:bg-rose-900 rounded-t-lg h-16 group-hover:bg-rose-600 transition-all" />
          </div>
        )}
        {type === 'DONUT' && (
          <div className="w-36 h-36 rounded-full border-8 border-[#2563eb] border-r-purple-600 border-b-emerald-500 border-l-amber-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <span className="font-mono font-black text-xs text-[#191b23] dark:text-white">100% SLA</span>
          </div>
        )}
        {type === 'LINE' && (
          <div className="w-full h-36 flex items-center justify-center relative">
            <svg className="w-full h-28 stroke-[#2563eb] fill-none stroke-2" viewBox="0 0 100 30">
              <path d="M0,25 Q20,5 40,20 T80,10 T100,15" />
            </svg>
            <span className="absolute bottom-2 font-mono text-[10px] text-emerald-600 font-bold bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-2xs">
              Resolution Time Trend: -1.4 hrs vs Q2
            </span>
          </div>
        )}
        <span className="text-[11px] font-mono text-[#737686] mt-3 block">
          Interactive AWS OpenSearch &amp; ServiceNow AI Aggregation Feed
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#737686] pt-1">
        <span>Updated automatically every 60s</span>
        <button className="text-[#2563eb] hover:underline font-bold">Export Raw Data →</button>
      </div>
    </div>
  );
};
