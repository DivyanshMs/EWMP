import React, { useState } from 'react';
import { Download, XCircle, Share2, Trash2, RotateCcw, ArrowUpDown, Check } from 'lucide-react';
import { DocumentStatusBadge, DocumentCategoryBadge, FileTypeBadge } from './DocumentBadges';

/**
 * DocumentTables.jsx
 * Enterprise tables: DocumentTable, VerificationQueueTable, and VersionHistoryTable.
 */

export const DocumentTable = ({
  documents = [],
  onSelectDoc,
  onDownload,
  onVerify,
  onDelete,
  onShare,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll
}) => {
  const [sortField, setSortField] = useState('uploadDate');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const allSelected = documents.length > 0 && selectedIds.length === documents.length;

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] font-mono select-none">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleSelectAll && onToggleSelectAll(documents.map(d => d.id))}
                  className="w-4 h-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                />
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-black dark:hover:text-white" onClick={() => handleSort('name')}>
                <span className="flex items-center gap-1">Document Name &amp; ID <ArrowUpDown size={12} /></span>
              </th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-black dark:hover:text-white" onClick={() => handleSort('owner')}>
                <span className="flex items-center gap-1">Owner &amp; Dept <ArrowUpDown size={12} /></span>
              </th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-black dark:hover:text-white" onClick={() => handleSort('uploadDate')}>
                <span className="flex items-center gap-1">Upload Date <ArrowUpDown size={12} /></span>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
            {documents.map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              return (
                <tr
                  key={doc.id}
                  onClick={() => onSelectDoc && onSelectDoc(doc)}
                  className={`hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect && onToggleSelect(doc.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileTypeBadge fileType={doc.fileType || 'PDF'} size="sm" />
                      <div className="min-w-0">
                        <strong className="text-sm font-extrabold text-[#191b23] dark:text-white block truncate hover:text-[#2563eb] transition-colors">
                          {doc.name}
                        </strong>
                        <span className="text-[11px] font-mono text-[#737686]">{doc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <DocumentCategoryBadge category={doc.category} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                        {(doc.owner || 'U').charAt(0)}
                      </div>
                      <div>
                        <strong className="font-semibold text-xs text-[#191b23] dark:text-white block">{doc.owner}</strong>
                        <span className="text-[11px] font-mono text-[#737686]">{doc.department || 'Engineering'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-xs">{doc.fileType || 'PDF'}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#737686] whitespace-nowrap">{doc.size || '1.8 MB'}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#191b23] dark:text-gray-300 whitespace-nowrap">{doc.uploadDate}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <DocumentStatusBadge status={doc.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onDownload && onDownload(doc)}
                        className="p-1.5 text-gray-500 hover:text-[#2563eb] hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => onShare && onShare(doc)}
                        className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(doc.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Archive"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const VerificationQueueTable = ({
  queue = [],
  onApprove,
  onReject,
  onSelectDoc
}) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs font-sans">
      <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-xs font-mono">
        <span className="font-bold text-[#191b23] dark:text-white">{queue.length} documents awaiting verification</span>
        <span className="text-amber-600 font-bold">● ACTIVE COMPLIANCE QUEUE</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] font-mono select-none">
              <th className="py-3.5 px-4">Document Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Employee / Owner</th>
              <th className="py-3.5 px-4">Submitted On</th>
              <th className="py-3.5 px-4">Reviewer Role</th>
              <th className="py-3.5 px-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
            {queue.map((item) => (
              <tr key={item.id} onClick={() => onSelectDoc && onSelectDoc(item)} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors cursor-pointer">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <FileTypeBadge fileType={item.fileType || 'PDF'} size="sm" />
                    <div>
                      <strong className="text-sm font-extrabold text-[#191b23] dark:text-white block">{item.name}</strong>
                      <span className="text-[11px] font-mono text-[#737686]">{item.id} · {item.size || '1.4 MB'}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4"><DocumentCategoryBadge category={item.category} size="sm" /></td>
                <td className="py-3.5 px-4">
                  <strong className="font-semibold text-xs text-[#191b23] dark:text-white block">{item.owner}</strong>
                  <span className="text-[11px] font-mono text-[#737686]">{item.department}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">{item.uploadDate}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-xs text-purple-600">{item.reviewer || 'HR / Compliance Admin'}</td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onApprove && onApprove(item)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-2xs flex items-center gap-1 text-xs"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => onReject && onReject(item)}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold rounded-lg border border-rose-200 transition-all flex items-center gap-1 text-xs"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const VersionHistoryTable = ({ versions = [], onRestore, onDownload }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs font-sans text-xs">
      <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center font-mono">
        <span className="font-bold text-[#191b23] dark:text-white">Document Version Ledger ({versions.length} versions stored)</span>
        <span className="text-[#2563eb] font-bold">AWS S3 VERSIONING ENABLED</span>
      </div>
      <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
        {versions.map((v, idx) => {
          const isCurrent = idx === 0 || v.isCurrent;
          return (
            <div key={v.version || idx} className="p-4 flex items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs ${
                  isCurrent ? 'bg-[#2563eb] text-white shadow-2xs' : 'bg-gray-100 dark:bg-gray-800 text-[#737686]'
                }`}>
                  {v.version || `v${versions.length - idx}.0`}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-[#191b23] dark:text-white">{v.name || 'Contract_Agreement.pdf'}</strong>
                    {isCurrent && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">CURRENT</span>}
                  </div>
                  <p className="text-xs text-[#737686] font-mono mt-0.5">
                    Uploaded by <strong className="text-[#191b23] dark:text-gray-300">{v.author || 'Alex Turner'}</strong> on {v.timestamp || 'Jul 04, 2026 at 14:30'} · {v.size || '1.8 MB'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onDownload && onDownload(v)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-white flex items-center gap-1.5 text-xs"
                >
                  <Download size={13} /> Download
                </button>
                {!isCurrent && (
                  <button
                    onClick={() => onRestore && onRestore(v)}
                    className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 font-semibold flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <RotateCcw size={13} /> Restore
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
