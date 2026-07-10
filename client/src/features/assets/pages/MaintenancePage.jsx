import React, { useState } from 'react';
import { PlusCircle, Calendar, Search, Download, Building2, User } from 'lucide-react';
import { MaintenanceBadge } from '../components/AssetBadges';
import { NoMaintenance } from '../components/AssetEmptyStates';

/**
 * MaintenancePage.jsx
 * Asset maintenance schedule management: upcoming, past, repair history, vendor, cost, status.
 */
export const MaintenancePage = ({ onSchedule, onSelectRecord }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [search, setSearch] = useState('');

  const records = [
    { id: 'MNT-0045', assetId: 'AST-0055', assetName: 'HP LaserJet Pro M404dn', type: 'Preventive Service', vendor: 'HP Enterprise Support', scheduledDate: 'Jul 10, 2026', cost: '$85', status: 'SCHEDULED',    technician: 'HP Field Technician',    notes: 'Annual drum & toner inspection.' },
    { id: 'MNT-0046', assetId: 'AST-0099', assetName: 'Cisco Catalyst 9300',     type: 'Firmware Upgrade',   vendor: 'Cisco TAC',              scheduledDate: 'Jul 14, 2026', cost: '$0',   status: 'SCHEDULED',    technician: 'Michael Vance IT Admin', notes: 'Security patch IOS-XE 17.12.' },
    { id: 'MNT-0044', assetId: 'AST-0042', assetName: 'Dell XPS 15 9530',        type: 'Battery Replacement',vendor: 'Dell ProSupport',        scheduledDate: 'Jun 02, 2026', cost: '$89',  status: 'COMPLETED',    technician: 'Dell ProSupport Field',  notes: 'Battery capacity dropped to 71%.' },
    { id: 'MNT-0043', assetId: 'AST-0117', assetName: 'Dell PowerEdge R750',     type: 'Hardware Inspection',vendor: 'Dell ProSupport Plus',   scheduledDate: 'Jul 22, 2026', cost: '$240', status: 'SCHEDULED',    technician: 'Dell ProSupport Field',  notes: 'Q3 data center hardware audit.' },
    { id: 'MNT-0041', assetId: 'AST-0021', assetName: 'Cisco IP Phone 8841',     type: 'Repair',             vendor: 'Cisco TAC',              scheduledDate: 'May 18, 2026', cost: '$55',  status: 'COMPLETED',    technician: 'Cisco TAC Engineer',     notes: 'Handset audio failure resolved.' },
    { id: 'MNT-0047', assetId: 'AST-0078', assetName: 'iPhone 14 Pro 256GB',     type: 'Screen Replacement', vendor: 'Apple Authorized Service',scheduledDate: 'Jul 08, 2026', cost: '$129', status: 'IN_PROGRESS',  technician: 'Apple ASP Technician',   notes: 'Cracked screen from reported drop incident.' },
    { id: 'MNT-0040', assetId: 'AST-0033', assetName: 'Samsung 4K Monitor 32"',  type: 'Preventive Service', vendor: 'Samsung B2B Support',    scheduledDate: 'Apr 10, 2026', cost: '$0',   status: 'OVERDUE',      technician: 'Unassigned',             notes: 'Annual panel calibration overdue.' },
  ];

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.id.toLowerCase().includes(q) || r.assetName.toLowerCase().includes(q) || r.vendor.toLowerCase().includes(q) || r.assetId.toLowerCase().includes(q);
    if (activeTab === 'upcoming') return matchSearch && (r.status === 'SCHEDULED' || r.status === 'IN_PROGRESS' || r.status === 'OVERDUE');
    if (activeTab === 'past')     return matchSearch && r.status === 'COMPLETED';
    return matchSearch;
  });

  const totalCost = filtered.reduce((sum, r) => sum + parseFloat(r.cost.replace('$','') || 0), 0);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 border border-amber-200">MAINTENANCE SCHEDULER</span>
            <span className="text-xs text-[#737686] font-mono">Integrated with Vendor SLA Portals</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">Asset Maintenance &amp; Repair Management</h2>
          <p className="text-xs text-[#737686] mt-0.5">Track preventive maintenance schedules, vendor repairs, and maintenance cost history.</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={onSchedule} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all">
            <PlusCircle size={15} /> Schedule Maintenance
          </button>
          <button className="px-3.5 py-2 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] flex items-center gap-1.5 shadow-2xs">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Scheduled',   count: records.filter(r => r.status==='SCHEDULED').length,   color: 'text-[#2563eb]',  bg: 'bg-blue-50' },
          { label: 'In Progress', count: records.filter(r => r.status==='IN_PROGRESS').length,  color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Overdue',     count: records.filter(r => r.status==='OVERDUE').length,      color: 'text-rose-600',   bg: 'bg-rose-50' },
          { label: 'Completed',   count: records.filter(r => r.status==='COMPLETED').length,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
        ].map(kpi => (
          <div key={kpi.label} className={`${kpi.bg} dark:bg-opacity-10 border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 space-y-1`}>
            <span className="text-xs font-bold text-[#737686] uppercase font-sans">{kpi.label}</span>
            <h3 className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.count}</h3>
          </div>
        ))}
      </div>

      {/* Tab & Search */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#faf8ff] dark:bg-gray-900 p-1 rounded-xl border border-[#e1e2ed] dark:border-gray-800 font-mono text-xs">
            {['upcoming','past','all'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg font-bold capitalize transition-all ${activeTab===tab ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:text-black dark:hover:text-white'}`}>
                {tab === 'upcoming' ? 'Upcoming & Active' : tab === 'past' ? 'Completed' : 'All Records'}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by asset, vendor, or ID..."
              className="w-full pl-9 pr-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs" />
          </div>
        </div>
      </div>

      {/* Records Table */}
      {filtered.length === 0 ? (
        <NoMaintenance onSchedule={onSchedule} />
      ) : (
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-[#191b23] dark:text-white">{filtered.length} maintenance records</span>
            <span className="text-[#737686]">Total cost: <strong className="text-[#191b23] dark:text-white">${totalCost.toFixed(0)}</strong></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] select-none">
                  <th className="py-3.5 px-4">Record ID</th>
                  <th className="py-3.5 px-4 min-w-[160px]">Asset</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Vendor</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Scheduled</th>
                  <th className="py-3.5 px-4">Cost</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
                {filtered.map(r => (
                  <tr key={r.id} onClick={() => onSelectRecord && onSelectRecord(r)}
                    className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors cursor-pointer">
                    <td className="py-3.5 px-4 font-mono text-[11px] font-extrabold text-amber-600">{r.id}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-sm font-bold text-[#191b23] dark:text-white block">{r.assetName}</strong>
                      <span className="text-[11px] font-mono text-[#2563eb]">{r.assetId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-xs">{r.type}</td>
                    <td className="py-3.5 px-4 text-xs text-[#737686]">
                      <span className="flex items-center gap-1"><Building2 size={12} /> {r.vendor}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#737686]">
                      <span className="flex items-center gap-1"><User size={12} /> {r.technician}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {r.scheduledDate}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-[#191b23] dark:text-white">{r.cost}</td>
                    <td className="py-3.5 px-4"><MaintenanceBadge status={r.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); onSelectRecord && onSelectRecord(r); }}
                        className="px-2.5 py-1 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white font-semibold rounded-lg border border-[#e1e2ed] transition-colors text-xs font-mono">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
