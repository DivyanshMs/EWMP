import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Search, Filter, PlusCircle, Download } from 'lucide-react';
import { GoalCard } from '../components/PerformanceCards';
import { AssignGoalModal } from '../components/PerformanceDrawers';
import { NoGoals, NoResults } from '../components/PerformanceEmptyStates';
import api from '../../../lib/axios';

/**
 * GoalsKPIsPage.jsx
 * Organizational Goals & KPI Administration Hub for EWMP Performance Management.
 * Displays Goal List with progress bars, priority badges, completion rates, milestones, and status filters.
 */

export const GoalsKPIsPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: goalsData, isLoading } = useQuery({
    queryKey: ['performance-goals'],
    queryFn: () => api.get('/performance/goals').then(r => r.data)
  });

  const createGoalMutation = useMutation({
    mutationFn: (payload) => api.post('/performance/goals', payload),
    onSuccess: () => { queryClient.invalidateQueries(['performance-goals']); setIsModalOpen(false); }
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/performance/goals/${id}/progress`, data),
    onSuccess: () => queryClient.invalidateQueries(['performance-goals'])
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id) => api.delete(`/performance/goals/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['performance-goals'])
  });

  const rawGoals = goalsData?.data?.items || goalsData?.data || [];

  const goals = rawGoals.map(g => ({
    id: g._id || g.id,
    title: g.title,
    description: g.description || '',
    priority: g.goalType === 'KPI' ? 'HIGH' : g.goalType === 'Learning' ? 'LOW' : 'MEDIUM',
    status: g.goalStatus === 'Completed' ? 'COMPLETED' : g.goalStatus === 'Missed' ? 'AT_RISK' : g.goalStatus === 'In Progress' ? 'IN_PROGRESS' : 'NOT_STARTED',
    progress: g.completionPercent || 0,
    dueDate: g.targetDate ? new Date(g.targetDate).toLocaleDateString() : '—',
    completedMilestones: Math.round((g.completionPercent || 0) / 25),
    totalMilestones: 4,
    employeeId: g.employee?._id || g.employee
  }));

  const filtered = goals.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || g.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || g.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateGoal = (newGoal) => {
    createGoalMutation.mutate(newGoal);
  };

  const handleUpdateProgress = (goal) => {
    const newProg = prompt(`Enter updated completion percentage (0-100) for "${goal.title}":`, goal.progress);
    if (newProg !== null && !isNaN(newProg)) {
      const p = Math.min(100, Math.max(0, Number(newProg)));
      updateProgressMutation.mutate({
        id: goal.id,
        data: { completionPercent: p, goalStatus: p === 100 ? 'Completed' : 'In Progress' }
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AssignGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateGoal}
      />

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Target size={20} className="text-[#2563eb]" />
            ORGANIZATIONAL GOALS & KPI TRACKING MATRIX
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Assign strategic goals, track quantifiable milestone completion percentages, and monitor at-risk deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle size={15} /> Assign New Goal
          </button>
          <button
            onClick={() => alert('Exporting KPI progress matrix to CSV...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export Matrix
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search goal titles, KPI metrics, or ID (e.g. KPI-0101)..."
            className="w-full pl-9 py-2 bg-[#faf8ff] dark:bg-[#161616]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-[#737686]" />
            <span className="text-[#737686] font-medium">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#737686] font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_PROGRESS">On Track</option>
              <option value="COMPLETED">Completed</option>
              <option value="AT_RISK">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <NoGoals onAssign={() => setIsModalOpen(true)} />
      ) : filtered.length === 0 ? (
        <NoResults onReset={() => { setSearchTerm(''); setFilterPriority('ALL'); setFilterStatus('ALL'); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onSelect={() => onNavigate && onNavigate('goal-details', goal)}
              onUpdate={() => handleUpdateProgress(goal)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
