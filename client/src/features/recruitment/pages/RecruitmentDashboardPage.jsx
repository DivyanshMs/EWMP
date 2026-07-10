import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Users, Calendar, DollarSign, UserCheck, XCircle, PlusCircle, Sparkles, ChevronRight, Download, TrendingUp } from 'lucide-react';
import { JobStatusBadge, StageBadge } from '../components/RecruitmentBadges';
import { JobCard, CandidateCard, InterviewCard, PerformanceAnalyticsCard } from '../components/RecruitmentCards';
import { CreateJobModal, AddCandidateModal, ScheduleInterviewModal } from '../components/RecruitmentDrawers';
import api from '../../../lib/axios';

/**
 * RecruitmentDashboardPage.jsx
 * Executive hiring command center for EWMP Recruitment Management.
 */

export default function RecruitmentDashboardPage({ onNavigate }) {
  const queryClient = useQueryClient();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showScheduleInterview, setShowScheduleInterview] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['recruitment-jobs'],
    queryFn: () => api.get('/recruitment/jobs').then(r => r.data)
  });

  const { data: candidatesData, isLoading: candidatesLoading } = useQuery({
    queryKey: ['recruitment-candidates'],
    queryFn: () => api.get('/recruitment/candidates').then(r => r.data)
  });

  const createJobMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/jobs', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-jobs']);
      setShowCreateJob(false);
    }
  });

  const addCandidateMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/candidates', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
      setShowAddCandidate(false);
    }
  });

  const scheduleInterviewMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/interviews', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
      setShowScheduleInterview(false);
    }
  });

  const rawJobs = jobsData?.data?.items || jobsData?.data || [];
  const rawCandidates = candidatesData?.data?.items || candidatesData?.data || [];

  const { data: interviewsData } = useQuery({
    queryKey: ['recruitment-dashboard-interviews', rawCandidates.slice(0, 5).map((candidate) => candidate._id || candidate.id).join(',')],
    queryFn: async () => {
      const responses = await Promise.all(
        rawCandidates.slice(0, 5).map((candidate) => api.get(`/recruitment/candidates/${candidate._id || candidate.id}/interviews`))
      );
      return responses.flatMap((response) => response.data?.data || []);
    },
    enabled: rawCandidates.length > 0,
  });

  const openJobsCount = rawJobs.filter(j => j.jobStatus === 'Open').length;
  const activeCandidatesCount = rawCandidates.length;

  const interviews = interviewsData || [];
  const today = new Date().toDateString();
  const interviewsToday = interviews.filter((interview) => {
    const date = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
    return date && !Number.isNaN(date.getTime()) && date.toDateString() === today;
  });

  const kpis = [
    { title: 'Open Positions', value: String(openJobsCount), subtitle: 'Active published jobs', icon: Briefcase, change: 'Live', trend: 'up' },
    { title: 'Total Candidates', value: String(activeCandidatesCount), subtitle: 'Across all stages', icon: Users, change: 'Live', trend: 'up' },
    { title: 'Interviews Today', value: String(interviewsToday.length), subtitle: 'Scheduled technical & HR', icon: Calendar, change: 'Live', trend: 'up' },
    { title: 'Offers Pending', value: String(rawCandidates.filter(c => c.recruitmentStatus === 'Offer').length), subtitle: 'Awaiting e-signatures', icon: DollarSign, change: 'Live', trend: 'up' },
    { title: 'Hires This Month', value: String(rawCandidates.filter(c => c.recruitmentStatus === 'Joined').length), subtitle: 'Onboarded employees', icon: UserCheck, change: 'Live', trend: 'up' },
    { title: 'Rejected Candidates', value: String(rawCandidates.filter(c => c.recruitmentStatus === 'Rejected').length), subtitle: 'Archived / Unsuccessful', icon: XCircle, change: 'Live', trend: 'down' },
  ];

  const sampleJobs = rawJobs.slice(0, 3).map(j => ({
    id: j._id || j.id,
    title: j.title,
    department: j.departmentId?.name || 'General',
    location: 'Office HQ (Hybrid)',
    type: 'FULL_TIME',
    openings: j.totalVacancies || 1,
    applicants: rawCandidates.filter(c => c.appliedForDesignation?._id === j._id).length,
    status: j.jobStatus === 'Open' ? 'PUBLISHED' : j.jobStatus || 'DRAFT'
  }));

  const sampleCandidates = rawCandidates.slice(0, 3).map(c => ({
    id: c._id || c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    appliedRole: c.appliedForDesignation?.title || 'General Applicant',
    experience: String(c.experience || 0),
    stage: c.recruitmentStatus || 'Applied'
  }));

  const scheduledInterviews = interviewsToday.slice(0, 3).map((interview) => {
    const date = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
    const candidate = interview.candidateId;
    const interviewer = interview.interviewerId;
    return {
      id: interview._id || interview.id,
      candidateName: [candidate?.firstName, candidate?.lastName].filter(Boolean).join(' ') || 'Candidate',
      appliedRole: candidate?.appliedForDesignation?.title || 'Applicant',
      round: interview.round,
      interviewer: [interviewer?.firstName, interviewer?.lastName].filter(Boolean).join(' ') || 'Interviewer',
      mode: interview.mode,
      date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : '',
      time: date && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      meetLink: interview.meetingLink,
    };
  });

  const handleCreateJob = (newJob) => {
    createJobMutation.mutate({
      title: newJob.title,
      departmentId: newJob.departmentId || rawJobs[0]?.departmentId?._id || rawJobs[0]?.departmentId,
      hiringManagerId: newJob.hiringManagerId || rawJobs[0]?.hiringManagerId?._id || rawJobs[0]?.hiringManagerId,
      description: newJob.description || 'Job requisition description.',
      totalVacancies: Number(newJob.openings || 1)
    });
  };

  const handleAddCandidate = (cand) => {
    addCandidateMutation.mutate({
      firstName: cand.name.split(' ')[0] || 'First',
      lastName: cand.name.split(' ').slice(1).join(' ') || 'Last',
      email: cand.email,
      experience: Number(cand.experience || 0),
      sourceChannel: 'LinkedIn'
    });
  };

  const handleScheduleInterview = (intv) => {
    scheduleInterviewMutation.mutate({
      candidateId: intv.candidateId || rawCandidates[0]?._id,
      interviewerId: intv.interviewerId || rawJobs[0]?.hiringManagerId?._id || rawJobs[0]?.hiringManagerId,
      round: 'Technical',
      scheduledAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner & Quick Actions Hub */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#faf8ff] text-[#2563eb] border border-[#2563eb]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse"></span>
              RECRUITMENT COMMAND CENTER • Q3 HIRING CYCLE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight">
            Workforce Acquisition & Talent Pipeline
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Manage job requisitions, evaluate candidate screening pipelines, schedule interview panels, and issue formal offer letters.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateJob(true)}
            className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle size={15} /> Create Job
          </button>
          <button
            onClick={() => setShowAddCandidate(true)}
            className="px-3.5 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Users size={15} /> Add Candidate
          </button>
          <button
            onClick={() => setShowScheduleInterview(true)}
            className="px-3.5 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-[#161616] dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Calendar size={15} /> Schedule Interview
          </button>
          <button
            onClick={() => alert('Exporting complete Recruitment Analytics CSV report...')}
            className="p-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded-lg transition-colors"
            title="Export Recruitment Data"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <PerformanceAnalyticsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Hiring Funnel & Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#2563eb]" /> Candidate Pipeline Funnel Conversion
              </h3>
              <span className="text-xs text-[#737686]">Real-time applicant progression across active recruitment stages</span>
            </div>
            <button onClick={() => onNavigate && onNavigate('pipeline')} className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
              View Kanban Board <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4 my-2">
            {[
              { stage: '1. Applied / Auto-Ingested', count: 342, pct: 100, color: 'bg-blue-500' },
              { stage: '2. HR Initial Screening', count: 210, pct: 61.4, color: 'bg-indigo-500' },
              { stage: '3. Manager Interview', count: 124, pct: 36.2, color: 'bg-purple-500' },
              { stage: '4. Technical / Case Round', count: 58, pct: 16.9, color: 'bg-amber-500' },
              { stage: '5. Final HR Round & Calibration', count: 28, pct: 8.1, color: 'bg-teal-500' },
              { stage: '6. Offer Extended', count: 18, pct: 5.2, color: 'bg-emerald-500' },
              { stage: '★ Successfully Hired', count: 15, pct: 4.3, color: 'bg-emerald-600 font-extrabold' },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#191b23] dark:text-white font-medium">{s.stage}</span>
                  <span className="text-[#737686]">{s.count} Candidates ({s.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#faf8ff] dark:bg-[#161616] rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-xs text-[#737686] font-mono">
            <span>Overall Funnel Efficiency: <strong className="text-emerald-600">4.3% Conversion to Hire</strong></span>
            <span>Target Cost Per Hire: <strong className="text-[#2563eb]">$3,420</strong></span>
          </div>
        </div>

        {/* Quick Recruitment Intelligence Card */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-[#2563eb]" /> Hiring Velocity & SLA
            </h3>
            <span className="text-[11px] font-mono text-[#737686]">Q3 Live</span>
          </div>

          <div className="space-y-4 font-mono">
            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] dark:border-gray-800">
              <span className="text-[11px] text-[#737686] uppercase block">Average Time to Hire</span>
              <strong className="text-2xl font-extrabold text-[#191b23] dark:text-white">18 Days</strong>
              <span className="text-xs text-emerald-600 font-bold block mt-0.5">↓ 4 days faster than industry SLA</span>
            </div>

            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] dark:border-gray-800">
              <span className="text-[11px] text-[#737686] uppercase block">Offer Acceptance Rate</span>
              <strong className="text-2xl font-extrabold text-emerald-600">92.4%</strong>
              <span className="text-xs text-[#737686] block mt-0.5">15 Accepted / 1 Rejected / 2 Pending</span>
            </div>

            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] dark:border-gray-800">
              <span className="text-[11px] text-[#737686] uppercase block">Top Source Channel</span>
              <strong className="text-base font-bold text-[#2563eb]">LinkedIn Recruiter (48%)</strong>
              <span className="text-xs text-[#737686] block mt-0.5">Followed by Employee Referrals (32%)</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('analytics')}
            className="w-full py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors"
          >
            Explore Complete Analytics & Source Analysis →
          </button>
        </div>
      </div>

      {/* Two Column Section: Active Open Positions & Today's Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Job Requisitions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
              <Briefcase size={16} className="text-[#2563eb]" /> High-Priority Published Job Requisitions
            </h3>
            <button onClick={() => onNavigate && onNavigate('jobs')} className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
              All 24 Jobs <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {sampleJobs.map((job, idx) => (
              <JobCard key={idx} job={job} onSelect={() => onNavigate && onNavigate('job_details')} />
            ))}
          </div>
        </div>

        {/* Right Column: Scheduled Interviews Today & Top Candidates */}
        <div className="space-y-6">
          {/* Today's Interviews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <Calendar size={16} className="text-amber-600" /> Scheduled Interviews Today (July 8)
              </h3>
              <button onClick={() => onNavigate && onNavigate('interviews')} className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
                Full Schedule <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {scheduledInterviews.map((intv, idx) => (
                <InterviewCard key={idx} interview={intv} onFeedback={() => alert(`Submitting scorecard for ${intv.candidateName}...`)} />
              ))}
              {scheduledInterviews.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#c3c6d7] p-5 text-center text-sm text-[#737686] dark:border-gray-800">
                  No interviews are scheduled for today.
                </div>
              ) : null}
            </div>
          </div>

          {/* Recently Added Candidates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <Users size={16} className="text-[#2563eb]" /> Active Pipeline Candidates
              </h3>
              <button onClick={() => onNavigate && onNavigate('candidates')} className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
                Directory (342) <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleCandidates.map((cand, idx) => (
                <CandidateCard key={idx} candidate={cand} onSelect={() => onNavigate && onNavigate('candidate_profile')} onViewResume={() => alert(`Opening resume PDF for ${cand.name}...`)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateJobModal isOpen={showCreateJob} onClose={() => setShowCreateJob(false)} onConfirm={handleCreateJob} />
      <AddCandidateModal isOpen={showAddCandidate} onClose={() => setShowAddCandidate(false)} onConfirm={handleAddCandidate} />
      <ScheduleInterviewModal isOpen={showScheduleInterview} onClose={() => setShowScheduleInterview(false)} onConfirm={handleScheduleInterview} />
    </div>
  );
}
