import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Edit, Archive, UserCheck, Mail, Phone, MapPin, Calendar, CheckSquare, Square } from 'lucide-react';
import { StatusBadge, EmploymentBadge, DepartmentBadge, EmployeeAvatar } from './EmployeeBadges';

/**
 * EmployeeTable.jsx
 * Enterprise large data table for the EWMP Employee Directory.
 * Renders all 12 core telemetry attributes with bulk selection, sorting,
 * client-side pagination, and item-level quick action menus.
 */

export const EmployeeTable = ({
  employees = [],
  onSelectEmployee,
  onEditEmployee,
  onArchiveEmployee,
  onAssignManager,
  selectedIds = [],
  onToggleSelectAll,
  onToggleSelectOne,
  sortField,
  sortOrder,
  onSort,
}) => {
  const isAllSelected = employees.length > 0 && selectedIds.length === employees.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < employees.length;

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} className="opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? <ArrowUp size={13} className="text-blue-600" /> : <ArrowDown size={13} className="text-blue-600" />;
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
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

              {/* 1. Employee Identity (Photo, Name, ID) */}
              <th
                onClick={() => onSort && onSort('name')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee Identity</span>
                  {renderSortIcon('name')}
                </div>
              </th>

              {/* 2. Department & Designation */}
              <th
                onClick={() => onSort && onSort('department')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department &amp; Title</span>
                  {renderSortIcon('department')}
                </div>
              </th>

              {/* 3. Reporting Manager */}
              <th
                onClick={() => onSort && onSort('manager')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Reporting Manager</span>
                  {renderSortIcon('manager')}
                </div>
              </th>

              {/* 4. Employment Type & Status */}
              <th
                onClick={() => onSort && onSort('status')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Contract &amp; Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              {/* 5. Contact Telemetry (Email & Phone) */}
              <th className="p-4">Contact Channels</th>

              {/* 6. Base Location & Joining Date */}
              <th
                onClick={() => onSort && onSort('joiningDate')}
                className="p-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Location &amp; Tenure</span>
                  {renderSortIcon('joiningDate')}
                </div>
              </th>

              {/* 7. Quick Actions */}
              <th className="p-4 text-right w-36">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
            {employees.map((emp) => {
              const isSelected = selectedIds.includes(emp.id);

              return (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                  className={`hover:bg-gray-50/80 dark:hover:bg-[#181818] transition-colors cursor-pointer group ${
                    isSelected ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne && onToggleSelectOne(emp.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* 1. Identity */}
                  <td className="p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <EmployeeAvatar
                        name={emp.name}
                        photoUrl={emp.photoUrl}
                        size="md"
                        status={emp.status}
                        showStatus={true}
                      />
                      <div className="min-w-0">
                        <div className="font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {emp.name}
                        </div>
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold block mt-0.5">
                          {emp.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Department & Designation */}
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-gray-800 dark:text-gray-200 text-xs truncate">
                      {emp.designation}
                    </div>
                    <DepartmentBadge department={emp.department} size="sm" />
                  </td>

                  {/* 3. Reporting Manager */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                        {emp.manager ? emp.manager.slice(0, 2).toUpperCase() : 'NA'}
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs truncate max-w-[140px]">
                        {emp.manager || 'No Manager Assigned'}
                      </span>
                    </div>
                  </td>

                  {/* 4. Contract & Status */}
                  <td className="p-4 space-y-1.5">
                    <div><StatusBadge status={emp.status} size="sm" /></div>
                    <div><EmploymentBadge type={emp.employmentType} size="sm" /></div>
                  </td>

                  {/* 5. Contact Channels */}
                  <td className="p-4 space-y-1 text-xs text-gray-600 dark:text-gray-300 font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone size={13} className="text-gray-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </td>

                  {/* 6. Base Location & Tenure */}
                  <td className="p-4 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-semibold truncate">
                      <MapPin size={13} className="text-purple-500 shrink-0" />
                      <span className="truncate max-w-[130px]">{emp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                      <Calendar size={12} className="shrink-0" />
                      <span>Joined: {emp.joiningDate}</span>
                    </div>
                  </td>

                  {/* 7. Action Triggers */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                        title="View Full Profile"
                        className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      {onEditEmployee && (
                        <button
                          onClick={() => onEditEmployee(emp)}
                          title="Edit Employee Profile"
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/40 text-gray-600 dark:text-gray-300 hover:text-amber-600 transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                      )}
                      {onAssignManager && (
                        <button
                          onClick={() => onAssignManager(emp)}
                          title="Assign Reporting Manager"
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                        >
                          <UserCheck size={15} />
                        </button>
                      )}
                      {onArchiveEmployee && (
                        <button
                          onClick={() => onArchiveEmployee(emp)}
                          title="Archive Record"
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-500 hover:text-rose-600 transition-colors"
                        >
                          <Archive size={15} />
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

export default EmployeeTable;
