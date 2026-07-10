import React, { useState } from 'react';
import { CalendarDays, PlusCircle } from 'lucide-react';
import { InteractiveTimeline } from '../components/ProjectTimelines';
import { MilestoneCard, ProgressBar } from '../components/ProjectCards';

/**
 * ProjectTimelinePage.jsx (Page 7)
 * Interactive Gantt chart schedules, phase dependency mappers, and calendar view for EWMP Projects.
 */

const ProjectTimelinePage = ({ onOpenMilestone }) => {
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [viewType, setViewType] = useState('GANTT'); // 'GANTT' | 'CALENDAR'

  const phases = [
    { name: 'Phase 1: Scoping & Architecture RFC', dates: 'Jul 1 – Jul 15', progress: 100, status: 'COMPLETED', color: 'bg-emerald-500', lead: 'Elena Rostova (Security)' },
    { name: 'Phase 2: Core Microservices & Database', dates: 'Jul 16 – Aug 15', progress: 65, status: 'IN_PROGRESS', color: 'bg-[#2563eb]', lead: 'Alex Turner (Backend)' },
    { name: 'Phase 3: Frontend UI & Security Audit', dates: 'Aug 16 – Sep 15', progress: 20, status: 'IN_PROGRESS', color: 'bg-purple-500', lead: 'Samantha Wu (Frontend)' },
    { name: 'Phase 4: Client UAT & Production Launch', dates: 'Sep 16 – Oct 1', progress: 0, status: 'PENDING', color: 'bg-amber-500', lead: 'Marcus Tech VP' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            <CalendarDays size={22} className="text-[#2563eb]" /> Interactive Project Timeline & Gantt Schedule
          </h1>
          <p className="text-xs text-[#737686] mt-0.5">
            Visualize project lifecycle phases, map critical path dependencies, and inspect milestone target completion SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-[#faf8ff] dark:bg-[#161616] p-1 rounded-lg border border-[#e1e2ed] dark:border-gray-800 text-xs font-semibold">
            <button
              onClick={() => setViewType('GANTT')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewType === 'GANTT' ? 'bg-[#2563eb] text-white font-bold shadow-2xs' : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              Gantt View
            </button>
            <button
              onClick={() => setViewType('CALENDAR')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewType === 'CALENDAR' ? 'bg-[#2563eb] text-white font-bold shadow-2xs' : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              Calendar Grid View
            </button>
          </div>

          <button
            onClick={onOpenMilestone}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle size={15} /> Add Milestone
          </button>
        </div>
      </div>

      {/* Phase Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((ph, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhase(selectedPhase === ph.name ? 'ALL' : ph.name)}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              selectedPhase === ph.name
                ? 'bg-blue-50/60 dark:bg-blue-950/40 border-[#2563eb] shadow-sm'
                : 'bg-[#ffffff] dark:bg-[#111111] border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
            }`}
          >
            <div className="flex justify-between items-start mb-2 font-mono">
              <span className="text-[11px] text-[#737686] font-bold uppercase">{ph.dates}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${ph.color}`} />
            </div>
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white mb-1 line-clamp-1">{ph.name}</h3>
            <span className="text-[11px] text-[#737686] block font-mono mb-3">Lead: {ph.lead}</span>
            <ProgressBar progress={ph.progress} size="sm" color={ph.color} />
          </div>
        ))}
      </div>

      {/* VIEW CONTENT: GANTT vs CALENDAR */}
      {viewType === 'GANTT' ? (
        <InteractiveTimeline />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
            <div>
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
                <CalendarIcon size={18} className="text-[#2563eb]" /> Q3 2026 Enterprise Milestone Calendar
              </h3>
              <p className="text-xs text-[#737686] mt-0.5">Showing scheduled deliverable drop dates across July, August, and September</p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] px-3 py-1 rounded-full border border-blue-200">
              Active Schedule: 7 Milestones
            </span>
          </div>

          {/* Monthly Calendar Layout Grid Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {[
              { month: 'July 2026', milestones: [
                { date: 'Jul 15', title: 'System Architecture RFC Sign-off', status: 'COMPLETED', project: 'PRJ-101' },
                { date: 'Jul 30', title: 'Kubernetes & PostgreSQL Migration', status: 'IN_PROGRESS', project: 'PRJ-101' }
              ]},
              { month: 'August 2026', milestones: [
                { date: 'Aug 10', title: 'HIPAA KMS Key Rotation RFC', status: 'BLOCKED', project: 'PRJ-108' },
                { date: 'Aug 15', title: 'OAuth 2.0 / SSO Gateway & Time API', status: 'IN_PROGRESS', project: 'PRJ-101' }
              ]},
              { month: 'September 2026', milestones: [
                { date: 'Sep 1', title: 'React Vite Frontend Client Dashboard', status: 'IN_PROGRESS', project: 'PRJ-101' },
                { date: 'Sep 15', title: 'SOC-2 Compliance & Pen Testing Audit', status: 'PENDING', project: 'PRJ-104' },
                { date: 'Oct 1', title: 'Client UAT Sign-off & Production Launch', status: 'PENDING', project: 'PRJ-101' }
              ]},
            ].map((col, idx) => (
              <div key={idx} className="bg-[#faf8ff] dark:bg-gray-900/40 p-4 rounded-xl border border-[#e1e2ed] dark:border-gray-800 space-y-3">
                <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between font-mono">
                  <span>{col.month}</span>
                  <span className="text-[11px] text-[#2563eb]">{col.milestones.length} Events</span>
                </h4>
                <div className="space-y-2.5">
                  {col.milestones.map((ev, i) => (
                    <div key={i} className="bg-white dark:bg-[#161616] p-3 rounded-lg border border-[#e1e2ed] dark:border-gray-800 shadow-2xs space-y-1.5">
                      <div className="flex justify-between items-center font-mono text-[10px]">
                        <span className="font-bold text-[#2563eb]">{ev.project} • {ev.date}</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold ${ev.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : ev.status === 'BLOCKED' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-[#2563eb]'}`}>
                          {ev.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-[#191b23] dark:text-white line-clamp-2">{ev.title}</h5>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTimelinePage;
