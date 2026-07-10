import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, UserCheck, Activity, Eye, AlertTriangle } from 'lucide-react';
import { VerificationQueueTable } from '../components/DocumentTables';
import { NoPendingVerification } from '../components/DocumentEmptyStates';
import { DocumentStatusBadge, DocumentCategoryBadge, FileTypeBadge } from '../components/DocumentBadges';

/**
 * VerificationCenterPage.jsx
 * HR & Compliance Verification Center.
 * Dedicated review queue for pending employee document submissions and corporate SLAs.
 * Supports inline Approve, Reject with comments, and audit timeline tracking.
 */
export const VerificationCenterPage = ({
  documents = [],
  onApproveDoc,
  onRejectDoc,
  onSelectDoc,
  onDownload
}) => {
  const pendingQueue = documents.filter(d => d.status === 'PENDING') || [];
  const verifiedRecently = documents.filter(d => d.status === 'VERIFIED').slice(0, 4) || [];

  const [reviewingDoc, setReviewingDoc] = useState(null);
  const [rejectComment, setRejectComment] = useState('');

  const handleOpenReject = (doc) => {
    setReviewingDoc(doc);
    setRejectComment('Document is blurry or expired. Please upload a valid unexpired color copy.');
  };

  const handleConfirmReject = () => {
    if (reviewingDoc && onRejectDoc) {
      onRejectDoc(reviewingDoc, rejectComment);
      setReviewingDoc(null);
      setRejectComment('');
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 border border-amber-200 animate-pulse">
              COMPLIANCE REVIEW QUEUE
            </span>
            <span className="text-xs text-[#737686] font-mono">HR / Legal Reviewer Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Document Verification Center
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Audit employee onboarding submissions, verify identity proofs, and validate annual legal SLAs before archiving.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#faf8ff] dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-3 flex items-center gap-3 text-xs">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-lg">
              <UserCheck size={18} />
            </div>
            <div>
              <span className="font-bold text-[#191b23] dark:text-white block">Samantha Wu</span>
              <span className="text-[10px] font-mono text-[#737686]">Compliance Lead · Level 3 Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase font-mono block">Pending In Queue</span>
            <h3 className="text-3xl font-black text-[#191b23] dark:text-white font-mono mt-0.5">{pendingQueue.length}</h3>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl border border-amber-200">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-[#111111] border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase font-mono block">Approved This Month</span>
            <h3 className="text-3xl font-black text-[#191b23] dark:text-white font-mono mt-0.5">{documents.filter(d => d.status === 'VERIFIED').length || 298}</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl border border-emerald-200">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-[#111111] border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase font-mono block">Rejected &amp; Returned</span>
            <h3 className="text-3xl font-black text-[#191b23] dark:text-white font-mono mt-0.5">{documents.filter(d => d.status === 'REJECTED').length || 14}</h3>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-xl border border-rose-200">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Reject Modal / Inline Comment Popover */}
      {reviewingDoc && (
        <div className="bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-700 rounded-2xl p-6 shadow-md space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-rose-900 dark:text-rose-100 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" /> Reject Document &amp; Send Feedback to Employee
            </h4>
            <button onClick={() => setReviewingDoc(null)} className="text-rose-700 font-bold text-xs hover:underline">
              Cancel
            </button>
          </div>
          <div className="bg-white dark:bg-[#111111] p-3 rounded-xl border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between">
            <div>
              <strong className="font-bold text-[#191b23] dark:text-white block">{reviewingDoc.name}</strong>
              <span className="text-[11px] font-mono text-[#737686]">Submitted by {reviewingDoc.owner} ({reviewingDoc.department})</span>
            </div>
            <DocumentCategoryBadge category={reviewingDoc.category} size="sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-rose-900 dark:text-rose-200 uppercase mb-1">
              Reviewer Rejection Reason (sent via email &amp; EWMP inbox notification)
            </label>
            <textarea
              rows={3}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full p-3 bg-white dark:bg-[#161616] border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-sans text-[#191b23] dark:text-white"
              placeholder="Explain why this document failed verification..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setReviewingDoc(null)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-2xs flex items-center gap-1.5"
            >
              <XCircle size={15} /> Confirm Rejection &amp; Notify
            </button>
          </div>
        </div>
      )}

      {/* Main Table or Empty State */}
      {pendingQueue.length === 0 ? (
        <NoPendingVerification />
      ) : (
        <VerificationQueueTable
          queue={pendingQueue}
          onApprove={(doc) => onApproveDoc && onApproveDoc(doc)}
          onReject={(doc) => handleOpenReject(doc)}
          onSelectDoc={onSelectDoc}
        />
      )}

      {/* Recently Verified Audit Timeline */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-mono pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <Activity size={16} className="text-[#2563eb]" /> Recent Verification Audit Ledger
        </h3>
        <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800 text-xs">
          {verifiedRecently.map((doc, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div className="min-w-0">
                  <strong className="font-bold text-[#191b23] dark:text-white block truncate">{doc.name}</strong>
                  <span className="text-[#737686] font-mono text-[11px]">Verified by Samantha Wu · {doc.uploadDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-[#191b23] dark:text-gray-300">{doc.owner}</span>
                <DocumentCategoryBadge category={doc.category} size="sm" />
                <button onClick={() => onSelectDoc && onSelectDoc(doc)} className="p-1.5 text-gray-400 hover:text-[#2563eb] rounded-lg">
                  <Eye size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
