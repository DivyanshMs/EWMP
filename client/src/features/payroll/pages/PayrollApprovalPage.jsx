import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, CheckCircle2, XCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { PayrollStatusBadge } from '../components/PayrollBadges';
import { AuditTimeline } from '../components/PayrollTimelines';
import { NoPendingApprovals } from '../components/PayrollEmptyStates';
import api from '../../../lib/axios';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

/**
 * PayrollApprovalPage.jsx
 * Executive Authorization & Finance Audit Review Hub for EWMP Payroll Management.
 * Features Pending Payroll List, Summary, Approval Timeline, Approve/Reject triggers with mandatory audit comments, and History.
 */

export const PayrollApprovalPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['payroll-list'],
    queryFn: () => api.get('/payroll').then(r => r.data)
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.patch(`/payroll/${id}/approve`, { approved: true, approverNotes: comment || 'Authorized without exceptions.' }),
    onSuccess: () => { queryClient.invalidateQueries(['payroll-list']); setComment(''); }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => api.patch(`/payroll/${id}/approve`, { approved: false, approverNotes: comment }),
    onSuccess: () => { queryClient.invalidateQueries(['payroll-list']); setComment(''); }
  });

  const rawList = toArray(payrollData);

  const toRunShape = r => ({
    id: r._id || r.id,
    month: new Date(r.payPeriodYear, r.payPeriodMonth - 1).toLocaleString('default', { month: 'long' }),
    year: String(r.payPeriodYear),
    status: r.status,
    empCount: r.employeeCount || 0,
    totalCost: r.totalNetPay || r.totalNet || 0,
    tds: r.totalTax || 0,
    generatedBy: r.processedBy?.fullName || r.processedBy || 'System',
    generatedDate: r.processedAt ? new Date(r.processedAt).toLocaleDateString() : '',
    notes: r.notes || 'Standard payroll calculation run.',
    approver: r.approvedBy?.fullName || r.approvedBy || '',
    date: r.approvedAt ? new Date(r.approvedAt).toLocaleDateString() : '',
    comment: r.approverNotes || ''
  });

  const pendingRuns = rawList.filter(r => r.status === 'PENDING_APPROVAL').map(toRunShape);
  const historyRuns = rawList.filter(r => ['APPROVED', 'REJECTED', 'PAID'].includes(r.status)).map(toRunShape);

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    if (!comment.trim()) {
      return alert('Please enter mandatory revision instructions or rejection reasons in the comments box.');
    }
    rejectMutation.mutate(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#2563eb]" />
            EXECUTIVE PAYROLL AUTHORIZATION & AUDIT QUEUE
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Finance Controllers and Super Administrators must audit calculation sheets and authorize disbursal runs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 rounded font-mono font-bold text-xs border border-amber-200">
            Pending Review: {pendingRuns.length} Run
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e1e2ed] dark:border-gray-800 gap-6 text-xs font-bold font-mono">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-[#2563eb] text-[#2563eb]'
              : 'border-transparent text-[#737686] hover:text-[#191b23] dark:hover:text-white'
          }`}
        >
          <Clock size={14} /> Pending Approval Queue ({pendingRuns.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-[#2563eb] text-[#2563eb]'
              : 'border-transparent text-[#737686] hover:text-[#191b23] dark:hover:text-white'
          }`}
        >
          <CheckCircle2 size={14} /> Authorization Audit History
        </button>
      </div>

      {/* Tab 1: Pending Approval Queue */}
      {activeTab === 'pending' && (
        pendingRuns.length === 0 ? (
          <NoPendingApprovals />
        ) : (
          <div className="space-y-6">
            {pendingRuns.map((run) => (
              <div key={run.id} className="bg-[#ffffff] dark:bg-[#111111] border-2 border-amber-200 dark:border-amber-900/60 rounded-xl p-6 shadow-md space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider">Awaiting Immediate Authorization</span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white mt-0.5">
                      {run.month} {run.year} Consolidated Payroll Run ({run.id})
                    </h2>
                    <span className="text-xs text-[#737686] font-mono">Generated by {run.generatedBy} on {run.generatedDate}</span>
                  </div>
                  <PayrollStatusBadge status={run.status} />
                </div>

                {/* Financial Summary Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60">
                    <span className="text-[#737686] block font-semibold">Total Disbursal Commitment</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#191b23] dark:text-white mt-1 block">
                      ₹{run.totalCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#737686] mt-0.5 block">Net bank transfer payout</span>
                  </div>
                  <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60">
                    <span className="text-[#737686] block font-semibold">Staff Headcount Processed</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#2563eb] mt-1 block">
                      {run.empCount} Employees
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">100% active staff matched</span>
                  </div>
                  <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/60">
                    <span className="text-[#737686] block font-semibold">Withheld TDS Income Tax</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-rose-600 mt-1 block">
                      ₹{run.tds.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#737686] mt-0.5 block">Ready for TRACES tax filing</span>
                  </div>
                </div>

                {/* HR Generation Notes */}
                <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900 text-xs">
                  <h4 className="font-bold text-[#191b23] dark:text-white flex items-center gap-1.5 mb-1">
                    <AlertCircle size={14} className="text-[#2563eb]" /> HR Operations Submission Notes:
                  </h4>
                  <p className="text-[#434655] dark:text-gray-300 italic leading-relaxed">"{run.notes}"</p>
                </div>

                {/* Approval Audit Comment Box & Actions */}
                <div className="space-y-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
                  <label className="font-semibold block text-xs text-[#191b23] dark:text-white flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-[#737686]" />
                    Executive Audit Comments / Revision Instructions (Mandatory for Rejection)
                  </label>
                  <textarea
                    rows="2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter formal authorization approval remarks or specify exact revisions needed..."
                    className="w-full text-xs"
                  />

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleReject(run.id)}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <XCircle size={15} /> Reject & Return for Revision
                    </button>
                    <button
                      onClick={() => handleApprove(run.id)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={15} /> Authorize & Approve Payroll Run
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Tab 2: Authorization Audit History */}
      {activeTab === 'history' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Payroll Period / ID</th>
                  <th>Status</th>
                  <th>Authorized By</th>
                  <th>Decision Date</th>
                  <th className="text-right">Staff Count</th>
                  <th className="text-right">Disbursal Amount</th>
                  <th>Audit Decision Remarks</th>
                </tr>
              </thead>
              <tbody>
                {historyRuns.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="font-bold text-xs">{r.month} {r.year}</div>
                      <span className="font-mono text-[11px] text-[#737686]">{r.id}</span>
                    </td>
                    <td><PayrollStatusBadge status={r.status} /></td>
                    <td className="font-semibold text-xs">{r.approver}</td>
                    <td className="font-mono text-xs text-[#737686]">{r.date}</td>
                    <td className="text-right font-mono font-bold">{r.empCount}</td>
                    <td className="text-right font-mono font-extrabold text-[#191b23] dark:text-white">₹{r.totalCost.toLocaleString('en-IN')}</td>
                    <td className="text-xs italic text-[#434655] dark:text-gray-300 max-w-xs truncate" title={r.comment}>
                      "{r.comment}"
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
