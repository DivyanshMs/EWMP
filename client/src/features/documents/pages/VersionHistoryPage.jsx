import React, { useState } from 'react';
import { History, Download, GitCompare } from 'lucide-react';
import { VersionHistoryTable } from '../components/DocumentTables';
import { FileTypeBadge } from '../components/DocumentBadges';

/**
 * VersionHistoryPage.jsx
 * Comprehensive version control management:
 * Current Version vs Previous Versions, Restore Version trigger, Download,
 * and an interactive Compare Versions (side-by-side diff) placeholder.
 */
export const VersionHistoryPage = ({
  documents = [],
  onRestoreVersion,
  onDownload
}) => {
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || 'DOC-8492');
  const [showCompare, setShowCompare] = useState(false);

  const doc = documents.find(d => d.id === selectedDocId) || {
    id: 'DOC-8492',
    name: 'EWMP_Employee_Code_of_Conduct_2026.pdf',
    category: 'POLICY',
    fileType: 'PDF',
    size: '2.4 MB',
    status: 'VERIFIED',
    owner: 'Alex Turner',
    department: 'HR & Compliance',
    versions: [
      { version: 'v3.0', name: 'EWMP_Employee_Code_of_Conduct_2026.pdf', timestamp: 'Jul 04, 2026 at 14:30', author: 'Alex Turner', size: '2.4 MB', isCurrent: true, changes: 'Added Section 4 remote work ethics guidelines.' },
      { version: 'v2.1', name: 'EWMP_Employee_Code_of_Conduct_2025_RevB.pdf', timestamp: 'Jun 12, 2025 at 09:10', author: 'Alex Turner', size: '2.2 MB', isCurrent: false, changes: 'Updated compliance SLA definitions.' },
      { version: 'v1.0', name: 'EWMP_Employee_Code_of_Conduct_Initial.pdf', timestamp: 'Jan 15, 2024 at 11:20', author: 'Elena Rostova', size: '1.9 MB', isCurrent: false, changes: 'Initial baseline import from SharePoint.' },
    ],
  };

  const versions = doc.versions || [];
  const currentVer = versions[0] || {};

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
              S3 OBJECT VERSIONING
            </span>
            <span className="text-xs text-[#737686] font-mono">Immutable Audit Logs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Document Version Ledger &amp; Restoration
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Compare historical file drafts, audit editorial changes, and restore previous immutable object snapshots.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
          >
            {documents.slice(0, 8).map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
            ))}
            <option value="DOC-8492">EWMP_Employee_Code_of_Conduct_2026.pdf (DOC-8492)</option>
          </select>
          <button
            onClick={() => setShowCompare(v => !v)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
              showCompare ? 'bg-purple-600 text-white' : 'bg-white dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white'
            }`}
          >
            <GitCompare size={15} /> {showCompare ? 'Exit Comparison' : 'Compare Versions'}
          </button>
        </div>
      </div>

      {/* Current Version Spotlight */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 bg-[#2563eb] text-white rounded-2xl shadow-md shrink-0">
            <History size={28} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[10px]">
                ACTIVE CURRENT VERSION ({currentVer.version || 'v3.0'})
              </span>
              <FileTypeBadge fileType={doc.fileType} size="sm" />
            </div>
            <h3 className="text-base font-extrabold text-[#191b23] dark:text-white mt-1 truncate">
              {doc.name}
            </h3>
            <p className="text-xs text-[#737686] font-mono mt-0.5">
              Uploaded by {currentVer.author || doc.owner} on {currentVer.timestamp || doc.uploadDate} · {currentVer.size || doc.size}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDownload && onDownload(currentVer)}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Download size={15} /> Download Active Copy
        </button>
      </div>

      {/* Compare Versions Placeholder (Side-by-Side Diff) */}
      {showCompare && (
        <div className="bg-white dark:bg-[#111111] border-2 border-purple-300 dark:border-purple-800 rounded-2xl p-6 shadow-md space-y-4 animate-slide-up font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
              <GitCompare size={18} className="text-purple-600" /> Side-by-Side Version Diff Viewer
            </h3>
            <span className="text-xs font-mono text-purple-600 font-bold">● COMPARING v3.0 vs v2.1</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Previous Version */}
            <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-rose-700 dark:text-rose-300">
                <span>Previous: v2.1 (Jun 12, 2025)</span>
                <span>2.2 MB</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-rose-200/60 font-mono text-xs text-[#737686] h-64 overflow-y-auto space-y-2">
                <p className="line-through text-rose-600">- Section 4.1: Remote work policy defaults to local office hours.</p>
                <p className="line-through text-rose-600">- Section 4.2: VPN connection is recommended when accessing intranet.</p>
                <p className="text-gray-500">Section 5.0: Employee expense reporting SLA remains 15 business days.</p>
              </div>
            </div>
            {/* Right: Current Version */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                <span>Current: v3.0 (Jul 04, 2026)</span>
                <span>2.4 MB</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-emerald-200/60 font-mono text-xs text-[#191b23] dark:text-gray-200 h-64 overflow-y-auto space-y-2">
                <p className="text-emerald-600 font-bold">+ Section 4.1: Remote work policy allows asynchronous timezone flexibility.</p>
                <p className="text-emerald-600 font-bold">+ Section 4.2: EWMP hardware-enforced VPN is mandatory for all access.</p>
                <p className="text-gray-500">Section 5.0: Employee expense reporting SLA remains 15 business days.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Table */}
      <VersionHistoryTable
        versions={versions}
        onDownload={(v) => onDownload && onDownload(v)}
        onRestore={(v) => onRestoreVersion && onRestoreVersion(v)}
      />
    </div>
  );
};
