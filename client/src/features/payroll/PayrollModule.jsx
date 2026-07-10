import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Play,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

import { PayrollDashboardPage } from './pages/PayrollDashboardPage';
import { PayrollRunsPage } from './pages/PayrollRunsPage';
import { PayrollApprovalPage } from './pages/PayrollApprovalPage';
import { PaymentTrackingPage } from './pages/PaymentTrackingPage';
import { PayslipViewerPage } from './pages/PayslipViewerPage';
import { PayrollDetailsPage } from './pages/PayrollDetailsPage';
import { PayrollAnalyticsPage } from './pages/PayrollAnalyticsPage';

const FINANCE_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE'];
const VIEW_ALL_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'FINANCE', 'AUDITOR'];

const getUserRole = (user) => user?.role || user?.roleCode || user?.roleName;
const canRunPayroll = (user) => FINANCE_ROLES.includes(getUserRole(user));
const canViewAllPayroll = (user) => VIEW_ALL_ROLES.includes(getUserRole(user));
const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

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

export const PayrollModule = ({ initialView = 'dashboard' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const canRun = canRunPayroll(user);
  const canViewAll = canViewAllPayroll(user);

  // Badge count for pending approvals
  const { data: payrollData } = useQuery({
    queryKey: ['payroll-list'],
    queryFn: () => api.get('/payroll').then(r => r.data),
    enabled: canViewAll
  });
  const rawList = toArray(payrollData);
  const pendingApprovalCount = rawList.filter(r => r.status === 'PENDING_APPROVAL').length;

  const navigate = (tab, record) => {
    if (record) setSelectedRecord(record);
    setActiveTab(tab);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'my-payslips', label: 'My Payslips', icon: <WalletCards size={15} /> },
    { id: 'runs', label: 'Payroll Runs', icon: <Play size={15} />, adminOnly: true },
    { id: 'approval', label: 'Approvals', icon: <ShieldCheck size={15} />, adminOnly: true, badge: pendingApprovalCount || undefined },
    { id: 'tracking', label: 'Payment Tracking', icon: <CreditCard size={15} />, adminOnly: true },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} />, adminOnly: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Tab Bar */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-[#111111]">
        <div className="flex min-w-max items-center gap-1">
          {tabs.map((tab) => {
            if (tab.adminOnly && !canViewAll) return null;
            return (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
                onClick={() => setActiveTab(tab.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'dashboard' && (
        <PayrollDashboardPage onNavigate={navigate} />
      )}
      {activeTab === 'my-payslips' && (
        <PayslipViewerPage onBack={null} />
      )}
      {activeTab === 'runs' && (
        <PayrollRunsPage onNavigate={navigate} />
      )}
      {activeTab === 'approval' && (
        <PayrollApprovalPage onNavigate={navigate} />
      )}
      {activeTab === 'tracking' && (
        <PaymentTrackingPage onNavigate={navigate} />
      )}
      {activeTab === 'analytics' && (
        <PayrollAnalyticsPage />
      )}
      {activeTab === 'details' && (
        <PayrollDetailsPage
          record={selectedRecord}
          onBack={() => setActiveTab('runs')}
          onNavigate={navigate}
        />
      )}
    </div>
  );
};

export default PayrollModule;
