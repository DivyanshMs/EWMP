import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

import RecruitmentDashboardPage from './pages/RecruitmentDashboardPage';
import JobPositionsPage from './pages/JobPositionsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CandidateDirectoryPage from './pages/CandidateDirectoryPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import InterviewManagementPage from './pages/InterviewManagementPage';
import RecruitmentPipelinePage from './pages/RecruitmentPipelinePage';
import RecruitmentAnalyticsPage from './pages/RecruitmentAnalyticsPage';

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

export const RecruitmentModule = ({ initialView = 'dashboard' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const isMgr = isManager(user);

  // Badge count for candidate pipeline
  const { data: candidatesData } = useQuery({
    queryKey: ['recruitment-candidates'],
    queryFn: () => api.get('/recruitment/candidates').then(r => r.data),
    enabled: !!user
  });
  const rawCandidates = candidatesData?.data?.items || candidatesData?.data || [];
  const activePipelineCount = rawCandidates.filter(c => !['Joined', 'Rejected'].includes(c.recruitmentStatus)).length;

  const navigate = (tab, record) => {
    if (record) setSelectedRecord(record);
    setActiveTab(tab);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'jobs', label: 'Job Openings', icon: <Briefcase size={15} /> },
    { id: 'candidates', label: 'Candidate Directory', icon: <Users size={15} /> },
    { id: 'pipeline', label: 'Hiring Pipeline', icon: <GitBranch size={15} />, badge: activePipelineCount || undefined },
    { id: 'interviews', label: 'Interviews', icon: <Calendar size={15} /> },
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
        <RecruitmentDashboardPage onNavigate={navigate} />
      )}
      {activeTab === 'jobs' && (
        <JobPositionsPage onSelectJob={(job) => navigate('job_details', job)} />
      )}
      {activeTab === 'candidates' && (
        <CandidateDirectoryPage onSelectCandidate={(cand) => navigate('candidate_profile', cand)} />
      )}
      {activeTab === 'pipeline' && (
        <RecruitmentPipelinePage onSelectCandidate={(cand) => navigate('candidate_profile', cand)} />
      )}
      {activeTab === 'interviews' && (
        <InterviewManagementPage />
      )}
      {activeTab === 'analytics' && (
        <RecruitmentAnalyticsPage />
      )}
      {activeTab === 'job_details' && (
        <JobDetailsPage
          jobData={selectedRecord}
          onBack={() => setActiveTab('jobs')}
          onSelectCandidate={(cand) => navigate('candidate_profile', cand)}
        />
      )}
      {activeTab === 'candidate_profile' && (
        <CandidateProfilePage
          candidateData={selectedRecord}
          onBack={() => setActiveTab('candidates')}
        />
      )}
    </div>
  );
};

export default RecruitmentModule;
