import React from 'react';
import { FolderKanban, PlayCircle, CheckCircle2, AlertTriangle, TrendingUp, Calendar, Users, PlusCircle, ArrowRight, Clock, Layers } from 'lucide-react';
import { AnalyticsCard, ProjectCard, MilestoneCard, BudgetCard } from '../components/ProjectCards';
import { ProjectHealthBadge, PriorityBadge } from '../components/ProjectBadges';

/**
 * ProjectDashboardPage.jsx (Page 1)
 * Executive command center for EWMP Project Management.
 * Displays KPI counts, health summary, budget usage, upcoming deadlines, active initiatives, and quick action triggers.
 */

const ProjectDashboardPage = ({ projects = [], onNavigate, onOpenCreate, onOpenAssign, onOpenMilestone }) => {
  const total = projects.length || 8;
  const active = projects.filter(p => p.status === 'ACTIVE').length || 5;
  const completed = projects.filter(p => p.status === 'COMPLETED').length || 2;
  const delayed = projects.filter(p => p.status === 'DELAYED').length || 1;

  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0) || 1850000;
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0) || 1120000;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome & Quick Actions Strip */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] text-[11px] font-mono font-bold rounded-full border border-blue-200">
              Jira / Monday / Asana Equivalent Telemetry
            </span>
            <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Q3 Execution Cycle
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191b23] dark:text-white tracking-tight">
            Enterprise Project Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#737686] dark:text-gray-400 mt-1 max-w-2xl font-sans">
            Orchestrate workforce initiatives, track milestone dependencies, monitor budget utilization SLAs, and allocate engineering capacity across global departments.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreate}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 font-sans"
          >
            <PlusCircle size={16} /> Create Project
          </button>
          <button
            onClick={onOpenAssign}
            className="px-4 py-2.5 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-1.5 transition-colors font-sans"
          >
            <Users size={16} className="text-[#2563eb]" /> Assign Team
          </button>
          <button
            onClick={onOpenMilestone}
            className="px-4 py-2.5 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-1.5 transition-colors font-sans"
          >
            <Calendar size={16} className="text-[#2563eb]" /> Create Milestone
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Initiatives"
          value={total}
          subtitle="All departments & phases"
          icon={FolderKanban}
          change="+2 new this month"
          trend="up"
        />
        <AnalyticsCard
          title="Active Projects"
          value={active}
          subtitle="Currently in execution"
          icon={PlayCircle}
          change="82% on-track velocity"
          trend="up"
        />
        <AnalyticsCard
          title="Completed Projects"
          value={completed}
          subtitle="Delivered & audited Q3"
          icon={CheckCircle2}
          change="100% SLA compliance"
          trend="up"
        />
        <AnalyticsCard
          title="Delayed / At Risk"
          value={delayed}
          subtitle="Requiring PM attention"
          icon={AlertTriangle}
          change="-1 resolved this week"
          trend="down"
        />
      </div>

      {/* Project Health & Budget Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Card (1 col) */}
        <div className="lg:col-span-1 flex flex-col justify-between">
          <BudgetCard
            title="Consolidated Q3 Budget Usage"
            allocated={totalBudget}
            spent={totalSpent}
            remaining={totalBudget - totalSpent}
          />
        </div>

        {/* Project Health Matrix (2 col) */}
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
            <div>
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-[#2563eb]" /> Enterprise Project Health Matrix
              </h3>
              <p className="text-xs text-[#737686] mt-0.5">Real-time schedule velocity and risk distribution</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('directory')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1 font-mono"
            >
              View All Projects <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4 py-4 font-mono">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase block">On Track</span>
              <span className="text-2xl font-extrabold text-emerald-800 dark:text-white mt-1 block">5 Projects</span>
              <span className="text-[11px] text-emerald-600 font-sans mt-0.5 block">62.5% of total portfolio</span>
            </div>
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase block">At Risk</span>
              <span className="text-2xl font-extrabold text-amber-800 dark:text-white mt-1 block">2 Projects</span>
              <span className="text-[11px] text-amber-600 font-sans mt-0.5 block">25.0% resource constraints</span>
            </div>
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200">
              <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold uppercase block">Off Track</span>
              <span className="text-2xl font-extrabold text-rose-800 dark:text-white mt-1 block">1 Project</span>
              <span className="text-[11px] text-rose-600 font-sans mt-0.5 block">12.5% dependency delay</span>
            </div>
            <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200">
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase block">Exceeded SLA</span>
              <span className="text-2xl font-extrabold text-purple-800 dark:text-white mt-1 block">0 Projects</span>
              <span className="text-[11px] text-purple-600 font-sans mt-0.5 block">0% audit escalations</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs text-[#737686] font-mono">
            <span>Most critical initiative: <strong className="text-[#191b23] dark:text-white font-sans">PRJ-101 (EWMP Core Engine)</strong></span>
            <span className="text-[#2563eb] font-bold">Priority: CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Active Projects & Upcoming Deadlines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Active Initiatives (2 col) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-[#2563eb]" /> Featured Active Initiatives
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('directory')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1 font-mono"
            >
              See All {total} <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((proj) => (
              <ProjectCard key={proj.id} project={proj} onSelect={() => onNavigate && onNavigate('details', proj)} />
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines & Milestones (1 col) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
              <Clock size={16} className="text-[#2563eb]" /> Upcoming Deadlines
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('milestones')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1 font-mono"
            >
              Schedule <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            <MilestoneCard
              milestone={{ title: 'Kubernetes Cluster Setup & PostgreSQL Schema', dueDate: 'July 30, 2026', progress: 80, status: 'IN_PROGRESS', dependencies: 'MLS-01', phase: 'Phase 2: Core Dev' }}
            />
            <MilestoneCard
              milestone={{ title: 'OAuth 2.0 / SSO Gateway & Time Telemetry API', dueDate: 'August 15, 2026', progress: 45, status: 'IN_PROGRESS', dependencies: 'MLS-02', phase: 'Phase 2: Core Dev' }}
            />
            <MilestoneCard
              milestone={{ title: 'SOC-2 Compliance & Penetration Testing Audit', dueDate: 'September 15, 2026', progress: 0, status: 'PENDING', dependencies: 'MLS-04', phase: 'Phase 3: Security' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;
