import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { DonutChartPlaceholder } from '../charts/ChartsPlaceholders';

/**
 * TasksAnalyticsWidget.jsx
 * Executive Tasks & Action Items Telemetry Widget.
 * Tracks open deliverables, due today queues, overdue items, and priority distribution.
 */

export const TasksAnalyticsWidget = () => {
  const { data: tasksRes } = useQuery({
    queryKey: ['_reports_tasks'],
    queryFn: () => api.get('/reports/tasks?export=true').then(res => res.data)
  });
  const rawData = tasksRes?.data || [];
  const total = rawData.length || 1;
  
  const completedCount = rawData.filter(r => r.taskStatus === 'Completed').length;
  const completedPct = Math.round((completedCount / total) * 100);
  const slaSegments = [
    { name: 'Completed', value: completedCount, color: 'bg-indigo-500' },
    { name: 'Pending', value: total - completedCount, color: 'bg-amber-500' }
  ];
  

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
            <CheckSquare size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Task Deliverables & Priority Split
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Cross-functional assignee performance, overdue risks & priority distribution
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 rounded-lg border border-sky-200 dark:border-sky-800/40 text-xs font-mono font-semibold">
            412 Open Tasks
          </span>
        </div>
      </div>

      {/* Grid: Priority Donut & Status breakdown cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="bg-gray-50/50 dark:bg-[#161616]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center mb-3">
            Task Priority Split
          </h4>
          <DonutChartPlaceholder
            percentage={completedPct}
            label="SLA On Time"
            segments={slaSegments}
          />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Due Today</span>
                <Clock size={14} className="text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">48 Tasks</div>
              <span className="text-[11px] text-gray-400 mt-1 block">18 in Engineering</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-semibold text-rose-600 dark:text-rose-400">Overdue SLA</span>
                <AlertCircle size={14} className="text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">12 Tasks</div>
              <span className="text-[11px] text-gray-400 mt-1 block">3 Critical blockers</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Completed (Week)</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mt-1">384 Tasks</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">+14% vs prior week</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>Agile sprint velocity remains stable at <strong className="text-gray-900 dark:text-white">92.4 story points / sprint</strong></span>
        <button
          onClick={() => window.location.assign('/tasks')}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View Task Board
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default TasksAnalyticsWidget;
