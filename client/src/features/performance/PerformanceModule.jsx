import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Target,
  FileText,
  UserCheck,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

import { PerformanceDashboardPage } from './pages/PerformanceDashboardPage';
import { GoalsKPIsPage } from './pages/GoalsKPIsPage';
import { GoalDetailsPage } from './pages/GoalDetailsPage';
import { PerformanceReviewsPage } from './pages/PerformanceReviewsPage';
import { ReviewDetailsPage } from './pages/ReviewDetailsPage';
import { SelfAssessmentPage } from './pages/SelfAssessmentPage';
import { ManagerEvaluationPage } from './pages/ManagerEvaluationPage';
import { PerformanceAnalyticsPage } from './pages/PerformanceAnalyticsPage';

const MANAGER_ROLES = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD'];

const getUserRole = (user) => user?.role || user?.roleCode || user?.roleName;
const isManager = (user) => MANAGER_ROLES.includes(getUserRole(user));

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

export const PerformanceModule = ({ initialView = 'dashboard' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const isMgr = isManager(user);

  // Badge count for pending reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['performance-reviews'],
    queryFn: () => api.get('/performance/reviews').then(r => r.data),
    enabled: !!user
  });
  const rawReviews = reviewsData?.data?.items || reviewsData?.data || [];
  const pendingReviewCount = rawReviews.filter(r => r.reviewStatus !== 'Completed').length;

  const navigate = (tab, record) => {
    if (record) setSelectedRecord(record);
    setActiveTab(tab);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'goals', label: 'KPIs & Goals', icon: <Target size={15} /> },
    { id: 'reviews', label: 'Appraisals', icon: <FileText size={15} />, badge: pendingReviewCount || undefined },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} />, adminOnly: true }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Tab Bar */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-[#111111]">
        <div className="flex min-w-max items-center gap-1">
          {tabs.map((tab) => {
            if (tab.adminOnly && !isMgr) return null;
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
        <PerformanceDashboardPage onNavigate={navigate} />
      )}
      {activeTab === 'goals' && (
        <GoalsKPIsPage onNavigate={navigate} />
      )}
      {activeTab === 'reviews' && (
        <PerformanceReviewsPage onNavigate={navigate} />
      )}
      {activeTab === 'analytics' && (
        <PerformanceAnalyticsPage />
      )}
      {activeTab === 'self-assessment' && (
        <SelfAssessmentPage
          record={selectedRecord}
          onBack={() => setActiveTab('reviews')}
          onSubmitted={() => setActiveTab('reviews')}
        />
      )}
      {activeTab === 'manager-evaluation' && (
        <ManagerEvaluationPage
          record={selectedRecord}
          onBack={() => setActiveTab('reviews')}
          onCompleted={() => setActiveTab('reviews')}
        />
      )}
      {activeTab === 'review-details' && (
        <ReviewDetailsPage
          record={selectedRecord}
          onBack={() => setActiveTab('reviews')}
          onNavigate={navigate}
        />
      )}
      {activeTab === 'goal-details' && (
        <GoalDetailsPage
          record={selectedRecord}
          onBack={() => setActiveTab('goals')}
        />
      )}
    </div>
  );
};

export default PerformanceModule;
