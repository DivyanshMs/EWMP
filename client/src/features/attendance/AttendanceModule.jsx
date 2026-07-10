
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
  BarChart2,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

import { AttendanceDashboardPage } from './pages/AttendanceDashboardPage';
import { MyAttendancePage } from './pages/MyAttendancePage';
import { AttendanceManagementPage } from './pages/AttendanceManagementPage';
import { AttendanceDetailsPage } from './pages/AttendanceDetailsPage';
import { CorrectionRequestsPage } from './pages/CorrectionRequestsPage';
import { AttendanceAnalyticsPage } from './pages/AttendanceAnalyticsPage';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'];
const APPROVER_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER'];

const getUserRole = (user) => user?.role || user?.roleCode || user?.roleName;
const canManageAttendance = (user) => ADMIN_ROLES.includes(getUserRole(user));
const canApproveCorrections = (user) => APPROVER_ROLES.includes(getUserRole(user));

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

export const AttendanceModule = ({ initialView = 'dashboard' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialView);

  const canManage = canManageAttendance(user);
  const canApprove = canApproveCorrections(user);

  const { data: queueData } = useQuery({
    queryKey: ['attendance-corrections-count'],
    queryFn: () => api.get('/attendance').then(res => res.data),
    enabled: canApprove
  });
  
  // Normalize API response to an array — server may return a paginated object
  const rawRecords = Array.isArray(queueData?.data?.items)
    ? queueData.data.items
    : Array.isArray(queueData?.data)
    ? queueData.data
    : [];

  const pendingCount = rawRecords.filter((r) => r.correctionRequest && r.correctionRequest.status === 'Pending').length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'my', label: 'My Attendance', icon: <History size={15} /> },
    { id: 'management', label: 'Roster Management', icon: <Users size={15} /> },
    { id: 'corrections', label: 'Corrections', icon: <ClipboardCheck size={15} />, badge: pendingCount || undefined },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Dynamic Tabs Navigation */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-[#111111]">
        <div className="flex min-w-max items-center gap-1">
          {tabs.map((tab) => {
            if (tab.id === 'management' && !canManage) return null;
            if (tab.id === 'corrections' && !canApprove) return null;
            if (tab.id === 'analytics' && !canManage) return null;
            return (
              <TabButton key={tab.id} active={activeTab === tab.id} icon={tab.icon} label={tab.label} badge={tab.badge} onClick={() => setActiveTab(tab.id)} />
            );
          })}
        </div>
      </div>

      {activeTab === 'dashboard' && <AttendanceDashboardPage onNavigateMyAttendance={() => setActiveTab('my')} onNavigateManagement={() => setActiveTab('management')} onNavigateCorrections={() => setActiveTab('corrections')} onNavigateAnalytics={() => setActiveTab('analytics')} onNavigateDetails={() => setActiveTab('details')} />}
      {activeTab === 'my' && <MyAttendancePage onRequestCorrection={() => setActiveTab('corrections')} />}
      {activeTab === 'management' && <AttendanceManagementPage />}
      {activeTab === 'corrections' && <CorrectionRequestsPage />}
      {activeTab === 'analytics' && <AttendanceAnalyticsPage />}
      {activeTab === 'details' && <AttendanceDetailsPage />}
    </div>
  );
};

export default AttendanceModule;
