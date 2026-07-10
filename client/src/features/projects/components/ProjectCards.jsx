import React from 'react';
import { Calendar, Users, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ProjectStatusBadge, ProjectHealthBadge, PriorityBadge, MilestoneStatusBadge } from './ProjectBadges';

/**
 * ProjectCards.jsx
 * Reusable enterprise cards, milestone widgets, team member cards, and chart placeholders for EWMP Projects.
 * Follows Stitch MCP Precision Enterprise tokens (#2563eb, rounded-xl, Inter font).
 */

export const ProgressBar = ({ progress = 0, color = 'bg-[#2563eb]', showLabel = true, size = 'md' }) => {
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono mb-1">
          <span className="text-[#737686]">Completion</span>
          <span className="font-bold text-[#191b23] dark:text-white">{progress}%</span>
        </div>
      )}
      <div className={`w-full ${heightClass} bg-[#faf8ff] dark:bg-[#161616] rounded-full overflow-hidden border border-[#e1e2ed]/50 dark:border-gray-800`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export const ProjectCard = ({ project, onSelect, onAction }) => {
  if (!project) return null;
  const { name, client, projectManager, department, priority, budget, spent, startDate, endDate, status, health, progress, teamSize = 6 } = project;

  return (
    <div 
      onClick={() => onSelect && onSelect(project)}
      className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 hover:border-[#2563eb] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#737686]">
            <span className="font-bold text-[#2563eb]">{project.id || 'PRJ-101'}</span>
            <span>•</span>
            <span>{department}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <PriorityBadge priority={priority} />
            <ProjectHealthBadge health={health} />
          </div>
        </div>

        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5 font-sans">
          Client: <strong className="text-[#191b23] dark:text-gray-200">{client}</strong>
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
        <ProgressBar progress={progress} color={health === 'OFF_TRACK' ? 'bg-rose-600' : health === 'AT_RISK' ? 'bg-amber-500' : 'bg-[#2563eb]'} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-[#faf8ff] dark:bg-gray-900/40 p-2.5 rounded-lg border border-[#e1e2ed]/60 dark:border-gray-800">
          <div>
            <span className="text-[10px] text-[#737686] block uppercase">Budget Usage</span>
            <strong className="text-[#191b23] dark:text-white">${(spent/1000).toFixed(1)}k / ${(budget/1000).toFixed(1)}k</strong>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#737686] block uppercase">Target End</span>
            <strong className="text-[#191b23] dark:text-white">{endDate}</strong>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#2563eb]/10 text-[#2563eb] font-extrabold text-[10px] flex items-center justify-center font-mono">
              {projectManager ? projectManager.split(' ').map(n=>n[0]).join('').slice(0,2) : 'PM'}
            </div>
            <span className="text-[#434655] dark:text-gray-300 font-medium truncate max-w-[130px]">{projectManager}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#737686] bg-[#ededf9] dark:bg-gray-800 px-2 py-0.5 rounded">
            <Users size={11} /> {teamSize}
          </span>
        </div>
      </div>
    </div>
  );
};

export const MilestoneCard = ({ milestone, onToggle, onEdit }) => {
  if (!milestone) return null;
  const { title, dueDate, progress, status, dependencies, phase } = milestone;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-2xs hover:border-[#2563eb] transition-all flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-[#2563eb] block mb-0.5">{phase || 'Phase 1: Architecture'}</span>
          <h4 className="font-bold text-sm text-[#191b23] dark:text-white">{title}</h4>
        </div>
        <MilestoneStatusBadge status={status} />
      </div>

      <ProgressBar progress={progress} size="sm" color={status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-[#2563eb]'} />

      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-[#737686]">
        <span className="flex items-center gap-1"><Calendar size={13} className="text-[#2563eb]" /> Due: <strong className="text-[#191b23] dark:text-white">{dueDate}</strong></span>
        {dependencies && (
          <span className="text-amber-600 font-semibold text-[11px]">⚠️ Depends on #{dependencies}</span>
        )}
      </div>
    </div>
  );
};

export const BudgetCard = ({ title, allocated, spent, remaining, currency = '$' }) => {
  const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
  const isOver = spent > allocated;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4 font-mono">
      <div className="flex justify-between items-start font-sans">
        <div>
          <span className="text-xs font-bold text-[#737686] uppercase tracking-wider block">{title || 'Consolidated Project Budget'}</span>
          <h3 className="text-2xl font-extrabold text-[#191b23] dark:text-white mt-0.5">{currency}{allocated.toLocaleString()}</h3>
        </div>
        <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${isOver ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
          {pct}% Utilized
        </span>
      </div>

      <ProgressBar progress={pct} color={isOver ? 'bg-rose-600' : pct > 85 ? 'bg-amber-500' : 'bg-emerald-600'} showLabel={false} size="lg" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#e1e2ed] dark:border-gray-800 text-xs">
        <div className="p-2.5 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60">
          <span className="text-[10px] text-[#737686] block uppercase">Total Spent</span>
          <strong className="text-sm text-rose-600 font-extrabold">{currency}{spent.toLocaleString()}</strong>
        </div>
        <div className="p-2.5 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60">
          <span className="text-[10px] text-[#737686] block uppercase">Remaining Buffer</span>
          <strong className="text-sm text-emerald-600 font-extrabold">{currency}{remaining.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};

export const TeamMemberCard = ({ member, onRemove, onInspect }) => {
  if (!member) return null;
  const { name, email, role, department, workload = 75, availability = 'Available', projectsCount = 3 } = member;

  const getAvailColor = (avail) => {
    if (avail === 'Overallocated') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200';
    if (avail === 'On Leave') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
  };

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-2xs hover:border-[#2563eb] transition-all flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563eb] to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 font-mono shadow-2xs">
            {name.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-1.5">
              {name}
            </h4>
            <span className="text-xs text-[#737686] block font-mono">{role}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getAvailColor(availability)}`}>
          {availability}
        </span>
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#737686]">Capacity Workload</span>
          <strong className={workload > 90 ? 'text-rose-600' : 'text-[#191b23] dark:text-white'}>{workload}%</strong>
        </div>
        <div className="w-full h-1.5 bg-[#faf8ff] dark:bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${workload > 90 ? 'bg-rose-600' : 'bg-[#2563eb]'} rounded-full`} style={{ width: `${Math.min(100, workload)}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#e1e2ed] dark:border-gray-800 font-mono text-[#737686]">
        <span>Dept: <strong className="text-[#191b23] dark:text-white font-sans">{department}</strong></span>
        <span>Assigned: <strong className="text-[#2563eb]">{projectsCount} Projects</strong></span>
      </div>
    </div>
  );
};

export const AnalyticsCard = ({ title, value, subtitle, icon: IconComp, change, trend = 'up' }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs hover:border-[#2563eb] transition-all flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-[#737686] uppercase tracking-wider">{title}</span>
      {IconComp && (
        <div className="p-2 rounded-lg bg-[#faf8ff] dark:bg-gray-900 text-[#2563eb] border border-[#e1e2ed]/50">
          <IconComp size={18} />
        </div>
      )}
    </div>
    <div className="my-3">
      <span className="text-2xl sm:text-3xl font-extrabold text-[#191b23] dark:text-white tracking-tight font-mono">{value}</span>
      {subtitle && <p className="text-xs text-[#737686] mt-0.5 font-sans">{subtitle}</p>}
    </div>
    {change && (
      <div className="flex items-center gap-1.5 pt-3 border-t border-[#e1e2ed] dark:border-gray-800 text-xs font-mono">
        {trend === 'up' ? (
          <ArrowUpRight size={14} className="text-emerald-600" />
        ) : (
          <ArrowDownRight size={14} className="text-rose-600" />
        )}
        <span className={trend === 'up' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{change}</span>
      </div>
    )}
  </div>
);

export const ChartPlaceholder = ({ title, height = 'h-64', type = 'BAR' }) => (
  <div className={`bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs flex flex-col justify-between ${height}`}>
    <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
      <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
        <BarChart2 size={16} className="text-[#2563eb]" /> {title}
      </h3>
      <span className="text-[11px] font-mono text-[#737686] bg-[#faf8ff] dark:bg-gray-900 px-2 py-0.5 rounded border border-[#e1e2ed]/60">
        Live Project Telemetry
      </span>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center p-4">
      {type === 'BAR' && (
        <div className="w-full h-full flex items-end justify-around gap-3 pt-6 pb-2">
          {[65, 80, 45, 90, 70, 85, 95].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-[#737686] opacity-0 group-hover:opacity-100 transition-opacity">{val}%</span>
              <div
                className="w-full bg-gradient-to-t from-[#2563eb] to-indigo-500 rounded-t-sm transition-all group-hover:brightness-110"
                style={{ height: `${val}%` }}
              />
              <span className="text-[10px] font-mono text-[#737686]">W{idx+1}</span>
            </div>
          ))}
        </div>
      )}
      {type === 'PIE' && (
        <div className="flex items-center justify-center gap-8 w-full h-full py-4">
          <div className="w-36 h-36 rounded-full border-8 border-[#2563eb] border-r-emerald-500 border-b-amber-500 border-l-purple-500 flex items-center justify-center shadow-inner">
            <span className="font-mono font-extrabold text-sm text-[#191b23] dark:text-white">100%</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2563eb]" /> <span>45% Engineering</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> <span>25% Infrastructure</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /> <span>18% Contractors</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500" /> <span>12% Travel & Ops</span></div>
          </div>
        </div>
      )}
    </div>

    <div className="pt-2 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-[11px] font-mono text-[#737686]">
      <span>Data auto-synced with Jira / Asana connectors</span>
      <span className="text-emerald-600 font-bold">● System Healthy</span>
    </div>
  </div>
);
