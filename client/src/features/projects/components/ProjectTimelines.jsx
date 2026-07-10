import React, { useState } from 'react';
import { Clock, User, CalendarDays } from 'lucide-react';
import { MilestoneStatusBadge } from './ProjectBadges';
import { ProgressBar } from './ProjectCards';

/**
 * ProjectTimelines.jsx
 * Gantt-style interactive project timelines, phase dependency mappers, and team assignment schedules for EWMP.
 * Follows Stitch MCP Precision Enterprise tokens.
 */

export const InteractiveTimeline = ({ milestones = [] }) => {
  const [viewMode, setViewMode] = useState('MONTH'); // 'WEEK' | 'MONTH' | 'PHASE'

  const phases = [
    { name: 'Phase 1: Architecture & Scoping', start: 'Jul 1', end: 'Jul 15', progress: 100, status: 'COMPLETED', color: 'bg-emerald-500' },
    { name: 'Phase 2: Core Microservices & Database', start: 'Jul 16', end: 'Aug 15', progress: 65, status: 'IN_PROGRESS', color: 'bg-[#2563eb]' },
    { name: 'Phase 3: Frontend UI & Security Audit', start: 'Aug 16', end: 'Sep 15', progress: 20, status: 'IN_PROGRESS', color: 'bg-purple-500' },
    { name: 'Phase 4: Client UAT & Production Launch', start: 'Sep 16', end: 'Oct 1', progress: 0, status: 'PENDING', color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
        <div>
          <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
            <CalendarDays size={18} className="text-[#2563eb]" /> Project Phases & Milestone Gantt Schedule
          </h3>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor critical path dependencies, target completion dates, and phase deliverables across the Q3 timeline.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#faf8ff] dark:bg-[#161616] p-1 rounded-lg border border-[#e1e2ed] dark:border-gray-800 text-xs font-semibold">
          {['WEEK', 'MONTH', 'PHASE'].map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === m ? 'bg-[#2563eb] text-white shadow-2xs font-bold' : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              {m === 'WEEK' ? 'Week View' : m === 'MONTH' ? 'Month View' : 'Phase View'}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Phase Header Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {phases.map((ph, idx) => (
          <div key={idx} className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono font-bold uppercase text-[#737686]">{ph.start} – {ph.end}</span>
              <span className={`w-2 h-2 rounded-full ${ph.color}`} />
            </div>
            <h4 className="font-bold text-xs text-[#191b23] dark:text-white">{ph.name}</h4>
            <ProgressBar progress={ph.progress} size="sm" color={ph.color} />
          </div>
        ))}
      </div>

      {/* Milestone Dependency List */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#737686]">Milestone Deliverables & Dependency Chain</h4>
        <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800 border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden">
          {(milestones.length > 0 ? milestones : [
            { id: 'MLS-01', title: 'System Architecture RFC & Security Model Sign-off', phase: 'Phase 1', dueDate: 'July 15, 2026', progress: 100, status: 'COMPLETED', dependencies: 'None (Root)' },
            { id: 'MLS-02', title: 'Kubernetes Cluster Setup & PostgreSQL Schema Migration', phase: 'Phase 2', dueDate: 'July 30, 2026', progress: 80, status: 'IN_PROGRESS', dependencies: 'MLS-01' },
            { id: 'MLS-03', title: 'OAuth 2.0 / SSO Gateway & Time Telemetry API Ingestion', phase: 'Phase 2', dueDate: 'August 15, 2026', progress: 45, status: 'IN_PROGRESS', dependencies: 'MLS-02' },
            { id: 'MLS-04', title: 'React Vite Frontend Client Dashboard Integration', phase: 'Phase 3', dueDate: 'September 1, 2026', progress: 15, status: 'IN_PROGRESS', dependencies: 'MLS-03' },
            { id: 'MLS-05', title: 'SOC-2 Compliance & Penetration Testing Audit Report', phase: 'Phase 3', dueDate: 'September 15, 2026', progress: 0, status: 'PENDING', dependencies: 'MLS-04' },
            { id: 'MLS-06', title: 'Client UAT Sign-off & Production Blue/Green Deployment', phase: 'Phase 4', dueDate: 'October 1, 2026', progress: 0, status: 'PENDING', dependencies: 'MLS-05' },
          ]).map((mls, idx) => (
            <div key={mls.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="font-bold text-[#2563eb]">{mls.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-[#737686]">{mls.phase}</span>
                </div>
                <h5 className="font-bold text-sm text-[#191b23] dark:text-white">{mls.title}</h5>
                <span className="text-xs text-[#737686] flex items-center gap-1 font-mono">
                  <Clock size={12} className="text-[#2563eb]" /> Due: <strong className="text-[#191b23] dark:text-gray-300">{mls.dueDate}</strong>
                  {mls.dependencies && mls.dependencies !== 'None (Root)' && (
                    <span className="ml-2 text-amber-600">⚠️ Depends on {mls.dependencies}</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-4 sm:w-64 justify-between">
                <div className="w-32">
                  <ProgressBar progress={mls.progress} size="sm" showLabel={true} color={mls.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-[#2563eb]'} />
                </div>
                <MilestoneStatusBadge status={mls.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MemberTimeline = () => {
  const assignments = [
    { name: 'Alex Turner', role: 'Lead Backend Systems Engineer', projects: ['PRJ-101 (EWMP Core)', 'PRJ-104 (Cloud Security)'], capacity: '95% Overallocated', color: 'text-rose-600' },
    { name: 'Elena Rostova', role: 'Enterprise Security Architect', projects: ['PRJ-104 (Cloud Security)', 'PRJ-108 (HIPAA Audit)'], capacity: '80% Optimal', color: 'text-emerald-600' },
    { name: 'David Chen', role: 'Strategic Sales Tech Lead', projects: ['PRJ-102 (Global CRM Migration)'], capacity: '60% Available', color: 'text-[#2563eb]' },
    { name: 'Samantha Wu', role: 'Senior Distributed Engineer', projects: ['PRJ-101 (EWMP Core)', 'PRJ-105 (Payroll Gateway)'], capacity: '85% Optimal', color: 'text-emerald-600' },
  ];

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-2"><User size={16} className="text-[#2563eb]" /> Team Member Workload & Allocation Timeline</span>
        <span className="text-xs font-mono text-[#737686]">July – September 2026</span>
      </h3>

      <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono text-xs">
        {assignments.map((ass, i) => (
          <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-sm font-sans text-[#191b23] dark:text-white block">{ass.name}</strong>
              <span className="text-[11px] text-[#737686]">{ass.role}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ass.projects.map((p, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] rounded font-semibold text-[11px]">
                  {p}
                </span>
              ))}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#737686] block uppercase font-sans">Allocation</span>
              <strong className={`font-bold ${ass.color}`}>{ass.capacity}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
