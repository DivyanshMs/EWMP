import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, ArrowLeft, Paperclip, MessageSquare, Send, Award, Edit3, Plus } from 'lucide-react';
import { GoalPriorityBadge, GoalStatusBadge } from '../components/PerformanceBadges';
import { GoalProgressTimeline } from '../components/PerformanceTimelines';
import api from '../../../lib/axios';

export const GoalDetailsPage = ({ onBack, record }) => {
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([
    { author: 'Marcus Tech VP (Manager)', text: 'InfoSec architecture review was thorough. Please ensure staging canary runs for at least 72 hours before production cutover.', date: 'June 18, 2026' },
    { author: 'Sarah SDE-II (Assignee)', text: 'Canary deployment initiated on July 5. Current CPU and latency metrics are within 1% of baseline.', date: 'July 5, 2026' },
  ]);

  const updateProgressMutation = useMutation({
    mutationFn: (percentage) => api.patch(`/performance/goals/${record?.id || record?._id}/progress`, {
      completionPercent: percentage,
      goalStatus: percentage === 100 ? 'Completed' : 'In Progress'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['performance-goals']);
    }
  });

  const goalData = record ? {
    id: record.id || record._id,
    title: record.title,
    description: record.description || 'No description provided.',
    priority: record.priority || 'MEDIUM',
    status: record.status || 'NOT_STARTED',
    progress: record.progress || 0,
    dueDate: record.dueDate || '—',
    assignee: 'Current Employee',
    department: 'General',
    kpiMetric: 'Completion Rate',
    targetValue: '100% completion',
    actualValue: `${record.progress || 0}%`,
    managerFeedback: 'Awaiting manager calibration evaluation.'
  } : {
    id: 'KPI-—',
    title: 'Goal Not Found',
    description: '',
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    progress: 0,
    dueDate: '—',
    assignee: '—',
    department: '—',
    kpiMetric: '—',
    targetValue: '—',
    actualValue: '—',
    managerFeedback: '—'
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([...comments, { author: 'Sarah Jenkins (You)', text: commentInput, date: 'Just now' }]);
    setCommentInput('');
  };

  const handleUpdatePercent = () => {
    const val = prompt('Enter new completion percentage (0-100):', goalData.progress);
    if (val !== null && !isNaN(val)) {
      const p = Math.min(100, Math.max(0, parseInt(val, 10)));
      updateProgressMutation.mutate(p);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 rounded text-[#191b23] dark:text-white transition-colors"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-xs text-[#737686]">{goalData.id}</span>
              <GoalPriorityBadge priority={goalData.priority} />
              <GoalStatusBadge status={goalData.status} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white">
              {goalData.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdatePercent}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Edit3 size={14} /> Update Progress %
          </button>
        </div>
      </div>

      {/* Hero Progress Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
        <div className="md:col-span-2 space-y-2">
          <span className="text-[#737686] font-semibold block">Goal Description & Scope</span>
          <p className="text-sm text-[#191b23] dark:text-white leading-relaxed">{goalData.description}</p>
          <div className="pt-2 flex items-center gap-4 font-mono text-[#737686]">
            <span>Assignee: <strong className="text-[#191b23] dark:text-gray-300">{goalData.assignee}</strong></span>
            <span>•</span>
            <span>Due: <strong className="text-[#2563eb]">{goalData.dueDate}</strong></span>
          </div>
        </div>

        <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 flex flex-col justify-between">
          <span className="text-[#737686] font-semibold">Quantifiable KPI Target</span>
          <div className="my-2">
            <strong className="text-sm text-[#191b23] dark:text-white block font-mono">{goalData.targetValue}</strong>
            <span className="text-[11px] text-[#2563eb] block mt-0.5">{goalData.kpiMetric}</span>
          </div>
          <span className="text-[11px] font-mono text-[#737686]">Actual: {goalData.actualValue}</span>
        </div>

        <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900 flex flex-col justify-between">
          <span className="text-[#2563eb] font-semibold">Overall Progress</span>
          <span className="text-3xl font-extrabold font-mono text-[#2563eb] my-1 block">{goalData.progress}%</span>
          <div className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563eb]" style={{ width: `${goalData.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Two Column Section: Progress Timeline vs Manager Feedback & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone Progress Timeline (1 Col) */}
        <GoalProgressTimeline />

        {/* Manager Feedback & Comments (1 Col) */}
        <div className="space-y-6">
          {/* Manager Feedback Card */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border-2 border-[#2563eb] dark:border-blue-800 rounded-lg p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563eb] flex items-center gap-1.5">
              <Award size={16} /> Reporting Manager Calibration Feedback
            </h4>
            <p className="text-xs text-[#434655] dark:text-gray-300 italic leading-relaxed bg-blue-50/30 dark:bg-blue-950/20 p-3 rounded">
              "{goalData.managerFeedback}"
            </p>
            <span className="text-[11px] font-mono text-[#737686] block text-right">Evaluated by Marcus Tech VP</span>
          </div>

          {/* Attachments & Proof of Delivery */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              <h4 className="text-xs font-bold text-[#191b23] dark:text-white flex items-center gap-1.5">
                <Paperclip size={14} className="text-[#2563eb]" /> Verification Attachments & Deliverables
              </h4>
              <button onClick={() => alert('Uploading supporting PDF/screenshot...')} className="text-xs text-[#2563eb] font-semibold hover:underline inline-flex items-center gap-1">
                <Plus size={12} /> Add File
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50">
                <span className="font-mono font-medium text-[#2563eb] hover:underline cursor-pointer">RFC-8821_Auth_Architecture_V2.pdf</span>
                <span className="text-[#737686] font-mono text-[11px]">2.4 MB • May 15</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50">
                <span className="font-mono font-medium text-[#2563eb] hover:underline cursor-pointer">Canary_LoadTest_Results_July2026.png</span>
                <span className="text-[#737686] font-mono text-[11px]">890 KB • July 5</span>
              </div>
            </div>
          </div>

          {/* Activity Comments Log */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-[#191b23] dark:text-white flex items-center gap-1.5 pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              <MessageSquare size={14} className="text-[#737686]" /> Goal Discussion & Status Updates ({comments.length})
            </h4>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {comments.map((c, idx) => (
                <div key={idx} className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="font-bold text-[#191b23] dark:text-white">{c.author}</strong>
                    <span className="font-mono text-[10px] text-[#737686]">{c.date}</span>
                  </div>
                  <p className="text-[#434655] dark:text-gray-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Post a status update or respond to manager remarks..."
                className="flex-1 text-xs px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3 py-2 bg-[#2563eb] hover:bg-[#004ac6] disabled:opacity-40 text-white text-xs font-semibold rounded inline-flex items-center gap-1 transition-colors"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
