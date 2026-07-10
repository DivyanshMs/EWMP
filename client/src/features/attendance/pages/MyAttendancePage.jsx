import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { History, Calendar, Clock, Download, FileText } from 'lucide-react';

import { AttendanceCalendar } from '../components/AttendanceCalendar';
import { AttendanceTimeline } from '../components/AttendanceTimeline';
import { WorkingHoursCard } from '../components/AttendanceCards';
import { AttendanceStatusBadge } from '../components/AttendanceBadges';

/**
 * MyAttendancePage.jsx
 * Page 2: Personal employee attendance portal for EWMP.
 * Features an interactive Monthly Calendar grid linked directly to a Daily Timeline inspection drawer.
 * Displays Clock In/Out timestamps, Working Hours, Break Time, Overtime, Geofence verification, and Export triggers.
 */

export const MyAttendancePage = ({ onRequestCorrection }) => {
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-attendance-history'],
    queryFn: () => api.get('/attendance/my').then(res => res.data)
  });

  const attendanceRecords = data?.data?.items || data?.data || [];

  const [selectedDate, setSelectedDate] = useState('2026-07-07');
  const [selectedDayTelemetry, setSelectedDayTelemetry] = useState({
    status: 'Present',
    hours: '8h 15m',
    clockIn: '08:28 AM',
    clockOut: '05:43 PM',
    location: 'Silicon Valley HQ (US-SV-01)',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleDateSelect = (dateStr, telemetry) => {
    setSelectedDate(dateStr);
    if (telemetry) {
      setSelectedDayTelemetry(telemetry);
    } else {
      const record = attendanceRecords.find(r => r.date === dateStr);
      if (record) {
        setSelectedDayTelemetry({
          status: record.status || 'Present',
          hours: record.totalHours ? record.totalHours.toFixed(2) + 'h' : '0h',
          clockIn: record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '--:--',
          clockOut: record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '--:--',
          location: 'HQ',
          id: record._id || record.id
        });
      }
    }
  };


  const handleExportMyHistory = () => {
    alert(`Exporting personal attendance audit ledger for July 2026 to verified PDF / CSV format...`);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* 1. Header Banner & Export Commands */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Personal Attendance Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="text-blue-600 dark:text-blue-400 shrink-0" size={30} />
            My Attendance &amp; Shift Timeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Inspect your monthly attendance grid, daily biometric check-in timestamps, working hours breakdown, overtime accumulation, and geofence verification logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRequestCorrection}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <FileText size={16} className="text-amber-500" />
            <span>Request Correction</span>
          </button>

          <button
            onClick={handleExportMyHistory}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. Monthly Calendar vs Daily Drilldown Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-7 space-y-6">
          <AttendanceCalendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />

          {/* Quick Summary Bar */}
          <div className="p-5 rounded-3xl bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div>
              <span className="text-gray-400 block uppercase font-bold text-[10px]">Monthly Total</span>
              <strong className="text-base text-gray-900 dark:text-white mt-1 block">168h 30m</strong>
            </div>
            <div>
              <span className="text-gray-400 block uppercase font-bold text-[10px]">Overtime YTD</span>
              <strong className="text-base text-teal-600 mt-1 block">14h 15m</strong>
            </div>
            <div>
              <span className="text-gray-400 block uppercase font-bold text-[10px]">Late Incidents</span>
              <strong className="text-base text-amber-600 mt-1 block">2 Days</strong>
            </div>
            <div>
              <span className="text-gray-400 block uppercase font-bold text-[10px]">SLA Score</span>
              <strong className="text-base text-emerald-600 mt-1 block">98.8%</strong>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Daily Timeline Inspection Panel */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold block uppercase">
                  Daily Telemetry Drilldown
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                  {selectedDate === '2026-07-07' ? 'Today, July 07, 2026' : selectedDate}
                </h3>
              </div>
              <AttendanceStatusBadge status={selectedDayTelemetry.status} size="md" />
            </div>

            {/* Working Hours Breakdown Box */}
            <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500 font-bold">Total Recorded Shift:</span>
                <strong className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">{selectedDayTelemetry.hours}</strong>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-gray-200/50 dark:border-gray-800">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Clock In</span>
                  <strong className="text-gray-800 dark:text-gray-200">{selectedDayTelemetry.clockIn}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Clock Out</span>
                  <strong className="text-gray-800 dark:text-gray-200">{selectedDayTelemetry.clockOut}</strong>
                </div>
              </div>
            </div>

            {/* Timeline Component */}
            <div className="pt-2">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-4">
                Biometric &amp; Geofenced Event Stream
              </h4>
              <AttendanceTimeline
                events={
                  selectedDayTelemetry.status === 'Scheduled Off'
                    ? []
                    : [
                        {
                          time: selectedDayTelemetry.clockIn || '08:30 AM',
                          type: 'clock_in',
                          title: 'Biometric Kiosk Clock In',
                          location: selectedDayTelemetry.location || 'Silicon Valley HQ (US-SV-01)',
                          geofenceVerified: true,
                          device: 'Zero-Trust Biometric Terminal #04',
                          status: 'On-Time',
                        },
                        {
                          time: '12:30 PM',
                          type: 'break_start',
                          title: 'Mid-Day Recreation Break',
                          location: 'Silicon Valley HQ — Enterprise Cafeteria',
                          geofenceVerified: true,
                          device: 'Mobile App Geofence Check-in',
                          status: 'Break',
                        },
                        {
                          time: '01:15 PM',
                          type: 'break_end',
                          title: 'Resumed Shift Duties (45m break)',
                          location: 'Silicon Valley HQ — Platform Engineering',
                          geofenceVerified: true,
                          device: 'Desktop Biometric MFA Sync',
                          status: 'Present',
                        },
                        {
                          time: selectedDayTelemetry.clockOut || '05:45 PM',
                          type: 'clock_out',
                          title: 'Biometric Kiosk Clock Out & Shift Completion',
                          location: selectedDayTelemetry.location || 'Silicon Valley HQ (US-SV-01)',
                          geofenceVerified: true,
                          device: 'Zero-Trust Biometric Terminal #02',
                          status: 'Completed',
                        },
                      ]
                }
              />
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={onRequestCorrection}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Report discrepancy for this date</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendancePage;
