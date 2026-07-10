import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, FolderKanban, Clock, Layers, Save, FileText, ShieldAlert } from 'lucide-react';

/**
 * CreateEditTaskPage.jsx
 * Comprehensive form for creating or editing an enterprise task deliverable.
 * Supports: Name, Description, Project link, Assignee, Priority, Status, Due Date, Estimated Time, Tags, Checklist, and Attachments.
 */

export const CreateEditTaskPage = ({ task, onSave, onCancel }) => {
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [project, setProject] = useState(task?.project || 'PRJ-101 (EWMP Core Engine)');
  const [assignee, setAssignee] = useState(task?.assignee || 'Alex Turner');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState(task?.status || 'TO_DO');
  const [dueDate, setDueDate] = useState(task?.dueDate || '2026-07-31');
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours || 16);
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') || 'Security, API, Backend');
  const [checklist, setChecklist] = useState(task?.checklist || [
    { id: 'chk-101', title: 'Conduct initial architectural review', completed: false },
    { id: 'chk-102', title: 'Write unit & integration test suites', completed: false }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist([...checklist, { id: `chk-${Date.now()}`, title: newChecklistText.trim(), completed: false }]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id) => {
    setChecklist(checklist.filter(c => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task title is required to initialize sprint deliverable.');
      return;
    }
    setErrorMsg(null);

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const savedTask = {
      id: task?.id || `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      project,
      assignee,
      priority,
      status,
      dueDate,
      estimatedHours: Number(estimatedHours) || 0,
      tags: tagsArray,
      checklist,
      checklistTotal: checklist.length,
      checklistDone: checklist.filter(c => c.completed).length,
      progress: 0,
      commentsCount: task?.commentsCount || 0,
      assignedBy: 'Divyansh Super Admin'
    };

    onSave && onSave(savedTask);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in max-w-5xl mx-auto">
      {/* Top Header Row */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onCancel && onCancel()}
            className="p-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white rounded-xl border border-[#e1e2ed] dark:border-gray-700 transition-colors shadow-2xs"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-xs font-mono font-bold text-[#2563eb] uppercase block">
              {isEditing ? `Modifying ${task?.id}` : 'New Q3 Deliverable'}
            </span>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-0.5">
              {isEditing ? 'Edit Enterprise Task Specification' : 'Initialize Enterprise Task Deliverable'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102"
        >
          <Save size={16} /> {isEditing ? 'Save Changes' : 'Create & Save Task'}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-center gap-3 text-xs font-mono text-rose-800 dark:text-rose-200 animate-slide-down">
          <ShieldAlert size={18} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Section 1: Core Specifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-[#191b23] dark:text-white uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <FileText size={16} className="text-[#2563eb]" /> 1. Deliverable Identity & Scope
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">
              Task Deliverable Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth 2.0 PKCE challenge verification for iOS client API..."
              className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-sm font-semibold text-[#191b23] dark:text-white focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">
              Detailed Technical Specifications & Acceptance Criteria
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe architectural requirements, SLA targets, and test criteria (supports Markdown formatting)..."
              className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans text-[#191b23] dark:text-gray-200 leading-relaxed focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Section 2: Project Linkage & Workforce Assignment */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-extrabold text-[#191b23] dark:text-white uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <FolderKanban size={16} className="text-purple-600" /> 2. Project Linkage & Workforce Assignment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">
                Associated Enterprise Project Linkage <span className="text-rose-600">*</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold text-[#191b23] dark:text-white"
              >
                <option value="PRJ-101 (EWMP Core Engine)">PRJ-101 (EWMP Core Engine)</option>
                <option value="PRJ-102 (Auth & Identity Gateway)">PRJ-102 (Auth & Identity Gateway)</option>
                <option value="PRJ-103 (Mobile Client Suite)">PRJ-103 (Mobile Client Suite)</option>
                <option value="PRJ-104 (Global HR & Payroll Migration)">PRJ-104 (Global HR & Payroll Migration)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">
                Assign Engineering Resource
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold text-[#191b23] dark:text-white"
              >
                <option value="Alex Turner">Alex Turner (Lead Backend Engineer)</option>
                <option value="Samantha Wu">Samantha Wu (Senior Distributed Dev)</option>
                <option value="Elena Rostova">Elena Rostova (Enterprise Security Architect)</option>
                <option value="David Chen">David Chen (Strategic Sales Lead)</option>
                <option value="Michael Vance">Michael Vance (DevOps & SRE Manager)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Workflow Schedule & Telemetry */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-extrabold text-[#191b23] dark:text-white uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <Clock size={16} className="text-amber-600" /> 3. Workflow Schedule & Priority Matrix
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div>
              <label className="block text-[11px] font-bold text-[#737686] uppercase mb-1 font-sans">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold"
              >
                <option value="CRITICAL">🔴 Urgent / P0</option>
                <option value="HIGH">🟠 High / P1</option>
                <option value="MEDIUM">🔵 Medium / P2</option>
                <option value="LOW">⚪ Low / P3</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#737686] uppercase mb-1 font-sans">Initial Workflow Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">In Review / QA</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#737686] uppercase mb-1 font-sans">Target Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Jul 31, 2026"
                className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold"
              >
              </input>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#737686] uppercase mb-1 font-sans">Estimated Hours</label>
              <input
                type="number"
                min="1"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1">
              Metadata Tags & Workstream Categories (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Security, API, iOS, Database..."
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Section 4: Initial Checklist Subtasks */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-extrabold text-[#191b23] dark:text-white uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
            <Layers size={16} className="text-emerald-600" /> 4. Deliverable Subtask Checklist ({checklist.length})
          </h3>

          <div className="space-y-2">
            {checklist.map((chk) => (
              <div key={chk.id} className="flex items-center justify-between p-2.5 bg-[#faf8ff] dark:bg-gray-900/40 rounded-xl border border-[#e1e2ed]/80 text-xs">
                <span className="font-semibold text-[#191b23] dark:text-gray-200">● {chk.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(chk.id)}
                  className="text-gray-400 hover:text-rose-600 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Checklist Input Row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="Add a required checklist deliverable..."
              className="flex-1 p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              className="px-4 py-2.5 bg-[#ededf9] dark:bg-gray-800 hover:bg-[#e1e2ed] text-[#191b23] dark:text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
            >
              <Plus size={15} /> Add Subtask
            </button>
          </div>
        </div>

        {/* Footer Buttons Row */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e1e2ed] dark:border-gray-800 font-sans">
          <button
            type="button"
            onClick={() => onCancel && onCancel()}
            className="px-6 py-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white font-semibold rounded-xl border border-[#e1e2ed] transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102"
          >
            <Save size={16} /> {isEditing ? 'Save Changes' : 'Initialize Deliverable'}
          </button>
        </div>
      </form>
    </div>
  );
};
