import React, { useState } from 'react';
import { FolderKanban, Users, Calendar, PlusCircle } from 'lucide-react';

/**
 * ProjectDrawers.jsx
 * Systematic modals and drawers for EWMP Project Management quick actions.
 */

export const CreateProjectModal = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [pm, setPm] = useState('Marcus Tech VP');
  const [department, setDepartment] = useState('Engineering & Product');
  const [priority, setPriority] = useState('HIGH');
  const [budget, setBudget] = useState('250000');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-10-01');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProj = {
      id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: name || 'New Enterprise Initiative',
      client: client || 'Internal EWMP Core',
      projectManager: pm,
      department,
      priority,
      budget: Number(budget) || 100000,
      spent: 0,
      startDate,
      endDate,
      status: 'ACTIVE',
      health: 'ON_TRACK',
      progress: 0,
      teamSize: 5
    };
    onConfirm && onConfirm(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#191b23] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm">CREATE ENTERPRISE PROJECT</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Project Name & Title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed SSO Authentication & Payroll Telemetry Engine"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Client / Stakeholder <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Acme Global or Internal"
                className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Project Manager</label>
              <select
                value={pm}
                onChange={(e) => setPm(e.target.value)}
                className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium"
              >
                <option value="Marcus Tech VP">Marcus Tech VP (Eng)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (VP Sales)</option>
                <option value="Emily Vance">Emily Vance (People Ops)</option>
                <option value="Divyansh Super Admin">Divyansh Super Admin (CEO)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium"
              >
                <option value="Engineering & Product">Engineering</option>
                <option value="Sales & Revenue">Sales</option>
                <option value="HR & Ops">HR & Ops</option>
                <option value="Finance & Legal">Finance</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Total Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Target End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle size={15} /> Publish Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AssignTeamModal = ({ isOpen, onClose, onConfirm, projectName = 'Selected Project' }) => {
  const [member, setMember] = useState('Alex Turner');
  const [role, setRole] = useState('Lead Backend Systems Engineer');
  const [workload, setWorkload] = useState('75');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#191b23] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm">ASSIGN TEAM MEMBER • {projectName}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded">✕</button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Select Employee</label>
            <select
              value={member}
              onChange={(e) => setMember(e.target.value)}
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium"
            >
              <option value="Alex Turner">Alex Turner (Senior SDE)</option>
              <option value="Elena Rostova">Elena Rostova (Security Architect)</option>
              <option value="David Chen">David Chen (Sales Lead)</option>
              <option value="Samantha Wu">Samantha Wu (Backend Eng)</option>
              <option value="Michael Vance">Michael Vance (DevOps Lead)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Project Role & Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Workload Allocation: <strong className="text-[#2563eb]">{workload}%</strong></label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              className="w-full accent-[#2563eb] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button onClick={onClose} className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded">Cancel</button>
            <button
              onClick={() => {
                onConfirm && onConfirm({ name: member, role, workload: Number(workload), department: 'Engineering', availability: 'Available' });
                onClose();
              }}
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs flex items-center gap-1.5"
            >
              <Users size={14} /> Assign to Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CreateMilestoneModal = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-08-15');
  const [phase, setPhase] = useState('Phase 2: Core Development');
  const [dependencies, setDependencies] = useState('MLS-01');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#191b23] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm">CREATE PROJECT MILESTONE</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded">✕</button>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Milestone Title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Redis Cache Race Condition Resolution"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Project Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium"
              >
                <option value="Phase 1: Scoping">Phase 1: Architecture & Scoping</option>
                <option value="Phase 2: Core Dev">Phase 2: Core Microservices</option>
                <option value="Phase 3: Frontend">Phase 3: Frontend UI & Audit</option>
                <option value="Phase 4: Launch">Phase 4: UAT & Launch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Dependency Linkage</label>
            <input
              type="text"
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="e.g. MLS-01 or None (Root)"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button onClick={onClose} className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded">Cancel</button>
            <button
              onClick={() => {
                onConfirm && onConfirm({ id: `MLS-${Math.floor(10 + Math.random()*90)}`, title: title || 'New Milestone Deliverable', dueDate, phase, status: 'IN_PROGRESS', progress: 0, dependencies });
                onClose();
              }}
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Add Milestone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
