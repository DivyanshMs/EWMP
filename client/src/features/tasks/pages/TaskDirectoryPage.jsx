import React, { useState } from 'react';
import { Search, Filter, Download, PlusCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskTable } from '../components/TaskTables';
import { NoSearchResults, NoTasks } from '../components/TaskEmptyStates';

/**
 * TaskDirectoryPage.jsx
 * Enterprise Task Directory with multi-parameter search, granular filters, sorting, and pagination.
 */

export const TaskDirectoryPage = ({ 
  tasks = [], 
  onSelectTask, 
  onEditTask, 
  onDeleteTask, 
  onCreateTask,
  onStatusChange,
  onExport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DUE_DATE');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      t.id.toLowerCase().includes(query) ||
      t.title.toLowerCase().includes(query) ||
      t.project?.toLowerCase().includes(query) ||
      t.assignee?.toLowerCase().includes(query) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)));
    
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchProject = projectFilter === 'ALL' || t.project?.includes(projectFilter);
    const matchDept = deptFilter === 'ALL' || (t.dept || 'Engineering') === deptFilter;

    return matchSearch && matchStatus && matchPriority && matchProject && matchDept;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'PRIORITY') {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0);
    }
    if (sortBy === 'PROGRESS') {
      const progA = a.checklistTotal > 0 ? (a.checklistDone / a.checklistTotal) : (a.progress || 0);
      const progB = b.checklistTotal > 0 ? (b.checklistDone / b.checklistTotal) : (b.progress || 0);
      return progB - progA;
    }
    if (sortBy === 'TITLE') {
      return a.title.localeCompare(b.title);
    }
    // Default DUE_DATE
    return a.id.localeCompare(b.id);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / itemsPerPage));
  const paginatedTasks = sortedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setProjectFilter('ALL');
    setDeptFilter('ALL');
    setSortBy('DUE_DATE');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 border border-purple-200">
              AUDITED DIRECTORY
            </span>
            <span className="text-xs text-[#737686] font-mono">Real-time DB Query Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Task Directory & Filter Registry
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onExport && onExport()}
            className="px-4 py-2 bg-[#ffffff] dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download size={15} /> Export Registry
          </button>
          <button
            onClick={() => onCreateTask && onCreateTask()}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <PlusCircle size={15} /> Create Task
          </button>
        </div>
      </div>

      {/* Multi-Parameter Search and Filter Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Main Search Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Task ID, Title, Project, Assignee, or Tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono">
            <span className="text-xs text-[#737686] hidden lg:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold text-[#191b23] dark:text-white"
            >
              <option value="DUE_DATE">⏰ Due Date & ID</option>
              <option value="PRIORITY">🔥 Highest Priority First</option>
              <option value="PROGRESS">📊 Completion Progress</option>
              <option value="TITLE">🔤 Alphabetical (A-Z)</option>
            </select>
            {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || projectFilter !== 'ALL' || deptFilter !== 'ALL') && (
              <button
                onClick={resetFilters}
                className="p-2.5 text-gray-500 hover:text-rose-600 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors"
                title="Reset filters"
              >
                <RefreshCw size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Granular Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800 font-mono text-xs">
          <div>
            <label className="block text-[10px] text-[#737686] uppercase mb-1 font-sans font-bold">Workflow Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg text-xs font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="BACKLOG">Backlog</option>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">In Review / QA</option>
              <option value="BLOCKED">Blocked</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#737686] uppercase mb-1 font-sans font-bold">Priority Level</label>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg text-xs font-semibold"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Urgent / P0</option>
              <option value="HIGH">High / P1</option>
              <option value="MEDIUM">Medium / P2</option>
              <option value="LOW">Low / P3</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#737686] uppercase mb-1 font-sans font-bold">Associated Project</label>
            <select
              value={projectFilter}
              onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg text-xs font-semibold"
            >
              <option value="ALL">All Projects</option>
              <option value="PRJ-101">PRJ-101 (Core Engine)</option>
              <option value="PRJ-102">PRJ-102 (Auth Gateway)</option>
              <option value="PRJ-103">PRJ-103 (Mobile App)</option>
              <option value="PRJ-104">PRJ-104 (HR Portal)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#737686] uppercase mb-1 font-sans font-bold">Department Scope</label>
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg text-xs font-semibold"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering & DevOps</option>
              <option value="Security">InfoSec & Compliance</option>
              <option value="Product">Product Management</option>
              <option value="HR">HR & Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Task Table or Empty State */}
      {sortedTasks.length === 0 ? (
        tasks.length === 0 ? <NoTasks onCreate={onCreateTask} /> : <NoSearchResults onReset={resetFilters} />
      ) : (
        <div className="space-y-4">
          <TaskTable 
            tasks={paginatedTasks} 
            onSelectTask={onSelectTask} 
            onEditTask={onEditTask} 
            onDeleteTask={onDeleteTask}
            onStatusChange={onStatusChange}
          />

          {/* Pagination Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[#737686]">
              Showing <strong className="text-[#191b23] dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-[#191b23] dark:text-white">{Math.min(currentPage * itemsPerPage, sortedTasks.length)}</strong> of <strong className="text-[#2563eb]">{sortedTasks.length}</strong> tasks
            </span>

            <div className="flex items-center gap-2 font-sans">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg font-bold font-mono transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[#2563eb] text-white shadow-2xs' 
                      : 'hover:bg-[#faf8ff] dark:hover:bg-gray-800 text-[#737686]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
