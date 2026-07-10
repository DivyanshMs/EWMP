import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Home, CalendarDays, TrendingUp, TrendingDown, Check, X, MessageSquare, BarChart2, PieChart, Activity, ChevronRight, Sparkles } from 'lucide-react';
import { AttendanceStatusBadge, AttendanceEmployeeAvatar } from './AttendanceBadges';

/**
 * AttendanceCards.jsx
 * Enterprise modular card components for the EWMP Attendance Management module.
 * Adheres to Workday & Rippling design aesthetics with Auto Layout spacing.
 * Includes:
 * 1. AttendanceCard (KPI summary metrics with trend delta)
 * 2. WorkingHoursCard (Daily hours progress & break telemetry)
 * 3. CorrectionCard (Request review item with Approve/Reject/Comment triggers)
 * 4. AnalyticsCard (Trend analysis summary card)
 * 5. ChartsPlaceholder (Interactive CSS heatmap and visual chart placeholder)
 */

export const AttendanceCard = ({
  title = 'Present Today',
  value = '1,248',
  subtitle = '92.4% of workforce',
  trend = '+2.1% vs yesterday',
  isPositive = true,
  type = 'present', // 'present' | 'absent' | 'late' | 'leave' | 'wfh' | 'ot'
  onClick,
}) => {
  const getCardTheme = () => {
    switch (type) {
      case 'present':
        return {
          icon: CheckCircle2,
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          borderHover: 'hover:border-emerald-500/50',
          accentText: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'absent':
        return {
          icon: XCircle,
          iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
          borderHover: 'hover:border-rose-500/50',
          accentText: 'text-rose-600 dark:text-rose-400',
        };
      case 'late':
        return {
          icon: Clock,
          iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          borderHover: 'hover:border-amber-500/50',
          accentText: 'text-amber-600 dark:text-amber-400',
        };
      case 'leave':
        return {
          icon: CalendarDays,
          iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
          borderHover: 'hover:border-purple-500/50',
          accentText: 'text-purple-600 dark:text-purple-400',
        };
      case 'wfh':
        return {
          icon: Home,
          iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
          borderHover: 'hover:border-indigo-500/50',
          accentText: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'ot':
      default:
        return {
          icon: TrendingUp,
          iconBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
          borderHover: 'hover:border-teal-500/50',
          accentText: 'text-teal-600 dark:text-teal-400',
        };
    }
  };

  const theme = getCardTheme();
  const IconComp = theme.icon;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between ${theme.borderHover}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
          {title}
        </span>
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${theme.iconBg}`}>
          <IconComp size={20} />
        </div>
      </div>

      <div className="my-4">
        <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-mono tracking-tight">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>

      {trend && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-mono">
          <span className={`flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend}</span>
          </span>
          <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors flex items-center gap-0.5 font-sans font-bold text-[11px]">
            Details <ChevronRight size={12} />
          </span>
        </div>
      )}
    </div>
  );
};

export const WorkingHoursCard = ({
  clockIn = '08:30 AM',
  clockOut = '05:45 PM',
  totalHours = '8h 15m',
  breakHours = '45m',
  overtime = '1h 15m',
  progress = 85,
  status = 'Present',
}) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-blue-600" />
          <h4 className="font-extrabold text-gray-900 dark:text-white text-base">Working Hours Roster</h4>
        </div>
        <AttendanceStatusBadge status={status} size="sm" />
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
        <div className="p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800/80">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Clock In</span>
          <strong className="text-sm text-gray-900 dark:text-white">{clockIn}</strong>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800/80">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Clock Out</span>
          <strong className="text-sm text-gray-900 dark:text-white">{clockOut}</strong>
        </div>
        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-800/40">
          <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold block">Total Work</span>
          <strong className="text-sm text-blue-700 dark:text-blue-300 font-extrabold">{totalHours}</strong>
        </div>
        <div className="p-3 bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl border border-teal-200/60 dark:border-teal-800/40">
          <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold block">Overtime</span>
          <strong className="text-sm text-teal-700 dark:text-teal-300 font-extrabold">{overtime}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono font-bold text-gray-500">
          <span>Daily Shift Progress ({progress}%)</span>
          <span>Break Taken: {breakHours}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-600 rounded-l-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: '10%' }} title="Break Time"></div>
        </div>
      </div>
    </div>
  );
};

