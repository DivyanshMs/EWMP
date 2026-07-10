import React from 'react';
import { FileText, SearchX, Plus, RefreshCw, BarChart2 } from 'lucide-react';

/**
 * ReportEmptyStates.jsx
 * Illustrated zero-data placeholders for BI catalogs, filtered data tables, and analytics feeds.
 */

export const NoReports = ({ onGenerateClick }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in my-4 shadow-xs font-sans">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center shadow-xs">
      <FileText size={32} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Reports Configured in Catalog
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        You have no customized business intelligence reports or scheduled analytics feeds established yet.
      </p>
    </div>
    {onGenerateClick && (
      <button
        onClick={onGenerateClick}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
      >
        <Plus size={15} /> Create Custom Report
      </button>
    )}
  </div>
);

export const NoData = ({ query, onClear }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 animate-fade-in my-4 shadow-xs font-sans">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-xs">
      <SearchX size={28} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white">
        No Data Matching Filtered Scope
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        We found 0 records matching your selected department, location, project, and date range filters.
      </p>
    </div>
    {onClear && (
      <button
        onClick={onClear}
        className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
      >
        <RefreshCw size={13} /> Reset All Slicers &amp; Filters
      </button>
    )}
  </div>
);

export const NoAnalytics = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in my-4 shadow-xs font-sans">
    <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-xs">
      <BarChart2 size={32} />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        Analytics Telemetry Pending
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400">
        Aggregating cross-module data streams. Visualizations will render once initial nightly audit ETL batch finishes.
      </p>
    </div>
  </div>
);
