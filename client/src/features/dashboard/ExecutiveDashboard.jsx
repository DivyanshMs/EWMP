import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  BarChart2, 
  RefreshCw,
  Sliders
} from 'lucide-react';

// Dashboard Widgets
import { KpiSection } from './widgets/KpiSection';
import { AiInsightsPanel } from './widgets/AiInsightsPanel';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { ActivityTimelineWidget } from './widgets/ActivityTimelineWidget';
import { NotificationSummaryWidget } from './widgets/NotificationSummaryWidget';

// Analytics Components
import { AttendanceAnalyticsWidget } from './analytics/AttendanceAnalyticsWidget';
import { PayrollAnalyticsWidget } from './analytics/PayrollAnalyticsWidget';
import { LeaveAnalyticsWidget } from './analytics/LeaveAnalyticsWidget';
import { RecruitmentAnalyticsWidget } from './analytics/RecruitmentAnalyticsWidget';
import { ProjectsAnalyticsWidget } from './analytics/ProjectsAnalyticsWidget';
import { TasksAnalyticsWidget } from './analytics/TasksAnalyticsWidget';
import { HelpDeskAnalyticsWidget } from './analytics/HelpDeskAnalyticsWidget';

// UI States
import { 
  DashboardLoadingState, 
  DashboardNoDataState, 
  DashboardErrorState, 
  DashboardOfflineState 
} from './states/DashboardStates';

/**
 * ExecutiveDashboard.jsx
 * Enterprise Workforce Management Platform (EWMP) — Lead Product Design implementation.
 * Acts as the central executive hub providing real-time operational telemetry, autonomous AI governance,
 * cross-module analytics, and one-click workflow triggers.
 */

