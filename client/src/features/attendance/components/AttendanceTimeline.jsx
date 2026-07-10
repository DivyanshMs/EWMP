import React from 'react';
import { Clock, MapPin, CheckCircle2, Coffee, LogOut, ShieldCheck, MessageSquare, History } from 'lucide-react';
import { AttendanceStatusBadge } from './AttendanceBadges';

/**
 * AttendanceTimeline.jsx
 * Daily biometric kiosk & geofenced check-in timeline for EWMP.
 * Audits timestamps across Clock In, Break duration, Clock Out,
 * Geofence verification status, and Manager regularizations.
 */

export const AttendanceTimeline = ({
  events = [
    {
      time: '08:28:14 AM',
      type: 'clock_in',
      title: 'Biometric Kiosk Clock In',
      location: 'Silicon Valley HQ (US-SV-01) — Main Lobby Gate 3',
      geofenceVerified: true,
      device: 'Zero-Trust Biometric Terminal #04',
      status: 'On-Time',
    },
    {
      time: '12:30:00 PM',
      type: 'break_start',
      title: 'Mid-Day Meal & Recreation Break Started',
      location: 'Silicon Valley HQ — Enterprise Cafeteria',
      geofenceVerified: true,
      device: 'Mobile App Geofence Check-in',
      status: 'Break',
    },
    {
      time: '01:15:22 PM',
      type: 'break_end',
      title: 'Resumed Shift Duties (Break Duration: 45m 22s)',
      location: 'Silicon Valley HQ — Platform Engineering Annex',
      geofenceVerified: true,
      device: 'Desktop Biometric MFA Sync',
      status: 'Present',
    },
    {
      time: '05:42:09 PM',
      type: 'clock_out',
      title: 'Biometric Kiosk Clock Out & Shift Completion',
      location: 'Silicon Valley HQ (US-SV-01) — Main Lobby Gate 1',
      geofenceVerified: true,
      device: 'Zero-Trust Biometric Terminal #02',
      status: 'Completed',
    },
  ],
  managerNotes = 'David completed standard 8h 15m shift with full geofence verification compliance. No regularization required.',
  correctionHistory = [],
}) => {
  const getTimelineConfig = (type) => {
    switch (type) {
      case 'clock_in':
        return {
          icon: Clock,
          bg: 'bg-emerald-500 text-white',
          badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
        };
      case 'break_start':
      case 'break_end':
        return {
          icon: Coffee,
          bg: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
        };
      case 'clock_out':
        return {
          icon: LogOut,
          bg: 'bg-purple-600 text-white',
          badge: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
        };
      default:
        return {
          icon: CheckCircle2,
          bg: 'bg-blue-600 text-white',
          badge: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
        };
    }
  };

  return (
    <div className="space-y-8 font-sans animate-fade-in">
      {/* 1. Main Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
        {events.map((ev, idx) => {
          const config = getTimelineConfig(ev.type);
          const IconComp = config.icon;

          return (
            <div key={idx} className="relative group">
              {/* Timeline Dot Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#111111] z-10 transition-transform group-hover:scale-110 ${config.bg}`}
              >
                <IconComp size={15} />
              </div>

              {/* Event Content Box */}
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all ml-2 sm:ml-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                      {ev.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${config.badge}`}>
                      {ev.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {ev.time}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-purple-500 shrink-0" />
                    <span className="font-medium truncate">{ev.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-gray-400">
                    <span>Device: <strong className="text-gray-700 dark:text-gray-300">{ev.device}</strong></span>
                    {ev.geofenceVerified && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck size={13} />
                        Geofence Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Manager Notes & Correction History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Manager Notes */}
        <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 space-y-3">
          <h5 className="font-extrabold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <MessageSquare size={14} className="text-blue-500" />
            Managerial Oversight &amp; Audit Notes
          </h5>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{managerNotes}"
          </p>
          <div className="text-[11px] font-mono text-gray-400 flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-800">
            <span>Verified by: <strong className="text-gray-800 dark:text-gray-200">David Kim (VP Eng)</strong></span>
            <span className="text-emerald-600 font-bold">✓ Signed &amp; Compliant</span>
          </div>
        </div>

        {/* Correction History */}
        <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 space-y-3">
          <h5 className="font-extrabold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <History size={14} className="text-amber-500" />
            Correction &amp; Regularization History
          </h5>
          {correctionHistory.length === 0 ? (
            <div className="text-xs text-gray-500 py-3 text-center">
              No historical correction requests or time adjustments logged for this date.
            </div>
          ) : (
            <div className="space-y-2">
              {correctionHistory.map((item, cIdx) => (
                <div key={cIdx} className="p-2.5 bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-xs flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.reason}</span>
                  <AttendanceStatusBadge status={item.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTimeline;
