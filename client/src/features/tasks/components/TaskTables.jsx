import React, { useState } from 'react';
import { FolderKanban, Clock, CheckCircle2, MoreVertical, Edit3, Trash2, ArrowUpRight } from 'lucide-react';
import { PriorityBadge, StatusBadge, TagChip } from './TaskBadges';
import { ProgressBar } from './TaskCards';

/**
 * TaskTables.jsx
 * High-performance enterprise task directory table with sorting, row selection, and action triggers.
 */

export const TaskTable = ({ tasks = [], onSelectTask, onEditTask, onDeleteTask, onStatusChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(tasks.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
      {/* Top Bulk Actions Toolbar if rows are selected */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/60 p-3 px-4 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs font-mono animate-fade-in">
          <span className="font-bold text-[#2563eb] dark:text-blue-300">
            ✓ {selectedIds.length} task(s) selected
          </span>
          <div className="flex items-center gap-2 font-sans">
            <button 
              onClick={() => {
                selectedIds.forEach(id => onStatusChange && onStatusChange(id, 'COMPLETED'));
                setSelectedIds([]);
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors shadow-2xs"
            >
              Mark Completed
            </button>
            <button 
              onClick={() => {
                selectedIds.forEach(id => onDeleteTask && onDeleteTask(id));
                setSelectedIds([]);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs transition-colors shadow-2xs"
            >
              Delete Selected
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-gray-600 hover:text-black dark:text-gray-400 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase font-bold text-[11px] select-none">
              <th className="py-3.5 px-4 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === tasks.length && tasks.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" 
                />
              </th>
              <th className="py-3.5 px-4 min-w-[220px]">Task ID & Title</th>
              <th className="py-3.5 px-4 min-w-[160px]">Project</th>
              <th className="py-3.5 px-4 min-w-[140px]">Assigned To</th>
              <th className="py-3.5 px-4 min-w-[120px]">Assigned By</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 w-36">Progress</th>
              <th className="py-3.5 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
            {tasks.map((t) => {
              const isSelected = selectedIds.includes(t.id);
              const progressPct = t.checklistTotal > 0 ? Math.round((t.checklistDone / t.checklistTotal) * 100) : (t.progress || 0);

              return (
                <tr 
                  key={t.id} 
                  onClick={() => onSelectTask && onSelectTask(t)}
                  className={`hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={(e) => toggleSelectRow(t.id, e)}
                      className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" 
                    />
                  </td>

                  {/* Task ID & Title */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-extrabold text-[#2563eb] block mb-0.5">
                      {t.id}
                    </span>
                    <strong className="font-bold text-sm text-[#191b23] dark:text-white line-clamp-1">
                      {t.title}
                    </strong>
                    {t.tags && t.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {t.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Project Name */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-[#191b23] dark:text-gray-300">
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <FolderKanban size={13} className="text-[#2563eb] shrink-0" /> {t.project}
                    </span>
                  </td>

                  {/* Assigned To */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold text-[10px] uppercase border border-blue-300 shrink-0">
                        {t.assignee ? t.assignee.charAt(0) : 'U'}
                      </div>
                      <span className="font-bold text-xs text-[#191b23] dark:text-white truncate max-w-[110px]">
                        {t.assignee || 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  {/* Assigned By */}
                  <td className="py-3.5 px-4 font-mono text-xs text-[#737686]">
                    {t.assignedBy || 'Marcus Tech VP'}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={t.priority} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.status} size="sm" />
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 font-mono font-bold text-xs">
                    <span className={`flex items-center gap-1 ${t.dueDate?.includes('Today') || t.dueDate?.includes('Overdue') ? 'text-rose-600 font-extrabold' : 'text-[#191b23] dark:text-gray-200'}`}>
                      <Clock size={12} className="shrink-0" /> {t.dueDate}
                    </span>
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3.5 px-4 w-36">
                    <ProgressBar progress={progressPct} size="sm" showLabel={true} color={progressPct === 100 ? 'bg-emerald-600' : 'bg-[#2563eb]'} />
                  </td>

                  {/* Action Menu */}
                  <td className="py-3.5 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === t.id ? null : t.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === t.id && (
                      <div className="absolute right-4 top-10 z-20 w-44 bg-[#ffffff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg shadow-xl py-1 text-left text-xs font-sans animate-fade-in">
                        <button 
                          onClick={() => { onSelectTask && onSelectTask(t); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-[#191b23] dark:text-white"
                        >
                          <ArrowUpRight size={14} className="text-[#2563eb]" /> View Details
                        </button>
                        <button 
                          onClick={() => { onEditTask && onEditTask(t); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-[#191b23] dark:text-white"
                        >
                          <Edit3 size={14} className="text-amber-600" /> Edit Task
                        </button>
                        <button 
                          onClick={() => { onStatusChange && onStatusChange(t.id, 'COMPLETED'); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-emerald-600"
                        >
                          <CheckCircle2 size={14} /> Mark Completed
                        </button>
                        <div className="border-t border-[#e1e2ed] dark:border-gray-800 my-1" />
                        <button 
                          onClick={() => { onDeleteTask && onDeleteTask(t.id); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold text-rose-600"
                        >
                          <Trash2 size={14} /> Delete Task
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
