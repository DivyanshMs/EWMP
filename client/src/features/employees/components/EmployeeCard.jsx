import React from 'react';
import { Mail, Phone, MapPin, Calendar, Eye, Edit, UserCheck, Archive } from 'lucide-react';
import { StatusBadge, EmploymentBadge, DepartmentBadge, EmployeeAvatar } from './EmployeeBadges';

/**
 * EmployeeCard.jsx
 * Enterprise employee profile card for responsive grid layouts and directory views.
 * Displays photo, ID, department, designation, manager, contact telemetry, and quick action dropdowns.
 */

export const EmployeeCard = ({
  employee,
  onSelect,
  onEdit,
  onArchive,
  onAssignManager,
  isSelected = false,
  onToggleSelect,
}) => {
  if (!employee) return null;

  return (
    <div
      onClick={() => onSelect && onSelect(employee)}
      className={`bg-white dark:bg-[#111111] border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group font-sans relative ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500 bg-blue-50/10'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      {/* Top Header Row with Avatar & Status */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(employee.id);
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
              />
            )}
            <EmployeeAvatar
              name={employee.name}
              photoUrl={employee.photoUrl}
              size="lg"
              status={employee.status}
              showStatus={true}
            />
            <div className="min-w-0">
              <h4 className="font-extrabold text-gray-900 dark:text-white text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {employee.name}
              </h4>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold block mt-0.5">
                {employee.id}
              </span>
            </div>
          </div>

          <StatusBadge status={employee.status} size="sm" />
        </div>

        {/* Designation & Department */}
        <div className="space-y-1.5">
          <div className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">
            {employee.designation || 'Software Engineer'}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <DepartmentBadge department={employee.department} size="sm" />
            <EmploymentBadge type={employee.employmentType || 'Full-Time'} size="sm" />
          </div>
        </div>

        {/* Contact Info & Telemetry Box */}
        <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800/80 space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2.5 truncate">
            <Mail size={14} className="text-gray-400 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2.5 truncate font-mono">
            <Phone size={14} className="text-gray-400 shrink-0" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 truncate">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span className="truncate">{employee.location}</span>
          </div>
          <div className="flex items-center gap-2.5 truncate pt-1 border-t border-gray-200 dark:border-gray-800 font-mono text-[11px] text-gray-400">
            <Calendar size={13} className="shrink-0" />
            <span>Joined: {employee.joiningDate}</span>
          </div>
        </div>
      </div>

      {/* Footer Row: Reporting Manager & Action Triggers */}
      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
            {employee.manager ? employee.manager.slice(0, 2).toUpperCase() : 'NA'}
          </div>
          <div className="min-w-0 truncate">
            <span className="text-[10px] text-gray-400 block font-mono uppercase">Reports to</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 truncate block">
              {employee.manager || 'No Manager Assigned'}
            </span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSelect && onSelect(employee)}
            title="Inspect Full Profile"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
          >
            <Eye size={15} />
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              title="Edit Employee Profile"
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/40 text-gray-600 dark:text-gray-300 hover:text-amber-600 transition-colors"
            >
              <Edit size={15} />
            </button>
          )}
          {onAssignManager && (
            <button
              onClick={() => onAssignManager(employee)}
              title="Reassign Reporting Manager"
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors"
            >
              <UserCheck size={15} />
            </button>
          )}
          {onArchive && (
            <button
              onClick={() => onArchive(employee)}
              title="Archive Employee Record"
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-600 dark:text-gray-300 hover:text-rose-600 transition-colors"
            >
              <Archive size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
