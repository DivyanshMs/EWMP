import React from 'react';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, PlusCircle, UserPlus, Layers, Calendar, ArrowRight, FolderKanban, Activity, Zap, BarChart2 } from 'lucide-react';
import { AnalyticsCard, TaskCard } from '../components/TaskCards';
import { PriorityBadge, StatusBadge } from '../components/TaskBadges';

/**
 * TaskDashboardPage.jsx
 * Executive Command Center for EWMP Task Management.
 * Displays My Tasks, Assigned Tasks, Completed Today, Overdue Tasks, High Priority Tasks, Upcoming Deadlines, Recent Activity, and Quick Actions.
 */

export const TaskDashboardPage = ({ 
  tasks = [], 
  onSelectTask, 
  onCreateTask, 
  onAssignTask, 
  onCreateSprint,
  onNavigateTab
}) => {
  // Calculate KPI summary counts
  const myTasksCount = tasks.filter(t => t.assignee === 'Alex Turner').length || 8;
  const assignedTasksCount = tasks.length || 24;
  const completedTodayCount = tasks.filter(t => t.status === 'COMPLETED').length || 6;
  const overdueCount = tasks.filter(t => t.dueDate?.includes('Overdue') || t.dueDate?.includes('Yesterday')).length || 3;
  const highPriorityCount = tasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length || 9;

  // Filter lists for quick preview cards
  const highPriorityTasks = tasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').slice(0, 3);
  const upcomingDeadlines = tasks.filter(t => t.status !== 'COMPLETED').slice(0, 4);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner & Quick Actions Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200">
              JIRA & LINEAR SYNCED
            </span>
            <span className="text-xs text-[#737686] font-mono">Q3 Deliverable Command Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Workforce Deliverables & Sprint Dashboard
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor real-time task completion velocities, SLA compliance, and cross-department team workload capacity.
          </p>
        </div>

        {/* Primary Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onCreateTask && onCreateTask()}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <PlusCircle size={15} /> Create Task
          </button>
          <button
            onClick={() => onAssignTask && onAssignTask()}
            className="px-4 py-2 bg-[#ffffff] dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UserPlus size={15} /> Assign Task
          </button>
          <button
            onClick={() => onCreateSprint && onCreateSprint()}
            className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-colors"
          >
            <Layers size={15} /> Create Sprint
          </button>
        </div>
      </div>

      {/* KPI Cards Row (5 Columns on Large Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        <AnalyticsCard 
          title="My Tasks" 
          value={myTasksCount} 
          subtitle="Assigned to your profile"
          icon={CheckSquare}
          change="+2 from yesterday"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard 
          title="Assigned Tasks" 
          value={assignedTasksCount} 
          subtitle="Total team backlog"
          icon={FolderKanban}
          change="85% SLA compliant"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <AnalyticsCard 
          title="Completed Today" 
          value={completedTodayCount} 
          subtitle="Verified QA deliverables"
          icon={CheckCircle2}
          change="+15% Q3 velocity"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard 
          title="Overdue Tasks" 
          value={overdueCount} 
          subtitle="Requires immediate escalation"
          icon={Clock}
          change="-1 resolved today"
          trend="down"
          color="text-rose-600"
          bg="bg-rose-50 dark:bg-rose-950/60"
        />
        <AnalyticsCard 
          title="High Priority" 
          value={highPriorityCount} 
          subtitle="Urgent P0 / P1 tickets"
          icon={AlertCircle}
          change="3 critical blockers"
          trend="down"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Secondary Quick Action Grid */}
      <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <span className="font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> Platform Quick Shortcuts:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onNavigateTab && onNavigateTab('kanban')}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-gray-200 flex items-center gap-1.5"
          >
            <Layers size={14} className="text-[#2563eb]" /> Open Kanban Board
          </button>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('directory')}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-gray-200 flex items-center gap-1.5"
          >
            <CheckSquare size={14} className="text-purple-600" /> Task Directory Table
          </button>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('workload')}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-gray-200 flex items-center gap-1.5"
          >
            <Activity size={14} className="text-emerald-600" /> Team Workload Matrix
          </button>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('analytics')}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-gray-200 flex items-center gap-1.5"
          >
            <BarChart2 size={14} className="text-amber-600" /> Portfolio Analytics
          </button>
        </div>
      </div>

      {/* Main Two-Column Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: High Priority Tasks & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* High Priority Tasks Box */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <AlertCircle className="text-rose-600" size={18} /> High Priority & Critical Blockers
              </h3>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('directory')}
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                View all P0/P1 <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {highPriorityTasks.map((t) => (
                <TaskCard key={t.id} task={t} onSelect={onSelectTask} />
              ))}
              {highPriorityTasks.length === 0 && (
                <p className="col-span-2 text-center text-gray-400 font-mono py-8 text-xs">Zero critical P0 blockers! All systems operating nominally.</p>
              )}
            </div>
          </div>

          {/* Upcoming Deadlines Table */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Clock className="text-amber-500" size={18} /> Upcoming Sprint Deadlines
              </h3>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('calendar')}
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                Open Calendar View <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
              {upcomingDeadlines.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => onSelectTask && onSelectTask(t)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-extrabold text-[#2563eb]">{t.id}</span>
                      <span className="text-[#737686]">●</span>
                      <span className="text-[#737686] truncate">{t.project}</span>
                    </div>
                    <p className="font-bold text-sm text-[#191b23] dark:text-white truncate">{t.title}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <PriorityBadge priority={t.priority} size="sm" />
                    <StatusBadge status={t.status} size="sm" />
                    <span className="font-mono text-xs font-bold text-[#191b23] dark:text-gray-200 min-w-[90px] text-right">
                      ⏰ {t.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Recent Activity Feed & Sprint Telemetry */}
        <div className="space-y-6">
          {/* Recent Activity Feed */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Activity className="text-[#2563eb]" size={18} /> Recent Task Activity
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">● LIVE FEED</span>
            </div>

            <div className="space-y-4 py-1 text-xs">
              {[
                { user: 'Alex Turner', action: 'moved', target: 'TSK-1042 to In Review', time: '10m ago', icon: '🔄' },
                { user: 'Samantha Wu', action: 'completed subtask on', target: 'TSK-201 Postgres DB Partitioning', time: '42m ago', icon: '✓' },
                { user: 'Elena Rostova', action: 'created bug report', target: 'TSK-309 JWT Expiration Vulnerability', time: '2h ago', icon: '🐛' },
                { user: 'David Chen', action: 'attached SLA doc to', target: 'TSK-114 Client CIO Review Prep', time: '3h ago', icon: '📎' },
                { user: 'Michael Vance', action: 'deployed QA build for', target: 'Sprint 24 Deliverables', time: '5h ago', icon: '🚀' }
              ].map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed]/60">
                  <span className="text-base shrink-0">{act.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#191b23] dark:text-gray-200">
                      <strong className="font-bold text-[#2563eb]">{act.user}</strong> {act.action} <strong className="font-semibold text-[#191b23] dark:text-white">{act.target}</strong>
                    </p>
                    <span className="text-[10px] font-mono text-[#737686] block mt-0.5">{act.time} via EWMP Web App</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sprint Health Widget */}
          <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white rounded-2xl p-6 shadow-md space-y-4 font-sans relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 transform skew-x-12 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-white/20 text-white uppercase tracking-wider">
                Active Sprint 24
              </span>
              <span className="text-xs font-mono font-semibold text-blue-100">Ends Q3 Jul 31</span>
            </div>
            
            <div className="relative z-10">
              <h4 className="text-lg font-extrabold tracking-tight">Q3 Enterprise Workforce Sprint</h4>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                68 of 82 scheduled deliverables completed across engineering & HR workstreams.
              </p>
            </div>

            <div className="space-y-1.5 relative z-10 font-mono">
              <div className="flex justify-between text-xs font-bold">
                <span>Velocity Benchmark</span>
                <span>83% Utilized</span>
              </div>
              <div className="w-full bg-blue-950/40 h-2.5 rounded-full overflow-hidden p-0.5">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '83%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
