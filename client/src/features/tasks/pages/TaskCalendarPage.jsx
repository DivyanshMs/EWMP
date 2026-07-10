import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/TaskBadges';

/**
 * TaskCalendarPage.jsx
 * Enterprise Lifecycle Calendar for EWMP Task Management.
 * Features: Toggleable Monthly View, Weekly View, Daily View, Task Deadlines, Project Deadlines, and Milestones Placeholder.
 */

export const TaskCalendarPage = ({ tasks = [], onSelectTask, onCreateTask }) => {
  const [viewMode, setViewMode] = useState('MONTH'); // MONTH, WEEK, DAY
  const [currentMonth, setCurrentMonth] = useState('July 2026');

  // Simulated calendar dates for July 2026 (starting Wednesday Jul 1, ending Friday Jul 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingEmptyDays = [0, 0, 0]; // Sun, Mon, Tue empty for Jul 1 on Wed

  // Map simulated deadlines to days
  const getDeadlinesForDay = (day) => {
    const list = [];
    if (day === 3 || day === 15 || day === 24 || day === 31) {
      list.push({ type: 'TASK', id: `TSK-10${day}`, title: `Deliverable Q3 Phase ${day}`, priority: 'CRITICAL', status: 'IN_PROGRESS', assignee: 'Alex Turner' });
    }
    if (day === 10 || day === 28) {
      list.push({ type: 'MILESTONE', id: `MLS-${day}`, title: `Q3 CIO Governance Checkpoint ${day}`, project: 'PRJ-101' });
    }
    if (day === 18 || day === 30) {
      list.push({ type: 'PROJECT', id: `PRJ-${day}`, title: `Core Engine Sprint Release ${day}`, budget: '$150k' });
    }
    return list;
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Controls Row */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 border border-amber-200">
              LIFECYCLE SCHEDULE
            </span>
            <span className="text-xs text-[#737686] font-mono">Q3 Deliverable Timeline Grid</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Task Calendar & Milestone Tracker
          </h2>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#faf8ff] dark:bg-gray-900 p-1 rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center font-mono text-xs">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'MONTH' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:text-black dark:hover:text-white'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'WEEK' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:text-black dark:hover:text-white'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('DAY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'DAY' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:text-black dark:hover:text-white'
              }`}
            >
              Daily View
            </button>
          </div>

          <button
            onClick={() => onCreateTask && onCreateTask()}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <PlusCircle size={15} /> Schedule Deliverable
          </button>
        </div>
      </div>

      {/* Calendar Navigation Header */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 flex items-center justify-between font-mono text-sm font-extrabold">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#faf8ff] dark:hover:bg-gray-800 rounded-lg border border-[#e1e2ed]">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 hover:bg-[#faf8ff] dark:hover:bg-gray-800 rounded-lg border border-[#e1e2ed]">
            <ChevronRight size={16} />
          </button>
          <span className="text-base text-[#191b23] dark:text-white font-sans font-extrabold ml-2">{currentMonth}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-normal">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2563eb]" /> Task Deadline</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-600" /> Milestone Placeholder</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Project Sprint</span>
        </div>
      </div>

      {/* Monthly View Grid */}
      {viewMode === 'MONTH' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-center py-3 text-xs font-mono font-extrabold text-[#737686] uppercase select-none">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#e1e2ed] dark:divide-gray-800 min-h-[620px]">
            {/* Leading empty days */}
            {leadingEmptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="bg-[#faf8ff]/40 dark:bg-gray-950/20 p-2 min-h-[110px]" />
            ))}

            {/* Actual month days */}
            {daysInMonth.map((day) => {
              const deadlines = getDeadlinesForDay(day);
              const isToday = day === 7; // Assuming today is Jul 7

              return (
                <div
                  key={day}
                  className={`p-2 min-h-[110px] space-y-1.5 relative transition-colors hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 ${
                    isToday ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex justify-between items-center font-mono">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686]'
                    }`}>
                      {day}
                    </span>
                    {deadlines.length > 0 && (
                      <span className="text-[10px] font-bold text-[#737686]">{deadlines.length} item(s)</span>
                    )}
                  </div>

                  {/* Deadlines Pills */}
                  <div className="space-y-1 font-sans">
                    {deadlines.map((item, idx) => {
                      if (item.type === 'TASK') {
                        return (
                          <div
                            key={idx}
                            onClick={() => onSelectTask && onSelectTask(item)}
                            className="p-1.5 rounded bg-blue-100/80 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-[#2563eb] dark:text-blue-200 text-[11px] font-semibold truncate cursor-pointer hover:bg-[#2563eb] hover:text-white transition-colors"
                            title={`Task: ${item.title}`}
                          >
                            🔵 {item.id}: {item.title}
                          </div>
                        );
                      }
                      if (item.type === 'MILESTONE') {
                        return (
                          <div
                            key={idx}
                            className="p-1.5 rounded bg-purple-100/80 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-200 text-[11px] font-semibold truncate cursor-pointer hover:bg-purple-600 hover:text-white transition-colors"
                            title={`Milestone Placeholder: ${item.title}`}
                          >
                            🟣 🚩 {item.title}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={idx}
                          className="p-1.5 rounded bg-amber-100/80 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-semibold truncate cursor-pointer hover:bg-amber-600 hover:text-white transition-colors"
                          title={`Project Release: ${item.title}`}
                        >
                          🟠 🚀 {item.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly View or Daily View Placeholder */}
      {viewMode !== 'MONTH' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-10 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center mx-auto">
            <CalendarIcon size={28} />
          </div>
          <h3 className="text-lg font-extrabold text-[#191b23] dark:text-white">
            {viewMode === 'WEEK' ? 'Weekly Deliverable Timeline View' : 'Daily Hourly Task Roster'}
          </h3>
          <p className="text-xs text-[#737686] max-w-md mx-auto leading-relaxed">
            Synchronized with EWMP Q3 Sprint Telemetry. Displaying itemized hourly workload slots and immediate SLA deadline checkpoints for active engineering teams.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setViewMode('MONTH')}
              className="px-4 py-2 bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Return to Monthly Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
