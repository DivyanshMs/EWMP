import React from 'react';
import { Users, Shield, Building2, Activity, ArrowUpRight, Key, Download, Edit3, Lock, CheckCircle2, Server, Cpu, Database, RefreshCw, Zap } from 'lucide-react';
import { SettingsCard, StatusBadge, ActivityTimeline } from '../components/AdminComponents';

/**
 * AdministrationDashboardPage.jsx
 * Command Center for EWMP Enterprise Administration & Governance.
 */

export const AdministrationDashboardPage = ({ onNavigateTab, searchQuery = '' }) => {
  const stats = [
    { title: 'Total Enterprise Users', value: '1,428', change: '+12 this week', status: 'operational', icon: Users, tab: 'roles' },
    { title: 'Active RBAC Roles', value: '9', change: 'All policies enforced', status: 'compliant', icon: Shield, tab: 'roles' },
    { title: 'Registered Locations', value: '14 HQ & Branches', change: 'Across 6 time zones', status: 'active', icon: Building2, tab: 'org' },
    { title: 'System Kernel Health', value: '99.98% Uptime', change: 'Zero security anomalies', status: 'compliant', icon: Activity, tab: 'system' },
  ];

  const quickActions = [
    { label: 'Edit My Profile', description: 'Update designation & contact info', icon: Edit3, tab: 'profile', color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
    { label: 'Update Password & 2FA', description: 'Manage cryptographic credentials', icon: Lock, tab: 'security', color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
    { label: 'Assign Role Permission', description: 'Modify access matrices across 12 modules', icon: Key, tab: 'roles', color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' },
    { label: 'Manage Notifications', description: 'Configure email vs in-app alert triggers', icon: Zap, tab: 'notifications', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
    { label: 'Inspect AI Settings', description: 'Review Gemini 3.1 Pro safety status', icon: Cpu, tab: 'ai', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { label: 'Export Audit Log Registry', description: 'Download CSV verification trail placeholder', icon: Download, action: () => alert('Exporting System Audit Log Placeholder (CSV)...'), color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 transform -skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Enterprise Command Center
          </div>
          <h2 className="text-2xl font-bold tracking-tight">EWMP Administration & System Governance</h2>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            Supervise global organization policies, role-based access permissions (RBAC), biometric geofence synchronization, and autonomous AI guardrails from a single dashboard.
          </p>
        </div>
      </div>

      {/* Quick Statistics Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              onClick={() => onNavigateTab && onNavigateTab(item.tab)}
              className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-slate-50 dark:bg-[#1a1a1a] rounded-lg text-slate-700 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Icon size={20} />
                </div>
                <StatusBadge status={item.status} label={item.status.toUpperCase()} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{item.value}</h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{item.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{item.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Administrative Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => action.action ? action.action() : (onNavigateTab && onNavigateTab(action.tab))}
                className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center gap-4 text-left group"
              >
                <div className={`p-3 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${action.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {action.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{action.description}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: System Health & Recent Administrative Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Breakdown */}
        <div className="space-y-4">
          <SettingsCard title="Infrastructure & Kernel Health" subtitle="Real-time service telemetry" icon={Server} badge={{ status: 'compliant', label: 'OPERATIONAL' }}>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Database size={14} className="text-blue-500" /> PostgreSQL 16 Replica Cluster
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Connected (4ms)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Cpu size={14} className="text-indigo-500" /> Gemini 3.1 Pro AI Gateway
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active (DLP On)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Lock size={14} className="text-purple-500" /> Biometric Kiosk Sync Engine
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">14 Hubs Synced</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Audit Log Immutable Vault
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">AES-256 Verified</span>
              </div>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => alert('Diagnostic probe complete. Zero anomalies detected across 12 modules.')}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Run Deep Diagnostic Probe
              </button>
            </div>
          </SettingsCard>
        </div>

        {/* Recent Administrative Activity */}
        <div className="lg:col-span-2">
          <SettingsCard 
            title="Recent Administrative Governance Feed" 
            subtitle="Live immutable audit trail of enterprise configuration modifications"
            icon={Activity}
            footerAction={
              <button 
                onClick={() => onNavigateTab && onNavigateTab('audit')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                View Complete Audit Registry <ArrowUpRight size={14} />
              </button>
            }
          >
            <div className="pt-2">
              <ActivityTimeline />
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
};
