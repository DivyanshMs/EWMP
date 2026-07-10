import React from 'react';
import { Laptop, Package, RefreshCw, Search, PlusCircle, Wrench, BarChart2 } from 'lucide-react';

/**
 * AssetEmptyStates.jsx
 * Zero-data placeholders for all asset management views.
 */

export const NoAssets = ({ onCreate }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-14 text-center shadow-xs space-y-4 font-sans">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center mx-auto shadow-xs">
      <Laptop size={30} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Assets Registered</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      Your enterprise asset inventory is empty. Register hardware, software licenses, and peripheral devices to begin tracking the organizational asset lifecycle.
    </p>
    {onCreate && (
      <button onClick={onCreate}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 mx-auto transition-all">
        <PlusCircle size={15} /> Register First Asset
      </button>
    )}
  </div>
);

export const NoAllocations = ({ onAllocate }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center shadow-xs space-y-4 font-sans">
    <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
      <Package size={30} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Active Allocations</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      No assets are currently allocated to employees or departments. Begin workforce asset distribution to track accountability and asset lifecycle.
    </p>
    {onAllocate && (
      <button onClick={onAllocate}
        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 mx-auto transition-all">
        <PlusCircle size={15} /> Allocate First Asset
      </button>
    )}
  </div>
);

export const NoMaintenance = ({ onSchedule }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center shadow-xs space-y-4 font-sans">
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
      <Wrench size={30} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Maintenance Records</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      No maintenance schedules or repair records found. Schedule preventive maintenance to extend asset lifespan and maintain SLA compliance.
    </p>
    {onSchedule && (
      <button onClick={onSchedule}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 mx-auto">
        <PlusCircle size={15} /> Schedule Maintenance
      </button>
    )}
  </div>
);

export const NoSearchResults = ({ onReset }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center shadow-xs space-y-4 font-sans">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center mx-auto shadow-xs">
      <Search size={30} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Assets Found</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      Your search and filter parameters returned zero inventory results. Try broadening your Asset ID, serial number, category, or department criteria.
    </p>
    {onReset && (
      <button onClick={onReset}
        className="px-5 py-2.5 bg-[#faf8ff] hover:bg-[#ededf9] text-[#191b23] dark:text-white text-xs font-bold rounded-xl border border-[#e1e2ed] transition-all shadow-2xs flex items-center gap-2 mx-auto">
        <RefreshCw size={14} /> Reset All Filters
      </button>
    )}
  </div>
);

export const NoAnalytics = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center shadow-xs space-y-4 font-sans">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
      <BarChart2 size={30} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">Insufficient Data for Analytics</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
      Register at least 5 assets across 2 departments to generate portfolio distribution charts, utilization heatmaps, and cost analysis reports.
    </p>
  </div>
);
