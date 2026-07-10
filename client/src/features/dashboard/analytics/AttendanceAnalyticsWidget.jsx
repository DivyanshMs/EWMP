import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  UserCheck, 
  Clock, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';
import { AreaChartPlaceholder, DonutChartPlaceholder, BarChartPlaceholder } from '../charts/ChartsPlaceholders';

/**
 * AttendanceAnalyticsWidget.jsx
 * Executive Attendance & Time-Tracking Analytics Widget.
 * Tracks daily/weekly attendance trends, department efficiency, late arrivals, and overtime.
 */

export const AttendanceAnalyticsWidget = () => {
  
  const [timeRange, setTimeRange] = useState('weekly');

  const { data: attendanceRes } = useQuery({
    queryKey: ['attendance_report', timeRange],
    queryFn: () => api.get('/reports/attendance?export=true').then(res => res.data)
  });

  const rawData = attendanceRes?.data || [];
  const total = rawData.length || 1;
  const lateCount = rawData.filter(r => r.status === 'Late').length;
  const presentCount = rawData.filter(r => r.status === 'Present').length;
  const onTimePct = Math.round((presentCount / total) * 100);
  const latePct = Math.round((lateCount / total) * 100);

  const dynamicDeptAttendance = [
    { label: 'All', val1: onTimePct, val2: latePct, color1: 'bg-emerald-600', color2: 'bg-amber-400' }
  ];


  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Attendance & Time Telemetry
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Real-time check-in efficiency & overtime tracking
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-lg text-xs font-semibold w-fit">
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1 rounded-md transition-all ${
              timeRange === 'weekly' ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            Weekly Trend
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1 rounded-md transition-all ${
              timeRange === 'monthly' ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      {/* Main Grid: Trend Area Chart & Efficiency Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2">
          <AreaChartPlaceholder
            title={timeRange === 'weekly' ? '7-Day Check-in & Presence Curve' : '30-Day Attendance Stability'}
            subtitle="Comparing present employees against grace period and late check-ins"
            height="h-52"
          />
        </div>
        <div className="bg-gray-50/50 dark:bg-[#161616]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center mb-3">
            Today&apos;s Punctuality Split
          </h4>
          <DonutChartPlaceholder percentage={onTimePct} label="Punctuality Rate" />
        </div>
      </div>

      {/* Bottom Metrics Row: Department Comparison, Late Arrivals & Overtime */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
        {/* Dept Bar Chart */}
        <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-900 dark:text-white">Dept Attendance (%)</span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Green = On Time</span>
          </div>
          <BarChartPlaceholder bars={dynamicDeptAttendance} height="h-28" />
        </div>

        {/* Late arrivals summary */}
        <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <Clock size={14} /> Late Arrivals Today
              </span>
              <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">{lateCount} Employees</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
              Average delay is <strong className="text-gray-900 dark:text-white">18 mins</strong>. Highest concentration in Engineering (16) and Sales (12).
            </p>
          </div>
          <button
            onClick={() => window.location.assign('/attendance')}
            className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
          >
            Review Regularizations
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Overtime summary */}
        <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                <TrendingUp size={14} /> Overtime Summary
              </span>
              <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">1,420 hrs (Month)</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
              Overtime hours are up <strong className="text-purple-600 dark:text-purple-400">+8.4%</strong> compared to last month. Highest in IT Infrastructure.
            </p>
          </div>
          <button
            onClick={() => window.location.assign('/attendance')}
            className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
          >
            Overtime Cost Report
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalyticsWidget;
