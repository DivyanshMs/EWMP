import React from 'react';
import { Mail, Phone, MapPin, Calendar, UserCheck, Edit, Archive, Upload, Clock, CalendarDays, CircleDollarSign, TrendingUp, ExternalLink } from 'lucide-react';
import { StatusBadge, EmploymentBadge, DepartmentBadge, EmployeeAvatar } from './EmployeeBadges';

/**
 * EmployeeProfileHeader.jsx
 * Comprehensive profile banner for the Employee Profile page.
 * Displays photo avatar, ID badge, manager hierarchy, emergency contact telemetry,
 * and standard HR quick action buttons.
 */

export const EmployeeProfileHeader = ({
  employee,
  onEdit,
  onArchive,
  onAssignManager,
  onUploadDoc,
  onNavigateModule,
}) => {
  if (!employee) return null;

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm font-sans relative overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2">
        {/* Left Avatar & Identity Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0 w-full lg:w-auto">
          <EmployeeAvatar
            name={employee.name}
            photoUrl={employee.photoUrl}
            size="xl"
            status={employee.status}
            showStatus={true}
          />

          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold">
                {employee.id || 'EMP-1042'}
              </span>
              <StatusBadge status={employee.status} size="sm" />
              <EmploymentBadge type={employee.employmentType} size="sm" />
              <DepartmentBadge department={employee.department} size="sm" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
              {employee.name || 'David Vance'}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span className="text-gray-900 dark:text-white font-bold">
                {employee.designation || 'Principal Systems Architect'}
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
              <span className="flex items-center gap-1">
                <UserCheck size={14} className="text-blue-500" />
                Reports to:{' '}
                <strong className="text-gray-800 dark:text-gray-200">
                  {employee.manager || 'Marcus Brody (COO)'}
                </strong>
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar size={13} className="text-emerald-500" />
                Joined: {employee.joiningDate || '2023-01-15'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Primary Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end shrink-0">
          <button
            onClick={() => onEdit && onEdit(employee)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => onUploadDoc && onUploadDoc(employee)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => onArchive && onArchive(employee)}
            className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-500 hover:text-rose-600 transition-colors"
            title="Archive Employee Record"
          >
            <Archive size={18} />
          </button>
        </div>
      </div>

      {/* Contact & Emergency Telemetry Bar */}
      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
          <span className="text-gray-400 font-mono uppercase text-[10px] block font-bold">Official Email</span>
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium truncate">
            <Mail size={14} className="text-blue-500 shrink-0" />
            <span className="truncate">{employee.email || 'd.vance@acme.corp'}</span>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
          <span className="text-gray-400 font-mono uppercase text-[10px] block font-bold">Direct Phone / Mobile</span>
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-mono font-medium truncate">
            <Phone size={14} className="text-emerald-500 shrink-0" />
            <span>{employee.phone || '+1 (415) 555-0199'}</span>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
          <span className="text-gray-400 font-mono uppercase text-[10px] block font-bold">Base Office Location</span>
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium truncate">
            <MapPin size={14} className="text-purple-500 shrink-0" />
            <span className="truncate">{employee.location || 'Silicon Valley HQ (US-SV-01)'}</span>
          </div>
        </div>

        <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-1">
          <span className="text-amber-700 dark:text-amber-400 font-mono uppercase text-[10px] block font-bold">Emergency Contact</span>
          <div className="flex items-center justify-between text-gray-800 dark:text-gray-200 font-medium truncate">
            <span className="truncate">{employee.emergencyContact?.name || 'Clara Vance (Spouse)'}</span>
            <span className="font-mono text-[11px] text-gray-500">{employee.emergencyContact?.phone || '+1 (415) 555-0188'}</span>
          </div>
        </div>
      </div>

      {/* Quick Jump Links Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider mr-2">
          Cross-Module Navigation:
        </span>
        <button
          onClick={() => onNavigateModule && onNavigateModule('attendance', employee.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#161616] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 text-xs font-semibold transition-all border border-gray-200/60 dark:border-gray-800"
        >
          <Clock size={13} className="text-blue-500" />
          <span>View Attendance Roster</span>
          <ExternalLink size={11} className="opacity-60" />
        </button>
        <button
          onClick={() => onNavigateModule && onNavigateModule('leave', employee.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#161616] hover:bg-purple-50 dark:hover:bg-purple-950/40 text-gray-700 dark:text-gray-300 hover:text-purple-600 text-xs font-semibold transition-all border border-gray-200/60 dark:border-gray-800"
        >
          <CalendarDays size={13} className="text-purple-500" />
          <span>View Leave Summary</span>
          <ExternalLink size={11} className="opacity-60" />
        </button>
        <button
          onClick={() => onNavigateModule && onNavigateModule('payroll', employee.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#161616] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-700 dark:text-gray-300 hover:text-emerald-600 text-xs font-semibold transition-all border border-gray-200/60 dark:border-gray-800"
        >
          <CircleDollarSign size={13} className="text-emerald-500" />
          <span>View Payroll Structure</span>
          <ExternalLink size={11} className="opacity-60" />
        </button>
        <button
          onClick={() => onNavigateModule && onNavigateModule('performance', employee.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#161616] hover:bg-amber-50 dark:hover:bg-amber-950/40 text-gray-700 dark:text-gray-300 hover:text-amber-600 text-xs font-semibold transition-all border border-gray-200/60 dark:border-gray-800"
        >
          <TrendingUp size={13} className="text-amber-500" />
          <span>View Performance Reviews</span>
          <ExternalLink size={11} className="opacity-60" />
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;
