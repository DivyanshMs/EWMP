/**
 * Enterprise Workforce Management Platform (EWMP) — Dashboard Feature Module
 * Exports the Executive Dashboard, modular widgets, analytics suites, and reusable chart placeholders.
 */

export { ExecutiveDashboard, default as DashboardPage } from './ExecutiveDashboard';

// Widgets
export { KpiSection } from './widgets/KpiSection';
export { AiInsightsPanel } from './widgets/AiInsightsPanel';
export { QuickActionsWidget } from './widgets/QuickActionsWidget';
export { ActivityTimelineWidget } from './widgets/ActivityTimelineWidget';
export { NotificationSummaryWidget } from './widgets/NotificationSummaryWidget';

// Analytics
export { AttendanceAnalyticsWidget } from './analytics/AttendanceAnalyticsWidget';
export { PayrollAnalyticsWidget } from './analytics/PayrollAnalyticsWidget';
export { LeaveAnalyticsWidget } from './analytics/LeaveAnalyticsWidget';
export { RecruitmentAnalyticsWidget } from './analytics/RecruitmentAnalyticsWidget';
export { ProjectsAnalyticsWidget } from './analytics/ProjectsAnalyticsWidget';
export { TasksAnalyticsWidget } from './analytics/TasksAnalyticsWidget';
export { HelpDeskAnalyticsWidget } from './analytics/HelpDeskAnalyticsWidget';

// Charts & States
export * from './charts/ChartsPlaceholders';
export * from './states/DashboardStates';
