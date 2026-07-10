import React from 'react';
import { TrendingUp, TrendingDown, Clock, Calendar, ArrowUpRight, ArrowDownRight, Play, Download, FileText, Activity } from 'lucide-react';

/**
 * ReportCards.jsx
 * Executive Business Intelligence card widgets inspired by Power BI and Looker.
 * Provides high-density KPI presentations, report catalog cards, and trend analysis widgets.
 */

export const ReportCard = ({
  title,
  description,
  category,
  frequency = 'Monthly',
  lastRun = 'Jul 07, 2026',
  onGenerate,
  onExport,
  onSchedule,
  icon: Icon = FileText
}) => {
  const getCategoryColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'ATTENDANCE': return 'bg-blue-50 dark:bg-blue-950 text-[#2563eb] border-blue-200';
      case 'PAYROLL': return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200';
      case 'LEAVE': return 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200';
      case 'PERFORMANCE': return 'bg-purple-50 dark:bg-purple-950 text-purple-600 border-purple-200';
      case 'RECRUITMENT': return 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-200';
      case 'PROJECTS': return 'bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-200';
      case 'ASSETS': return 'bg-cyan-50 dark:bg-cyan-950 text-cyan-600 border-cyan-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs hover:border-[#2563eb]/60 transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider ${getCategoryColor(category)}`}>
            {category || 'GENERAL BI'}
          </span>
          <span className="text-[11px] font-mono text-[#737686] flex items-center gap-1">
            <Clock size={12} /> {frequency}
          </span>
        </div>

        <div>
          <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors flex items-center gap-1.5">
            <Icon size={16} className="text-[#2563eb] shrink-0" />
            {title}
          </h4>
          <p className="text-xs text-[#737686] mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono text-[#737686]">Last run: {lastRun}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSchedule && onSchedule(title)}
            title="Schedule Automated Report"
            className="p-1.5 rounded-lg hover:bg-[#faf8ff] dark:hover:bg-gray-800 text-gray-500 hover:text-[#2563eb] transition-colors"
          >
            <Calendar size={14} />
          </button>
          <button
            onClick={() => onExport && onExport(title)}
            title="Export Report Data"
            className="p-1.5 rounded-lg hover:bg-[#faf8ff] dark:hover:bg-gray-800 text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onGenerate && onGenerate(title)}
            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl font-bold text-xs shadow-2xs flex items-center gap-1 transition-all"
          >
            <Play size={11} className="fill-current" /> Run Report
          </button>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsCard = ({
  title,
  value,
  subtitle,
  change,
  trend = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon = Activity,
  color = 'text-[#2563eb]',
  bg = 'bg-blue-50 dark:bg-blue-950/60',
  sparklineData = [30, 45, 38, 52, 48, 65, 78]
}) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-sans">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#737686] block">
            {title}
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-[#191b23] dark:text-white block mt-1 tracking-tight">
            {value}
          </strong>
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color} shadow-2xs border border-current/10 shrink-0`}>
          <Icon size={22} />
        </div>
      </div>

      {/* Optional Sparkline Preview */}
      <div className="h-6 flex items-end gap-1 px-1 pt-2">
        {sparklineData.map((val, idx) => (
          <div
            key={idx}
            style={{ height: `${val}%` }}
            className={`flex-1 rounded-t-xs transition-all ${
              idx === sparklineData.length - 1 ? 'bg-[#2563eb]' : 'bg-blue-200 dark:bg-blue-900/60'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#e1e2ed] dark:border-gray-800 text-xs font-mono">
        <span className="text-[#737686] truncate max-w-[150px]">{subtitle}</span>
        {change && (
          <span className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded text-[11px] ${
            isUp
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 border border-emerald-200/50'
              : isDown
              ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 border border-rose-200/50'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
          }`}>
            {isUp && <ArrowUpRight size={13} />}
            {isDown && <ArrowDownRight size={13} />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export const KPICard = ({
  title,
  value,
  target = '95%',
  progress = 88,
  departmentLeader = 'IT Infrastructure',
  status = 'ON TRACK',
  color = 'bg-[#2563eb]'
}) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono font-bold text-[#737686] uppercase tracking-wider">{title}</span>
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
        progress >= 90 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
      }`}>
        {status}
      </span>
    </div>

    <div className="flex items-baseline justify-between">
      <strong className="text-2xl font-black text-[#191b23] dark:text-white">{value}</strong>
      <span className="text-xs font-mono text-[#737686]">Target: <strong className="text-[#191b23] dark:text-gray-300">{target}</strong></span>
    </div>

    <div className="space-y-1">
      <div className="w-full bg-[#faf8ff] dark:bg-gray-800 rounded-full h-2 overflow-hidden border border-[#e1e2ed] dark:border-gray-700">
        <div style={{ width: `${Math.min(100, progress)}%` }} className={`h-full rounded-full ${color} transition-all duration-500`} />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-[#737686]">
        <span>Current Progress: {progress}%</span>
        <span>Top Dept: <strong className="text-[#191b23] dark:text-white">{departmentLeader}</strong></span>
      </div>
    </div>
  </div>
);

export const TrendCard = ({
  title,
  currentValue,
  previousValue,
  period = 'FY26/Q3 vs Q2',
  variance = '+12.4%',
  isPositive = true
}) => (
  <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 flex items-center justify-between font-sans">
    <div className="space-y-0.5">
      <span className="text-[11px] font-mono text-[#737686] uppercase block">{title}</span>
      <div className="flex items-baseline gap-2">
        <strong className="text-lg font-black text-[#191b23] dark:text-white">{currentValue}</strong>
        <span className="text-xs font-mono text-[#737686] line-through">{previousValue}</span>
      </div>
      <span className="text-[10px] font-mono text-[#737686] block">{period}</span>
    </div>

    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono font-bold text-xs ${
      isPositive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
    }`}>
      {isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
      <span>{variance}</span>
    </div>
  </div>
);
