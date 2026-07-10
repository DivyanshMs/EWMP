import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Download, Layers } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './TaskBadges';

/**
 * TaskDrawers.jsx
 * Interactive slide-over modals for Quick Assign Task, Move Task column status, and Export Tasks configuration.
 */

export const QuickAssignModal = ({ isOpen, onClose, onConfirm, taskName = 'TSK-1042: Implement OAuth 2.0 PKCE' }) => {
  const [assignee, setAssignee] = useState('Alex Turner');
  const [role, setRole] = useState('Lead Backend Engineer');
  const [workload, setWorkload] = useState(85);
  const [notify, setNotify] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm && onConfirm({ assignee, role, workload, notify });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-4">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center font-bold">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Quick Assign Task</h3>
              <p className="text-xs text-[#737686] truncate max-w-[240px]">{taskName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black dark:hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Select Engineering Member</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold text-[#191b23] dark:text-white"
            >
              <option value="Alex Turner">Alex Turner (Lead Backend Engineer)</option>
              <option value="Samantha Wu">Samantha Wu (Senior Distributed Dev)</option>
              <option value="Elena Rostova">Elena Rostova (Enterprise Security Architect)</option>
              <option value="David Chen">David Chen (Strategic Sales Lead)</option>
              <option value="Michael Vance">Michael Vance (DevOps & SRE Manager)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Project Responsibility Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Primary Developer, QA Reviewer"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 font-mono">
              <label className="font-bold text-[#191b23] dark:text-white font-sans">Capacity Workload Allocation</label>
              <span className="text-[#2563eb] font-bold">{workload}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={workload}
              onChange={(e) => setWorkload(Number(e.target.value))}
              className="w-full accent-[#2563eb]"
            />
            <span className="text-[11px] text-[#737686] block mt-0.5 font-mono">
              {workload > 85 ? '⚠️ Warning: Member approaches capacity saturation.' : '● Optimal capacity allocation.'}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              id="notify-check"
              className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
            />
            <label htmlFor="notify-check" className="text-xs text-[#191b23] dark:text-gray-300 font-medium">
              Send instant email & EWMP notification toast to assignee
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#faf8ff] dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <UserPlus size={15} /> Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MoveTaskModal = ({ isOpen, onClose, onConfirm, currentStatus = 'IN_PROGRESS', taskName = 'TSK-1042' }) => {
  const [targetStatus, setTargetStatus] = useState(currentStatus);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const statuses = [
    { id: 'BACKLOG', label: 'Backlog', desc: 'Not ready for development sprint' },
    { id: 'TO_DO', label: 'To Do', desc: 'Queued for immediate engineering pickup' },
    { id: 'IN_PROGRESS', label: 'In Progress', desc: 'Actively being developed' },
    { id: 'REVIEW', label: 'In Review / QA', desc: 'Awaiting PR review or QA testing' },
    { id: 'BLOCKED', label: 'Blocked', desc: 'Waiting on external dependency' },
    { id: 'COMPLETED', label: 'Completed', desc: 'Verified and merged to production' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-4">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <div>
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-[#2563eb]" /> Move Task Column Status
            </h3>
            <p className="text-xs text-[#737686] font-mono mt-0.5">{taskName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black dark:hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 font-sans text-xs">
          <label className="block font-bold text-[#191b23] dark:text-white mb-1">Select Target Workflow Stage</label>
          <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-1">
            {statuses.map((st) => (
              <div
                key={st.id}
                onClick={() => setTargetStatus(st.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetStatus === st.id
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-[#2563eb] shadow-2xs'
                    : 'bg-[#faf8ff] dark:bg-[#161616] border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-[#191b23] dark:text-white block">{st.label}</span>
                  <span className="text-[11px] text-[#737686] font-mono">{st.desc}</span>
                </div>
                <StatusBadge status={st.id} size="sm" />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Optional Transition Note</label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain why this status changed (logged to audit trail)..."
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#faf8ff] dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onConfirm && onConfirm(targetStatus, note); onClose(); }}
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} /> Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExportTasksModal = ({ isOpen, onClose, onConfirm }) => {
  const [format, setFormat] = useState('CSV');
  const [scope, setScope] = useState('ALL_ACTIVE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-4">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center font-bold">
              <Download size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Export Tasks & Telemetry</h3>
              <p className="text-xs text-[#737686]">Generate enterprise audit report</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black dark:hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 font-sans text-xs">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-2">Select Export File Format</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <button
                type="button"
                onClick={() => setFormat('CSV')}
                className={`p-3 rounded-xl border font-bold text-center transition-all ${
                  format === 'CSV' ? 'bg-[#2563eb] text-white border-[#2563eb]' : 'bg-[#faf8ff] dark:bg-gray-900 text-[#737686] border-[#e1e2ed]'
                }`}
              >
                CSV Spreadsheet (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat('PDF')}
                className={`p-3 rounded-xl border font-bold text-center transition-all ${
                  format === 'PDF' ? 'bg-[#2563eb] text-white border-[#2563eb]' : 'bg-[#faf8ff] dark:bg-gray-900 text-[#737686] border-[#e1e2ed]'
                }`}
              >
                PDF Executive Dossier (.pdf)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-2">Select Export Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium text-[#191b23] dark:text-white"
            >
              <option value="ALL_ACTIVE">All Active & In-Progress Tasks</option>
              <option value="COMPLETED_Q3">Completed Q3 Deliverables</option>
              <option value="OVERDUE_ONLY">Overdue & At-Risk Escalations</option>
              <option value="MY_DEPARTMENT">My Department Scope Only</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 text-xs text-[#191b23] dark:text-gray-300">
            <strong>Audit Note:</strong> Export includes full time-tracking telemetry, assignee billing rates, and checklist progress logs.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#faf8ff] dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onConfirm && onConfirm(format, scope); onClose(); }}
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Download size={15} /> Download Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
