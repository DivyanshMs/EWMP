import React, { useState } from 'react';
import { Activity, Search, Filter, Download, RefreshCw, FileText } from 'lucide-react';
import { SettingsCard, StatusBadge, ActivityTimeline } from '../components/AdminComponents';
import { NoActivity } from '../components/AdminEmptyStates';

/**
 * AuditActivityPage.jsx
 * Comprehensive, filterable timeline and audit registry of platform modifications and security events.
 */

export const AuditActivityPage = () => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [allLogs] = useState([
    { id: 101, type: 'SECURITY', action: 'Updated Global MFA Enforcement Policy for Org Admins', actor: 'Alexander Vance (SUPER_ADMIN)', timestamp: '2026-07-08 01:40:12', ip: '192.168.1.104', details: 'Mandated TOTP verification across all 14 subsidiary IP blocks.' },
    { id: 102, type: 'ROLE', action: 'Assigned [FINANCE] Privilege Scope to Sarah Jenkins', actor: 'Alexander Vance (SUPER_ADMIN)', timestamp: '2026-07-08 00:15:00', ip: '192.168.1.104', details: 'Authorized access to payroll tax ledgers and compensation ledgers.' },
    { id: 103, type: 'ORG', action: 'Modified UK Subsidiary Operating Schedule Grid', actor: 'Marcus Sterling (ORG_ADMIN)', timestamp: '2026-07-07 21:10:44', ip: '10.0.4.88', details: 'Adjusted Friday shift termination hour from 17:30 to 17:00.' },
    { id: 104, type: 'PROFILE', action: 'Updated Emergency Contact & Legal Tax Parameters', actor: 'Elena Rostova (EMPLOYEE)', timestamp: '2026-07-07 18:05:19', ip: '172.16.0.42', details: 'Synchronized primary residential address and spouse contact info.' },
    { id: 105, type: 'AI', action: 'Refreshed Gemini 3.1 Pro Vector Semantic Cache Buffer', actor: 'System Daemon (CRON)', timestamp: '2026-07-07 12:00:00', ip: 'localhost', details: 'Re-indexed 14,280 organization policy vectors with AES-256 encryption.' },
    { id: 106, type: 'SECURITY', action: 'Revoked Stale Safari Session on macOS Sonoma', actor: 'Victoria Sterling (ORG_ADMIN)', timestamp: '2026-07-07 09:30:11', ip: '10.0.4.88', details: 'Terminated remote session sess-8910 due to 48-hour inactivity.' },
    { id: 107, type: 'ROLE', action: 'Created Custom Security Role [Compliance Inspector]', actor: 'Alexander Vance (SUPER_ADMIN)', timestamp: '2026-07-06 15:45:00', ip: '192.168.1.104', details: 'Cloned standard auditor permissions with read-only audit vault access.' }
  ]);

  const filteredLogs = allLogs.filter(item => {
    const matchesCat = filterCategory === 'ALL' || item.type === filterCategory;
    const matchesQuery = !searchQuery || 
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleExportCsv = () => {
    alert('Exporting Immutable Enterprise Audit Ledger (CSV format)... Download will commence shortly.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Immutable Enterprise Audit Log Registry</h3>
            <StatusBadge status="compliant" label="AES-256 VAULT" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological, cryptographic record of all administrative policy changes, RBAC role assignments, and authentication events.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button 
            onClick={() => { setSearchQuery(''); setFilterCategory('ALL'); }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Refresh Ledger"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button 
            onClick={handleExportCsv}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download size={14} /> Export Audit Ledger (CSV)
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {[
            { id: 'ALL', label: 'All Activity', count: allLogs.length },
            { id: 'SECURITY', label: 'Security & MFA', count: allLogs.filter(l => l.type === 'SECURITY').length },
            { id: 'ROLE', label: 'RBAC Roles', count: allLogs.filter(l => l.type === 'ROLE').length },
            { id: 'ORG', label: 'Org Policy', count: allLogs.filter(l => l.type === 'ORG').length },
            { id: 'PROFILE', label: 'Profile Changes', count: allLogs.filter(l => l.type === 'PROFILE').length },
            { id: 'AI', label: 'AI Governance', count: allLogs.filter(l => l.type === 'AI').length }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
                filterCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search action, actor, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Audit Log Table View */}
      <SettingsCard 
        title="Chronological Audit Trail Registry" 
        subtitle={`Displaying ${filteredLogs.length} verified administrative events matching your criteria`}
        icon={FileText}
      >
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]">
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 w-24">Category</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Administrative Action & Details</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Responsible Actor</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">IP Endpoint</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => {
                  const typeStyles = {
                    SECURITY: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400',
                    ROLE: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400',
                    ORG: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400',
                    PROFILE: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400',
                    AI: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
                  };
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-[#161616]/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${typeStyles[log.type] || typeStyles.ORG}`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{log.action}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{log.details}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{log.actor}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{log.ip}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <NoActivity onResetFilter={() => { setSearchQuery(''); setFilterCategory('ALL'); }} />
        )}
      </SettingsCard>
    </div>
  );
};
