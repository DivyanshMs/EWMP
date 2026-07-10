import React from 'react';
import { Clock, ShieldAlert, BellOff, Laptop, Plus, RefreshCw, Filter } from 'lucide-react';

/**
 * AdminEmptyStates.jsx
 * Enterprise empty state components for the Settings & Administration Module.
 */

export const NoActivity = ({ onResetFilter }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center my-4 shadow-sm">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <Clock size={32} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No Administrative Activity Found</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
        There are no recent audit logs or system events matching your current filter criteria or search query.
      </p>
      {onResetFilter && (
        <button 
          onClick={onResetFilter}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );
};

export const NoRoles = ({ onCreateRole }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center my-4 shadow-sm">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
        <ShieldAlert size={32} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No Custom Roles Defined</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
        Your organization is currently relying exclusively on standard system roles. Define a custom role to configure granular access permissions across platform modules.
      </p>
      {onCreateRole && (
        <button 
          onClick={onCreateRole}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={14} /> Create Custom Role
        </button>
      )}
    </div>
  );
};

export const NoNotifications = () => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center my-4 shadow-sm">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <BellOff size={32} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No Active Alert Triggers</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Your notification channels and alert preferences are configured. You will receive system alerts here when attendance or payroll anomalies occur.
      </p>
    </div>
  );
};

export const NoSessions = ({ onRefresh }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center my-4 shadow-sm">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <Laptop size={32} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No Remote Sessions Logged</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
        You currently have no active remote sessions logged outside of your primary device.
      </p>
      {onRefresh && (
        <button 
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw size={14} /> Refresh Session Registry
        </button>
      )}
    </div>
  );
};
