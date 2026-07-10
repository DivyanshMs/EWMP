
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  History,
  LayoutDashboard,
  PlusCircle,
  Timer,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

import { LeaveDashboardPage } from './pages/LeaveDashboardPage';
import { LeaveTypesPage } from './pages/LeaveTypesPage';
import { LeaveBalancesPage } from './pages/LeaveBalancesPage';
import { MyLeaveRequestsPage } from './pages/MyLeaveRequestsPage';
import { ApplyLeavePage } from './pages/ApplyLeavePage';
import { LeaveApprovalQueuePage } from './pages/LeaveApprovalQueuePage';
import { LeaveCalendarPage } from './pages/LeaveCalendarPage';
import { LeaveAnalyticsPage } from './pages/LeaveAnalyticsPage';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'];
const APPROVER_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER'];

const getUserRole = (user) => user?.role || user?.roleCode || user?.roleName;
const canManageLeaveTypes = (user) => ADMIN_ROLES.includes(getUserRole(user));
const canApproveLeave = (user) => APPROVER_ROLES.includes(getUserRole(user));

const TabButton = ({ active, icon, label, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'inline-flex h-9 shrink-0 items-center gap-2 rounded px-3 text-xs font-semibold transition-colors',
      active
        ? 'bg-[#2563eb] text-white shadow-sm'
        : 'text-[#434655] hover:bg-[#ededf9] hover:text-[#191b23] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
    ].join(' ')}
  >
    {icon}
    <span>{label}</span>
    {badge ? (
      <span className={active ? 'rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]' : 'rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700'}>
        {badge}
      </span>
    ) : null}
  </button>
);

export const LeaveModule = ({ initialView = 'dashboard' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialView);

  const canApprove = canApproveLeave(user);
  const canManageTypes = canManageLeaveTypes(user);

  const { data: queueData } = useQuery({
    queryKey: ['leave-requests-approval-count'],
    queryFn: () => api.get('/leave-requests?status=Pending').then(res => res.data),
    enabled: canApprove
  });
  
  const pendingCount = queueData?.data?.total || queueData?.data?.items?.length || queueData?.data?.length || 0;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'types', label: 'Leave Types', icon: <FileText size={15} /> },
    { id: 'balance', label: 'Leave Balance', icon: <Timer size={15} /> },
    { id: 'requests', label: 'My Requests', icon: <History size={15} /> },
    { id: 'apply', label: 'Apply Leave', icon: <PlusCircle size={15} /> },
    { id: 'approval', label: 'Approvals', icon: <ClipboardCheck size={15} />, badge: pendingCount || undefined },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Dynamic Tabs Navigation */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-[#111111]">
        <div className="flex min-w-max items-center gap-1">
          {tabs.map((tab) => {
            if (tab.id === 'types' && !canManageTypes) return null;
            if (tab.id === 'approval' && !canApprove) return null;
            return (
              <TabButton key={tab.id} active={activeTab === tab.id} icon={tab.icon} label={tab.label} badge={tab.badge} onClick={() => setActiveTab(tab.id)} />
            );
          })}
        </div>
      </div>

      {activeTab === 'dashboard' && <LeaveDashboardPage onNavigate={setActiveTab} />}
      {activeTab === 'types' && <LeaveTypesPage />}
      {activeTab === 'balance' && <LeaveBalancesPage />}
      {activeTab === 'requests' && <MyLeaveRequestsPage />}
      {activeTab === 'apply' && <ApplyLeavePage onSuccess={() => setActiveTab('requests')} onCancel={() => setActiveTab('dashboard')} />}
      {activeTab === 'approval' && <LeaveApprovalQueuePage />}
      {activeTab === 'calendar' && <LeaveCalendarPage />}
      {activeTab === 'analytics' && <LeaveAnalyticsPage />}
    </div>
  );
};
