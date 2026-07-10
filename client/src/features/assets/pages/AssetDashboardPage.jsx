import React from 'react';
import { Laptop, Package, CheckCircle2, Archive, XCircle, Wrench, PlusCircle, UserPlus, RotateCcw, BarChart2, Download, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import { AssetAnalyticsCard, WarrantyCard } from '../components/AssetCards';
import { CategoryBadge, AssetStatusBadge } from '../components/AssetBadges';

/**
 * AssetDashboardPage.jsx
 * Executive command center for EWMP Asset Management.
 * Shows KPIs, Quick Actions, Maintenance Due, Expiring Warranties, and Category breakdown.
 */
export const AssetDashboardPage = ({
  assets = [],
  onRegister,
  onAllocate,
  onReturn,
  onScheduleMaintenance,
  onExport,
  onNavigate,
}) => {
  // KPIs from asset list
  const total      = assets.length || 284;
  const assigned   = assets.filter(a => a.status === 'ASSIGNED').length  || 152;
  const available  = assets.filter(a => a.status === 'AVAILABLE').length || 97;
  const maintenance= assets.filter(a => a.status === 'MAINTENANCE').length || 18;
  const retired    = assets.filter(a => a.status === 'RETIRED').length   || 12;
  const lost       = assets.filter(a => a.status === 'LOST').length      || 5;

  const warrantyExpiring = assets.filter(a => a.warrantyDaysLeft > 0 && a.warrantyDaysLeft < 90).slice(0, 3);
  const maintenanceDue   = assets.filter(a => a.status === 'MAINTENANCE').slice(0, 3);

  const recentActivity = [
    { icon: '💻', user: 'Michael Vance', action: 'allocated', target: 'Dell XPS 15 (AST-0042) to Alex Turner', time: '18m ago' },
    { icon: '🔁', user: 'Elena Rostova', action: 'returned',  target: 'iPhone 14 Pro (AST-0118) in GOOD condition', time: '1h ago' },
    { icon: '🔧', user: 'IT Admin',       action: 'scheduled maintenance for', target: 'HP LaserJet Pro (AST-0055)', time: '3h ago' },
    { icon: '📦', user: 'Michael Vance', action: 'registered', target: 'Cisco Switch SG350 (AST-0281)', time: '5h ago' },
    { icon: '🚨', user: 'System Alert',  action: 'flagged as lost', target: 'iPad Pro 11 (AST-0097)', time: '1d ago' },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200">
              INTUNE &amp; FRESHSERVICE SYNCED
            </span>
            <span className="text-xs text-[#737686] font-mono">Q3 IT Asset Command Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise IT Asset Management Platform
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Track hardware lifecycle, software licenses, maintenance schedules, and workforce allocation across all departments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button onClick={onRegister} className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102">
            <PlusCircle size={15} /> Register Asset
          </button>
          <button onClick={onAllocate} className="px-4 py-2 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 transition-colors shadow-2xs">
            <UserPlus size={15} /> Allocate Asset
          </button>
          <button onClick={onReturn} className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-colors">
            <RotateCcw size={15} /> Return Asset
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <AssetAnalyticsCard title="Total Assets"       value={total}      subtitle="Full inventory"    icon={Laptop}        change="+12 this month" trend="up"      color="text-[#2563eb]"  bg="bg-blue-50 dark:bg-blue-950/60" />
        <AssetAnalyticsCard title="Assigned Assets"    value={assigned}   subtitle="Active allocation" icon={UserPlus}      change={`${Math.round(assigned/total*100)}% allocation rate`} trend="neutral" color="text-purple-600" bg="bg-purple-50 dark:bg-purple-950/60" />
        <AssetAnalyticsCard title="Available"          value={available}  subtitle="Ready for allocation" icon={CheckCircle2} change="Unallocated pool"  trend="up"      color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/60" />
        <AssetAnalyticsCard title="Maintenance Due"    value={maintenance} subtitle="Scheduled service" icon={Wrench}       change="Action required"  trend="down"    color="text-amber-600"   bg="bg-amber-50 dark:bg-amber-950/60" />
        <AssetAnalyticsCard title="Retired Assets"     value={retired}    subtitle="End-of-life"       icon={Archive}       change="Decommissioned"   trend="neutral" color="text-gray-600"    bg="bg-gray-100 dark:bg-gray-800" />
        <AssetAnalyticsCard title="Lost / Stolen"      value={lost}       subtitle="Flagged records"   icon={XCircle}       change="Incident reports"  trend="down"    color="text-rose-600"    bg="bg-rose-50 dark:bg-rose-950/60" />
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <span className="font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> IT Admin Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Register Asset', icon: PlusCircle, color: 'text-[#2563eb]', action: onRegister },
            { label: 'Allocate Asset', icon: UserPlus, color: 'text-purple-600', action: onAllocate },
            { label: 'Return Asset', icon: RotateCcw, color: 'text-emerald-600', action: onReturn },
            { label: 'Schedule Maintenance', icon: Wrench, color: 'text-amber-600', action: onScheduleMaintenance },
            { label: 'Export Inventory', icon: Download, color: 'text-gray-600', action: onExport },
            { label: 'View Analytics', icon: BarChart2, color: 'text-rose-600', action: () => onNavigate && onNavigate('analytics') },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-gray-200 flex items-center gap-1.5">
              <btn.icon size={14} className={btn.color} /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Breakdown + Maintenance Due */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Categories Grid */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Package size={18} className="text-[#2563eb]" /> Asset Category Distribution
              </h3>
              <button onClick={() => onNavigate && onNavigate('categories')} className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
                Manage Categories <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { category: 'LAPTOP',     count: 84, pct: 74 },
                { category: 'DESKTOP',    count: 32, pct: 56 },
                { category: 'MONITOR',    count: 61, pct: 90 },
                { category: 'PHONE',      count: 43, pct: 62 },
                { category: 'NETWORKING', count: 28, pct: 80 },
                { category: 'PRINTER',    count: 14, pct: 43 },
                { category: 'KEYBOARD',   count: 72, pct: 95 },
                { category: 'MOUSE',      count: 68, pct: 95 },
                { category: 'SOFTWARE',   count: 19, pct: 100 },
                { category: 'OTHER',      count: 12, pct: 50 },
              ].map((c, i) => (
                <div key={i} className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-3 text-center space-y-2">
                  <div className="flex justify-center"><CategoryBadge category={c.category} size="sm" showLabel={false} /></div>
                  <div className="text-xl font-extrabold text-[#191b23] dark:text-white font-mono">{c.count}</div>
                  <div className="text-[10px] text-[#737686] font-bold uppercase font-mono">{c.category}</div>
                  <div className="w-full bg-[#ededf9] dark:bg-gray-800 rounded-full h-1.5">
                    <div className="bg-[#2563eb] h-1.5 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Due Table */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Wrench size={18} className="text-amber-500" /> Upcoming Maintenance &amp; Service Due
              </h3>
              <button onClick={() => onNavigate && onNavigate('maintenance')} className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
              {[
                { id: 'AST-0055', name: 'HP LaserJet Pro M404dn', type: 'Preventive Service', date: 'Jul 10, 2026', vendor: 'HP Enterprise Support', cost: '$85' },
                { id: 'AST-0099', name: 'Cisco Catalyst 9300 Switch', type: 'Firmware Update', date: 'Jul 14, 2026', vendor: 'Cisco TAC', cost: '$0' },
                { id: 'AST-0117', name: 'Dell PowerEdge Server', type: 'Hardware Inspection', date: 'Jul 22, 2026', vendor: 'Dell ProSupport', cost: '$240' },
              ].map((m, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 px-2 rounded-lg transition-colors cursor-pointer">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-extrabold text-[#2563eb]">{m.id}</span>
                    <p className="font-bold text-sm text-[#191b23] dark:text-white truncate">{m.name}</p>
                    <p className="text-xs text-[#737686] font-mono">{m.type} · {m.vendor}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-amber-600 block">⏰ {m.date}</span>
                    <span className="font-mono text-xs text-[#737686]">Est. {m.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity + Expiring Warranties */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-[#2563eb]" /> Recent Asset Activity
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">● LIVE</span>
            </div>
            <div className="space-y-3 text-xs">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed]/60">
                  <span className="text-base shrink-0">{act.icon}</span>
                  <div>
                    <p className="text-xs text-[#191b23] dark:text-gray-200 leading-relaxed">
                      <strong className="font-bold text-[#2563eb]">{act.user}</strong> {act.action} <strong className="font-semibold">{act.target}</strong>
                    </p>
                    <span className="text-[10px] font-mono text-[#737686] block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty Expiry Card */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <Shield size={16} className="text-rose-500" /> Warranties Expiring Soon
              </h3>
              <span className="text-[11px] font-mono text-rose-600 font-bold">⚠ 3 items</span>
            </div>
            {[
              { id: 'AST-0042', name: 'Dell XPS 15 9530', warrantyExpiry: 'Aug 15, 2026', daysLeft: 39 },
              { id: 'AST-0078', name: 'iPhone 14 Pro 256GB', warrantyExpiry: 'Sep 01, 2026', daysLeft: 56 },
              { id: 'AST-0102', name: 'Samsung 4K Monitor 32"', warrantyExpiry: 'Sep 20, 2026', daysLeft: 75 },
            ].map((a, i) => (
              <WarrantyCard key={i} asset={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
