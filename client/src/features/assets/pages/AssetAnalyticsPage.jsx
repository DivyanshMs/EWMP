import React from 'react';
import { Download, TrendingUp, DollarSign, Clock, Users, Activity } from 'lucide-react';
import { AssetAnalyticsCard, ChartPlaceholder, AssetProgressBar } from '../components/AssetCards';

/**
 * AssetAnalyticsPage.jsx
 * Portfolio intelligence, distribution, utilization, maintenance cost, and department allocation.
 */
export const AssetAnalyticsPage = ({ onExport }) => {
  const deptData = [
    { dept: 'Engineering',   assets: 112, assigned: 98, utilPct: 88 },
    { dept: 'IT & InfoSec',  assets: 48,  assigned: 42, utilPct: 88 },
    { dept: 'Sales & CRM',   assets: 36,  assigned: 27, utilPct: 75 },
    { dept: 'HR & Ops',      assets: 24,  assigned: 18, utilPct: 75 },
    { dept: 'Finance',       assets: 19,  assigned: 16, utilPct: 84 },
    { dept: 'Marketing',     assets: 14,  assigned: 12, utilPct: 86 },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 border border-rose-200">EXECUTIVE TELEMETRY</span>
            <span className="text-xs text-[#737686] font-mono">Q3 Asset Portfolio Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">Asset Analytics &amp; Portfolio Intelligence</h2>
          <p className="text-xs text-[#737686] mt-0.5">Analyze asset distribution, utilization, maintenance cost, and department allocation efficiency.</p>
        </div>
        <button onClick={onExport} className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0">
          <Download size={16} /> Export Analytics Report (.PDF)
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AssetAnalyticsCard title="Asset Utilization Rate"  value="86.4%"    subtitle="Overall allocation efficiency" icon={TrendingUp}    change="+3.2% from Q2" trend="up"      color="text-[#2563eb]"   bg="bg-blue-50 dark:bg-blue-950/60" />
        <AssetAnalyticsCard title="Total CMDB Value"        value="$1.24M"   subtitle="Acquisition cost of all assets" icon={DollarSign}    change="Q3 FY2026"     trend="neutral" color="text-purple-600"  bg="bg-purple-50 dark:bg-purple-950/60" />
        <AssetAnalyticsCard title="Avg Asset Age"           value="2.4 yrs"  subtitle="Across all active inventory"    icon={Clock}         change="0.3yr older than Q2" trend="down" color="text-amber-600"   bg="bg-amber-50 dark:bg-amber-950/60" />
        <AssetAnalyticsCard title="Q3 Maintenance Cost"     value="$8,420"   subtitle="Vendor service & repairs"       icon={Activity}      change="-18% vs Q2 budget" trend="up"  color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/60" />
      </div>

      {/* Primary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Asset Distribution by Category (Count)" type="BAR"   height="h-80" />
        <ChartPlaceholder title="Status Breakdown (Available vs Assigned vs Maintenance)" type="DONUT" height="h-80" />
      </div>

      {/* Secondary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Asset Age Distribution (Years Since Purchase)" type="BAR"   height="h-72" />
        <ChartPlaceholder title="Monthly Maintenance Cost Trend (Q1–Q3 2026)"  type="BAR"   height="h-72" />
      </div>

      {/* Department Allocation Table */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <Users size={18} className="text-[#2563eb]" /> Department Asset Allocation &amp; Utilization Matrix
          </h3>
          <span className="text-xs font-mono text-emerald-600 font-bold">● AUDITED</span>
        </div>
        <div className="overflow-x-auto text-xs font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] font-mono">
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-4">Total Assets</th>
                <th className="py-3.5 px-4">Assigned</th>
                <th className="py-3.5 px-4 w-56">Utilization Rate</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
              {deptData.map((d, i) => (
                <tr key={i} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors">
                  <td className="py-4 px-5 font-bold text-sm text-[#191b23] dark:text-white">{d.dept}</td>
                  <td className="py-4 px-4 font-mono font-bold">{d.assets}</td>
                  <td className="py-4 px-4 font-mono font-extrabold text-[#2563eb]">{d.assigned}</td>
                  <td className="py-4 px-4 w-56">
                    <AssetProgressBar value={d.utilPct} max={100} label={`${d.utilPct}%`} size="md"
                      color={d.utilPct > 90 ? 'bg-rose-500' : d.utilPct > 75 ? 'bg-[#2563eb]' : 'bg-emerald-500'} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                      d.utilPct > 90 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      d.utilPct > 75 ? 'bg-blue-50 text-[#2563eb] border-blue-200' :
                                       'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {d.utilPct > 90 ? 'HIGH LOAD' : d.utilPct > 75 ? 'OPTIMAL' : 'AVAILABLE CAPACITY'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
