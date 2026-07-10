import React from 'react';
import { TrendingUp, HardDrive, ShieldCheck, AlertTriangle, Building2, Download } from 'lucide-react';
import { DocumentAnalyticsCard, StorageProgressBar, ChartPlaceholder } from '../components/DocumentCards';
import { DocumentStatusBadge, DocumentCategoryBadge } from '../components/DocumentBadges';

/**
 * DocumentAnalyticsPage.jsx
 * Executive portfolio intelligence for EWMP Document Repository:
 * Storage Usage breakdown, Upload Trends, Category distribution,
 * Department allocation matrix, Verification Rate SLA, and Expired Alerts.
 */
export const DocumentAnalyticsPage = ({ documents = [], onExportReport }) => {
  const total = documents.length || 384;
  const verified = documents.filter(d => d.status === 'VERIFIED').length || 298;
  const pending = documents.filter(d => d.status === 'PENDING').length || 64;
  const expired = documents.filter(d => d.status === 'EXPIRED').length || 8;
  const verificationRate = Math.round((verified / (total || 1)) * 100) || 78;

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200">
              REPOSITORY TELEMETRY
            </span>
            <span className="text-xs text-[#737686] font-mono">Q3 FY2026 Audit Report</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Document Analytics &amp; Storage Intelligence
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Monitor enterprise storage consumption, audit compliance verification SLAs, and track departmental document velocity.
          </p>
        </div>
        <button
          onClick={onExportReport}
          className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <Download size={15} /> Export Audit Telemetry (.PDF)
        </button>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DocumentAnalyticsCard title="Verification SLA Rate" value={`${verificationRate}%`} subtitle="HR & Compliance approved" icon={ShieldCheck} change="+4.2% vs Q2" trend="up" color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/60" />
        <DocumentAnalyticsCard title="Cloud Storage Used"    value="342 GB"               subtitle="68.4% of 500 GB quota"   icon={HardDrive}   change="158 GB free"  trend="neutral" color="text-[#2563eb]" bg="bg-blue-50 dark:bg-blue-950/60" />
        <DocumentAnalyticsCard title="Monthly Uploads"       value="1,420"                subtitle="Files added in Jul 2026" icon={TrendingUp}  change="+18% surge"   trend="up" color="text-purple-600" bg="bg-purple-50 dark:bg-purple-950/60" />
        <DocumentAnalyticsCard title="Expired SLA Alerts"    value={expired}              subtitle="Action required by HR"   icon={AlertTriangle} change="High priority" trend="down" color="text-rose-600" bg="bg-rose-50 dark:bg-rose-950/60" />
      </div>

      {/* Storage Breakdown Bar */}
      <StorageProgressBar usedGB={342} totalGB={500} label="AWS S3 Multi-Region Storage Consumption" />

      {/* 2x2 Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Document Taxonomy Distribution by Category" type="BAR" height="h-72" />
        <ChartPlaceholder title="Verification Status Breakdown (Verified vs Pending)" type="DONUT" height="h-72" />
        <ChartPlaceholder title="Monthly Document Upload Velocity (Jan – Jul 2026)" type="LINE" height="h-72" />
        <ChartPlaceholder title="Department Storage Consumption Share (%)" type="DONUT" height="h-72" />
      </div>

      {/* Department Allocation Matrix */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-[#191b23] dark:text-white">Departmental Document &amp; Storage Matrix</span>
          <span className="text-[#2563eb] font-bold">● AUDITED Q3 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] font-mono">
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Total Documents</th>
                <th className="py-3.5 px-4">Verified Docs</th>
                <th className="py-3.5 px-4">Storage Used</th>
                <th className="py-3.5 px-4">Compliance SLA Rate</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
              {[
                { dept: 'Engineering', total: 142, ver: 124, storage: '148.2 GB', rate: 87, status: 'OPTIMAL' },
                { dept: 'HR & Operations', total: 98, ver: 88, storage: '84.6 GB', rate: 90, status: 'OPTIMAL' },
                { dept: 'Finance & Legal', total: 64, ver: 60, storage: '48.1 GB', rate: 94, status: 'OPTIMAL' },
                { dept: 'Sales & Marketing', total: 48, ver: 34, storage: '42.0 GB', rate: 71, status: 'REVIEW REQ' },
                { dept: 'IT & InfoSec', total: 32, ver: 30, storage: '19.1 GB', rate: 94, status: 'OPTIMAL' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40">
                  <td className="py-3.5 px-4 font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                    <Building2 size={15} className="text-[#2563eb]" /> {row.dept}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">{row.total}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">{row.ver}</td>
                  <td className="py-3.5 px-4 font-mono text-[#737686]">{row.storage}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[#ededf9] dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 rounded-full ${row.rate > 80 ? 'bg-emerald-600' : 'bg-amber-500'}`} style={{ width: `${row.rate}%` }} />
                      </div>
                      <span className="font-mono font-bold text-xs">{row.rate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                      row.status === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {row.status}
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
