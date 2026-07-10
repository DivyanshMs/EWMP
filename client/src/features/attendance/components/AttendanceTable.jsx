import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, CheckSquare, Square, Eye, Edit, Clock, Calendar } from 'lucide-react';
import { AttendanceStatusBadge, AttendanceEmployeeAvatar } from './AttendanceBadges';

/**
 * AttendanceTable.jsx
 * Enterprise attendance roster table for EWMP.
 * Renders required columns: Employee, Department, Date, Clock In, Clock Out, Working Hours, Overtime, and Status.
 * Includes checkbox bulk selection, column sorting, and item action triggers.
 */

export const AttendanceTable = ({
  records = [],
  onSelectRecord,
  onEditRecord,
  selectedIds = [],
  onToggleSelectAll,
  onToggleSelectOne,
  sortField,
  sortOrder,
  onSort,
}) => {
  const isAllSelected = records.length > 0 && selectedIds.length === records.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < records.length;

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} className="opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? <ArrowUp size={13} className="text-blue-600" /> : <ArrowDown size={13} className="text-blue-600" />;
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {/* Checkbox Column */}
              <th className="p-4 w-12 text-center">
                <button
                  onClick={onToggleSelectAll}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {isAllSelected ? (
                    <CheckSquare size={18} className="text-blue-600" />
                  ) : (
                    <Square size={18} className={isSomeSelected ? 'text-blue-500 opacity-80' : ''} />
                  )}
                </button>
              </th>

              {/* 1. Employee */}
              <th
                onClick={() => onSort && onSort('employeeName')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee Identity</span>
                  {renderSortIcon('employeeName')}
                </div>
              </th>

              {/* 2. Department */}
              <th
                onClick={() => onSort && onSort('department')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  {renderSortIcon('department')}
                </div>
              </th>

              {/* 3. Date */}
              <th
                onClick={() => onSort && onSort('date')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Date</span>
                  {renderSortIcon('date')}
                </div>
              </th>

              {/* 4. Clock In */}
              <th className="p-4">Clock In</th>

              {/* 5. Clock Out */}
              <th className="p-4">Clock Out</th>

              {/* 6. Working Hours */}
              <th
                onClick={() => onSort && onSort('workingHours')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Working Hours</span>
                  {renderSortIcon('workingHours')}
                </div>
              </th>

              {/* 7. Overtime */}
              <th
                onClick={() => onSort && onSort('overtime')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Overtime</span>
                  {renderSortIcon('overtime')}
                </div>
              </th>

              {/* 8. Status */}
              <th
                onClick={() => onSort && onSort('status')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              {/* 9. Actions */}
              <th className="p-4 text-right w-28">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
            {records.map((rec) => {
              const isSelected = selectedIds.includes(rec.id);

              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectRecord && onSelectRecord(rec)}
                  className={`hover:bg-gray-50/80 dark:hover:bg-[#181818] transition-colors cursor-pointer group ${
                    isSelected ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne && onToggleSelectOne(rec.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* 1. Employee */}
                  <td className="p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <AttendanceEmployeeAvatar
                        name={rec.employeeName}
                        photoUrl={rec.photoUrl}
                        size="md"
                        status={rec.status?.includes('Present') ? 'Present' : rec.status?.includes('Late') ? 'Late' : rec.status?.includes('WFH') ? 'WFH' : null}
                      />
                      <div className="min-w-0">
                        <div className="font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {rec.employeeName}
                        </div>
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold block mt-0.5">
                          {rec.employeeId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Department */}
                  <td className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-xs">
                    {rec.department}
                  </td>

                  {/* 3. Date */}
                  <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400 shrink-0" />
                      <span>{rec.date}</span>
                    </div>
                  </td>

                  {/* 4. Clock In */}
                  <td className="p-4 font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-emerald-500 shrink-0" />
                      <span>{rec.clockIn}</span>
                    </div>
                  </td>

                  {/* 5. Clock Out */}
                  <td className="p-4 font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-purple-500 shrink-0" />
                      <span>{rec.clockOut}</span>
                    </div>
                  </td>

                  {/* 6. Working Hours */}
                  <td className="p-4 font-mono font-extrabold text-xs text-blue-600 dark:text-blue-400">
                    {rec.workingHours}
                  </td>

                  {/* 7. Overtime */}
                  <td className="p-4 font-mono font-bold text-xs text-teal-600 dark:text-teal-400">
                    {rec.overtime || '0h 00m'}
                  </td>

                  {/* 8. Status */}
                  <td className="p-4">
                    <AttendanceStatusBadge status={rec.status} size="sm" />
                  </td>

                  {/* 9. Actions */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectRecord && onSelectRecord(rec)}
                        title="View Attendance Audit Log"
                        className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      {onEditRecord && (
                        <button
                          onClick={() => onEditRecord(rec)}
                          title="Regularize / Edit Record"
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/40 text-gray-600 dark:text-gray-300 hover:text-amber-600 transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                      )}
                    </div>
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

export default AttendanceTable;
