import React, { useState } from 'react';
import { X, Target, FileText, CheckCircle2 } from 'lucide-react';

/**
 * PerformanceDrawers.jsx
 * Precision Enterprise modal dialogs and slide-out drawers for EWMP Performance Management.
 */

export const CreateReviewModal = ({ isOpen, onClose, onConfirm }) => {
  const [employeeName, setEmployeeName] = useState('Sarah Jenkins (EMP-0142)');
  const [reviewer, setReviewer] = useState('Marcus Tech VP');
  const [cycle, setCycle] = useState('H1 2026 Appraisal');
  const [department, setDepartment] = useState('Engineering');
  const [dueDate, setDueDate] = useState('2026-07-31');
  const [notes, setNotes] = useState('Evaluate half-yearly KPI achievement, technical architecture contributions, and team mentorship.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm && onConfirm({
      id: `REV-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: employeeName.split(' ')[0] + ' ' + employeeName.split(' ')[1],
      reviewer,
      cycle,
      department,
      rating: 4.5,
      status: 'SELF_REVIEW_PENDING',
      submissionDate: 'Pending Self',
      goalsCompleted: 0,
      totalGoals: 6
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white">CREATE NEW PERFORMANCE REVIEW CYCLE</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Select Employee / Target Staff</label>
            <select
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
            >
              <option value="Sarah Jenkins (EMP-0142)">Sarah Jenkins (Senior Software Engineer • Eng)</option>
              <option value="John Doe (EMP-0089)">John Doe (DevOps Lead • Eng)</option>
              <option value="Emily Vance (EMP-0034)">Emily Vance (HR Specialist • HR)</option>
              <option value="David Miller (EMP-0012)">David Miller (Finance Manager • Finance)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Review Cycle Period</label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
              >
                <option value="H1 2026 Appraisal">H1 2026 Appraisal (Jan–Jun)</option>
                <option value="Annual FY 2026">Annual FY 2026 Comprehensive</option>
                <option value="Probation 90-Day">90-Day Probation Review</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Assigned Reviewer / Manager</label>
              <input
                type="text"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Submission Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Appraisal Focus & Mandated Evaluation Areas</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
              placeholder="Enter instructions for self-assessment and managerial review..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} /> Launch Review Cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AssignGoalModal = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [milestone1, setMilestone1] = useState('Complete architecture blueprint and get InfoSec approval');
  const [milestone2, setMilestone2] = useState('Deploy canary test to staging environment');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a Goal title.');

    onConfirm && onConfirm({
      id: `KPI-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      priority,
      status: 'IN_PROGRESS',
      progress: 0,
      dueDate,
      completedMilestones: 0,
      totalMilestones: 2
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white">ASSIGN NEW GOAL & KPI METRIC</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Goal / KPI Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Zero-Trust Network Architecture for Internal APIs"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Measurable Description & Success Metrics</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what success looks like and key deliverables..."
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
            <label className="block font-bold text-[#191b23] dark:text-white">Milestone Progress Breakdown</label>
            <input
              type="text"
              value={milestone1}
              onChange={(e) => setMilestone1(e.target.value)}
              placeholder="Milestone 1 description..."
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
            />
            <input
              type="text"
              value={milestone2}
              onChange={(e) => setMilestone2(e.target.value)}
              placeholder="Milestone 2 description..."
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Target size={15} /> Assign Goal & Lock KPI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
