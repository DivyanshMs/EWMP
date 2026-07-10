import React from 'react';
import { Filter, X, RefreshCw, Calendar, Building2, Briefcase, MapPin, Clock, User, ShieldCheck } from 'lucide-react';

/**
 * AdvancedFilterPanel.jsx
 * Enterprise multi-criteria filter panel for the EWMP Employee Directory.
 * Supports filtering by Department, Designation, Location, Shift, Status, Employment Type,
 * Joining Date window, and Manager reporting line.
 */

export const AdvancedFilterPanel = ({
  isOpen,
  onClose,
  filters,
  onChangeFilter,
  onResetFilters,
  totalResults = 0,
}) => {
  if (!isOpen) return null;

  const departments = [
    'All Departments',
    'Platform Engineering',
    'Global Enterprise Sales',
    'Human Resources',
    'Corporate Finance',
    'Global Operations',
    'Product Design',
    'Legal & Compliance',
  ];

  const designations = [
    'All Designations',
    'Global COO',
    'Vice President of Engineering',
    'Principal Systems Architect',
    'Senior Software Engineer',
    'Enterprise Account Executive',
    'HR Business Partner',
    'Operations Manager',
  ];

  const locations = [
    'All Locations',
    'Silicon Valley HQ (US)',
    'London Innovation Hub (UK)',
    'Singapore APAC Tower (SG)',
    'Austin Engineering Annex (US)',
    'Tokyo R&D Satellite (JP)',
  ];

  const shifts = [
    'All Shifts',
    'Standard Morning Roster',
    'APAC Evening Support Roster',
    'Global Night SRE Roster',
    'Executive Flexible Core Hours',
  ];

  const statuses = [
    'All Statuses',
    'Active',
    'Probation',
    'Notice',
    'Terminated',
  ];

  const employmentTypes = [
    'All Types',
    'Full-Time',
    'Part-Time',
    'Contractor',
    'Intern',
  ];

  const managers = [
    'All Managers',
    'David Vance (COO)',
    'Sarah Jenkins (HR VP)',
    'David Kim (VP Eng)',
    'Marcus Brody (Finance VP)',
    'Elena Rostova (HR Dir)',
    'Alex Chen (Product VP)',
  ];

  return (
    <div className="bg-gray-50/90 dark:bg-[#161616]/90 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-lg animate-slide-down my-4 space-y-6 font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Filter size={18} />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">
              Advanced Employee Telemetry Filters
            </h4>
            <p className="text-xs text-gray-500">
              Filter workforce records by organizational hierarchy, roster window, and contract status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all shadow-2xs"
          >
            <RefreshCw size={13} />
            Reset All
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Filter Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs sm:text-sm">
        {/* 1. Department Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Building2 size={14} className="text-blue-500" />
            Department / Division
          </label>
          <select
            value={filters.department || 'All Departments'}
            onChange={(e) => onChangeFilter('department', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* 2. Designation Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Briefcase size={14} className="text-indigo-500" />
            Job Designation
          </label>
          <select
            value={filters.designation || 'All Designations'}
            onChange={(e) => onChangeFilter('designation', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {designations.map((des) => (
              <option key={des} value={des}>{des}</option>
            ))}
          </select>
        </div>

        {/* 3. Office Location Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-500" />
            Office Location
          </label>
          <select
            value={filters.location || 'All Locations'}
            onChange={(e) => onChangeFilter('location', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* 4. Shift Roster Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Clock size={14} className="text-amber-500" />
            Shift Roster
          </label>
          <select
            value={filters.shift || 'All Shifts'}
            onChange={(e) => onChangeFilter('shift', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {shifts.map((sh) => (
              <option key={sh} value={sh}>{sh}</option>
            ))}
          </select>
        </div>

        {/* 5. Status Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-purple-500" />
            Employment Status
          </label>
          <select
            value={filters.status || 'All Statuses'}
            onChange={(e) => onChangeFilter('status', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* 6. Employment Type Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Briefcase size={14} className="text-teal-500" />
            Employment Type
          </label>
          <select
            value={filters.employmentType || 'All Types'}
            onChange={(e) => onChangeFilter('employmentType', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {employmentTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 7. Reporting Manager Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <User size={14} className="text-blue-600" />
            Reporting Manager
          </label>
          <select
            value={filters.manager || 'All Managers'}
            onChange={(e) => onChangeFilter('manager', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {managers.map((mgr) => (
              <option key={mgr} value={mgr}>{mgr}</option>
            ))}
          </select>
        </div>

        {/* 8. Joining Date Window Filter */}
        <div className="space-y-1.5">
          <label className="block font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Calendar size={14} className="text-rose-500" />
            Joining Date Window
          </label>
          <select
            value={filters.joiningWindow || 'All Time'}
            onChange={(e) => onChangeFilter('joiningWindow', e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Time">All Time (Historical)</option>
            <option value="This Month">Joined This Month (New Hires)</option>
            <option value="Last 3 Months">Joined in Last 3 Months</option>
            <option value="Last 6 Months">Joined in Last 6 Months</option>
            <option value="1+ Years">Tenured (1+ Years Service)</option>
          </select>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs font-mono">
        <span className="text-gray-500">
          Filtered Workforce Density: <strong className="text-blue-600 dark:text-blue-400 text-sm">{totalResults}</strong> Active Records
        </span>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all font-sans"
        >
          Apply &amp; View Results
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
