import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Star, Clock, CheckCircle2, ChevronRight, Sparkles, Users, BarChart3, ShieldCheck, PlusCircle, FileText } from 'lucide-react';
import { PerformanceReviewCard, PerformanceAnalyticsCard } from '../components/PerformanceCards';
import { ReviewTimeline } from '../components/PerformanceTimelines';
import { CreateReviewModal, AssignGoalModal } from '../components/PerformanceDrawers';
import api from '../../../lib/axios';

/**
 * PerformanceDashboardPage.jsx
 * Executive Performance Management Dashboard for EWMP.
 * Adheres strictly to Stitch MCP Precision Enterprise Design System rules.
 * Displays Current Review Cycle, KPI summaries, Department Performance, Quick Actions, and Live Feeds.
 */

export const PerformanceDashboardPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['performance-reviews'],
    queryFn: () => api.get('/performance/reviews').then(r => r.data)
  });

  const { data: goalsData, isLoading: goalsLoading } = useQuery({
    queryKey: ['performance-goals'],
    queryFn: () => api.get('/performance/goals').then(r => r.data)
  });

  const createReviewMutation = useMutation({
    mutationFn: (payload) => api.post('/performance/reviews', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['performance-reviews']);
      setIsReviewModalOpen(false);
    }
  });

  const createGoalMutation = useMutation({
    mutationFn: (payload) => api.post('/performance/goals', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['performance-goals']);
      setIsGoalModalOpen(false);
    }
  });

  const rawReviews = reviewsData?.data?.items || reviewsData?.data || [];
  const rawGoals = goalsData?.data?.items || goalsData?.data || [];

  const reviews = rawReviews.slice(0, 3).map(r => ({
    id: r._id || r.id,
    employeeName: r.employee?.fullName || r.employee?.firstName + ' ' + r.employee?.lastName || 'Employee',
    reviewer: r.reviewer?.fullName || 'Manager',
    cycle: `${r.quarter} ${r.year}`,
    department: r.employee?.department?.name || 'General',
    rating: r.managerRating || r.selfRating || 0,
    status: r.reviewStatus || 'Draft',
    goalsCompleted: rawGoals.filter(g => g.employee?._id === r.employee?._id && g.goalStatus === 'Completed').length,
    totalGoals: rawGoals.filter(g => g.employee?._id === r.employee?._id).length,
    submissionDate: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Pending'
  }));

  // KPI counts
  const pendingCount = rawReviews.filter(r => r.reviewStatus !== 'Completed').length;
  const completedCount = rawReviews.filter(r => r.reviewStatus === 'Completed').length;
  const avgRating = rawReviews.length
    ? (rawReviews.reduce((s, r) => s + (r.managerRating || r.selfRating || 0), 0) / rawReviews.length).toFixed(1)
    : 0;
  const totalGoals = rawGoals.length;
  const completedGoals = rawGoals.filter(g => g.goalStatus === 'Completed').length;

  const handleCreateReview = (newRev) => {
    createReviewMutation.mutate(newRev);
  };

  const handleAssignGoal = (newGoal) => {
    createGoalMutation.mutate(newGoal);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleCreateReview}
      />
      <AssignGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onConfirm={handleAssignGoal}
      />

      {/* Hero Appraisal Cycle Banner */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white rounded-xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-300 animate-pulse" /> Active Appraisal Period
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            H1 2026 Consolidated Performance Review
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Organization-wide goal evaluation and managerial competency calibration is currently live. Deadline for HR calibration sign-off is <strong className="text-white font-mono underline">July 31, 2026</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-3 bg-white text-[#2563eb] hover:bg-blue-50 font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 scale-100 hover:scale-105"
          >
            <PlusCircle size={16} /> Launch Review Cycle
          </button>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-4 py-3 bg-blue-900/60 hover:bg-blue-900 text-white font-semibold text-xs rounded-lg border border-blue-400/40 transition-all flex items-center gap-2"
          >
            <Target size={16} /> Assign KPI Goal
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceAnalyticsCard
          title="Pending Appraisal Reviews"
          value="42"
          subtitle="Awaiting manager or HR sign-off"
          icon={Clock}
          change="-15 this week"
          trend="down"
        />
        <PerformanceAnalyticsCard
          title="Completed Reviews"
          value="300"
          subtitle="Out of 342 active employees"
          icon={CheckCircle2}
          change="87.7% finished"
          trend="up"
        />
        <PerformanceAnalyticsCard
          title="Total Goals Achieved"
          value="1,420"
          subtitle="KPI milestones verified in H1"
          icon={Target}
          change="+18% vs H2 2025"
          trend="up"
        />
        <PerformanceAnalyticsCard
          title="Organization Average Rating"
          value="4.2"
          subtitle="Meets & Exceeds expectation curve"
          icon={Star}
          change="+0.3 improvement"
          trend="up"
        />
      </div>

      {/* Quick Action Hub */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#737686] mb-3">
          Executive Quick Actions & Calibration Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="p-3 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-900/40 dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 rounded-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2 transition-colors"
          >
            <FileText size={16} className="text-[#2563eb]" /> Create New Review
          </button>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="p-3 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-900/40 dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 rounded-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2 transition-colors"
          >
            <Target size={16} className="text-emerald-600" /> Assign Goal & KPI
          </button>
          <button
            onClick={() => onNavigate && onNavigate('reviews')}
            className="p-3 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800/40 dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 rounded-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2 transition-colors"
          >
            <ShieldCheck size={16} className="text-purple-600" /> Complete Review Queue
          </button>
          <button
            onClick={() => onNavigate && onNavigate('analytics')}
            className="p-3 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-900/40 dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 rounded-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={16} className="text-amber-600" /> View Bell Curve Analytics
          </button>
        </div>
      </div>

      {/* Two Column Grid: Department Performance vs Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance Comparison (1 Col) */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <Users size={16} className="text-[#2563eb]" />
                DEPARTMENT PERFORMANCE
              </h3>
              <span className="text-xs font-mono text-[#737686]">Avg Rating</span>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { dept: 'Engineering & Product', rating: 4.4, share: 88, staff: 185 },
                { dept: 'Sales & Revenue Marketing', rating: 4.1, share: 82, staff: 95 },
                { dept: 'Operations & Support', rating: 4.0, share: 80, staff: 62 },
                { dept: 'People HR & Finance', rating: 4.5, share: 90, staff: 24 },
              ].map((d, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="font-bold text-[#191b23] dark:text-white">{d.dept}</strong>
                    <span className="font-mono font-bold text-[#2563eb]">{d.rating.toFixed(1)} <span className="text-[#737686] font-normal">({d.staff} staff)</span></span>
                  </div>
                  <div className="w-full h-2 bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${d.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-center">
            <button
              onClick={() => onNavigate && onNavigate('analytics')}
              className="text-xs font-bold text-[#2563eb] hover:underline inline-flex items-center gap-1"
            >
              Explore Detailed Calibration Matrix <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Live Review Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-[#2563eb]" />
              RECENT PERFORMANCE REVIEWS & EVALUATIONS
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('reviews')}
              className="text-xs font-bold text-[#2563eb] hover:underline inline-flex items-center gap-1"
            >
              View All 342 Reviews <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <PerformanceReviewCard
                key={rev.id}
                review={rev}
                onSelect={() => onNavigate && onNavigate('details')}
                onEvaluate={() => onNavigate && onNavigate('manager-eval')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Appraisal Timeline Section */}
      <ReviewTimeline />
    </div>
  );
};
