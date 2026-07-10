import React from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  WifiOff, 
  Database, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';
import { SkeletonLoader } from '../../../components/ui/Loaders';

/**
 * DashboardStates.jsx
 * Enterprise Empty, Loading, Error, and Offline states for EWMP Executive Dashboard.
 */

export const DashboardLoadingState = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-6 bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="space-y-3 w-1/2">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* KPI Section Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            className="p-5 bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-36 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-2/3">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              </div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800/80 rounded-xl"></div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800/60">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="w-16 h-6 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights & Analytics Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-96">
          <SkeletonLoader type="text" count={6} />
        </div>
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-96 flex flex-col justify-between">
          <SkeletonLoader type="text" count={4} />
          <div className="h-32 bg-gray-100 dark:bg-gray-800/60 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const DashboardNoDataState = ({ onSetupAction }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[550px] p-8 text-center bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm my-4 animate-fade-in">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        <Database size={40} className="stroke-[1.5]" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        No Workforce Data Available
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        Your organization workspace is clean and ready. Start onboarding employees, setting up department hierarchies, or running your first AI-assisted workforce simulation to populate executive analytics.
      </p>
      
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onSetupAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#111]"
        >
          <PlusCircle size={18} />
          Onboard First Employee
        </button>
        <button
          onClick={onSetupAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-medium text-sm rounded-xl transition-all duration-200 border border-indigo-200 dark:border-indigo-800/60"
        >
          <Sparkles size={18} className="text-indigo-500" />
          Populate with Demo Data
        </button>
      </div>
    </div>
  );
};

export const DashboardErrorState = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white dark:bg-[#111111] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-sm my-4 animate-fade-in">
      <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-5">
        <AlertTriangle size={34} className="stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Unable to Load Executive Telemetry
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        {error || 'An unexpected timeout occurred while synchronizing analytics with MongoDB Atlas and the AI Gateway. Your data remains safe and immutable.'}
      </p>
      
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm rounded-xl shadow-sm transition-all duration-200"
        >
          <RefreshCw size={16} />
          Retry Synchronization
        </button>
      </div>
    </div>
  );
};

export const DashboardOfflineState = () => {
  return (
    <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-between text-amber-800 dark:text-amber-200 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
          <WifiOff size={20} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Offline Workspace Mode</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            You are currently disconnected from the EWMP network. Displaying cached executive metrics from last synchronization.
          </p>
        </div>
      </div>
      <span className="text-xs font-mono font-medium px-2.5 py-1 bg-amber-100 dark:bg-amber-900/60 rounded-md uppercase tracking-wider">
        Cached
      </span>
    </div>
  );
};