export const CorrectionCard = ({
  request,
  onApprove,
  onReject,
  onComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  if (!request) return null;

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <AttendanceEmployeeAvatar name={request.employeeName} photoUrl={request.photoUrl} size="md" />
          <div>
            <div className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base">
              {request.employeeName}
            </div>
            <span className="text-xs font-mono text-gray-400 font-bold">
              {request.employeeId} • {request.department}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AttendanceStatusBadge status={request.status} size="sm" />
          <span className="text-xs font-mono text-gray-400 font-semibold">{request.submittedDate}</span>
        </div>
      </div>

      {/* Request Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800/80 text-xs font-mono">
        <div>
          <span className="text-gray-400 uppercase font-bold block">Target Date</span>
          <strong className="text-gray-800 dark:text-gray-200">{request.targetDate}</strong>
        </div>
        <div>
          <span className="text-gray-400 uppercase font-bold block">Requested Change</span>
          <strong className="text-blue-600 dark:text-blue-400">{request.requestedChange}</strong>
        </div>
        <div>
          <span className="text-gray-400 uppercase font-bold block">Assigned Approver</span>
          <strong className="text-gray-800 dark:text-gray-200">{request.manager}</strong>
        </div>
      </div>

      {/* Reason Box */}
      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-blue-50/30 dark:bg-blue-950/10 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
        <strong className="text-blue-700 dark:text-blue-300 font-bold block mb-1">Employee Justification:</strong>
        "{request.reason}"
      </div>

      {/* Approval Timeline Preview */}
      {request.timeline && request.timeline.length > 0 && (
        <div className="space-y-1 text-xs">
          <span className="font-bold text-gray-400 uppercase text-[10px] font-mono">Audit Timeline:</span>
          <div className="flex flex-wrap gap-2">
            {request.timeline.map((step, sIdx) => (
              <span key={sIdx} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono text-[11px]">
                ✓ {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comment expansion */}
      {showCommentInput && (
        <div className="space-y-2 pt-2 animate-fade-in">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add managerial review notes or rejection reason..."
            rows={2}
            className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                if (onComment) onComment(request, commentText);
                setCommentText('');
                setShowCommentInput(false);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-2xs hover:bg-blue-700"
            >
              Post Comment
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <MessageSquare size={14} />
          <span>{showCommentInput ? 'Hide Comments' : 'Add Comment'}</span>
        </button>

        {request.status?.toLowerCase().includes('pending') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject && onReject(request)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition-all"
            >
              <X size={14} />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onApprove && onApprove(request)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <Check size={14} />
              <span>Approve Correction</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const AnalyticsCard = ({
  title = 'Late Arrival Frequency',
  value = '4.2%',
  subtitle = 'vs 5.8% organizational target',
  chartType = 'bar', // 'bar' | 'pie' | 'line' | 'heatmap'
  metric = '-1.6% improvement',
  isPositive = true,
}) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4 font-sans flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
          {title}
        </span>
        <div className="p-2.5 rounded-2xl bg-gray-100 dark:bg-[#161616] text-gray-600 dark:text-gray-300">
          {chartType === 'pie' ? <PieChart size={18} /> : chartType === 'line' ? <Activity size={18} /> : <BarChart2 size={18} />}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-mono">{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{subtitle}</div>
      </div>

      <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-mono font-bold">
        <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
          {metric}
        </span>
        <span className="text-gray-400">EWMP AI Analytics</span>
      </div>
    </div>
  );
};

export const ChartsPlaceholder = ({
  title = 'Workforce Attendance Heatmap & Trend Analysis',
  subtitle = 'Real-time biometric kiosk logs & geofenced check-in distribution across departments',
  height = 'h-80',
}) => {
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' | 'bars' | 'trend'

  return (
    <div className={`bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 font-sans flex flex-col justify-between ${height}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h4 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center p-1 bg-gray-100 dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-gray-800 shrink-0">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'heatmap' ? 'bg-white dark:bg-[#222] text-blue-600 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly Heatmap
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'bars' ? 'bg-white dark:bg-[#222] text-blue-600 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Dept Comparison
          </button>
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'trend' ? 'bg-white dark:bg-[#222] text-blue-600 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Overtime Trend
          </button>
        </div>
      </div>

      {/* Visual Simulation Body */}
      <div className="flex-1 flex items-center justify-center overflow-hidden py-2">
        {viewMode === 'heatmap' && (
          <div className="w-full h-full flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 font-bold px-2">
              <span>Week 01</span><span>Week 02</span><span>Week 03</span><span>Week 04</span><span>Week 05</span>
            </div>
            <div className="grid grid-cols-7 gap-2 sm:gap-3 flex-1">
              {Array.from({ length: 35 }).map((_, idx) => {
                const intensities = [
                  'bg-emerald-500/90 text-white',
                  'bg-emerald-400/80 text-white',
                  'bg-emerald-600 text-white',
                  'bg-indigo-500/80 text-white',
                  'bg-amber-500/80 text-white',
                  'bg-gray-100 dark:bg-[#181818] text-gray-400',
                ];
                const choice = intensities[idx % intensities.length];
                return (
                  <div
                    key={idx}
                    title={`Day ${idx + 1}: ${idx % 7 === 0 || idx % 7 === 6 ? 'Weekend Roster' : 'Present (98% compliance)'}`}
                    className={`rounded-2xl flex items-center justify-center font-mono text-xs font-bold transition-transform hover:scale-110 cursor-pointer shadow-2xs ${choice}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-4 text-[11px] font-mono text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Present / On-Time</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Late / Half-Day</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500"></span> WFH / Remote</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-gray-200 dark:bg-gray-700"></span> Scheduled Off</span>
            </div>
          </div>
        )}

        {viewMode === 'bars' && (
          <div className="w-full h-full flex items-end justify-around gap-4 pt-4 pb-2 px-6 bg-gray-50/50 dark:bg-[#161616]/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            {[
              { label: 'Engineering', val: 96, color: 'bg-blue-600' },
              { label: 'Global Sales', val: 91, color: 'bg-emerald-500' },
              { label: 'Human Resources', val: 98, color: 'bg-purple-600' },
              { label: 'Finance', val: 94, color: 'bg-teal-500' },
              { label: 'Operations', val: 89, color: 'bg-amber-500' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}%
                </span>
                <div className={`w-full max-w-[50px] rounded-t-2xl transition-all duration-500 group-hover:brightness-110 shadow-xs ${bar.color}`} style={{ height: `${bar.val}%` }}></div>
                <span className="text-[11px] font-mono font-bold text-gray-500 truncate max-w-[80px]">{bar.label}</span>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'trend' && (
          <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-linear-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center space-y-3">
            <TrendingUp size={40} className="text-blue-600 animate-bounce" />
            <div className="space-y-1">
              <h5 className="font-extrabold text-base text-gray-900 dark:text-white">Overtime Roster Stabilization Trend</h5>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md">
                Overtime hours have decreased by <strong>14.2%</strong> over the last 30 business days following the introduction of automated shift regularization rules in the platform.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  AttendanceCard,
  WorkingHoursCard,
  CorrectionCard,
  AnalyticsCard,
  ChartsPlaceholder,
};
