import React from 'react';
import { UserPlus, FolderTree, Award, DollarSign, CalendarDays, Clock, TrendingUp, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

/**
 * EmployeeTimelineComponent.jsx
 * Comprehensive employee lifecycle timeline auditing events across:
 * Joined, Department Changes, Promotions, Salary Updates, Leave History,
 * Attendance Events, Performance Reviews, and Document Uploads.
 */

export const EmployeeTimelineComponent = ({ events = [], filterCategory = 'All' }) => {
  const getEventConfig = (type) => {
    switch (type) {
      case 'joined':
        return {
          icon: UserPlus,
          bg: 'bg-emerald-500 text-white',
          badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
          label: 'Onboarding Milestone',
        };
      case 'department':
        return {
          icon: FolderTree,
          bg: 'bg-blue-600 text-white',
          badge: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
          label: 'Department Transfer',
        };
      case 'promotion':
        return {
          icon: Award,
          bg: 'bg-purple-600 text-white',
          badge: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
          label: 'Career Advancement',
        };
      case 'salary':
        return {
          icon: DollarSign,
          bg: 'bg-emerald-600 text-white',
          badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
          label: 'Compensation Revision',
        };
      case 'leave':
        return {
          icon: CalendarDays,
          bg: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
          label: 'Leave Event',
        };
      case 'attendance':
        return {
          icon: Clock,
          bg: 'bg-indigo-600 text-white',
          badge: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
          label: 'Attendance Regularization',
        };
      case 'performance':
        return {
          icon: TrendingUp,
          bg: 'bg-teal-600 text-white',
          badge: 'bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
          label: 'Performance Appraisal',
        };
      case 'document':
        return {
          icon: FileText,
          bg: 'bg-gray-700 text-white',
          badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
          label: 'Document Verification',
        };
      default:
        return {
          icon: CheckCircle2,
          bg: 'bg-blue-500 text-white',
          badge: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
          label: 'General Event',
        };
    }
  };

  const filteredEvents = filterCategory === 'All'
    ? events
    : events.filter((ev) => ev.type?.toLowerCase() === filterCategory.toLowerCase());

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-200 dark:border-gray-800 text-gray-500 font-sans">
        No historical lifecycle audit events recorded for this category yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 font-sans before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
      {filteredEvents.map((ev, idx) => {
        const config = getEventConfig(ev.type);
        const IconComp = config.icon;

        return (
          <div key={idx} className="relative group animate-fade-in">
            {/* Timeline Dot Icon */}
            <div
              className={`absolute -left-6 sm:-left-8 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#111111] z-10 transition-transform group-hover:scale-110 ${config.bg}`}
            >
              <IconComp size={15} />
            </div>

            {/* Event Content Card */}
            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 ml-2 sm:ml-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${config.badge}`}>
                    {config.label}
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {ev.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-gray-400 font-semibold">
                  {ev.date}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {ev.description}
              </p>

              {ev.metadata && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500">
                  {Object.entries(ev.metadata).map(([key, value], mIdx) => (
                    <div key={mIdx} className="flex items-center gap-1">
                      <span className="capitalize font-semibold text-gray-400">{key}:</span>
                      <strong className="text-gray-800 dark:text-gray-200">{value}</strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>Logged by: <strong className="text-gray-700 dark:text-gray-300">{ev.author || 'System Auto-Auditor'}</strong></span>
                {ev.docRef && (
                  <span className="text-blue-600 dark:text-blue-400 font-sans font-bold flex items-center gap-1 cursor-pointer hover:underline">
                    Ref: {ev.docRef} <ChevronRight size={12} />
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeTimelineComponent;
