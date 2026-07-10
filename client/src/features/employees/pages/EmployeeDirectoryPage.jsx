import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, UserPlus, Upload, Download, LayoutGrid, Archive, History, CheckSquare, Trash2, FolderTree, ChevronLeft, ChevronRight } from 'lucide-react';

import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeCard } from '../components/EmployeeCard';
import { AdvancedFilterPanel } from '../components/AdvancedFilterPanel';
import { EmployeeTableSkeleton, EmployeeCardSkeleton } from '../components/EmployeeLoadingStates';
import { EmployeeEmptyState } from '../components/EmployeeEmptyStates';

/**
 * EmployeeDirectoryPage.jsx
 * Page 1: Main Employee Directory command center.
 * Features dual-view toggling (Large Data Table & Responsive Card Grid),
 * real-time search across ID/Email/Phone/Name, 8-criteria Advanced Filters,
 * bulk selection operations, CSV export/import simulation, and pagination.
 */

export const EmployeeDirectoryPage = ({
  onNavigateCreate,
  onNavigateProfile,
  onNavigateEdit,
  onNavigateArchive,
  onNavigateTimeline,
}) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sorting state
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter state
  const [filters, setFilters] = useState({
    department: 'All Departments',
    designation: 'All Designations',
    location: 'All Locations',
    shift: 'All Shifts',
    status: 'All Statuses',
    employmentType: 'All Types',
    manager: 'All Managers',
    joiningWindow: 'All Time',
  });

  // Realistic enterprise workforce dataset
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-1042',
      name: 'David Vance',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Platform Engineering',
      designation: 'Principal Systems Architect',
      manager: 'David Kim (VP Eng)',
      employmentType: 'Full-Time',
      status: 'Active',
      email: 'd.vance@acme.corp',
      phone: '+1 (415) 555-0199',
      location: 'Silicon Valley HQ (US)',
      shift: 'Standard Morning Roster',
      joiningDate: '2023-01-15',
      salary: '$245,000 / yr',
    },
    {
      id: 'EMP-1043',
      name: 'Sarah Jenkins',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      department: 'Human Resources',
      designation: 'Vice President of HR',
      manager: 'Marcus Brody (COO)',
      employmentType: 'Full-Time',
      status: 'Active',
      email: 's.jenkins@acme.corp',
      phone: '+1 (415) 555-0182',
      location: 'Silicon Valley HQ (US)',
      shift: 'Executive Flexible Core Hours',
      joiningDate: '2021-06-01',
      salary: '$280,000 / yr',
    },
    {
      id: 'EMP-1044',
      name: 'David Kim',
      photoUrl: null,
      department: 'Platform Engineering',
      designation: 'Vice President of Engineering',
      manager: 'Marcus Brody (COO)',
      employmentType: 'Full-Time',
      status: 'Active',
      email: 'd.kim@acme.corp',
      phone: '+1 (415) 555-0144',
      location: 'Silicon Valley HQ (US)',
      shift: 'Executive Flexible Core Hours',
      joiningDate: '2020-03-10',
      salary: '$310,000 / yr',
    },
    {
      id: 'EMP-1045',
      name: 'Elena Rostova',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Global Operations',
      designation: 'Director of Global Ops',
      manager: 'Marcus Brody (COO)',
      employmentType: 'Full-Time',
      status: 'Probation',
      email: 'e.rostova@acme.corp',
      phone: '+44 20 7946 0921',
      location: 'London Innovation Hub (UK)',
      shift: 'Standard Morning Roster',
      joiningDate: '2026-04-12',
      salary: '£165,000 / yr',
    },
    {
      id: 'EMP-1046',
      name: 'Alex Chen',
      photoUrl: null,
      department: 'Product Design',
      designation: 'Lead UX Designer',
      manager: 'David Kim (VP Eng)',
      employmentType: 'Full-Time',
      status: 'Active',
      email: 'a.chen@acme.corp',
      phone: '+65 6789 0123',
      location: 'Singapore APAC Tower (SG)',
      shift: 'APAC Evening Support Roster',
      joiningDate: '2024-08-20',
      salary: 'S$185,000 / yr',
    },
    {
      id: 'EMP-1047',
      name: 'Marcus Brody',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Corporate Finance',
      designation: 'Chief Financial Officer',
      manager: 'Board of Directors',
      employmentType: 'Full-Time',
      status: 'Active',
      email: 'm.brody@acme.corp',
      phone: '+1 (212) 555-0190',
      location: 'Silicon Valley HQ (US)',
      shift: 'Executive Flexible Core Hours',
      joiningDate: '2019-11-01',
      salary: '$380,000 / yr',
    },
    {
      id: 'EMP-1048',
      name: 'Clara Barton',
      photoUrl: null,
      department: 'Legal & Compliance',
      designation: 'Senior Legal Counsel',
      manager: 'Marcus Brody (COO)',
      employmentType: 'Full-Time',
      status: 'Notice',
      email: 'c.barton@acme.corp',
      phone: '+1 (512) 555-0111',
      location: 'Austin Engineering Annex (US)',
      shift: 'Standard Morning Roster',
      joiningDate: '2022-09-15',
      salary: '$210,000 / yr',
    },
    {
      id: 'EMP-1049',
      name: 'James Wilson',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Platform Engineering',
      designation: 'Senior SRE Engineer',
      manager: 'David Vance (Principal)',
      employmentType: 'Contractor',
      status: 'Active',
      email: 'j.wilson@acme.corp',
      phone: '+81 3 5555 0143',
      location: 'Tokyo R&D Satellite (JP)',
      shift: 'Global Night SRE Roster',
      joiningDate: '2025-02-01',
      salary: '¥18,500,000 / yr',
    },
  ]);

  // Filtering Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Search Query (ID, Name, Email, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(q);
        const matchId = emp.id.toLowerCase().includes(q);
        const matchEmail = emp.email.toLowerCase().includes(q);
        const matchPhone = emp.phone.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchEmail && !matchPhone) return false;
      }

      // 2. Department
      if (filters.department !== 'All Departments' && emp.department !== filters.department) {
        return false;
      }
      // 3. Designation
      if (filters.designation !== 'All Designations' && emp.designation !== filters.designation) {
        return false;
      }
      // 4. Location
      if (filters.location !== 'All Locations' && emp.location !== filters.location) {
        return false;
      }
      // 5. Shift
      if (filters.shift !== 'All Shifts' && emp.shift !== filters.shift) {
        return false;
      }
      // 6. Status
      if (filters.status !== 'All Statuses' && emp.status !== filters.status) {
        return false;
      }
      // 7. Employment Type
      if (filters.employmentType !== 'All Types' && emp.employmentType !== filters.employmentType) {
        return false;
      }
      // 8. Manager
      if (filters.manager !== 'All Managers' && !emp.manager.toLowerCase().includes(filters.manager.split(' ')[0].toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [employees, searchQuery, filters]);

  // Sorting Logic
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(start, start + itemsPerPage);
  }, [sortedEmployees, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedEmployees.map((e) => e.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkArchive = () => {
    if (window.confirm(`Are you sure you want to archive ${selectedIds.length} selected employee record(s)?`)) {
      setEmployees(employees.filter((emp) => !selectedIds.includes(emp.id)));
      setSelectedIds([]);
    }
  };

  const handleExportCSV = () => {
    alert('Exporting verified workforce records to CSV format...');
  };

  const handleImportCSV = () => {
    alert('Simulating HRIS / CSV bulk workforce roster import...');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header Banner & Quick Action Commands */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Workforce Directory Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="text-blue-600 dark:text-blue-400 shrink-0" size={30} />
            Employee Directory &amp; Lifecycle Roster
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Inspect, filter, and govern full-time employees, contractors, and executives across all regional operating divisions with real-time HR telemetry.
          </p>
        </div>

        {/* Primary Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onNavigateCreate}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <UserPlus size={17} />
            <span>Onboard Employee</span>
          </button>

          <button
            onClick={onNavigateArchive}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <Archive size={16} />
            <span>Archive Vault</span>
          </button>

          <button
            onClick={onNavigateTimeline}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <History size={16} />
            <span>Lifecycle Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. Global Search, Filter Bar & View Toggle */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Employee ID, Name, Official Email, or Mobile Phone..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-gray-600 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter & View Mode Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                showFilters || Object.values(filters).some((v) => !v.startsWith('All'))
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter size={15} />
              <span>Advanced Filters</span>
              {Object.values(filters).some((v) => !v.startsWith('All')) && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              )}
            </button>

            {/* Export / Import */}
            <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-800 pl-3">
              <button
                onClick={handleExportCSV}
                title="Export Filtered Roster to CSV"
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
              >
                <Download size={16} />
              </button>
              <button
                onClick={handleImportCSV}
                title="Import Employee Roster from HRIS"
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
              >
                <Upload size={16} />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-gray-100 dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setViewMode('table')}
                title="Large Data Table View"
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-[#222] text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <TableIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Responsive Card Grid View"
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#222] text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Advanced Filter Panel Expansion */}
        <AdvancedFilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onChangeFilter={(field, val) => setFilters({ ...filters, [field]: val })}
          onResetFilters={() =>
            setFilters({
              department: 'All Departments',
              designation: 'All Designations',
              location: 'All Locations',
              shift: 'All Shifts',
              status: 'All Statuses',
              employmentType: 'All Types',
              manager: 'All Managers',
              joiningWindow: 'All Time',
            })
          }
          totalResults={sortedEmployees.length}
        />
      </div>

      {/* 4. Bulk Selection Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-down">
          <div className="flex items-center gap-3 font-bold text-sm">
            <CheckSquare size={20} />
            <span>{selectedIds.length} employee record(s) selected for bulk operation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Initiating bulk department transfer for ${selectedIds.length} employees...`)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FolderTree size={14} />
              <span>Bulk Department Transfer</span>
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Bulk Archive Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 bg-transparent hover:bg-white/10 rounded-xl text-xs font-bold transition-colors underline"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Directory Body (Table vs Grid) */}
      {isLoading ? (
        viewMode === 'table' ? (
          <EmployeeTableSkeleton rows={8} columns={7} />
        ) : (
          <EmployeeCardSkeleton count={6} />
        )
      ) : sortedEmployees.length === 0 ? (
        <EmployeeEmptyState
          type="search"
          onAction={() => {
            setSearchQuery('');
            setFilters({
              department: 'All Departments',
              designation: 'All Designations',
              location: 'All Locations',
              shift: 'All Shifts',
              status: 'All Statuses',
              employmentType: 'All Types',
              manager: 'All Managers',
              joiningWindow: 'All Time',
            });
          }}
        />
      ) : viewMode === 'table' ? (
        <EmployeeTable
          employees={paginatedEmployees}
          onSelectEmployee={onNavigateProfile}
          onEditEmployee={onNavigateEdit}
          onArchiveEmployee={(emp) => {
            if (window.confirm(`Archive employee record for ${emp.name} (${emp.id})?`)) {
              setEmployees(employees.filter((e) => e.id !== emp.id));
            }
          }}
          onAssignManager={(emp) => alert(`Opening Manager Assignment modal for ${emp.name}...`)}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onSelect={onNavigateProfile}
              onEdit={onNavigateEdit}
              onArchive={(emp) => {
                if (window.confirm(`Archive employee record for ${emp.name} (${emp.id})?`)) {
                  setEmployees(employees.filter((e) => e.id !== emp.id));
                }
              }}
              onAssignManager={(emp) => alert(`Opening Manager Assignment modal for ${emp.name}...`)}
              isSelected={selectedIds.includes(emp.id)}
              onToggleSelect={handleToggleSelectOne}
            />
          ))}
        </div>
      )}

      {/* 6. Client-Side Pagination Bar */}
      {sortedEmployees.length > 0 && (
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-sans shadow-2xs">
          <div className="text-gray-500">
            Showing <strong className="text-gray-900 dark:text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-gray-900 dark:text-white font-bold">
              {Math.min(currentPage * itemsPerPage, sortedEmployees.length)}
            </strong>{' '}
            of <strong className="text-blue-600 dark:text-blue-400 font-bold">{sortedEmployees.length}</strong> active employee records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 px-2 font-mono font-bold">
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectoryPage;
