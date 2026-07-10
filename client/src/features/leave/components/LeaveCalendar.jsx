import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Building2, Flag, Filter } from 'lucide-react';
import { LeaveStatusBadge, LeaveTypeBadge } from './LeaveBadges';

/**
 * LeaveCalendar.jsx
 * Multi-view interactive calendar for EWMP Leave Management.
 * Supports Monthly, Weekly, Team, and Department calendar views with holiday overlays.
 */

export const LeaveCalendar = ({ events = [], holidays = [] }) => {
  const [viewMode, setViewMode] = useState('monthly'); // monthly | weekly | team | department
  const [currentMonth, setCurrentMonth] = useState('July 2026');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Simulated calendar grid for July 2026 (starts on Wed)
  const calendarDays = [
    { day: 29, month: 'prev', isCurrentMonth: false },
    { day: 30, month: 'prev', isCurrentMonth: false },
    ...Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      month: 'current',
      isCurrentMonth: true,
      events: events.filter(e => e.day === i + 1),
      holidays: holidays.filter(h => h.day === i + 1)
    })),
    { day: 1, month: 'next', isCurrentMonth: false },
    { day: 2, month: 'next', isCurrentMonth: false }
  ];

  const handlePrevMonth = () => setCurrentMonth('June 2026');
  const handleNextMonth = () => setCurrentMonth('August 2026');

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg shadow-xs overflow-hidden">
      {/* Calendar Header & View Controls */}
      <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded p-0.5">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-[#ededf9] dark:hover:bg-gray-800 rounded text-[#434655] dark:text-gray-300">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 font-bold text-sm text-[#191b23] dark:text-white font-mono">{currentMonth}</span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-[#ededf9] dark:hover:bg-gray-800 rounded text-[#434655] dark:text-gray-300">
              <ChevronRight size={16} />
            </button>
          </div>
          <button onClick={() => setCurrentMonth('July 2026')} className="text-xs font-semibold px-2.5 py-1.5 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded hover:bg-[#faf8ff] text-[#191b23] dark:text-white">
            Today
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded p-0.5">
            {[
              { id: 'monthly', label: 'Monthly', icon: CalendarIcon },
              { id: 'weekly', label: 'Weekly', icon: CalendarIcon },
              { id: 'team', label: 'Team Calendar', icon: Users },
              { id: 'department', label: 'Department', icon: Building2 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                    viewMode === tab.id
                      ? 'bg-[#2563eb] text-white shadow-2xs'
                      : 'text-[#434655] dark:text-gray-400 hover:text-[#191b23] dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Department Filter */}
          {(viewMode === 'team' || viewMode === 'department') && (
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">All Departments</option>
              <option value="ENG">Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="FIN">Finance</option>
              <option value="SALES">Sales & Mktg</option>
            </select>
          )}
        </div>
      </div>

      {/* Legend & Filter Bar */}
      <div className="px-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 font-medium text-[#434655] dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Approved Leave
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending Approval
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Company Holiday
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#737686]" />
          <span className="text-[#737686]">Status Filter:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-white dark:bg-[#111] border border-[#c3c6d7] dark:border-gray-800 rounded px-2 py-0.5"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid View */}
      {viewMode === 'monthly' && (
        <div>
          {/* Day Names Header */}
          <div className="grid grid-cols-7 border-b border-[#e1e2ed] dark:border-gray-800 bg-[#ededf9]/50 dark:bg-gray-900/50">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2.5 px-3 text-xs font-bold text-center uppercase tracking-wider text-[#434655] dark:text-gray-400 border-r last:border-r-0 border-[#e1e2ed]/60 dark:border-gray-800/60">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 auto-rows-[110px]">
            {calendarDays.map((cell, idx) => (
              <div
                key={idx}
                className={`p-2 border-r border-b border-[#e1e2ed]/60 dark:border-gray-800/60 transition-colors flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-[#faf8ff]/50 dark:bg-gray-950/50 text-[#737686]'
                    : 'bg-white dark:bg-[#111111] hover:bg-[#f3f3fe] dark:hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${
                    cell.day === 7 && cell.isCurrentMonth
                      ? 'w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center'
                      : ''
                  }`}>
                    {cell.day}
                  </span>
                  {cell.holidays && cell.holidays.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-purple-500" title={cell.holidays[0].name} />
                  )}
                </div>

                {/* Event Pills inside Day Cell */}
                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[70px]">
                  {cell.holidays?.map((hol, hIdx) => (
                    <div key={`h-${hIdx}`} className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded text-[10px] font-bold truncate border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                      <Flag size={9} /> {hol.name}
                    </div>
                  ))}

                  {cell.events?.map((ev, eIdx) => {
                    if (selectedStatus !== 'ALL' && ev.status !== selectedStatus) return null;
                    const isApproved = ev.status === 'APPROVED';
                    return (
                      <div
                        key={`e-${eIdx}`}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border flex items-center justify-between ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                        title={`${ev.employee} - ${ev.type} (${ev.status})`}
                      >
                        <span className="truncate">{ev.employee}</span>
                        <span className="text-[9px] font-mono opacity-80">{ev.type.substring(0, 3)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly & Team List/Timeline Views */}
      {(viewMode === 'weekly' || viewMode === 'team' || viewMode === 'department') && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Users size={18} className="text-[#2563eb]" />
              {viewMode.toUpperCase()} SCHEDULE & LEAVE ROSTER — JULY 2026
            </h4>
            <span className="text-xs text-[#737686] font-mono">Showing {events.length} employees on leave this period</span>
          </div>

          <div className="space-y-3">
            {events.map((row, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between p-3.5 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] dark:border-gray-800 gap-3 hover:border-[#c3c6d7] transition-all">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-9 h-9 rounded-full bg-[#2563eb]/10 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                    {row.avatar}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#191b23] dark:text-white">{row.name}</h5>
                    <span className="text-xs text-[#737686]">{row.dept}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <LeaveTypeBadge type={row.type} />
                  <span className="text-xs font-mono font-bold text-[#191b23] dark:text-white bg-white dark:bg-[#111] px-2.5 py-1 rounded border border-[#e1e2ed] dark:border-gray-800">
                    {row.dates} ({row.days})
                  </span>
                </div>

                <div>
                  <LeaveStatusBadge status={row.status} />
                </div>
              </div>
            ))}
            {events.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#c3c6d7] p-6 text-center text-sm text-[#737686] dark:border-gray-800">
                No leave records found for this calendar view.
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
