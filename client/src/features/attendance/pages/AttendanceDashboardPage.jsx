import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Clock, Home, TrendingUp, UserCheck, AlertCircle, LogOut, LogIn, FileText, History, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';

import { AttendanceCard, WorkingHoursCard } from '../components/AttendanceCards';
import { AttendanceStatusBadge } from '../components/AttendanceBadges';

/**
 * AttendanceDashboardPage.jsx
 * Page 1: Main command center for the EWMP Attendance Management module.
 * Displays real-time organizational KPIs (Present, Absent, Late, WFH, Leave, Overtime),
 * Weekly/Monthly overview trend summaries, and one-click employee Quick Actions.
 */

export const AttendanceDashboardPage = ({
  onNavigateMyAttendance,
  onNavigateManagement,
  onNavigateCorrections,
  onNavigateAnalytics,
  onNavigateDetails,
}) => {
  const [clockedIn, setClockedIn] = useState(true);
  const [lastActionTime, setLastActionTime] = useState('08:28 AM today');

  const handleClockToggle = () => {
    if (clockedIn) {
      if (window.confirm('Initiate biometric kiosk Clock Out sequence for your current shift?')) {
        setClockedIn(false);
        setLastActionTime('05:45 PM today');
      }
    } else {
      setClockedIn(true);
      setLastActionTime('08:30 AM today');
    }
  };

  const handleRequestCorrectionSim = () => {
    const reason = window.prompt(
      'Enter justification for attendance regularization (e.g., Biometric kiosk delay, geofence sync error):'
    );
    if (reason && reason.trim()) {
      alert(`Correction request submitted successfully! Your reporting manager has been notified for approval.`);
      if (onNavigateCorrections) onNavigateCorrections();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* 1. Header Banner & Live Telemetry Clock Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Workforce Attendance Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Clock className="text-blue-600 dark:text-blue-400 shrink-0" size={30} />
            Attendance &amp; Geofence Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Monitor real-time biometric kiosk synchronizations, geofenced remote check-ins, overtime rosters, and regularization queues across all global operating divisions.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleClockToggle}
            className={`px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 ${
              clockedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            }`}
          >
            {clockedIn ? <LogOut size={18} /> : <LogIn size={18} />}
            <span>{clockedIn ? 'Clock Out Now' : 'Clock In Now'}</span>
          </button>

          <button
            onClick={handleRequestCorrectionSim}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <FileText size={16} className="text-amber-500" />
            <span>Request Correction</span>
          </button>

          <button
            onClick={onNavigateMyAttendance}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <History size={16} className="text-blue-500" />
            <span>View My History</span>
          </button>
        </div>
      </div>

      {/* 2. Personal Live Status Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold">
            <Sparkles size={13} className="text-amber-400" />
            <span>Zero-Trust Biometric Kiosk Status: ACTIVE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, David Vance (EMP-1042)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl opacity-90">
            Your attendance for today is verified via Silicon Valley HQ geofence boundary. Current shift roster: <strong>Standard Morning Roster (08:00 - 17:00)</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-inner">
            ✓
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-200 block font-bold">Current Status</span>
            <div className="text-lg font-extrabold font-mono">Present • On-Time</div>
            <div className="text-[11px] text-blue-200 font-mono">Last logged: {lastActionTime}</div>
          </div>
        </div>
      </div>

      {/* 3. Today's Attendance Summary (6 KPI Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <UserCheck size={20} className="text-blue-600" />
            Today’s Organizational Attendance Summary (July 7, 2026)
          </h3>
          <span className="text-xs font-mono text-gray-400">Total Active Roster: 1,350 Employees</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          <AttendanceCard
            title="Present Today"
            value="1,142"
            subtitle="84.6% of workforce"
            trend="+1.8% vs yesterday"
            isPositive={true}
            type="present"
            onClick={onNavigateManagement}
          />
          <AttendanceCard
            title="Work From Home"
            value="138"
            subtitle="10.2% remote roster"
            trend="+3.4% hybrid surge"
            isPositive={true}
            type="wfh"
            onClick={onNavigateManagement}
          />
          <AttendanceCard
            title="Late Arrival"
            value="24"
            subtitle="1.8% delayed check-in"
            trend="-0.5% vs last week"
            isPositive={true}
            type="late"
            onClick={onNavigateCorrections}
          />
          <AttendanceCard
            title="On Leave"
            value="38"
            subtitle="2.8% planned PTO"
            trend="+0.2% seasonal"
            isPositive={true}
            type="leave"
            onClick={() => alert('Navigating to Leave Summary...')}
          />
          <AttendanceCard
            title="Overtime Active"
            value="42"
            subtitle="Extended shift roster"
            trend="-2.1% stabilization"
            isPositive={true}
            type="ot"
            onClick={onNavigateAnalytics}
          />
          <AttendanceCard
            title="Unexcused Absent"
            value="8"
            subtitle="0.6% missing logs"
            trend="-1.2% reduction"
            isPositive={true}
            type="absent"
            onClick={onNavigateManagement}
          />
        </div>
      </div>

      {/* 4. Weekly & Monthly Overview Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Working Hours Card & Weekly Trend */}
        <div className="lg:col-span-2 space-y-6">
          <WorkingHoursCard
            clockIn="08:28 AM"
            clockOut="05:42 PM"
            totalHours="8h 14m"
            breakHours="45m"
            overtime="0h 00m"
            progress={88}
            status="Present"
          />

          {/* Weekly Overview Summary Box */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" />
                Weekly Workforce Compliance Trend (Week 28)
              </h4>
              <button
                onClick={onNavigateAnalytics}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-mono text-gray-400 uppercase font-bold block">Avg Working Hours</span>
                <div className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white mt-1">8.4 hrs/day</div>
                <span className="text-[11px] text-emerald-600 font-mono font-bold mt-1 block">✓ Compliant with SLA</span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-mono text-gray-400 uppercase font-bold block">Biometric Sync Rate</span>
                <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">99.4%</div>
                <span className="text-[11px] text-gray-500 font-mono mt-1 block">0.6% manual override</span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-mono text-gray-400 uppercase font-bold block">Overtime Hours</span>
                <div className="text-2xl font-extrabold font-mono text-teal-600 mt-1">340 hrs total</div>
                <span className="text-[11px] text-teal-600 font-mono font-bold mt-1 block">↓ 12% vs previous week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Correction Queue Preview & System Telemetry */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Pending Correction Queue (3)
              </h4>
              <button
                onClick={onNavigateCorrections}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Elena Rostova', reason: 'Biometric kiosk delay at London Hub gate 2', date: '2026-07-06', status: 'Pending Review' },
                { name: 'James Wilson', reason: 'Geofence GPS drift during remote SRE incident', date: '2026-07-05', status: 'Pending Review' },
                { name: 'Clara Barton', reason: 'Forgot to swipe out after Austin client meeting', date: '2026-07-03', status: 'In Review' },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={onNavigateCorrections}
                  className="p-3.5 bg-gray-50 dark:bg-[#161616] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">{item.name}</span>
                    <span className="font-mono text-[10px] text-amber-600 font-bold">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900 text-white space-y-3 relative overflow-hidden">
            <ShieldCheck size={24} className="text-emerald-400" />
            <h5 className="font-extrabold text-base">SOX &amp; ISO-27001 Compliance</h5>
            <p className="text-xs text-gray-400 leading-relaxed">
              All attendance logs are cryptographically sealed and immutable. Manual regularization overrides require explicit manager authorization and leave a verifiable audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboardPage;
