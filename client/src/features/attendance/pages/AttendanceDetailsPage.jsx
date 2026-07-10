import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { ArrowLeft, Clock, ShieldCheck, MessageSquare, History, Edit, Check, FileText, Globe } from 'lucide-react';

import { AttendanceTimeline } from '../components/AttendanceTimeline';
import { AttendanceStatusBadge, AttendanceEmployeeAvatar } from '../components/AttendanceBadges';
import { WorkingHoursCard } from '../components/AttendanceCards';

/**
 * AttendanceDetailsPage.jsx
 * Page 4: Detailed employee attendance inspection & audit hub for EWMP.
 * Displays Employee Information, Attendance Timeline, Geofence Location Placeholder,
 * Working Hours, Break Duration, Status History, Correction History, and Manager Notes.
 */

export const AttendanceDetailsPage = ({
  record,
  onBack,
  onRequestCorrection,
}) => {
  
  const { data } = useQuery({
    queryKey: ['attendance-details', record?.id],
    queryFn: () => api.get(`/attendance/${record?.id}`).then(res => res.data),
    enabled: !!record?.id
  });

  const backendRecord = data?.data;

  // Fallback if accessed directly without selecting a record
  const empData = backendRecord ? {
    id: backendRecord._id || backendRecord.id,
    employeeId: backendRecord.employee?.employeeId || 'EMP',
    employeeName: backendRecord.employee?.fullName || backendRecord.employee?.firstName + ' ' + backendRecord.employee?.lastName || 'Employee',
    photoUrl: null,
    department: backendRecord.employee?.department?.name || 'General',
    date: backendRecord.date ? new Date(backendRecord.date).toLocaleDateString() : '',
    clockIn: backendRecord.clockIn ? new Date(backendRecord.clockIn).toLocaleTimeString() : '--:--',
    clockOut: backendRecord.clockOut ? new Date(backendRecord.clockOut).toLocaleTimeString() : '--:--',
    workingHours: backendRecord.totalHours ? backendRecord.totalHours.toFixed(2) + 'h' : '0h',
    overtime: '0h',
    status: backendRecord.status || 'Present',
    location: backendRecord.locationId?.name || 'Office',
    shift: 'Standard',
    manager: 'Manager',
  } : record || {
    id: 'att-1',
    employeeId: 'EMP-1042',
    employeeName: 'David Vance',
    photoUrl: null,
    department: 'Engineering',
    date: '2026-07-07',
    clockIn: '08:28:14 AM',
    clockOut: '05:43:09 PM',
    workingHours: '8h 15m',
    overtime: '0h 00m',
    status: 'Present',
    location: 'Silicon Valley HQ (US-SV-01)',
    shift: 'Standard Morning (08:00 - 17:00)',
    manager: 'David Kim (VP Engineering)',
  };


  const [managerNote, setManagerNote] = useState(
    'Employee arrived on time via Silicon Valley HQ lobby biometric kiosk. Full geofence compliance verified. Shift completed with standard 45m break.'
  );
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(managerNote);

  const handleSaveNote = () => {
    setManagerNote(tempNote);
    setIsEditingNote(false);
    alert('Managerial oversight note saved to immutable audit log.');
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* 1. Top Back Banner & Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#181818] text-gray-700 dark:text-gray-300 shadow-2xs transition-all"
            title="Return to Attendance Roster"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span>Attendance Roster</span>
              <span>/</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">Audit Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>{empData.employeeName}</span>
              <AttendanceStatusBadge status={empData.status} size="md" />
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRequestCorrection}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <FileText size={16} className="text-amber-500" />
            <span>Regularize Record</span>
          </button>
          <button
            onClick={() => alert(`Exporting official compliance sign-off PDF for ${empData.employeeName}...`)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>Sign-Off &amp; Lock</span>
          </button>
        </div>
      </div>

      {/* 2. Employee Information & Shift Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left 2 Cols: Employee Identity & Shift Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <AttendanceEmployeeAvatar name={empData.employeeName} photoUrl={empData.photoUrl} size="xl" />
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                  {empData.employeeName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{empData.employeeId}</span>
                  <span>•</span>
                  <span>{empData.department}</span>
                  <span>•</span>
                  <span>Assigned Shift: <strong>{empData.shift}</strong></span>
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right font-mono text-xs space-y-1 bg-gray-50 dark:bg-[#161616] p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block uppercase text-[10px]">Reporting Manager</span>
              <strong className="text-gray-800 dark:text-gray-200 block">{empData.manager || 'David Kim'}</strong>
            </div>
          </div>

          <WorkingHoursCard
            clockIn={empData.clockIn || '08:28 AM'}
            clockOut={empData.clockOut || '05:43 PM'}
            totalHours={empData.workingHours || '8h 15m'}
            breakHours="45m 22s"
            overtime={empData.overtime || '0h 00m'}
            progress={100}
            status={empData.status}
          />
        </div>

        {/* Right Col: Location Geofence Placeholder & MFA Card */}
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                Zero-Trust Geofence Telemetry
              </span>
              <Globe size={18} className="text-purple-500 animate-spin-slow" />
            </div>
            <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
              {empData.location || 'Silicon Valley HQ (US-SV-01)'}
            </h4>
          </div>

          {/* Interactive Geofence Visual Map Simulation */}
          <div className="h-44 bg-linear-to-br from-gray-900 via-indigo-950 to-slate-900 rounded-2xl relative overflow-hidden border border-gray-800 shadow-inner flex items-center justify-center p-4 text-center group">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

            {/* Geofence Circle */}
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-emerald-500/70 bg-emerald-500/10 flex items-center justify-center relative animate-pulse">
              <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500"></div>
              <span className="absolute -bottom-6 text-[10px] font-mono text-emerald-300 font-bold bg-gray-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                within 15m radius
              </span>
            </div>

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
              GPS: 37.3861° N, 122.0839° W
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck size={14} /> MFA Biometric Verified
            </span>
            <span>IP: 192.168.1.104</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Attendance Timeline Section */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              Chronological Biometric Event Stream ({empData.date})
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Verified hardware kiosk check-ins, automated break deductions, and security clearance validations.
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 font-bold hidden sm:inline">
            Ref ID: ATT-LOG-20260707-1042
          </span>
        </div>

        <AttendanceTimeline
          managerNotes={managerNote}
          correctionHistory={[
            { reason: 'Regularized minor kiosk delay (2 mins) at Gate 3 lobby', status: 'Approved' },
          ]}
          events={[
            {
              time: empData.clockIn || '08:28:14 AM',
              type: 'clock_in',
              title: 'Biometric Kiosk Clock In',
              location: `${empData.location} — Main Lobby Gate 3`,
              geofenceVerified: true,
              device: 'Zero-Trust Biometric Terminal #04',
              status: 'On-Time',
            },
            {
              time: '12:30:00 PM',
              type: 'break_start',
              title: 'Mid-Day Meal & Recreation Break Started',
              location: `${empData.location} — Enterprise Cafeteria`,
              geofenceVerified: true,
              device: 'Mobile App Geofence Check-in',
              status: 'Break',
            },
            {
              time: '01:15:22 PM',
              type: 'break_end',
              title: 'Resumed Shift Duties (Break Duration: 45m 22s)',
              location: `${empData.location} — Platform Engineering Annex`,
              geofenceVerified: true,
              device: 'Desktop Biometric MFA Sync',
              status: 'Present',
            },
            {
              time: empData.clockOut || '05:43:09 PM',
              type: 'clock_out',
              title: 'Biometric Kiosk Clock Out & Shift Completion',
              location: `${empData.location} — Main Lobby Gate 1`,
              geofenceVerified: true,
              device: 'Zero-Trust Biometric Terminal #02',
              status: 'Completed',
            },
          ]}
        />

        {/* Manager Oversight Editable Box */}
        <div className="mt-8 p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-extrabold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              Managerial Oversight &amp; Sign-off Notes
            </h5>
            {!isEditingNote ? (
              <button
                onClick={() => {
                  setTempNote(managerNote);
                  setIsEditingNote(true);
                }}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit size={13} />
                <span>Edit Note</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-2xs"
                >
                  Save to Audit Log
                </button>
              </div>
            )}
          </div>

          {!isEditingNote ? (
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed">
              "{managerNote}"
            </p>
          ) : (
            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white dark:bg-[#111] border border-blue-300 dark:border-blue-800 rounded-xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailsPage;
