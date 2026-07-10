import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, Eye, Download, Trash2, ShieldCheck, FileCode, FileCheck } from 'lucide-react';

/**
 * EmployeeDocumentCard.jsx
 * Enterprise document card component for displaying employee contracts, government IDs,
 * tax withholdings, and background checks with preview, download, and verification badges.
 */

export const EmployeeDocumentCard = ({
  document,
  onPreview,
  onDownload,
  onDelete,
  onVerify,
  canVerify = true,
}) => {
  if (!document) return null;

  const statusMap = {
    Verified: {
      bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40',
      icon: CheckCircle2,
      label: 'Verified & Compliant',
    },
    Pending: {
      bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40',
      icon: Clock,
      label: 'Pending HR Review',
    },
    Revision: {
      bg: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40',
      icon: AlertCircle,
      label: 'Revision Required',
    },
  };

  const currentStatus = statusMap[document.status] || statusMap.Pending;
  const StatusIcon = currentStatus.icon;

  const getDocIcon = (type) => {
    if (type?.toLowerCase().includes('contract') || type?.toLowerCase().includes('agreement')) {
      return <FileCheck size={22} className="text-blue-600 dark:text-blue-400" />;
    }
    if (type?.toLowerCase().includes('tax') || type?.toLowerCase().includes('w-4')) {
      return <FileCode size={22} className="text-emerald-600 dark:text-emerald-400" />;
    }
    return <FileText size={22} className="text-indigo-600 dark:text-indigo-400" />;
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between font-sans group">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-gray-800 flex items-center justify-center shrink-0 shadow-xs">
              {getDocIcon(document.type)}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
                {document.title || document.name}
              </h4>
              <span className="text-xs font-mono text-gray-400 block truncate">
                {document.type || 'Legal Contract'} • {document.fileSize || '2.4 MB'}
              </span>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${currentStatus.bg} shrink-0`}>
            <StatusIcon size={12} />
            <span>{currentStatus.label}</span>
          </span>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800/80 text-xs font-mono text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Uploaded On:</span>
            <strong className="text-gray-800 dark:text-gray-200">{document.uploadDate || '2026-07-01'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Uploaded By:</span>
            <strong className="text-gray-800 dark:text-gray-200">{document.uploadedBy || 'Employee User'}</strong>
          </div>
          {document.verificationNotes && (
            <div className="pt-1 border-t border-gray-200 dark:border-gray-800 text-[11px] text-amber-600 dark:text-amber-400 font-sans font-medium">
              Note: {document.verificationNotes}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview && onPreview(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-xl text-xs font-semibold transition-colors"
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={() => onDownload && onDownload(document)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-gray-700 dark:text-gray-300 hover:text-emerald-600 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download size={14} />
            Download
          </button>
        </div>

        <div className="flex items-center gap-1">
          {canVerify && document.status !== 'Verified' && (
            <button
              onClick={() => onVerify && onVerify(document)}
              title="Verify Compliance"
              className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              <ShieldCheck size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(document)}
              title="Delete Document"
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentCard;
