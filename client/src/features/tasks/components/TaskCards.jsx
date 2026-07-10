import React from 'react';
import { TrendingUp, TrendingDown, Clock, CheckSquare, MessageSquare, FolderKanban, BarChart2, PieChart } from 'lucide-react';
import { PriorityBadge, StatusBadge, TagChip } from './TaskBadges';

/**
 * TaskCards.jsx
 * Reusable task cards, Kanban cards, analytics KPI widgets, and chart placeholders for EWMP Task Management.
 */

export const AnalyticsCard = ({ title, value, subtitle, icon: Icon, change, trend = 'neutral', color = 'text-[#2563eb]', bg = 'bg-blue-50 dark:bg-blue-950/60' }) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs hover:border-gray-400 dark:hover:border-gray-600 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#737686] dark:text-gray-400 uppercase tracking-wider font-sans">{title}</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191b23] dark:text-white mt-1.5 font-mono tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${bg} ${color} border border-[#e1e2ed]/60 shrink-0`}>
            <Icon size={22} />
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800 flex items-center justify-between text-xs">
        {subtitle && <span className="text-[#737686] font-sans truncate">{subtitle}</span>}
        {change && (
          <span className={`inline-flex items-center gap-1 font-mono font-bold ${
            isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-[#737686]'
          }`}>
            {isUp ? <TrendingUp size={13} /> : isDown ? <TrendingDown size={13} /> : null}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, color = 'bg-[#2563eb]' }) => {
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size] || 'h-2';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-mono font-semibold">
          <span className="text-[#737686]">Checklist Progress</span>
          <span className="text-[#191b23] dark:text-white">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden ${heightClass}`}>
        <div 
          className={`${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export const TaskCard = ({ task, onSelect, onEdit, onComplete }) => {
  const t = task || {
    id: 'TSK-1042',
    title: 'Implement OAuth 2.0 PKCE challenge verification for iOS client API',
    project: 'PRJ-101 (EWMP Core Engine)',
    assignee: 'Alex Turner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    dueDate: 'Today at 5:00 PM',
    progress: 75,
    checklistDone: 3,
    checklistTotal: 4,
    commentsCount: 8,
    tags: ['Security', 'API', 'iOS']
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(t)}
      className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#2563eb]/60 dark:hover:border-blue-500/60 transition-all cursor-pointer space-y-4 group"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200">
            {t.id}
          </span>
          <span className="text-[11px] font-mono font-semibold text-[#737686] flex items-center gap-1 truncate max-w-[180px]">
            <FolderKanban size={13} className="text-gray-400" /> {t.project}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <PriorityBadge priority={t.priority} size="sm" />
          <StatusBadge status={t.status} size="sm" />
        </div>
      </div>

      {/* Task Title */}
      <h4 className="font-bold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors line-clamp-2 leading-snug">
        {t.title}
      </h4>

      {/* Tags */}
      {t.tags && t.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {t.tags.map((tag, idx) => (
            <TagChip key={idx} tag={tag} />
          ))}
        </div>
      )}

      {/* Checklist Progress Bar */}
      {t.checklistTotal > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#737686]">
            <span className="flex items-center gap-1"><CheckSquare size={13} /> Subtasks: {t.checklistDone} of {t.checklistTotal} completed</span>
            <span className="font-bold text-[#191b23] dark:text-white">{Math.round((t.checklistDone / t.checklistTotal) * 100)}%</span>
          </div>
          <ProgressBar progress={Math.round((t.checklistDone / t.checklistTotal) * 100)} size="sm" showLabel={false} color={t.checklistDone === t.checklistTotal ? 'bg-emerald-600' : 'bg-[#2563eb]'} />
        </div>
      )}

      {/* Footer Meta Row */}
      <div className="pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800 flex items-center justify-between text-xs text-[#737686] font-mono">
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 ${t.dueDate?.includes('Today') || t.dueDate?.includes('Overdue') ? 'text-rose-600 font-bold' : ''}`}>
            <Clock size={13} /> {t.dueDate}
          </span>
          {t.commentsCount > 0 && (
            <span className="flex items-center gap-1 text-[#737686]">
              <MessageSquare size={13} /> {t.commentsCount}
            </span>
          )}
        </div>

        {/* Assignee Avatar & Name */}
        <div className="flex items-center gap-2 font-sans font-semibold text-[#191b23] dark:text-gray-200" title={`Assigned to ${t.assignee}`}>
          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold text-[10px] uppercase border border-blue-300">
            {t.assignee ? t.assignee.charAt(0) : 'U'}
          </div>
          <span className="text-xs truncate max-w-[100px]">{t.assignee || 'Unassigned'}</span>
        </div>
      </div>
    </div>
  );
};

export const KanbanCard = ({ task, onSelect, onMove, onComplete }) => {
  const t = task || {
    id: 'TSK-201',
    title: 'Migrate PostgreSQL legacy schema to multi-tenant partitioning',
    project: 'PRJ-101 (Core Engine)',
    assignee: 'Samantha Wu',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: 'Jul 15',
    checklistDone: 4,
    checklistTotal: 5,
    commentsCount: 3,
    attachmentsCount: 2,
    tags: ['Database', 'Postgres']
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(t)}
      className="bg-[#ffffff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-3.5 shadow-xs hover:shadow-md hover:border-[#2563eb] transition-all cursor-pointer space-y-2.5 group relative"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-extrabold text-[#2563eb]">
          {t.id}
        </span>
        <div className="flex items-center gap-1">
          <PriorityBadge priority={t.priority} size="sm" />
        </div>
      </div>

      {/* Task Title */}
      <h5 className="font-bold text-xs text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors leading-relaxed">
        {t.title}
      </h5>

      {/* Project & Tags */}
      <div className="flex flex-wrap items-center gap-1 pt-0.5">
        <span className="text-[10px] font-mono text-[#737686] bg-[#faf8ff] dark:bg-gray-900 px-1.5 py-0.5 rounded border border-[#e1e2ed]/60 truncate max-w-[140px]">
          📁 {t.project}
        </span>
        {t.tags && t.tags.slice(0, 2).map((tg, i) => (
          <span key={i} className="text-[9px] font-mono bg-blue-50/60 dark:bg-blue-950/40 text-[#2563eb] px-1.5 py-0.5 rounded font-semibold">
            #{tg}
          </span>
        ))}
      </div>

      {/* Footer Info Row */}
      <div className="pt-2 border-t border-[#e1e2ed]/60 dark:border-gray-800 flex items-center justify-between text-[11px] text-[#737686] font-mono">
        <div className="flex items-center gap-2">
          {t.dueDate && (
            <span className={`flex items-center gap-1 ${t.dueDate?.includes('Today') || t.dueDate?.includes('Overdue') ? 'text-rose-600 font-bold' : ''}`}>
              <Clock size={11} /> {t.dueDate}
            </span>
          )}
          {t.checklistTotal > 0 && (
            <span className="flex items-center gap-0.5" title="Checklist progress">
              <CheckSquare size={11} className={t.checklistDone === t.checklistTotal ? 'text-emerald-600' : ''} /> {t.checklistDone}/{t.checklistTotal}
            </span>
          )}
          {t.commentsCount > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare size={11} /> {t.commentsCount}
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        <div className="w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-[9px] uppercase shadow-2xs" title={t.assignee || 'Unassigned'}>
          {t.assignee ? t.assignee.charAt(0) : '?'}
        </div>
      </div>
    </div>
  );
};

export const ChartPlaceholder = ({ title, type = 'BAR', height = 'h-72' }) => {
  const isPie = type === 'PIE' || type === 'DONUT';

  return (
    <div className={`bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col justify-between ${height}`}>
      <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
        <div>
          <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
            {isPie ? <PieChart size={16} className="text-[#2563eb]" /> : <BarChart2 size={16} className="text-[#2563eb]" />}
            {title}
          </h4>
          <p className="text-xs text-[#737686] mt-0.5 font-mono">Real-time enterprise task telemetry sync</p>
        </div>
        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] text-[10px] font-mono font-bold rounded border border-blue-200">
          LIVE TELEMETRY
        </span>
      </div>

      {/* Simulated Chart Body */}
      <div className="flex-1 flex items-center justify-center py-6">
        {isPie ? (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-36 h-36 rounded-full border-[18px] border-[#2563eb] border-r-purple-500 border-b-emerald-500 border-l-amber-500 relative flex items-center justify-center shadow-inner animate-pulse">
              <span className="text-xs font-mono font-extrabold text-[#191b23] dark:text-white">100% SLA</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#2563eb]" /> <span>Completed (55%)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500" /> <span>In Progress (25%)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" /> <span>In Review (12%)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500" /> <span>Backlog (8%)</span></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-end justify-between gap-3 px-4 pt-4 border-b border-l border-[#e1e2ed] dark:border-gray-800">
            {[45, 68, 85, 52, 92, 74, 100].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-[#737686] opacity-0 group-hover:opacity-100 transition-opacity">{val}%</span>
                <div 
                  className="w-full bg-[#2563eb] hover:bg-[#004ac6] dark:bg-blue-600 rounded-t transition-all duration-500 relative"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
                </div>
                <span className="text-[10px] font-mono text-[#737686]">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-[11px] text-[#737686] font-mono">
        <span>Audited against Jira & Linear SLA metrics</span>
        <span className="text-emerald-600 font-bold">● Synchronized</span>
      </div>
    </div>
  );
};
