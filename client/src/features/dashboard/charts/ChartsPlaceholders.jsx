import React from 'react';

/**
 * ChartsPlaceholders.jsx
 * Enterprise-grade responsive SVG chart placeholders for EWMP Executive Dashboard.
 * Designed to seamlessly blend into light/dark themes with hover interactions,
 * tooltips, and smooth data visualization aesthetics without requiring heavy chart canvas overhead.
 */

export const SparklinePlaceholder = ({ trend = 'up', color = 'blue' }) => {
  const isUp = trend === 'up';
  const strokeColor =
    color === 'emerald' || isUp
      ? '#10b981'
      : color === 'rose' || !isUp
      ? '#f43f5e'
      : color === 'indigo'
      ? '#6366f1'
      : '#3b82f6';
  const points = isUp
    ? '0,35 15,30 30,32 45,22 60,25 75,12 90,15 100,5'
    : '0,10 15,12 30,18 45,15 60,28 75,22 90,32 100,38';

  return (
    <div className="w-24 h-10 flex items-center justify-end overflow-hidden">
      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,40 ${points} 100,40`}
          fill={`url(#grad-${color}-${trend})`}
        />
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <circle
          cx="100"
          cy={isUp ? '5' : '38'}
          r="3"
          className="fill-white dark:fill-[#1a1a1a]"
          stroke={strokeColor}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export const AreaChartPlaceholder = ({ title, subtitle, height = 'h-56', dataPoints = [] }) => {
  const points = dataPoints.length
    ? dataPoints.join(' ')
    : '0,180 50,160 100,165 150,130 200,140 250,90 300,105 350,60 400,75 450,35 500,45';

  return (
    <div className={`w-full ${height} flex flex-col justify-between`}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-2">
          <div>
            {title && <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</h4>}
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span> Current Year
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 ml-2"></span> Prior Year
          </div>
        </div>
      )}
      <div className="relative flex-1 w-full bg-gray-50/50 dark:bg-[#151515]/50 rounded-xl border border-gray-100 dark:border-gray-800/80 p-3 overflow-hidden flex items-end">
        {/* Grid lines */}
        <div className="absolute inset-x-0 inset-y-3 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-gray-400 w-full"></div>
          <div className="border-b border-dashed border-gray-400 w-full"></div>
          <div className="border-b border-dashed border-gray-400 w-full"></div>
          <div className="border-b border-dashed border-gray-400 w-full"></div>
        </div>
        <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradientPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="areaGradientSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Secondary background wave */}
          <polygon
            points="0,200 0,190 60,170 120,175 180,150 240,160 300,130 360,140 420,110 480,115 500,105 500,200"
            fill="url(#areaGradientSecondary)"
          />
          <polyline
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            points="0,190 60,170 120,175 180,150 240,160 300,130 360,140 420,110 480,115 500,105"
          />
          {/* Primary wave */}
          <polygon points={`0,200 ${points} 500,200`} fill="url(#areaGradientPrimary)" />
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {/* Active hover indicator dot */}
          <circle cx="350" cy="60" r="5" className="fill-white dark:fill-[#1a1a1a]" stroke="#3b82f6" strokeWidth="3" />
        </svg>
      </div>
      {/* X Axis Labels */}
      <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-2 px-1">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </div>
  );
};

export const BarChartPlaceholder = ({ bars = [], height = 'h-52', maxVal = 100 }) => {
  const defaultBars = bars.length
    ? bars
    : [
        { label: 'Eng', val1: 85, val2: 15, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
        { label: 'Sales', val1: 70, val2: 25, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
        { label: 'Ops', val1: 90, val2: 10, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
        { label: 'HR', val1: 60, val2: 30, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
        { label: 'Fin', val1: 75, val2: 20, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
        { label: 'Mktg', val1: 65, val2: 25, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
        { label: 'IT', val1: 95, val2: 5, color1: 'bg-blue-600', color2: 'bg-indigo-400' },
      ];

  return (
    <div className={`w-full ${height} flex flex-col justify-end`}>
      <div className="relative flex-1 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4 pb-1 border-b border-gray-200 dark:border-gray-800">
        {/* Horizontal grid dashed lines */}
        <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-gray-200 dark:border-gray-800/60 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-gray-200 dark:border-gray-800/60 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-gray-200 dark:border-gray-800/60 pointer-events-none"></div>

        {defaultBars.map((bar, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer h-full justify-end">
            <div className="w-full max-w-[36px] flex flex-col justify-end h-full gap-0.5 relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center justify-center px-2 py-1 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[10px] font-mono rounded shadow-lg whitespace-nowrap z-10 pointer-events-none transition-all">
                {bar.val1}% / {bar.val2}%
              </div>
              <div
                style={{ height: `${(bar.val2 / maxVal) * 100}%` }}
                className={`w-full rounded-t-sm ${bar.color2 || 'bg-indigo-400/80'} transition-all duration-300 group-hover:brightness-110`}
              ></div>
              <div
                style={{ height: `${(bar.val1 / maxVal) * 100}%` }}
                className={`w-full rounded-t-sm ${bar.color1 || 'bg-blue-600'} transition-all duration-300 group-hover:brightness-110`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-2 px-1">
        {defaultBars.map((bar, i) => (
          <span key={i} className="flex-1 text-center truncate">
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const DonutChartPlaceholder = ({ 
  percentage = 78, 
  label = 'Overall Efficiency', 
  segments = [
    { name: 'On-Time', value: '78%', color: 'bg-emerald-500' },
    { name: 'Grace Period', value: '14%', color: 'bg-blue-500' },
    { name: 'Late / Absent', value: '8%', color: 'bg-amber-500' },
  ]
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <path
            className="text-gray-100 dark:text-gray-800"
            strokeWidth="3.8"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-emerald-500 transition-all duration-1000 ease-out"
            strokeDasharray={`${percentage}, 100`}
            strokeWidth="3.8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-blue-500 opacity-80"
            strokeDasharray="14, 100"
            strokeDashoffset={`-${percentage}`}
            strokeWidth="3.8"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5 max-w-[70px] leading-tight">
            {label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full max-w-[180px]">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`}></span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">{seg.name}</span>
            </div>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProgressChartPlaceholder = ({ items = [] }) => {
  const defaultItems = items.length
    ? items
    : [
        { label: 'Engineering & Product', value: 92, color: 'bg-blue-600' },
        { label: 'Sales & Customer Success', value: 84, color: 'bg-indigo-500' },
        { label: 'Operations & Finance', value: 88, color: 'bg-emerald-500' },
        { label: 'Human Resources', value: 95, color: 'bg-purple-500' },
      ];

  return (
    <div className="space-y-4 w-full">
      {defaultItems.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="font-mono text-gray-900 dark:text-white font-semibold">{item.value}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${item.value}%` }}
              className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
