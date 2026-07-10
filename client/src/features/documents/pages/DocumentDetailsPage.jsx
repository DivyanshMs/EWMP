import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Trash2, CheckCircle2, XCircle, FileText, ShieldCheck, History, Activity, Users, ExternalLink } from 'lucide-react';
import { DocumentStatusBadge, DocumentCategoryBadge, FileTypeBadge } from '../components/DocumentBadges';
import { VersionHistoryTable } from '../components/DocumentTables';

/**
 * DocumentDetailsPage.jsx
 * Comprehensive document dossier with preview, metadata, version history,
 * activity timeline, verification status, and access audit log.
 */
export const DocumentDetailsPage = ({
  document,
  onBack,
  onDownload,
  onVerify,
  onReject,
  onDelete,
  onShare,
  onRestoreVersion
}) => {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'versions' | 'timeline' | 'access'

  const doc = document || {
    id: 'DOC-8492',
    name: 'EWMP_Employee_Code_of_Conduct_2026.pdf',
    category: 'POLICY',
    fileType: 'PDF',
    size: '2.4 MB',
    status: 'VERIFIED',
    owner: 'Alex Turner',
    department: 'HR & Compliance',
    uploadDate: 'Jul 04, 2026 at 14:30',
    expiryDate: 'Jul 04, 2029',
    description: 'Mandatory annual employee code of conduct and ethics policy document. Reviewed by corporate legal.',
    tags: ['Policy', 'Legal', 'Annual', 'Mandatory', 'HR'],
    verifiedBy: 'Samantha Wu (Compliance Admin)',
    verifiedDate: 'Jul 04, 2026 at 16:15',
    storageUri: 's3://ewmp-enterprise-repo-prod/hr-policies/doc-8492.pdf',
    versions: [
      { version: 'v3.0', name: 'EWMP_Employee_Code_of_Conduct_2026.pdf', timestamp: 'Jul 04, 2026 at 14:30', author: 'Alex Turner', size: '2.4 MB', isCurrent: true },
      { version: 'v2.1', name: 'EWMP_Employee_Code_of_Conduct_2025_RevB.pdf', timestamp: 'Jun 12, 2025 at 09:10', author: 'Alex Turner', size: '2.2 MB', isCurrent: false },
      { version: 'v1.0', name: 'EWMP_Employee_Code_of_Conduct_Initial.pdf', timestamp: 'Jan 15, 2024 at 11:20', author: 'Elena Rostova', size: '1.9 MB', isCurrent: false },
    ],
    activityLog: [
      { action: 'Verified & Approved', user: 'Samantha Wu (Compliance Admin)', timestamp: 'Jul 04, 2026 at 16:15', note: 'Policy compliance audit passed.' },
      { action: 'Uploaded v3.0 revision', user: 'Alex Turner (HR Lead)', timestamp: 'Jul 04, 2026 at 14:30', note: 'Updated Section 4 for remote work ethics.' },
      { action: 'Shared link with Engineering Lead', user: 'Alex Turner (HR Lead)', timestamp: 'Jul 03, 2026 at 10:00', note: 'View-only permission.' },
      { action: 'Initial upload v1.0', user: 'Elena Rostova', timestamp: 'Jan 15, 2024 at 11:20', note: 'Imported from legacy SharePoint.' },
    ],
    accessHistory: [
      { user: 'Alex Turner', role: 'HR Lead', action: 'Downloaded PDF', timestamp: '2 hours ago', ip: '192.168.1.104' },
      { user: 'David Chen', role: 'Sales Lead', action: 'Viewed Online', timestamp: '5 hours ago', ip: '10.0.4.88' },
      { user: 'Michael Vance', role: 'IT Admin', action: 'Metadata Inspection', timestamp: '1 day ago', ip: '192.168.1.12' },
      { user: 'Samantha Wu', role: 'Compliance Admin', action: 'Verified Document', timestamp: '3 days ago', ip: '10.0.2.19' },
    ],
  };

  const tabs = [
    { id: 'preview',  label: 'Document Preview & Specs', icon: FileText },
    { id: 'versions', label: `Version History (${doc.versions.length})`, icon: History },
    { id: 'timeline', label: 'Activity Audit Trail',     icon: Activity },
    { id: 'access',   label: 'Access Ledger',            icon: Users },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white rounded-xl border border-[#e1e2ed] dark:border-gray-700 transition-colors shadow-2xs shrink-0"
            title="Back to Library"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-extrabold text-[#2563eb] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">
                {doc.id}
              </span>
              <FileTypeBadge fileType={doc.fileType || 'PDF'} size="sm" />
              <DocumentCategoryBadge category={doc.category} size="sm" />
              <DocumentStatusBadge status={doc.status} size="sm" />
            </div>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-1 truncate">
              {doc.name}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {doc.status === 'PENDING' && (
            <>
              <button
                onClick={() => onVerify && onVerify(doc)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 size={15} /> Approve &amp; Verify
              </button>
              <button
                onClick={() => onReject && onReject(doc)}
                className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center gap-1.5"
              >
                <XCircle size={15} /> Reject
              </button>
            </>
          )}
          <button
            onClick={() => onDownload && onDownload(doc)}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download size={15} /> Download File
          </button>
          <button
            onClick={() => onShare && onShare(doc)}
            className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl border border-purple-200 flex items-center gap-1.5 transition-colors"
          >
            <Share2 size={15} /> Share
          </button>
          <button
            onClick={() => onDelete && onDelete(doc.id)}
            className="p-2 text-gray-400 hover:text-rose-600 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors"
            title="Archive Document"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Left (Tabs & Content) 2/3 + Right (Metadata) 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Bar */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-2 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeTab === t.id ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-5">
              {/* Visual Preview Box */}
              <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
                  <span className="font-bold text-xs text-[#737686] uppercase font-mono flex items-center gap-2">
                    <FileText size={15} className="text-[#2563eb]" /> Secure Document Previewer (AWS S3 Stream)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">● ENCRYPTED IN TRANSIT</span>
                </div>
                {/* PDF Reader Simulation */}
                <div className="bg-[#faf8ff] dark:bg-[#161616] border border-dashed border-[#c3c6d7] dark:border-gray-800 rounded-xl h-96 flex flex-col items-center justify-center p-8 text-center space-y-4 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-[#2563eb]">
                    <FileText size={36} />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white font-mono truncate">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-[#737686]">
                      Previewing page 1 of 8. Enterprise watermark enabled for confidential workforce protection.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onDownload && onDownload(doc)}
                      className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Download size={14} /> Download Original PDF
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5">
                      <ExternalLink size={14} /> Open in New Tab
                    </button>
                  </div>
                </div>
              </div>

              {/* Description & Tags */}
              <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                  Document Scope &amp; Keywords
                </h4>
                <p className="text-xs text-[#191b23] dark:text-gray-200 leading-relaxed">
                  {doc.description || 'No detailed description provided for this document.'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {doc.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#faf8ff] dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded-md text-[11px] font-mono font-bold text-[#2563eb]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Versions Tab */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <VersionHistoryTable
                versions={doc.versions}
                onDownload={(v) => onDownload && onDownload(v)}
                onRestore={(v) => onRestoreVersion && onRestoreVersion(v)}
              />
            </div>
          )}

          {/* Activity Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-5">
              <h4 className="font-bold text-sm text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
                <Activity size={16} className="text-[#2563eb]" /> Full Document Activity &amp; Audit Trail
              </h4>
              <div className="space-y-4 relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#e1e2ed] dark:bg-gray-800" />
                {doc.activityLog.map((log, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="absolute -left-4.5 w-4 h-4 rounded-full bg-[#2563eb] border-2 border-white dark:border-[#111111] shrink-0 mt-0.5" />
                    <div className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed]/80 rounded-xl p-3 flex-1 text-xs font-sans space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="font-extrabold text-[#191b23] dark:text-white">{log.action}</strong>
                        <span className="font-mono text-[10px] text-[#737686]">{log.timestamp}</span>
                      </div>
                      <p className="text-[#737686] font-mono">By {log.user}</p>
                      {log.note && <p className="text-[#191b23] dark:text-gray-300 font-semibold bg-white dark:bg-gray-800 p-2 rounded border border-[#e1e2ed]/60 mt-1">{log.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access History Ledger Tab */}
          {activeTab === 'access' && (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-[#191b23] dark:text-white">Confidential Access Ledger ({doc.accessHistory.length} logs)</span>
                <span className="text-emerald-600 font-bold">● SOC2 AUDIT READY</span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] font-mono">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action Taken</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
                  {doc.accessHistory.map((acc, i) => (
                    <tr key={i} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40">
                      <td className="py-3 px-4 font-bold text-[#191b23] dark:text-white">{acc.user}</td>
                      <td className="py-3 px-4 font-mono text-purple-600 font-semibold">{acc.role}</td>
                      <td className="py-3 px-4 font-semibold">{acc.action}</td>
                      <td className="py-3 px-4 font-mono text-[#737686]">{acc.timestamp}</td>
                      <td className="py-3 px-4 font-mono text-right text-[#737686]">{acc.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Sidebar: Document Metadata & Owner */}
        <div className="space-y-5">
          {/* Verification Status Card */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
              <span>Verification Status</span>
              <ShieldCheck size={14} className="text-[#2563eb]" />
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#737686]">Status:</span>
                <DocumentStatusBadge status={doc.status} size="sm" />
              </div>
              {doc.verifiedBy && (
                <div className="flex justify-between items-start pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
                  <span className="text-[#737686]">Verified By:</span>
                  <span className="font-semibold text-right text-[#191b23] dark:text-white">{doc.verifiedBy}</span>
                </div>
              )}
              {doc.verifiedDate && (
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[#737686]">Date:</span>
                  <span className="text-[#191b23] dark:text-gray-300">{doc.verifiedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Owner & Department */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              Document Owner &amp; Dept
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                {doc.owner?.charAt(0) || 'A'}
              </div>
              <div>
                <strong className="font-bold text-sm text-[#191b23] dark:text-white block">{doc.owner}</strong>
                <span className="text-xs font-mono text-[#737686]">{doc.department}</span>
              </div>
            </div>
          </div>

          {/* Technical Metadata Box */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              Technical Metadata
            </h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><span className="text-[#737686]">File Size:</span><strong className="text-[#191b23] dark:text-white">{doc.size}</strong></div>
              <div className="flex justify-between"><span className="text-[#737686]">Format:</span><strong className="text-[#2563eb]">{doc.fileType}</strong></div>
              <div className="flex justify-between"><span className="text-[#737686]">Uploaded:</span><strong className="text-[#191b23] dark:text-white">{doc.uploadDate}</strong></div>
              {doc.expiryDate && (
                <div className="flex justify-between pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
                  <span className="text-[#737686]">Expires:</span><strong className="text-rose-600 font-bold">{doc.expiryDate}</strong>
                </div>
              )}
              <div className="pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-[10px] text-[#737686] break-all">
                <span className="block font-bold mb-0.5">S3 URI:</span>
                {doc.storageUri}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
