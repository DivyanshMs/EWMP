import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { LeaveStatusBadge, LeaveTypeBadge, LeaveDurationBadge } from './LeaveBadges';
import { LeaveTimeline } from './LeaveTimeline';

/**
 * LeaveDrawers.jsx
 * Precision Enterprise drawers and modals for EWMP Leave Management.
 * Includes Approval Drawer, Adjust Balance Modal, and Request Info Modal.
 */

export const LeaveApprovalDrawer = ({ request, isOpen, onClose, onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-[#ffffff] dark:bg-[#111111] h-full shadow-2xl border-l border-[#e1e2ed] dark:border-gray-800 flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {request.employeeName?.substring(0, 2).toUpperCase() || 'EMP'}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191b23] dark:text-white leading-tight">
                Review Leave Request #{request.id || 'LR-9021'}
              </h3>
              <span className="text-xs text-[#737686] dark:text-gray-400 font-medium">
                {request.employeeName} • {request.department}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded hover:bg-white dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-4 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800">
            <div>
              <span className="text-xs text-[#737686] block">Current Request Status</span>
              <div className="mt-1"><LeaveStatusBadge status={request.status} /></div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#737686] block">Submitted Date</span>
              <span className="text-xs font-mono font-bold text-[#191b23] dark:text-white">{request.submittedAt || 'July 2, 2026'}</span>
            </div>
          </div>

          {/* Key Request Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-white dark:bg-[#161616] rounded-lg border border-[#e1e2ed] dark:border-gray-800 shadow-2xs">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#737686] font-semibold block mb-1">Leave Type</span>
              <LeaveTypeBadge type={request.type} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#737686] font-semibold block mb-1">Duration</span>
              <LeaveDurationBadge days={request.days} isHalfDay={request.isHalfDay} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] uppercase tracking-wider text-[#737686] font-semibold block mb-1">Current Balance</span>
              <span className="text-xs font-mono font-bold text-[#2563eb] bg-[#ededf9] dark:bg-gray-800 px-2 py-1 rounded inline-block">
                15 Days Remaining
              </span>
            </div>
            <div className="col-span-2 sm:col-span-3 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
              <span className="text-[11px] uppercase tracking-wider text-[#737686] font-semibold block mb-1">Date Range Requested</span>
              <span className="text-sm font-mono font-extrabold text-[#191b23] dark:text-white">
                {request.startDate} — {request.endDate}
              </span>
            </div>
          </div>

          {/* Reason & Attachments */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 flex items-center gap-1.5">
              <FileText size={14} className="text-[#2563eb]" /> Employee Reason & Justification
            </h4>
            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] dark:border-gray-800 text-xs text-[#191b23] dark:text-gray-200 italic leading-relaxed">
              "{request.reason || 'No detailed explanation provided by the employee.'}"
            </div>
          </div>

          {/* Timeline audit */}
          <LeaveTimeline />

          {/* Manager Comments Textarea */}
          <div className="space-y-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
            <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 block">
              Managerial Comments / Notes (Required for Rejection)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter instructions, approval feedback, or specific handover requirements..."
              className="w-full"
            />
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] border border-[#c3c6d7] dark:border-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onReject(request, comment); onClose(); }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <XCircle size={15} /> Reject Request
          </button>
          <button
            onClick={() => { onApprove(request, comment); onClose(); }}
            className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 size={15} /> Authorize & Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdjustBalanceModal = ({ isOpen, onClose, onSave, employeeName = 'Sarah SDE-II', leaveType = 'Annual Leave', currentBalance = 15 }) => {
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const newBalance = Number(currentBalance) + Number(adjustment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Adjust Leave Balance Allocation
          </h3>
          <button onClick={onClose} className="text-[#737686] hover:text-[#191b23] dark:hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/50 rounded border border-[#e1e2ed] dark:border-gray-800 flex justify-between">
            <div>
              <span className="text-[#737686] block">Employee:</span>
              <strong className="text-sm font-bold text-[#191b23] dark:text-white">{employeeName}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#737686] block">Leave Type:</span>
              <strong className="text-sm font-bold text-[#2563eb]">{leaveType}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center py-2">
            <div className="p-2.5 bg-white dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded">
              <span className="text-[11px] text-[#737686] block">Current</span>
              <span className="text-base font-mono font-bold text-[#191b23] dark:text-white">{currentBalance}d</span>
            </div>
            <div className="p-2.5 bg-white dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded">
              <span className="text-[11px] text-[#737686] block">Adjustment</span>
              <span className={`text-base font-mono font-bold ${adjustment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {adjustment >= 0 ? `+${adjustment}` : adjustment}d
              </span>
            </div>
            <div className="p-2.5 bg-[#ededf9] dark:bg-gray-800 border border-[#c3c6d7] dark:border-gray-700 rounded">
              <span className="text-[11px] text-[#737686] block">New Balance</span>
              <span className="text-base font-mono font-extrabold text-[#2563eb]">{newBalance}d</span>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Days Adjustment (+ / -)</label>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              placeholder="e.g. 5 or -2"
              className="w-full font-mono"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Audit Reason / Policy Ref (Required)</label>
            <textarea
              rows="2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Compensatory leave granted for Saturday production release rollout..."
              className="w-full"
            />
          </div>
        </div>

        <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-2 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded text-xs font-semibold text-[#191b23] dark:text-white">
            Cancel
          </button>
          <button
            onClick={() => { onSave({ adjustment, reason }); onClose(); }}
            disabled={!reason.trim()}
            className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] disabled:opacity-50 text-white rounded text-xs font-semibold shadow-xs transition-all"
          >
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};
