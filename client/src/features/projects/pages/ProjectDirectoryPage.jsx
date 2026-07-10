import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ArrowUpDown, PlusCircle, Download, 
  FolderKanban, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { ProjectTable } from '../components/ProjectTables';
import { NoResults, NoProjects } from '../components/ProjectEmptyStates';

/**
 * ProjectDirectoryPage.jsx (Page 2)
 * Comprehensive project directory table with multi-parameter search, filters, sorting, and pagination.
 */

const ProjectDirectoryPage = ({ projects = [], onSelectProject, onOpenCreate, onExport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [pmFilter, setPmFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NAME'); // 'NAME' | 'BUDGET' | 'PROGRESS' | 'DUE'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchQuery = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || p.priority === priorityFilter;
      const matchDept = deptFilter === 'ALL' || p.department.includes(deptFilter);
      const matchPm = pmFilter === 'ALL' || p.projectManager === pmFilter;

      return matchQuery && matchStatus && matchPriority && matchDept && matchPm;
    }).sort((a, b) => {
      if (sortBy === 'BUDGET') return b.budget - a.budget;
      if (sortBy === 'PROGRESS') return b.progress - a.progress;
      if (sortBy === 'DUE') return new Date(a.endDate) - new Date(b.endDate);
      return a.name.localeCompare(b.name);
    });
  }, [projects, searchQuery, statusFilter, priorityFilter, deptFilter, pmFilter, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setDeptFilter('ALL');
    setPmFilter('ALL');
    setSortBy('NAME');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-lg font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            <FolderKanban size={20} className="text-[#2563eb]" /> Enterprise Project Directory
          </h1>
          <p className="text-xs text-[#737686] mt-0.5">
            Showing <strong className="text-[#191b23] dark:text-white">{filteredProjects.length}</strong> of <strong className="text-[#2563eb]">{projects.length}</strong> enterprise initiatives
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetFilters}
            className="px-3 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#737686] text-xs font-semibold rounded-lg border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} /> Reset Filters
          </button>
          <button
            onClick={onExport}
            className="px-3 py-2 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} className="text-[#2563eb]" /> Export CSV
          </button>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle size={15} /> Create Project
          </button>
        </div>
      </div>

      {/* Multi-parameter Search & Filter Toolbar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs space-y-3 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Project Name, ID, Client, Project Manager, or Department..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 text-xs bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium text-[#191b23] dark:text-white"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering & Product</option>
              <option value="Sales">Sales & Revenue</option>
              <option value="HR">HR & People Ops</option>
              <option value="Finance">Finance & Legal</option>
            </select>
          </div>

          {/* Project Manager Filter */}
          <div>
            <select
              value={pmFilter}
              onChange={(e) => { setPmFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 text-xs bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-medium text-[#191b23] dark:text-white"
            >
              <option value="ALL">All Project Managers</option>
              <option value="Marcus Tech VP">Marcus Tech VP</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="Emily Vance">Emily Vance</option>
              <option value="Divyansh Super Admin">Divyansh Super Admin</option>
            </select>
          </div>
        </div>

        {/* Second Row Filters: Status, Priority, Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#737686] flex items-center gap-1 font-sans font-bold"><Filter size={13} /> Filters:</span>
            
            {/* Status Pills */}
            {['ALL', 'ACTIVE', 'COMPLETED', 'DELAYED', 'PLANNING'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  statusFilter === st ? 'bg-[#2563eb] text-white font-bold shadow-2xs' : 'bg-[#faf8ff] dark:bg-gray-900 text-[#737686] hover:text-[#191b23] dark:hover:text-white border border-[#e1e2ed]/60'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}

            {/* Priority Selector */}
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="p-1 px-2 text-xs bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#737686] flex items-center gap-1 font-sans font-bold"><ArrowUpDown size={13} /> Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1 px-2 text-xs bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold text-[#2563eb]"
            >
              <option value="NAME">Project Name (A-Z)</option>
              <option value="BUDGET">Total Budget (High to Low)</option>
              <option value="PROGRESS">Completion Progress (%)</option>
              <option value="DUE">Target End Date (Earliest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content or Empty State */}
      {filteredProjects.length === 0 ? (
        projects.length === 0 ? <NoProjects onCreate={onOpenCreate} /> : <NoResults onReset={resetFilters} />
      ) : (
        <ProjectTable
          projects={paginatedProjects}
          onSelectProject={onSelectProject}
          onEditProject={onSelectProject}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 text-xs font-mono">
          <span className="text-[#737686]">
            Page <strong className="text-[#191b23] dark:text-white">{currentPage}</strong> of <strong className="text-[#191b23] dark:text-white">{totalPages}</strong> ({filteredProjects.length} total)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-[#faf8ff] dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded disabled:opacity-40 text-[#191b23] dark:text-white hover:bg-[#ededf9]"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded font-bold transition-all ${
                  currentPage === i + 1 ? 'bg-[#2563eb] text-white shadow-2xs' : 'bg-[#faf8ff] dark:bg-gray-900 text-[#737686] hover:text-[#191b23] dark:hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-[#faf8ff] dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded disabled:opacity-40 text-[#191b23] dark:text-white hover:bg-[#ededf9]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDirectoryPage;
