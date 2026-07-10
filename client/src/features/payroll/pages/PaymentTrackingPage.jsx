import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, Clock, Download, FileText } from 'lucide-react';
import { PayrollStatusBadge, PaymentMethodBadge } from '../components/PayrollBadges';
import { PaymentTimeline } from '../components/PayrollTimelines';
import { MarkPaidModal } from '../components/PayrollDrawers';
import { NoPaymentHistory } from '../components/PayrollEmptyStates';
import api from '../../../lib/axios';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

/**
 * PaymentTrackingPage.jsx
 * Bank Settlement & Disbursal Batch Tracking module for EWMP Payroll Management.
 * Features Paid vs Pending tabs, UTR/Ref tracking, Payment Method badges, and settlement modal.
 */

export const PaymentTrackingPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('paid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['payroll-list'],
    queryFn: () => api.get('/payroll').then(r => r.data)
  });

  const markPaidMutation = useMutation({
    mutationFn: (id) => api.patch(`/payroll/${id}/mark-paid`),
    onSuccess: () => queryClient.invalidateQueries(['payroll-list'])
  });

  const rawList = toArray(payrollData);

  const toBatchShape = r => ({
    id: r._id || r.id,
    month: new Date(r.payPeriodYear, r.payPeriodMonth - 1).toLocaleString('default', { month: 'long' }),
    year: String(r.payPeriodYear),
    totalCost: r.totalNetPay || r.totalNet || 0,
    empCount: r.employeeCount || 0,
    paymentDate: r.paidAt ? new Date(r.paidAt).toLocaleDateString() : '',
    method: r.paymentMethod || 'BANK_TRANSFER',
    refNum: r.paymentRef || r.bankRef || '—',
    notes: r.notes || 'Bank transfer settlement.',
    status: r.status
  });

  const paidBatches = rawList.filter(r => r.status === 'PAID').map(toBatchShape);
  const pendingBatches = rawList.filter(r => r.status === 'APPROVED').map(toBatchShape);

  const handleMarkPaidConfirm = (data) => {
    markPaidMutation.mutate(data.id || selectedRun?.id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <MarkPaidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleMarkPaidConfirm}
        payroll={selectedRun || {}}
      />

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <CreditCard size={20} className="text-[#2563eb]" />
            BANK DISBURSAL & PAYMENT SETTLEMENT TRACKER
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Monitor NACH / NEFT bank transfer clearing batches, track UTR transaction numbers, and audit settlement dates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting bank settlement UTR transaction log to Excel...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export UTR Log
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e1e2ed] dark:border-gray-800 gap-6 text-xs font-bold font-mono">
        <button
          onClick={() => setActiveTab('paid')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'paid'
              ? 'border-[#2563eb] text-[#2563eb]'
              : 'border-transparent text-[#737686] hover:text-[#191b23] dark:hover:text-white'
          }`}
        >
          <CheckCircle2 size={14} /> Settled & Paid Batches ({paidBatches.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-[#2563eb] text-[#2563eb]'
              : 'border-transparent text-[#737686] hover:text-[#191b23] dark:hover:text-white'
          }`}
        >
          <Clock size={14} /> Awaiting Bank Disbursal ({pendingBatches.length})
        </button>
      </div>

      {/* Tab 1: Paid Batches */}
      {activeTab === 'paid' && (
        paidBatches.length === 0 ? (
          <NoPaymentHistory />
        ) : (
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Payroll Period / ID</th>
                    <th>Settlement Date</th>
                    <th>Payment Method</th>
                    <th>Reference / UTR Number</th>
                    <th className="text-right">Staff Count</th>
                    <th className="text-right">Net Paid Out</th>
                    <th>Finance Settlement Notes</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paidBatches.map((batch, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="font-bold text-xs">{batch.month} {batch.year}</div>
                        <span className="font-mono text-[11px] text-[#737686]">{batch.id}</span>
                      </td>
                      <td className="font-mono text-xs font-bold text-emerald-600">{batch.paymentDate}</td>
                      <td><PaymentMethodBadge method={batch.method} /></td>
                      <td className="font-mono text-xs font-bold text-[#191b23] dark:text-white">{batch.refNum}</td>
                      <td className="text-right font-mono font-bold">{batch.empCount}</td>
                      <td className="text-right font-mono font-extrabold text-emerald-600">₹{batch.totalCost.toLocaleString('en-IN')}</td>
                      <td className="text-[11px] text-[#434655] dark:text-gray-300 max-w-xs truncate" title={batch.notes}>
                        {batch.notes}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => alert(`Downloading official bank payment UTR receipt for ${batch.id} (${batch.refNum})...`)}
                          className="px-2.5 py-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                        >
                          <FileText size={12} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Tab 2: Pending Batches */}
      {activeTab === 'pending' && (
        pendingBatches.length === 0 ? (
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-10 text-center text-xs text-[#737686]">
            All authorized payroll runs have been formally settled and disbursed via bank transfer.
          </div>
        ) : (
          <div className="space-y-6">
            {pendingBatches.map((b) => (
              <div key={b.id} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#2563eb] block uppercase tracking-wider">Ready For Bank NACH Batch Upload</span>
                    <h2 className="text-base sm:text-lg font-bold text-[#191b23] dark:text-white mt-0.5">
                      {b.month} {b.year} Authorized Disbursal Batch ({b.id})
                    </h2>
                    <span className="text-xs text-[#737686]">{b.notes}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedRun(b); setIsModalOpen(true); }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} /> Enter UTR & Mark Paid
                  </button>
                </div>

                {/* Settlement Progress Tracking */}
                <PaymentTimeline batchId={b.id} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
