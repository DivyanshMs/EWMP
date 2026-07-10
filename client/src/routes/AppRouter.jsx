import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { PageLoader } from '../components/shared';

// Error Pages
import NotFoundPage from '../features/errors/NotFoundPage';
import ForbiddenPage from '../features/errors/ForbiddenPage';
import ServerErrorPage from '../features/errors/ServerErrorPage';

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const ExecutiveDashboard = lazyNamed(() => import('../features/dashboard'), 'ExecutiveDashboard');
const OrganizationModule = lazyNamed(() => import('../features/organization'), 'OrganizationModule');
const EmployeeModule = lazyNamed(() => import('../features/employees'), 'EmployeeModule');
const AttendanceModule = lazyNamed(() => import('../features/attendance'), 'AttendanceModule');
const LeaveModule = lazyNamed(() => import('../features/leave'), 'LeaveModule');
const PayrollModule = lazyNamed(() => import('../features/payroll'), 'PayrollModule');
const PerformanceModule = lazyNamed(() => import('../features/performance'), 'PerformanceModule');
const RecruitmentModule = lazyNamed(() => import('../features/recruitment'), 'RecruitmentModule');
const ProjectsModule = lazyNamed(() => import('../features/projects'), 'ProjectsModule');
const TasksModule = lazyNamed(() => import('../features/tasks'), 'TasksModule');
const AssetsModule = lazyNamed(() => import('../features/assets'), 'AssetsModule');
const DocumentsModule = lazyNamed(() => import('../features/documents'), 'DocumentsModule');
const NotificationsModule = lazyNamed(() => import('../features/notifications'), 'NotificationsModule');
const HelpDeskModule = lazyNamed(() => import('../features/helpdesk'), 'HelpDeskModule');
const ReportsModule = lazyNamed(() => import('../features/reports'), 'ReportsModule');
const AIAssistantModule = lazyNamed(() => import('../features/ai-assistant'), 'AIAssistantModule');
const SettingsModule = lazyNamed(() => import('../features/settings'), 'SettingsModule');

/**
 * AppRouter.jsx
 * Centralized routing for EWMP. All routes in one place.
 * - Public routes: /login, /forgot-password, /reset-password/:token
 * - Error routes: /403, /500 (public, accessible without auth)
 * - Protected routes: Everything else, wrapped in ProtectedRoute guard.
 * - Settings/Admin hub: Standalone layout (no Sidebar/Topbar).
 * - Module routes: All use DashboardLayout (Sidebar + Topbar).
 * 
 * Route deduplication: Use "/*" suffix only for modules that render internal sub-routes.
 * React Router v6 handles prefix matching with "/*" correctly.
 */
const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader message="Loading module..." />}>
      <Routes>
      {/* ── Public Routes ─────────────────────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ── Error Routes (public) ─────────────────────────────────────────── */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />

      {/* ── Protected Routes ──────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>

        {/* Settings & Administration Hub — Standalone layout (no Sidebar/Topbar) */}
        <Route path="/settings/*" element={<SettingsModule />} />
        <Route path="/admin/*" element={<SettingsModule />} />
        {/* Quick-access shortcut routes that open specific settings tabs */}
        <Route path="/profile" element={<SettingsModule initialTab="profile" />} />
        <Route path="/change-password" element={<SettingsModule initialTab="account" />} />
        <Route path="/account" element={<SettingsModule initialTab="account" />} />

        {/* Main Module Routes — All share DashboardLayout (Sidebar + Topbar) */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/organization/*" element={<OrganizationModule />} />
          <Route path="/employees/*" element={<EmployeeModule />} />
          <Route path="/attendance/*" element={<AttendanceModule />} />
          <Route path="/leave/*" element={<LeaveModule />} />
          <Route path="/payroll/*" element={<PayrollModule />} />
          <Route path="/performance/*" element={<PerformanceModule />} />
          <Route path="/recruitment/*" element={<RecruitmentModule />} />
          <Route path="/projects/*" element={<ProjectsModule />} />
          <Route path="/tasks/*" element={<TasksModule />} />
          <Route path="/assets/*" element={<AssetsModule />} />
          <Route path="/documents/*" element={<DocumentsModule />} />
          <Route path="/notifications/*" element={<NotificationsModule />} />
          <Route path="/helpdesk/*" element={<HelpDeskModule />} />
          <Route path="/reports/*" element={<ReportsModule />} />
          <Route path="/ai-assistant/*" element={<AIAssistantModule />} />
        </Route>
      </Route>

      {/* ── Fallback 404 ──────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
