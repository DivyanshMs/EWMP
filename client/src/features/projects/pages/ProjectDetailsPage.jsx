import React, { useState } from 'react';
import { FolderKanban, Calendar, Users, DollarSign, CheckCircle2, FileText, ShieldAlert, Activity, ArrowLeft, Download, PlusCircle, ExternalLink } from 'lucide-react';
import { ProjectStatusBadge, ProjectHealthBadge, PriorityBadge, MilestoneStatusBadge } from '../components/ProjectBadges';
import { ProgressBar, BudgetCard, TeamMemberCard, MilestoneCard } from '../components/ProjectCards';

/**
 * ProjectDetailsPage.jsx (Page 3)
 * Comprehensive project dossier in EWMP Project Management.
 * Features Overview, Description, Client Info, Budget, Timeline, Milestones, Team Members, Project Files, Risks, and Recent Activity.
 */

const ProjectDetailsPage = ({ project, onBack, onOpenAssign, onOpenMilestone }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'MILESTONES' | 'TEAM' | 'FILES' | 'RISKS' | 'ACTIVITY'

  const proj = project || {
    id: 'PRJ-101',
    name: 'Distributed SSO Authentication & Workforce Time Telemetry Engine',
    client: 'Acme Global Enterprises',
    projectManager: 'Marcus Tech VP',
    department: 'Engineering & Core Product',
    priority: 'CRITICAL',
    budget: 450000,
    spent: 285000,
    startDate: 'July 1, 2026',
    endDate: 'October 1, 2026',
    status: 'ACTIVE',
    health: 'ON_TRACK',
    progress: 68,
    description: 'Enterprise initiative to modernize SSO authentication gateways across 14 organizational modules, integrate zero-latency Redis token validation, and unify biometric attendance telemetry ingestion with high-speed PostgreSQL partitioning.',
    clientContact: 'Dr. Evelyn Reed (Chief Information Officer)',
    clientEmail: 'ereed@acmeglobal.org',
    teamSize: 8,
    risksCount: 2,
    filesCount: 14
  };

  const mockMilestones = [
    { id: 'MLS-01', title: 'System Architecture RFC & Security Model Sign-off', phase: 'Phase 1: Architecture', dueDate: 'July 15, 2026', progress: 100, status: 'COMPLETED', dependencies: 'None' },
    { id: 'MLS-02', title: 'Kubernetes Cluster Setup & PostgreSQL Schema Migration', phase: 'Phase 2: Core Dev', dueDate: 'July 30, 2026', progress: 80, status: 'IN_PROGRESS', dependencies: 'MLS-01' },
    { id: 'MLS-03', title: 'OAuth 2.0 / SSO Gateway & Time Telemetry API Ingestion', phase: 'Phase 2: Core Dev', dueDate: 'August 15, 2026', progress: 45, status: 'IN_PROGRESS', dependencies: 'MLS-02' },
  ];

  const mockTeam = [
    { name: 'Alex Turner', role: 'Lead Backend Systems Engineer', department: 'Engineering', workload: 95, availability: 'Overallocated', projectsCount: 3 },
    { name: 'Elena Rostova', role: 'Enterprise Security Architect', department: 'Security & GRC', workload: 80, availability: 'Available', projectsCount: 2 },
    { name: 'Samantha Wu', role: 'Senior Distributed Systems Dev', department: 'Engineering', workload: 85, availability: 'Available', projectsCount: 2 },
  ];

  const mockFiles = [
    { name: 'EWMP_Core_SSO_Architecture_v2.4.pdf', size: '4.8 MB', updated: 'July 5, 2026', author: 'Elena Rostova', type: 'Architecture SPEC' },
    { name: 'PostgreSQL_Partitioning_Benchmark_Q3.xlsx', size: '1.2 MB', updated: 'July 4, 2026', author: 'Alex Turner', type: 'Performance Lab' },
    { name: 'SOC2_Type2_Security_Audit_Scope.docx', size: '840 KB', updated: 'July 2, 2026', author: 'Marcus Tech VP', type: 'Compliance GRC' },
    { name: 'Acme_Global_SLA_Agreement_Signed.pdf', size: '3.1 MB', updated: 'July 1, 2026', author: 'Divyansh Super Admin', type: 'Legal Contract' },
  ];

  const mockRisks = [
    { id: 'RSK-01', title: 'Redis Cluster Memory Eviction during Peak Morning Shift Check-ins', severity: 'HIGH', impact: 'Potential 400ms latency spike during 9 AM check-in burst.', mitigation: 'Upgraded AWS ElastiCache node sizes and implemented aggressive token TTL pruning.', status: 'MITIGATING', owner: 'Alex Turner' },
    { id: 'RSK-02', title: 'Third-Party Biometric Terminal SDK Firmware Incompatibility', severity: 'MEDIUM', impact: 'Delayed time synchronization for legacy Model T-100 clocks.', mitigation: 'Created fallback REST webhook ingestion buffer.', status: 'OPEN', owner: 'Samantha Wu' },
  ];

  const mockActivity = [
    { user: 'Alex Turner', action: 'completed milestone deliverable', target: 'MLS-01: System Architecture RFC Sign-off', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-600' },
    { user: 'Marcus Tech VP', action: 'assigned employee', target: 'Samantha Wu (Senior Distributed Dev) to project roster', time: 'Yesterday at 4:15 PM', icon: Users, color: 'text-[#2563eb]' },
    { user: 'Elena Rostova', action: 'uploaded compliance architecture specification', target: 'EWMP_Core_SSO_Architecture_v2.4.pdf', time: 'July 5, 2026', icon: FileText, color: 'text-purple-600' },
    { user: 'Dr. Evelyn Reed (Client)', action: 'approved Q3 budget allocation milestone', target: '$450,000 baseline budget locked', time: 'July 1, 2026', icon: DollarSign, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Back Strip & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded-lg transition-colors"
            title="Return to Directory"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#2563eb]">{proj.id}</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-[#737686]">{proj.department}</span>
              <PriorityBadge priority={proj.priority} />
              <ProjectHealthBadge health={proj.health} />
            </div>
            <h1 className="text-xl font-extrabold text-[#191b23] dark:text-white line-clamp-1">{proj.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ProjectStatusBadge status={proj.status} />
          <button
            onClick={onOpenAssign}
            className="px-3 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-1.5 font-sans"
          >
            <Users size={14} className="text-[#2563eb]" /> Assign Member
          </button>
          <button
            onClick={onOpenMilestone}
            className="px-3.5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 font-sans"
          >
            <PlusCircle size={14} /> Add Milestone
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 bg-[#ffffff] dark:bg-[#111111] p-1.5 rounded-xl border border-[#e1e2ed] dark:border-gray-800 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'OVERVIEW', label: 'Overview & Client Dossier', icon: FolderKanban },
          { id: 'MILESTONES', label: `Milestones (${mockMilestones.length})`, icon: Calendar },
          { id: 'TEAM', label: `Assigned Team (${proj.teamSize || mockTeam.length})`, icon: Users },
          { id: 'FILES', label: `Project Files (${mockFiles.length})`, icon: FileText },
          { id: 'RISKS', label: `Risk Register (${mockRisks.length})`, icon: ShieldAlert },
          { id: 'ACTIVITY', label: 'Audit Trail Activity', icon: Activity },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive ? 'bg-[#2563eb] text-white font-bold shadow-2xs' : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white hover:bg-[#faf8ff] dark:hover:bg-gray-900'
              }`}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dossier Column (2 col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
                <FolderKanban size={16} className="text-[#2563eb]" /> Executive Scope & Technical Charter
              </h3>
              <p className="text-sm text-[#434655] dark:text-gray-300 leading-relaxed font-sans">
                {proj.description}
              </p>
              
              <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
                <ProgressBar progress={proj.progress} size="lg" showLabel={true} color="bg-[#2563eb]" />
              </div>
            </div>

            {/* Client & Stakeholder Information Card */}
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4 font-sans">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
                <Users size={16} className="text-[#2563eb]" /> Client & Stakeholder Governance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/60">
                  <span className="text-[10px] text-[#737686] uppercase font-mono block">Client Organization</span>
                  <strong className="text-sm text-[#191b23] dark:text-white font-bold">{proj.client}</strong>
                </div>
                <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/60">
                  <span className="text-[10px] text-[#737686] uppercase font-mono block">Primary Contact CIO</span>
                  <strong className="text-sm text-[#191b23] dark:text-white font-bold">{proj.clientContact || 'Dr. Evelyn Reed'}</strong>
                </div>
                <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/60">
                  <span className="text-[10px] text-[#737686] uppercase font-mono block">Contact Email</span>
                  <span className="text-xs text-[#2563eb] font-mono block">{proj.clientEmail || 'ereed@acmeglobal.org'}</span>
                </div>
                <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/60">
                  <span className="text-[10px] text-[#737686] uppercase font-mono block">Project Manager</span>
                  <strong className="text-sm text-[#191b23] dark:text-white font-bold">{proj.projectManager}</strong>
                </div>
              </div>
            </div>

            {/* Recent Activity Snapshot */}
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
                <span className="flex items-center gap-2"><Activity size={16} className="text-[#2563eb]" /> Recent Telemetry Activity</span>
                <button onClick={() => setActiveTab('ACTIVITY')} className="text-xs text-[#2563eb] font-semibold hover:underline">View All Log</button>
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {mockActivity.slice(0, 3).map((act, idx) => {
                  const IconComp = act.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 py-1.5">
                      <div className={`p-1.5 rounded-full bg-[#faf8ff] dark:bg-gray-800 border ${act.color} mt-0.5`}>
                        <IconComp size={14} />
                      </div>
                      <div className="flex-1 font-sans">
                        <p className="text-xs text-[#191b23] dark:text-gray-200">
                          <strong className="font-bold text-[#2563eb]">{act.user}</strong> {act.action}: <strong className="font-semibold">{act.target}</strong>
                        </p>
                        <span className="text-[11px] font-mono text-[#737686]">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Budget Usage & Schedule (1 col) */}
          <div className="space-y-6">
            <BudgetCard
              title="Allocated vs Spent Budget"
              allocated={proj.budget || 450000}
              spent={proj.spent || 285000}
              remaining={(proj.budget || 450000) - (proj.spent || 285000)}
            />

            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4 font-mono">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white pb-2 border-b border-[#e1e2ed] dark:border-gray-800 font-sans flex items-center gap-2">
                <Calendar size={16} className="text-[#2563eb]" /> Schedule & Milestones
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#737686]">Start Date:</span>
                  <strong className="text-[#191b23] dark:text-white">{proj.startDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Target Completion:</span>
                  <strong className="text-[#191b23] dark:text-white">{proj.endDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Total Duration:</span>
                  <strong className="text-[#2563eb]">92 Calendar Days</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
                <button
                  onClick={() => setActiveTab('MILESTONES')}
                  className="w-full py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] font-bold rounded-lg text-center text-xs transition-colors"
                >
                  Inspect All {mockMilestones.length} Milestones
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONES */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-[#2563eb]" /> Project Phase Milestones & Dependencies
            </h3>
            <button onClick={onOpenMilestone} className="px-4 py-2 bg-[#2563eb] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs">
              <PlusCircle size={14} /> Add Milestone
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMilestones.map((mls) => (
              <MilestoneCard key={mls.id} milestone={mls} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEAM MEMBERS */}
      {activeTab === 'TEAM' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <Users size={18} className="text-[#2563eb]" /> Assigned Engineering Team Roster
            </h3>
            <button onClick={onOpenAssign} className="px-4 py-2 bg-[#2563eb] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs">
              <PlusCircle size={14} /> Assign New Member
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTeam.map((mem, i) => (
              <TeamMemberCard key={i} member={mem} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROJECT FILES */}
      {activeTab === 'FILES' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-[#2563eb]" /> Attached Specifications, Compliance Audits & SLAs
            </h3>
            <button className="px-4 py-2 bg-[#faf8ff] dark:bg-gray-800 border border-[#e1e2ed] rounded-lg text-xs font-semibold text-[#2563eb] flex items-center gap-1.5">
              <PlusCircle size={14} /> Upload Document
            </button>
          </div>
          <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono text-xs">
            {mockFiles.map((file, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 p-2 rounded transition-colors font-sans">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] font-mono font-bold text-[10px]">
                    {file.type}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#191b23] dark:text-white hover:text-[#2563eb] cursor-pointer flex items-center gap-1">
                      {file.name} <ExternalLink size={12} className="text-gray-400" />
                    </h4>
                    <span className="text-[11px] font-mono text-[#737686]">Uploaded by {file.author} on {file.updated} • Size: {file.size}</span>
                  </div>
                </div>
                <button className="p-2 bg-[#faf8ff] dark:bg-gray-800 text-[#2563eb] rounded-lg hover:bg-[#ededf9] transition-colors">
                  <Download size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RISKS */}
      {activeTab === 'RISKS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-600" /> Enterprise Risk Register & Mitigation Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRisks.map((rsk) => (
              <div key={rsk.id} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-200">
                    {rsk.id} • {rsk.severity} SEVERITY
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    {rsk.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#191b23] dark:text-white">{rsk.title}</h4>
                <p className="text-xs text-[#737686] font-sans">
                  <strong>Impact:</strong> {rsk.impact}
                </p>
                <div className="p-2.5 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60 text-xs font-sans">
                  <strong className="text-[#2563eb] block text-[11px] font-mono uppercase mb-0.5">Mitigation Action</strong>
                  <span className="text-[#191b23] dark:text-gray-300">{rsk.mitigation}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-[#737686] pt-1 border-t border-[#e1e2ed] dark:border-gray-800">
                  <span>Risk Owner: <strong className="text-[#191b23] dark:text-white font-sans">{rsk.owner}</strong></span>
                  <span className="text-emerald-600 font-bold">● Active Monitoring</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ACTIVITY LOG */}
      {activeTab === 'ACTIVITY' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <Activity size={18} className="text-[#2563eb]" /> Complete Audit Trail & Telemetry Timeline
          </h3>
          <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono text-xs">
            {mockActivity.map((act, idx) => {
              const IconComp = act.icon;
              return (
                <div key={idx} className="py-3 flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-[#faf8ff] dark:bg-gray-800 border ${act.color}`}>
                    <IconComp size={16} />
                  </div>
                  <div className="flex-1 font-sans">
                    <p className="text-sm text-[#191b23] dark:text-white">
                      <strong className="font-bold text-[#2563eb]">{act.user}</strong> {act.action}: <strong className="font-semibold text-[#191b23] dark:text-gray-200">{act.target}</strong>
                    </p>
                    <span className="text-[11px] font-mono text-[#737686] block mt-0.5">{act.time} • Verified via EWMP Auth Gateway</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
