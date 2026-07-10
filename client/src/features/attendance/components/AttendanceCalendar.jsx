import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Home, Sparkles } from 'lucide-react';
import { AttendanceStatusBadge } from './AttendanceBadges';

/**
 * AttendanceCalendar.jsx
 * Enterprise monthly attendance calendar grid for EWMP.
 * Displays interactive date cells with HSL status pills, working hours, and drilldown support.
 * Adheres to Atlassian & Microsoft 365 calendar design patterns.
 */

export const AttendanceCalendar = ({
  onSelectDate,
  selectedDate,
  events = {},
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // July 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate realistic default calendar data if none passed
  const getDayTelemetry = (dayNum) => {
    const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    if (events[dateStr]) return events[dateStr];

    // Simulate standard work week pattern
    const dayOfWeek = new Date(2026, 6, dayNum).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { status: 'Scheduled Off', hours: '0h 00m', clockIn: '-', clockOut: '-', location: 'Weekend Roster' };
    }
    if (dayNum === 3 || dayNum === 17) {
      return { status: 'Late Arrival', hours: '7h 45m', clockIn: '09:15 AM', clockOut: '05:45 PM', location: 'Silicon Valley HQ' };
    }
    if (dayNum === 10 || dayNum === 24) {
      return { status: 'Work From Home', hours: '8h 30m', clockIn: '08:30 AM', clockOut: '05:45 PM', location: 'Remote IP (US-CA)' };
    }
    if (dayNum === 14) {
      return { status: 'Overtime', hours: '10h 15m', clockIn: '08:00 AM', clockOut: '07:00 PM', location: 'Silicon Valley HQ' };
    }
    if (dayNum === 20 || dayNum === 21) {
      return { status: 'On Leave', hours: '8h 00m (PTO)', clockIn: 'PTO', clockOut: 'PTO', location: 'Annual Vacation' };
    }
    if (dayNum > 28) {
      return { status: 'Scheduled', hours: '8h 00m', clockIn: '08:30 AM', clockOut: '05:30 PM', location: 'Silicon Valley HQ' };
    }

    return { status: 'Present', hours: '8h 15m', clockIn: '08:25 AM', clockOut: '05:30 PM', location: 'Silicon Valley HQ' };
  };

  // Grid calculation
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm font-sans space-y-6">
      {/* 1. Calendar Header & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} />
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Interactive monthly attendance grid. Click any calendar date cell to inspect detailed clock-in telemetry and biometric kiosk timestamps.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#161616] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#161616] p-1 rounded-2xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#222] shadow-2xs transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#222] shadow-2xs transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Weekday Label Headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-extrabold text-gray-400 uppercase tracking-wider pb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* 3. Monthly Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {/* Leading empty slots */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-24 sm:h-32 bg-gray-50/40 dark:bg-[#141414]/40 rounded-2xl border border-gray-100/50 dark:border-gray-800/30 opacity-40 select-none"
          />
        ))}

        {/* Actual month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
          const telemetry = getDayTelemetry(dayNum);
          const isSelected = selectedDate === dateStr;
          const isToday = dayNum === 7; // Simulating July 7th as Today

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate && onSelectDate(dateStr, telemetry)}
              className={`h-24 sm:h-32 rounded-2xl p-2.5 sm:p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : isToday
                  ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-400/80 dark:border-amber-700/80'
                  : 'bg-gray-50/80 dark:bg-[#161616] border-gray-200/80 dark:border-gray-800/80 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono font-extrabold text-xs sm:text-sm rounded-lg px-1.5 py-0.5 ${
                    isToday
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600'
                  }`}
                >
                  {dayNum < 10 ? `0${dayNum}` : dayNum}
                </span>

                <span className="text-[10px] font-mono font-bold text-gray-400 hidden sm:inline truncate max-w-[60px]">
                  {telemetry.hours}
                </span>
              </div>

              {/* Status Pill Indicator */}
              <div className="my-1">
                <AttendanceStatusBadge status={telemetry.status} size="sm" showIcon={false} />
              </div>

              {/* Footer Telemetry */}
              <div className="pt-1.5 border-t border-gray-200/50 dark:border-gray-800/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span className="truncate max-w-[70px]">{telemetry.clockIn}</span>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-700">→</span>
                <span className="hidden sm:inline truncate max-w-[70px]">{telemetry.clockOut}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Legend Footer */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px]">Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Present / On-Time</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Late Arrival</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Work From Home</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> On Leave</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Overtime</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-blue-600 font-sans font-bold">
          <Sparkles size={13} />
          <span>Click any date cell for geofence &amp; kiosk audit logs</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
