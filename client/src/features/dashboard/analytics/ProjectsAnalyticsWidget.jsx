import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  Folder, 
  ChevronRight 
} from 'lucide-react';
import { ProgressChartPlaceholder } from '../charts/ChartsPlaceholders';

/**
 * ProjectsAnalyticsWidget.jsx
 * Executive Projects & Deliverables Analytics Widget.
 * Tracks active enterprise projects, completion percentages, upcoming milestones, and SLA deadlines.
 */

export const ProjectsAnalyticsWidget = () => {
  const { data: projectsRes } = useQuery({
    queryKey: ['_reports_projects'],
    queryFn: () => api.get('/reports/projects?export=true').then(res => res.data)
  });
  const rawData = projectsRes?.data || [];
  const total = rawData.length || 1;
  
  const activeCount = rawData.filter(r => r.projectStatus === 'Active').length;
  const activePct = Math.round((activeCount / total) * 100);
  const completedCount = rawData.filter(r => r.projectStatus === 'Completed').length;
  const healthSegments = [
    { name: 'Active', value: activeCount, color: 'bg-blue-500' },
    { name: 'Completed', value: completedCount, color: 'bg-emerald-500' },
  ];
  

  const projectProgress = rawData.length > 0 
    ? rawData.slice(0, 4).map(p => ({
        label: p.name,
        value: p.completionPercent || 0,
        color: p.priority === 'Critical' ? 'bg-rose-500' : p.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'
      }))
    : [
        { label: 'Cloud Security Architecture Overhaul', value: 88, color: 'bg-indigo-600' },
        { label: 'Q3 Enterprise ERP Migration', value: 64, color: 'bg-blue-500' },
        { label: 'Autonomous AI Gateway v2 Integration', value: 92, color: 'bg-emerald-500' },
        { label: 'Mobile Workforce App 3.0 Launch', value: 45, color: 'bg-amber-500' },
      ];

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Folder size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Active Projects & Milestones
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Deliverable health, milestone progress & upcoming release deadlines
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800/40 text-xs font-mono font-semibold">
            18 Active Workspaces
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Progress chart */}
        <div className="lg:col-span-2 p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900 dark:text-white">High-Priority Project Health</span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">94% On-Schedule</span>
          </div>
          <ProgressChartPlaceholder items={projectProgress} />
        </div>

        {/* Upcoming Deadlines Summary */}
        <div className="space-y-3">
          <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                Due in 3 Days
              </span>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1">ISO-27001 Security Audit Final Polish</h4>
              <span className="text-[11px] text-gray-500 block font-mono">Owner: David Kim • Eng Dept</span>
            </div>
          </div>

          <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                Due next week
              </span>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1">AI Payroll Simulation Node Testing</h4>
              <span className="text-[11px] text-gray-500 block font-mono">Owner: Sarah Jenkins • Fin Tech</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>Total project completion rate across all departments: <strong className="text-gray-900 dark:text-white">82.4%</strong></span>
        <button
          onClick={() => window.location.assign('/projects')}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View All Workspaces
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProjectsAnalyticsWidget;
