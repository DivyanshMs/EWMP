import React from 'react';
import { Users, AlertTriangle, CheckCircle2, UserPlus } from 'lucide-react';
import { ChartPlaceholder, ProgressBar } from '../components/TaskCards';

/**
 * TeamWorkloadPage.jsx
 * Capacity and Workforce Allocation Center for EWMP Task Management.
 * Features: Employee Workload, Task Distribution, Capacity, Availability, Overloaded Members, and Charts Placeholder.
 */

export const TeamWorkloadPage = ({ onAssignTask }) => {
  const members = [
    { name: 'Alex Turner', role: 'Lead Backend Engineer', dept: 'Engineering', activeTasks: 6, completedQ3: 18, capacityPct: 92, status: 'OVERLOADED', avatar: 'A', billRate: '$145/hr' },
    { name: 'Samantha Wu', role: 'Senior Distributed Dev', dept: 'Engineering', activeTasks: 4, completedQ3: 22, capacityPct: 75, status: 'OPTIMAL', avatar: 'S', billRate: '$140/hr' },
    { name: 'Elena Rostova', role: 'Enterprise Security Architect', dept: 'InfoSec', activeTasks: 5, completedQ3: 14, capacityPct: 88, status: 'HIGH_LOAD', avatar: 'E', billRate: '$160/hr' },
    { name: 'David Chen', role: 'Strategic Sales Lead', dept: 'Sales', activeTasks: 2, completedQ3: 9, capacityPct: 45, status: 'AVAILABLE', avatar: 'D', billRate: '$125/hr' },
    { name: 'Michael Vance', role: 'DevOps & SRE Manager', dept: 'DevOps', activeTasks: 7, completedQ3: 31, capacityPct: 98, status: 'CRITICAL_OVERLOAD', avatar: 'M', billRate: '$155/hr' }
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner Row */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border border-emerald-200">
              CAPACITY TELEMETRY
            </span>
            <span className="text-xs text-[#737686] font-mono">Real-time Workforce Allocation Grid</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Team Workload & Resource Saturation Matrix
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor employee task distribution, identify overloaded engineering members, and balance sprint capacity.
          </p>
        </div>

        <button
          onClick={() => onAssignTask && onAssignTask()}
          className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 shrink-0"
        >
          <UserPlus size={16} /> Reallocate Workforce Tasks
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#737686] uppercase font-sans">Total Engineering Capacity</span>
          <h3 className="text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">82.4% Utilized</h3>
          <span className="text-[11px] text-emerald-600 font-bold font-sans block mt-2">● Within 85% SLA Threshold</span>
        </div>

        <div className="bg-[#ffffff] dark:bg-[#111111] border border-rose-200 dark:border-rose-900/60 rounded-xl p-5 shadow-xs bg-rose-50/20">
          <span className="text-xs font-bold text-rose-700 uppercase font-sans flex items-center gap-1">
            <AlertTriangle size={14} /> Overloaded Members
          </span>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1">2 Engineers</h3>
          <span className="text-[11px] text-rose-700 font-bold font-sans block mt-2">Requires immediate task offloading</span>
        </div>

        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#737686] uppercase font-sans">Available Workstream Slots</span>
          <h3 className="text-2xl font-extrabold text-[#2563eb] mt-1">14 Deliverables</h3>
          <span className="text-[11px] text-[#737686] font-sans block mt-2">Ready for sprint injection</span>
        </div>

        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#737686] uppercase font-sans">Avg Task Completion Time</span>
          <h3 className="text-2xl font-extrabold text-purple-600 mt-1">18.5 Hours</h3>
          <span className="text-[11px] text-emerald-600 font-bold font-sans block mt-2">⬇ 2.4h faster than Q2</span>
        </div>
      </div>

      {/* Charts Placeholder Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Department Task Distribution & Workload Share" type="BAR" height="h-80" />
        <ChartPlaceholder title="Workforce Capacity Saturation Breakdown" type="DONUT" height="h-80" />
      </div>

      {/* Employee Workload Roster Table */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs space-y-4">
        <div className="p-5 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <Users size={18} className="text-[#2563eb]" /> Itemized Employee Workload & Availability Roster
          </h3>
          <span className="text-xs font-mono text-[#737686]">Synchronized with EWMP Employee Directory</span>
        </div>

        <div className="overflow-x-auto font-sans text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase font-bold text-[11px] select-none font-mono">
                <th className="py-3.5 px-5">Engineering Team Member</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Active Tasks</th>
                <th className="py-3.5 px-4">Completed Q3</th>
                <th className="py-3.5 px-4 w-48">Workload Capacity Saturation</th>
                <th className="py-3.5 px-4">Availability Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
              {members.map((m, idx) => {
                const isOver = m.capacityPct > 88;

                return (
                  <tr key={idx} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs shrink-0">
                          {m.avatar}
                        </div>
                        <div>
                          <strong className="font-bold text-sm text-[#191b23] dark:text-white block">{m.name}</strong>
                          <span className="text-xs text-[#737686] font-mono">{m.role} • {m.billRate}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs font-semibold">
                      {m.dept}
                    </td>

                    <td className="py-4 px-4 font-mono font-extrabold text-sm text-[#2563eb]">
                      {m.activeTasks} tasks
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-xs text-emerald-600">
                      ✓ {m.completedQ3} verified
                    </td>

                    <td className="py-4 px-4 w-48">
                      <ProgressBar 
                        progress={m.capacityPct} 
                        size="md" 
                        showLabel={true} 
                        color={isOver ? 'bg-rose-600' : 'bg-[#2563eb]'} 
                      />
                    </td>

                    <td className="py-4 px-4 font-mono font-bold">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-200">
                          <AlertTriangle size={12} /> Overloaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 size={12} /> Optimal
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right font-mono">
                      <button 
                        onClick={() => onAssignTask && onAssignTask()}
                        className="px-3 py-1.5 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded-lg border border-[#e1e2ed] transition-colors"
                      >
                        Rebalance Tasks
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
