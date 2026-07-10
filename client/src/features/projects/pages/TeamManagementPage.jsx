import React, { useState } from 'react';
import { Users, UserPlus, Shield, Search, Filter, CheckCircle, AlertTriangle } from 'lucide-react';
import { TeamMemberCard } from '../components/ProjectCards';
import { MemberTimeline } from '../components/ProjectTimelines';

/**
 * TeamManagementPage.jsx (Page 4)
 * Dedicated workforce allocation and capacity management center for EWMP Projects.
 * Displays Assigned Members, Roles, Availability, Workload percentage, Project Permissions, and Member Timeline.
 */

const TeamManagementPage = ({ onOpenAssign }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availFilter, setAvailFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const members = [
    { name: 'Alex Turner', email: 'aturner@ewmp.enterprise', role: 'Lead Backend Systems Engineer', department: 'Engineering & Product', workload: 95, availability: 'Overallocated', projectsCount: 3, permissions: 'Full Read/Write & Milestones', hourlyRate: 145 },
    { name: 'Elena Rostova', email: 'erostova@ewmp.enterprise', role: 'Enterprise Security Architect', department: 'Security & GRC', workload: 80, availability: 'Available', projectsCount: 2, permissions: 'Audit & GRC Reviewer', hourlyRate: 160 },
    { name: 'Samantha Wu', email: 'swu@ewmp.enterprise', role: 'Senior Distributed Dev', department: 'Engineering & Product', workload: 85, availability: 'Available', projectsCount: 2, permissions: 'Code Commit & Subtasks', hourlyRate: 135 },
    { name: 'David Chen', email: 'dchen@ewmp.enterprise', role: 'Strategic Sales Lead', department: 'Sales & Revenue', workload: 60, availability: 'Available', projectsCount: 1, permissions: 'Stakeholder Read-Only', hourlyRate: 120 },
    { name: 'Michael Vance', email: 'mvance@ewmp.enterprise', role: 'DevOps & SRE Manager', department: 'Engineering & Infrastructure', workload: 90, availability: 'Overallocated', projectsCount: 4, permissions: 'Deployment Gateway Admin', hourlyRate: 150 },
    { name: 'Dr. Evelyn Reed', email: 'ereed@acmeglobal.org', role: 'Client CIO Representative', department: 'External Stakeholder', workload: 25, availability: 'Available', projectsCount: 1, permissions: 'Client Approver SLA', hourlyRate: 0 },
  ];

  const filteredMembers = members.filter(m => {
    const matchQ = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAvail = availFilter === 'ALL' || m.availability === availFilter;
    const matchDept = deptFilter === 'ALL' || m.department.includes(deptFilter);
    return matchQ && matchAvail && matchDept;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            <Users size={22} className="text-[#2563eb]" /> Enterprise Project Workforce Allocation & Capacity
          </h1>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor engineering bandwidth, balance capacity workloads, assign project roles, and enforce security access permissions.
          </p>
        </div>

        <button
          onClick={onOpenAssign}
          className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <UserPlus size={16} /> Assign Employee to Project
        </button>
      </div>

      {/* Workforce Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">Total Project Roster</span>
            <strong className="text-2xl font-extrabold text-[#191b23] dark:text-white mt-1 block">{members.length} Members</strong>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] rounded-lg border border-blue-200">
            <Users size={20} />
          </div>
        </div>

        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">Optimal Capacity</span>
            <strong className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {members.filter(m => m.availability === 'Available').length} Engineers
            </strong>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-lg border border-emerald-200">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[#737686] uppercase block">Overallocated Alerts</span>
            <strong className="text-2xl font-extrabold text-rose-600 mt-1 block">
              {members.filter(m => m.availability === 'Overallocated').length} Engineers &gt; 90%
            </strong>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-lg border border-rose-200">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Member Timeline Schedule Section */}
      <MemberTimeline />

      {/* Toolbar Search & Filter */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Employee Name, Role, or Skill Set..."
            className="w-full py-1.5 px-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-sans"
          />
        </div>

        <div className="flex items-center gap-3 font-mono">
          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="py-1.5 px-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold text-[#191b23] dark:text-white"
          >
            <option value="ALL">All Availability</option>
            <option value="Available">Available Capacity</option>
            <option value="Overallocated">Overallocated (&gt;90%)</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="py-1.5 px-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold text-[#191b23] dark:text-white"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Security">Security & GRC</option>
            <option value="Sales">Sales & Revenue</option>
          </select>
        </div>
      </div>

      {/* Assigned Members Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((mem, idx) => (
          <TeamMemberCard key={idx} member={mem} />
        ))}
      </div>

      {/* Project Permissions & Governance Matrix Table */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2 font-sans">
          <Shield size={18} className="text-[#2563eb]" /> Role-Based Access Control & Project Permissions Matrix
        </h3>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase">
                <th className="py-3 px-4">Employee Member</th>
                <th className="py-3 px-4">Assigned Department</th>
                <th className="py-3 px-4">Project Role</th>
                <th className="py-3 px-4">Permission Scope</th>
                <th className="py-3 px-4 text-right">Hourly Billing Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
              {members.map((mem, i) => (
                <tr key={i} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40">
                  <td className="py-3.5 px-4 font-bold text-[#191b23] dark:text-white">
                    {mem.name}
                    <span className="text-[11px] font-mono font-normal text-[#737686] block">{mem.email}</span>
                  </td>
                  <td className="py-3.5 px-4">{mem.department}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#2563eb]">{mem.role}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-gray-200 rounded border border-[#e1e2ed]">
                      {mem.permissions}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#191b23] dark:text-white">
                    ${mem.hourlyRate}/hr
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

export default TeamManagementPage;