export const ExecutiveDashboard = () => {
  const navigate = useNavigate();

  // Navigation tab state for analytics sections
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('all');
  
  // Interactive UI State Preview (Normal | Loading | NoData | Error | Offline)
  const [dashboardState, setDashboardState] = useState('normal');

  // Current session metadata (in production, retrieved from AuthContext)
  const { user } = useAuth();
  
  const sessionData = {
    user: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Executive User',
    role: user?.role || 'Executive',
    organization: user?.organization?.name || 'Enterprise Organization',
    date: new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date()),
  };

  const handleOpenAiWorkspace = () => {
    navigate('/ai-assistant');
  };

  const handleQuickAction = (actionName) => {
    const routeMap = {
      'Create Employee': '/employees',
      'Approve Leave': '/leave',
      'Run Payroll': '/payroll',
      'Add Project': '/projects',
      'Create Task': '/tasks',
      'Upload Document': '/documents',
      'Create Announcement': '/notifications',
      'Open AI Assistant': '/ai-assistant',
    };

    const targetRoute = routeMap[actionName];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* ---------------------------------------------------- */}
      {/* DESIGNER STATE PREVIEW BAR (For QA & Review Purposes) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
        <div className="flex items-center gap-2">
          <Sliders size={14} className="text-indigo-400" />
          <span className="font-semibold text-white">Design System State Preview:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['normal', 'loading', 'nodata', 'error', 'offline'].map((st) => (
            <button
              key={st}
              onClick={() => setDashboardState(st)}
              className={`px-3 py-1 rounded-md font-mono uppercase tracking-wider transition-all ${
                dashboardState === st
                  ? 'bg-indigo-600 text-white shadow font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {st === 'nodata' ? 'No Data' : st}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TOP EXECUTIVE WELCOME HEADER                         */}
      {/* ---------------------------------------------------- */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800/40">
              <Building2 size={13} className="text-blue-600 dark:text-blue-400" />
              {sessionData.organization}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800/40">
              <ShieldCheck size={13} className="text-purple-600 dark:text-purple-400" />
              {sessionData.role}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome back, {sessionData.user}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
            Here is your enterprise operational overview and autonomous AI governance telemetry for today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-mono font-medium text-gray-700 dark:text-gray-300 shadow-sm">
            <Calendar size={15} className="text-blue-600 dark:text-blue-400" />
            {sessionData.date}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl shadow-sm transition-all duration-200"
          >
            <RefreshCw size={14} className="text-gray-500" />
            Sync Telemetry
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* OFFLINE STATE BANNER (If state === offline)          */}
      {/* ---------------------------------------------------- */}
      {dashboardState === 'offline' && <DashboardOfflineState />}

      {/* ---------------------------------------------------- */}
      {/* LOADING STATE PREVIEW                                */}
      {/* ---------------------------------------------------- */}
      {dashboardState === 'loading' && <DashboardLoadingState />}

      {/* ---------------------------------------------------- */}
      {/* NO DATA STATE PREVIEW                                */}
      {/* ---------------------------------------------------- */}
      {dashboardState === 'nodata' && (
        <DashboardNoDataState onSetupAction={() => setDashboardState('normal')} />
      )}

      {/* ---------------------------------------------------- */}
      {/* ERROR STATE PREVIEW                                  */}
      {/* ---------------------------------------------------- */}
      {dashboardState === 'error' && (
        <DashboardErrorState onRetry={() => setDashboardState('normal')} />
      )}

      {/* ---------------------------------------------------- */}
      {/* NORMAL EXECUTIVE DASHBOARD CONTENT                   */}
      {/* ---------------------------------------------------- */}
      {(dashboardState === 'normal' || dashboardState === 'offline') && (
        <div className="space-y-8 animate-fade-in">
          
          {/* 1. TOP KPI SECTION (9 Responsive Cards) */}
          <KpiSection />

          {/* 2. FLAGSHIP AI INSIGHTS PANEL */}
          <section className="pt-2">
            <AiInsightsPanel onOpenAiWorkspace={handleOpenAiWorkspace} />
          </section>

          {/* 3. EXECUTIVE QUICK ACTIONS */}
          <QuickActionsWidget onActionTrigger={handleQuickAction} />

          {/* 4. ACTIVITY TIMELINE & NOTIFICATION SUMMARY ROW */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            <div className="lg:col-span-2">
              <ActivityTimelineWidget />
            </div>
            <div>
              <NotificationSummaryWidget />
            </div>
          </section>

          {/* 5. CROSS-MODULE ENTERPRISE ANALYTICS SUITE */}
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  <BarChart2 size={24} className="text-blue-600 dark:text-blue-400" />
                  Comprehensive Module Analytics Suite
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Deep dive operational performance across HR, Finance, Projects, and IT Support
                </p>
              </div>

              {/* Module Analytics Filter Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#151515] p-1.5 rounded-xl border border-gray-200 dark:border-gray-800/80 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Modules' },
                  { id: 'attendance', label: 'Attendance' },
                  { id: 'payroll', label: 'Payroll' },
                  { id: 'leave', label: 'Leave' },
                  { id: 'recruitment', label: 'Recruitment' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'tasks', label: 'Tasks' },
                  { id: 'helpdesk', label: 'Helpdesk' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAnalyticsTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeAnalyticsTab === tab.id
                        ? 'bg-white dark:bg-[#222] text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analytics Widgets Render Area */}
            <div className="space-y-8">
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'attendance') && (
                <AttendanceAnalyticsWidget />
              )}
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'payroll') && (
                <PayrollAnalyticsWidget />
              )}
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'leave') && (
                <LeaveAnalyticsWidget />
              )}
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'recruitment') && (
                <RecruitmentAnalyticsWidget />
              )}
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'projects') && (
                <ProjectsAnalyticsWidget />
              )}
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'tasks') && (
                <TasksAnalyticsWidget />
              )}
              {(activeAnalyticsTab === 'all' || activeAnalyticsTab === 'helpdesk') && (
                <HelpDeskAnalyticsWidget />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDashboard;
