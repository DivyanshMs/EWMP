import React, { useState } from 'react';
import { Download } from 'lucide-react';

/**
 * ChartContainers.jsx
 * Precision enterprise chart wrapper and high-fidelity SVG visualization mocks
 * inspired by Looker, Power BI, and Tableau. Supports period toggling and legend overlays.
 */

export const ChartContainer = ({
  title,
  subtitle,
  children,
  defaultPeriod = 'Q3',
  onExport,
  height = 'h-80',
  legends = []
}) => {
  const [activePeriod, setActivePeriod] = useState(defaultPeriod);

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
        <div>
          <h3 className="text-base font-extrabold text-[#191b23] dark:text-white flex items-center gap-2">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-[#737686] mt-0.5 font-mono">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Period Selector Tabs */}
          <div className="flex items-center bg-[#faf8ff] dark:bg-[#161616] p-1 rounded-xl border border-[#e1e2ed] dark:border-gray-800 text-[11px] font-mono font-bold">
            {['7D', '30D', 'Q3', 'FY26'].map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activePeriod === period
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {onExport && (
            <button
              onClick={() => onExport(title)}
              title="Export Chart Snapshot"
              className="p-2 rounded-xl bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 text-[#737686] hover:text-[#2563eb] hover:border-[#2563eb]/50 transition-colors"
            >
              <Download size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Rendering Zone */}
      <div className={`w-full ${height} flex items-center justify-center relative`}>
        {children}
      </div>

      {/* Legend Footer */}
      {legends.length > 0 && (
        <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
          {legends.map((leg, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm ${leg.color}`} />
              <span className="text-[#191b23] dark:text-gray-300 font-bold">{leg.label}:</span>
              <span className="text-[#737686]">{leg.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BarChartMock = ({
  data = [
    { label: 'Engineering', value1: 82, value2: 64, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
    { label: 'HR & Ops', value1: 65, value2: 48, color1: 'bg-purple-600', color2: 'bg-purple-300' },
    { label: 'Finance & Tax', value1: 45, value2: 38, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
    { label: 'Sales & Growth', value1: 90, value2: 72, color1: 'bg-amber-500', color2: 'bg-amber-300' },
    { label: 'Executive Suite', value1: 30, value2: 28, color1: 'bg-indigo-600', color2: 'bg-indigo-300' },
  ],
  showComparison = true
}) => (
  <div className="w-full h-full flex items-end justify-around pt-6 pb-2 px-4 gap-4">
    {data.map((item, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
        <div className="w-full flex items-end justify-center gap-1.5 h-4/5 pb-2">
          <div
            style={{ height: `${item.value1}%` }}
            className={`w-5 sm:w-8 rounded-t-lg ${item.color1} transition-all duration-500 group-hover:brightness-110 shadow-2xs relative`}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#191b23] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#161616] px-1.5 py-0.5 rounded shadow-2xs border">
              {item.value1}%
            </span>
          </div>
          {showComparison && (
            <div
              style={{ height: `${item.value2}%` }}
              className={`w-3 sm:w-6 rounded-t-md ${item.color2} opacity-80 transition-all duration-500`}
            />
          )}
        </div>
        <span className="text-[11px] font-mono font-bold text-[#737686] truncate max-w-[80px] text-center block mt-2">
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

export const LineChartMock = ({
  points = [35, 48, 42, 60, 55, 75, 82, 78, 92],
  color = '#2563eb',
  gradientFrom = 'rgba(37, 99, 235, 0.25)',
  gradientTo = 'rgba(37, 99, 235, 0.0)',
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
}) => {
  const max = 100;
  const width = 600;
  const height = 220;
  const stepX = width / (points.length - 1);

  const coords = points.map((val, i) => ({
    x: i * stepX,
    y: height - (val / max) * (height - 30) - 15
  }));

  const pathD = coords.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, idx) => (
            <line key={idx} x1="0" y1={height * ratio} x2={width} y2={height * ratio} stroke="#e1e2ed" strokeDasharray="4 4" strokeWidth="1" className="dark:stroke-gray-800" />
          ))}
          {/* Area Fill */}
          <path d={areaD} fill="url(#lineGrad)" />
          {/* Main Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Data Points */}
          {coords.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke={color} strokeWidth="3" className="hover:scale-125 transition-transform" />
              <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill={color} fontSize="11" fontWeight="bold" fontFamily="monospace" className="opacity-0 group-hover:opacity-100 transition-opacity">
                {points[i]}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between px-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-[11px] font-mono text-[#737686]">
        {labels.map((lbl, i) => (
          <span key={i}>{lbl}</span>
        ))}
      </div>
    </div>
  );
};

export const AreaChartMock = ({
  series1 = [40, 55, 62, 58, 72, 80, 88],
  series2 = [25, 38, 45, 40, 55, 62, 70],
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}) => (
  <div className="w-full h-full">
    <LineChartMock points={series1} color="#2563eb" gradientFrom="rgba(37, 99, 235, 0.3)" labels={labels} />
  </div>
);

export const PieChartMock = ({
  slices = [
    { label: 'Engineering R&D', value: 42, color: 'bg-[#2563eb]', hex: '#2563eb' },
    { label: 'Sales & Growth', value: 28, color: 'bg-purple-600', hex: '#9333ea' },
    { label: 'HR & Ops', value: 16, color: 'bg-emerald-600', hex: '#059669' },
    { label: 'Finance & Legal', value: 14, color: 'bg-amber-500', hex: '#f59e0b' },
  ]
}) => (
  <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-6 p-4">
    {/* SVG Pie Representation */}
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {/* Simple segmented circle */}
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="42 58" strokeDashoffset="0" />
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#9333ea" strokeWidth="6" strokeDasharray="28 72" strokeDashoffset="-42" />
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#059669" strokeWidth="6" strokeDasharray="16 84" strokeDashoffset="-70" />
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="14 86" strokeDashoffset="-86" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <strong className="text-xl font-black text-[#191b23] dark:text-white">100%</strong>
        <span className="text-[10px] font-mono text-[#737686] uppercase">Total Allocation</span>
      </div>
    </div>

    {/* Slices Breakdown List */}
    <div className="space-y-3 flex-1 max-w-xs font-mono text-xs">
      {slices.map((slice, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${slice.color}`} />
            <span className="font-bold text-[#191b23] dark:text-white">{slice.label}</span>
          </div>
          <span className="font-extrabold text-[#2563eb]">{slice.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

export const DonutChartMock = ({
  centerValue = '98.4%',
  centerLabel = 'SLA COMPLIANCE',
  slices = [
    { label: 'On Track (SLA Met)', value: 98.4, hex: '#059669', color: 'bg-emerald-600' },
    { label: 'At Risk Window', value: 1.2, hex: '#f59e0b', color: 'bg-amber-500' },
    { label: 'Breached Target', value: 0.4, hex: '#e11d48', color: 'bg-rose-600' },
  ]
}) => (
  <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-6 p-4">
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#059669" strokeWidth="4.5" strokeDasharray="98.4 1.6" strokeDashoffset="0" />
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="1.2 98.8" strokeDashoffset="-98.4" />
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#e11d48" strokeWidth="4.5" strokeDasharray="0.4 99.6" strokeDashoffset="-99.6" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <strong className="text-2xl font-black text-[#191b23] dark:text-white">{centerValue}</strong>
        <span className="text-[10px] font-mono font-bold text-[#737686] uppercase tracking-wider">{centerLabel}</span>
      </div>
    </div>

    <div className="space-y-3 flex-1 max-w-xs font-mono text-xs">
      {slices.map((slice, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${slice.color}`} />
            <span className="font-bold text-[#191b23] dark:text-white">{slice.label}</span>
          </div>
          <span className="font-extrabold text-[#191b23] dark:text-gray-200">{slice.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

export const HeatmapMock = ({
  rows = ['Engineering', 'HR & Ops', 'Finance', 'Sales', 'Executive'],
  cols = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  data = [
    [98, 96, 99, 97, 94],
    [95, 94, 98, 96, 92],
    [99, 98, 99, 99, 97],
    [92, 90, 94, 91, 88],
    [97, 96, 98, 98, 95]
  ],
  unit = '%'
}) => {
  const getCellBg = (val) => {
    if (val >= 98) return 'bg-emerald-600 text-white font-black';
    if (val >= 95) return 'bg-emerald-500/80 text-white font-bold';
    if (val >= 90) return 'bg-amber-400 text-[#191b23] font-bold';
    return 'bg-rose-500 text-white font-black';
  };

  return (
    <div className="w-full overflow-x-auto p-2 font-mono text-xs">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-[#737686] font-bold text-[11px] uppercase">Department</th>
            {cols.map((col, idx) => (
              <th key={idx} className="p-2 text-center text-[#737686] font-bold text-[11px] uppercase">{col}</th>
            ))}
            <th className="p-2 text-center text-[#2563eb] font-bold text-[11px] uppercase">Avg</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
          {rows.map((row, rIdx) => {
            const rowVals = data[rIdx] || [95, 95, 95, 95, 95];
            const avg = (rowVals.reduce((a, b) => a + b, 0) / rowVals.length).toFixed(1);
            return (
              <tr key={rIdx} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors">
                <td className="p-2.5 font-bold text-[#191b23] dark:text-white font-sans">{row}</td>
                {rowVals.map((val, cIdx) => (
                  <td key={cIdx} className="p-1.5 text-center">
                    <div className={`py-2 px-3 rounded-lg shadow-2xs transition-transform hover:scale-105 cursor-pointer ${getCellBg(val)}`}>
                      {val}{unit}
                    </div>
                  </td>
                ))}
                <td className="p-2.5 text-center font-extrabold text-[#2563eb]">{avg}{unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
