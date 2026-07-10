import React, { useState } from 'react';
import { Search, Filter, Calendar, X, RefreshCw, Check, ChevronDown } from 'lucide-react';

/**
 * FilterPanels.jsx
 * Enterprise multi-column filter bar, global search input, and styled date range selectors
 * for precision data slicing across departments, locations, projects, and reporting periods.
 */

export const GlobalSearchStrip = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search by Report Name, Department, Employee ID or Date Range..."
}) => (
  <div className="relative flex-1">
    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={16} />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans font-semibold focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-hidden transition-all shadow-2xs"
    />
    {searchQuery && (
      <button
        onClick={() => onSearchChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X size={14} />
      </button>
    )}
  </div>
);

export const FilterPanel = ({
  department,
  onDepartmentChange,
  location,
  onLocationChange,
  project,
  onProjectChange,
  status,
  onStatusChange,
  reportType,
  onReportTypeChange,
  onReset
}) => {
  const hasActiveFilters =
    (department && department !== 'ALL') ||
    (location && location !== 'ALL') ||
    (project && project !== 'ALL') ||
    (status && status !== 'ALL') ||
    (reportType && reportType !== 'ALL');

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3 font-sans animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-[#737686] font-bold">
          <Filter size={14} className="text-[#2563eb]" />
          <span>MULTI-FACTOR DATA SLICING &amp; SCOPING</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[#2563eb] hover:underline font-bold flex items-center gap-1"
          >
            <RefreshCw size={12} /> Reset All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Department Filter */}
        <select
          value={department || 'ALL'}
          onChange={(e) => onDepartmentChange && onDepartmentChange(e.target.value)}
          className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold text-[#191b23] dark:text-gray-200 focus:border-[#2563eb] outline-hidden"
        >
          <option value="ALL">Dept: All Departments</option>
          <option value="Engineering">Engineering R&amp;D</option>
          <option value="HR & Operations">HR &amp; Operations</option>
          <option value="Finance & Tax">Finance &amp; Tax Audit</option>
          <option value="Sales & Growth">Sales &amp; Growth</option>
          <option value="Executive">Executive Suite</option>
        </select>

        {/* Location Filter */}
        <select
          value={location || 'ALL'}
          onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
          className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold text-[#191b23] dark:text-gray-200 focus:border-[#2563eb] outline-hidden"
        >
          <option value="ALL">Location: Global (All)</option>
          <option value="Seattle HQ">Seattle Headquarters</option>
          <option value="New York">New York Tech Hub</option>
          <option value="London">London Office</option>
          <option value="Tokyo">Tokyo Branch</option>
          <option value="Remote">Remote &amp; Distributed</option>
        </select>

        {/* Project Filter */}
        <select
          value={project || 'ALL'}
          onChange={(e) => onProjectChange && onProjectChange(e.target.value)}
          className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold text-[#191b23] dark:text-gray-200 focus:border-[#2563eb] outline-hidden"
        >
          <option value="ALL">Project: All Active</option>
          <option value="PRJ-101">PRJ-101 (Cloud Migration)</option>
          <option value="PRJ-102">PRJ-102 (AI Engine V3)</option>
          <option value="PRJ-103">PRJ-103 (SOC2 Audit Prep)</option>
          <option value="PRJ-104">PRJ-104 (Mobile App iOS)</option>
        </select>

        {/* Status Filter */}
        <select
          value={status || 'ALL'}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold text-[#191b23] dark:text-gray-200 focus:border-[#2563eb] outline-hidden"
        >
          <option value="ALL">Status: All States</option>
          <option value="ACTIVE">Active &amp; On Target</option>
          <option value="PENDING">Pending Approval / Review</option>
          <option value="FLAGGED">Flagged / Escalated</option>
          <option value="ARCHIVED">Archived Historical</option>
        </select>

        {/* Report Type Filter */}
        <select
          value={reportType || 'ALL'}
          onChange={(e) => onReportTypeChange && onReportTypeChange(e.target.value)}
          className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold text-[#191b23] dark:text-gray-200 focus:border-[#2563eb] outline-hidden"
        >
          <option value="ALL">Type: All Formats</option>
          <option value="SUMMARY">Executive Summary</option>
          <option value="DETAILED">Detailed Line-Item Audit</option>
          <option value="COMPARATIVE">Departmental Comparative</option>
          <option value="COMPLIANCE">Regulatory Compliance</option>
        </select>
      </div>

      {/* Active Chips Strip */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
          <span className="text-[10px] font-mono text-[#737686] uppercase">Active Filters:</span>
          {department && department !== 'ALL' && (
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200 text-xs font-mono flex items-center gap-1.5 font-bold">
              Dept: {department}
              <button onClick={() => onDepartmentChange && onDepartmentChange('ALL')}><X size={12} /></button>
            </span>
          )}
          {location && location !== 'ALL' && (
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 text-xs font-mono flex items-center gap-1.5 font-bold">
              Loc: {location}
              <button onClick={() => onLocationChange && onLocationChange('ALL')}><X size={12} /></button>
            </span>
          )}
          {project && project !== 'ALL' && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 text-xs font-mono flex items-center gap-1.5 font-bold">
              Prj: {project}
              <button onClick={() => onProjectChange && onProjectChange('ALL')}><X size={12} /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const DateRangePicker = ({
  activeRange = 'FY26/Q3 (Jul - Sep)',
  onRangeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ranges = [
    'Today (Live)',
    'This Week (Mon - Fri)',
    'This Month (Jul 2026)',
    'FY26/Q3 (Jul - Sep)',
    'FY26/Q2 (Apr - Jun)',
    'Full Fiscal Year 2026',
    'Custom Date Range...'
  ];

  return (
    <div className="relative inline-block font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-colors shadow-2xs"
      >
        <Calendar size={15} className="text-[#2563eb]" />
        <span>{activeRange}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-slide-up">
          <div className="px-3 py-1.5 text-[10px] font-mono text-[#737686] uppercase font-bold border-b border-[#e1e2ed] dark:border-gray-800">
            Select Reporting Window
          </div>
          {ranges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => {
                onRangeChange && onRangeChange(range);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-between transition-colors ${
                activeRange === range
                  ? 'bg-[#2563eb] text-white'
                  : 'text-[#191b23] dark:text-gray-200 hover:bg-[#faf8ff] dark:hover:bg-gray-800'
              }`}
            >
              <span>{range}</span>
              {activeRange === range && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
