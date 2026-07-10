import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, PlusCircle, Search, Filter, ShieldAlert } from 'lucide-react';
import { MilestoneCard, ProgressBar } from '../components/ProjectCards';
import { MilestoneStatusBadge } from '../components/ProjectBadges';
import { InteractiveTimeline } from '../components/ProjectTimelines';

/**
 * MilestoneManagementPage.jsx (Page 5)
 * Dedicated milestone deliverables, dependency tracker, and timeline governance for EWMP Projects.
 */

const MilestoneManagementPage = ({ onOpenMilestone }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');

  const milestones = [
    { id: 'MLS-01', title: 'System Architecture RFC & Security Model Sign-off', phase: 'Phase 1: Scoping', dueDate: 'July 15, 2026', progress: 100, status: 'COMPLETED', dependencies: 'None (Root)', project: 'PRJ-101 (EWMP Core)' },
    { id: 'MLS-02', title: 'Kubernetes Cluster Setup & PostgreSQL Schema Migration', phase: 'Phase 2: Core Dev', dueDate: 'July 30, 2026', progress: 80, status: 'IN_PROGRESS', dependencies: 'MLS-01', project: 'PRJ-101 (EWMP Core)' },
    { id: 'MLS-03', title: 'OAuth 2.0 / SSO Gateway & Time Telemetry API Ingestion', phase: 'Phase 2: Core Dev', dueDate: 'August 15, 2026', progress: 45, status: 'IN_PROGRESS', dependencies: 'MLS-02', project: 'PRJ-101 (EWMP Core)' },
    { id: 'MLS-04', title: 'React Vite Frontend Client Dashboard Integration', phase: 'Phase 3: Frontend', dueDate: 'September 1, 2026', progress: 15, status: 'IN_PROGRESS', dependencies: 'MLS-03', project: 'PRJ-101 (EWMP Core)' },
    { id: 'MLS-05', title: 'SOC-2 Compliance & Penetration Testing Audit Report', phase: 'Phase 3: Frontend', dueDate: 'September 15, 2026', progress: 0, status: 'PENDING', dependencies: 'MLS-04', project: 'PRJ-104 (Cloud Security)' },
    { id: 'MLS-06', title: 'Client UAT Sign-off & Production Blue/Green Deployment', phase: 'Phase 4: Launch', dueDate: 'October 1, 2026', progress: 0, status: 'PENDING', dependencies: 'MLS-05', project: 'PRJ-101 (EWMP Core)' },
    { id: 'MLS-07', title: 'HIPAA Encryption Gateway KMS Key Rotation RFC', phase: 'Phase 2: Core Dev', dueDate: 'August 10, 2026', progress: 0, status: 'BLOCKED', dependencies: 'MLS-03 (Token API)', project: 'PRJ-108 (HIPAA Audit)' },
  ];

  const filteredMilestones = milestones.filter(m => {
    const matchQ = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase()) || m.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchPhase = phaseFilter === 'ALL' || m.phase.includes(phaseFilter);
    return matchQ && matchStatus && matchPhase;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            <Calendar size={22} className="text-[#2563eb]" /> Milestone Management & Deliverable Dependencies
          </h1>
          <p className="text-xs text-[#737686] mt-0.5">
            Manage target due dates, track phase deliverables, enforce dependency chain blockers, and audit progress completion.
          </p>
        </div>

        <button
          onClick={onOpenMilestone}
          className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <PlusCircle size={16} /> Create Milestone
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">Total Milestones</span>
            <strong className="text-2xl font-extrabold text-[#191b23] dark:text-white mt-1 block">{milestones.length} Deliverables</strong>
          </div>
          <Calendar size={20} className="text-[#2563eb]" />
        </div>
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">Completed SLA</span>
            <strong className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {milestones.filter(m=>m.status==='COMPLETED').length} Met
            </strong>
          </div>
          <CheckCircle2 size={20} className="text-emerald-600" />
        </div>
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">In Progress</span>
            <strong className="text-2xl font-extrabold text-[#2563eb] mt-1 block">
              {milestones.filter(m=>m.status==='IN_PROGRESS').length} Active
            </strong>
          </div>
          <Clock size={20} className="text-[#2563eb]" />
        </div>
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">Dependency Blocked</span>
            <strong className="text-2xl font-extrabold text-rose-600 mt-1 block">
              {milestones.filter(m=>m.status==='BLOCKED').length} Blockers
            </strong>
          </div>
          <ShieldAlert size={20} className="text-rose-600" />
        </div>
      </div>

      {/* Interactive Gantt Timeline */}
      <InteractiveTimeline milestones={filteredMilestones} />

      {/* Toolbar Search & Filter */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Milestones by Title, ID, or Associated Project..."
            className="w-full py-1.5 px-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-sans"
          />
        </div>

        <div className="flex items-center gap-3 font-mono">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold text-[#191b23] dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Not Started</option>
            <option value="BLOCKED">Dependency Blocked</option>
          </select>

          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="py-1.5 px-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold text-[#191b23] dark:text-white"
          >
            <option value="ALL">All Phases</option>
            <option value="Phase 1">Phase 1: Architecture</option>
            <option value="Phase 2">Phase 2: Core Dev</option>
            <option value="Phase 3">Phase 3: Frontend</option>
            <option value="Phase 4">Phase 4: Launch</option>
          </select>
        </div>
      </div>

      {/* Milestones Directory Table */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase">
                <th className="py-3 px-4">Milestone Deliverable</th>
                <th className="py-3 px-4">Project Association</th>
                <th className="py-3 px-4">Phase</th>
                <th className="py-3 px-4">Target Due Date</th>
                <th className="py-3 px-4 w-40">Progress Completion</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dependency Blockers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
              {filteredMilestones.map((mls) => (
                <tr key={mls.id} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40">
                  <td className="py-3.5 px-4 font-bold text-[#191b23] dark:text-white">
                    <span className="font-mono text-[10px] text-[#2563eb] block">{mls.id}</span>
                    {mls.title}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#191b23] dark:text-gray-300">{mls.project}</td>
                  <td className="py-3.5 px-4 text-[11px] text-[#737686] font-mono">{mls.phase}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#191b23] dark:text-white">{mls.dueDate}</td>
                  <td className="py-3.5 px-4 w-40">
                    <ProgressBar progress={mls.progress} size="sm" showLabel={true} color={mls.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-[#2563eb]'} />
                  </td>
                  <td className="py-3.5 px-4">
                    <MilestoneStatusBadge status={mls.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {mls.dependencies === 'None (Root)' || mls.dependencies === 'None' ? (
                      <span className="text-gray-400">None</span>
                    ) : (
                      <span className="text-amber-600 font-bold">⚠️ {mls.dependencies}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MilestoneManagementPage;
