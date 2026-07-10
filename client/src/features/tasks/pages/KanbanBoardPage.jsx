import React, { useState } from 'react';
import { Plus, Layers, Circle, PlayCircle, RefreshCw, ShieldAlert, CheckCircle2, Search, Filter } from 'lucide-react';
import { KanbanCard } from '../components/TaskCards';
import { StatusBadge } from '../components/TaskBadges';

/**
 * KanbanBoardPage.jsx
 * Enterprise Linear / Jira inspired Kanban Board for EWMP Task Management.
 * Features 6 columns: Backlog, To Do, In Progress, Review, Blocked, Completed.
 */

export const KanbanBoardPage = ({ 
  tasks = [], 
  onSelectTask, 
  onMoveTask, 
  onCreateTaskInColumn,
  onStatusChange 
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: 'BACKLOG', title: 'Backlog', icon: Layers, color: 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300', bg: 'bg-gray-100/60 dark:bg-gray-900/40' },
    { id: 'TO_DO', title: 'To Do', icon: Circle, color: 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300', bg: 'bg-slate-100/60 dark:bg-slate-900/40' },
    { id: 'IN_PROGRESS', title: 'In Progress', icon: PlayCircle, color: 'border-blue-300 dark:border-blue-800 text-[#2563eb] dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20' },
    { id: 'REVIEW', title: 'In Review / QA', icon: RefreshCw, color: 'border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400', bg: 'bg-purple-50/50 dark:bg-purple-950/20' },
    { id: 'BLOCKED', title: 'Blocked', icon: ShieldAlert, color: 'border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400', bg: 'bg-rose-50/50 dark:bg-rose-950/20' },
    { id: 'COMPLETED', title: 'Completed', icon: CheckCircle2, color: 'border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20' }
  ];

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const q = searchFilter.toLowerCase();
    const matchQ = t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.assignee?.toLowerCase().includes(q);
    const matchPrj = projectFilter === 'ALL' || t.project?.includes(projectFilter);
    return matchQ && matchPrj;
  });

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId && onStatusChange) {
      onStatusChange(taskId, targetStatus);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-5 font-sans animate-fade-in flex flex-col h-[calc(100vh-190px)] min-h-[650px]">
      {/* Top Controls Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200">
              AGILE KANBAN BOARD
            </span>
            <span className="text-xs text-[#737686] font-mono">Drag & Drop Workflow Stage Transition</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Q3 Enterprise Deliverable Board
          </h2>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" size={15} />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter board tasks..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans"
            />
          </div>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="py-1.5 px-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold text-[#191b23] dark:text-white font-mono"
          >
            <option value="ALL">All Projects</option>
            <option value="PRJ-101">PRJ-101 (Core)</option>
            <option value="PRJ-102">PRJ-102 (Auth)</option>
            <option value="PRJ-103">PRJ-103 (Mobile)</option>
          </select>
        </div>
      </div>

      {/* Kanban Columns Grid (Horizontal Scrollable on Smaller Viewports) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const IconComp = col.icon;
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border p-3 flex flex-col h-full transition-all ${col.bg} ${
                isOver 
                  ? 'border-2 border-[#2563eb] bg-blue-50/40 dark:bg-blue-950/40 shadow-lg scale-[1.01]' 
                  : 'border-[#e1e2ed] dark:border-gray-800 shadow-2xs'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-[#e1e2ed]/80 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border bg-white dark:bg-gray-900 ${col.color}`}>
                    <IconComp size={15} />
                  </span>
                  <h4 className="font-extrabold text-xs text-[#191b23] dark:text-white uppercase tracking-wider font-mono">
                    {col.title}
                  </h4>
                </div>
                <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-700 text-[#191b23] dark:text-white flex items-center justify-center text-xs font-mono font-bold shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Column List */}
              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 min-h-[120px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing transform transition-transform"
                  >
                    <KanbanCard 
                      task={task} 
                      onSelect={onSelectTask} 
                      onMove={onMoveTask} 
                      onComplete={(id) => onStatusChange && onStatusChange(id, 'COMPLETED')}
                    />
                  </div>
                ))}

                {/* Drag Placeholder / Empty Column State */}
                {colTasks.length === 0 && (
                  <div className="h-28 rounded-xl border-2 border-dashed border-[#c3c6d7] dark:border-gray-800 flex flex-col items-center justify-center text-center p-3 text-gray-400 font-mono text-[11px]">
                    <span>Drop tasks here to move to {col.title}</span>
                  </div>
                )}
              </div>

              {/* Quick Add Bottom Button */}
              <button
                onClick={() => onCreateTaskInColumn && onCreateTaskInColumn(col.id)}
                className="w-full mt-2 py-2 rounded-xl bg-white/80 dark:bg-[#161616] hover:bg-white dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 text-[#737686] hover:text-[#2563eb] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs font-sans"
              >
                <Plus size={14} /> Add to {col.title}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
