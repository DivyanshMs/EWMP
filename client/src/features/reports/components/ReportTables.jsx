import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * ReportTables.jsx
 * Enterprise comparison data grid inspired by Tableau and Workday.
 * Features sticky headers, sortable columns, inline variance progress indicators, and pagination.
 */

export const ComparisonTable = ({
  columns = [
    { key: 'department', label: 'Department / Unit', sortable: true },
    { key: 'headcount', label: 'Active Headcount', sortable: true },
    { key: 'payrollCost', label: 'Monthly Payroll Spend', sortable: true },
    { key: 'overtimeHrs', label: 'Overtime Hours', sortable: true },
    { key: 'attendanceRate', label: 'Attendance Rate', sortable: true },
    { key: 'variance', label: 'YoY Budget Variance', sortable: false },
  ],
  data = [
    { id: 1, department: 'Engineering R&D', headcount: '142', payrollCost: '$1,420,000', overtimeHrs: '420 hrs', attendanceRate: '98.4%', variance: '+2.4%', isPositive: true },
    { id: 2, department: 'Sales & Growth', headcount: '86', payrollCost: '$740,000', overtimeHrs: '180 hrs', attendanceRate: '96.8%', variance: '+1.2%', isPositive: true },
    { id: 3, department: 'HR & Operations', headcount: '34', payrollCost: '$290,000', overtimeHrs: '45 hrs', attendanceRate: '99.1%', variance: '-0.8%', isPositive: false },
    { id: 4, department: 'Finance & Tax Audit', headcount: '22', payrollCost: '$210,000', overtimeHrs: '60 hrs', attendanceRate: '98.9%', variance: '-0.4%', isPositive: false },
    { id: 5, department: 'Facilities & Office Ops', headcount: '18', payrollCost: '$140,000', overtimeHrs: '95 hrs', attendanceRate: '97.5%', variance: '+3.1%', isPositive: true },
    { id: 6, department: 'Legal Compliance', headcount: '12', payrollCost: '$180,000', overtimeHrs: '20 hrs', attendanceRate: '99.5%', variance: '-0.2%', isPositive: false },
  ],
  onRowClick
}) => {
  const [sortCol, setSortCol] = useState('department');
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleSort = (key) => {
    if (sortCol === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortCol];
    const valB = b[sortCol];
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginated = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs space-y-0 font-sans">
      <div className="overflow-x-auto max-h-[480px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#faf8ff] dark:bg-[#161616] text-[#737686] uppercase font-bold text-[10px] border-b border-[#e1e2ed] dark:border-gray-800 font-mono sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3 px-4 ${col.sortable ? 'cursor-pointer hover:text-[#191b23] dark:hover:text-white' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <ArrowUpDown size={12} className={sortCol === col.key ? 'text-[#2563eb]' : 'text-gray-400'} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
            {paginated.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors cursor-pointer"
              >
                {columns.map((col) => {
                  const val = row[col.key];
                  if (col.key === 'department') {
                    return (
                      <td key={col.key} className="py-3.5 px-4 font-bold text-[#191b23] dark:text-white font-sans">
                        {val}
                      </td>
                    );
                  }
                  if (col.key === 'variance') {
                    return (
                      <td key={col.key} className="py-3.5 px-4 font-mono font-bold">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                          row.isPositive
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600'
                            : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600'
                        }`}>
                          {row.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {val}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={col.key} className="py-3.5 px-4 font-mono text-[#737686] font-semibold">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="py-3 px-4 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs font-mono">
        <span className="text-[#737686]">
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg border border-[#c3c6d7] dark:border-gray-800 bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-3 py-1 font-bold text-[#2563eb]">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg border border-[#c3c6d7] dark:border-gray-800 bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
