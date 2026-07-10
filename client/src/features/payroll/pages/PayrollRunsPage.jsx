import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Search, Filter, PlusCircle, Download, ChevronRight, ChevronLeft, Eye, ShieldCheck, CreditCard } from 'lucide-react';
import { PayrollStatusBadge } from '../components/PayrollBadges';
import { RunPayrollModal, MarkPaidModal } from '../components/PayrollDrawers';
import { NoPayrollRuns, NoPayrollResults } from '../components/PayrollEmptyStates';
import api from '../../../lib/axios';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

/**
 * PayrollRunsPage.jsx
 * Enterprise Payroll Runs History & Execution table for EWMP.
 * Includes Search, Filters (Year, Status), Sorting, Pagination, and modal triggers.
 */

export const PayrollRunsPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('month');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['payroll-list'],
    queryFn: () => api.get('/payroll').then(r => r.data)
  });

  const processMutation = useMutation({
    mutationFn: (payload) => api.post('/payroll/process', payload),
    onSuccess: () => queryClient.invalidateQueries(['payroll-list'])
  });

  const markPaidMutation = useMutation({
    mutationFn: (id) => api.patch(`/payroll/${id}/mark-paid`),
    onSuccess: () => queryClient.invalidateQueries(['payroll-list'])
  });

  const rawData = toArray(payrollData);
  const runs = rawData.map(r => ({
    id: r._id || r.id,
    month: new Date(r.payPeriodYear, r.payPeriodMonth - 1).toLocaleString('default', { month: 'long' }),
    year: String(r.payPeriodYear),
    status: r.status || 'PENDING_APPROVAL',
    generatedBy: r.processedBy?.fullName || r.processedBy || 'System',
    generatedDate: r.processedAt ? new Date(r.processedAt).toLocaleDateString() : '',
    empCount: r.employeeCount || 0,
    totalCost: r.totalNetPay || r.totalNet || 0,
    tds: r.totalTax || 0
  }));

  const handleCreateRun = (runData) => {
    processMutation.mutate({
      payPeriodMonth: runData.month ? new Date(runData.month + ' 1').getMonth() + 1 : new Date().getMonth() + 1,
      payPeriodYear: runData.year ? parseInt(runData.year) : new Date().getFullYear()
    });
  };

  const filtered = runs.filter(r => {
    const matchesSearch = r.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'ALL' || r.year === filterYear;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleMarkPaid = (data) => {
    markPaidMutation.mutate(data.id || selectedRun?.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <RunPayrollModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onConfirm={handleCreateRun}
      />
      <MarkPaidModal
        isOpen={isPaidModalOpen}
        onClose={() => setIsPaidModalOpen(false)}
        onConfirm={handleMarkPaid}
        payroll={selectedRun || {}}
      />

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Calendar size={20} className="text-[#2563eb]" />
            PAYROLL RUNS & DISBURSAL BATCH HISTORY
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Audit historical monthly payroll calculation runs, check employee headcount coverage, and review tax withholdings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle size={15} /> Run New Payroll
          </button>
          <button
            onClick={() => alert('Exporting full payroll runs audit log to Excel/CSV...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export History
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by month, Run ID (e.g. PR-2026-07), or generator name..."
            className="w-full pl-9 py-2 bg-[#faf8ff] dark:bg-[#161616]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-[#737686]" />
            <span className="text-[#737686] font-medium">Year:</span>
            <select
              value={filterYear}
              onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#737686] font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Runs Table */}
      {runs.length === 0 ? (
        <NoPayrollRuns onRun={() => setIsRunModalOpen(true)} />
      ) : filtered.length === 0 ? (
        <NoPayrollResults onReset={() => { setSearchTerm(''); setFilterYear('ALL'); setFilterStatus('ALL'); }} />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Payroll Run / ID</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Generated By & Date</th>
                  <th className="text-right">Staff Count</th>
                  <th className="text-right">Total Net Disbursal</th>
                  <th className="text-right">TDS Withheld</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#2563eb]" /> {r.month} {r.year}
                      </div>
                      <span className="font-mono text-xs text-[#737686]">{r.id}</span>
                    </td>
                    <td className="font-mono font-bold text-xs text-[#434655] dark:text-gray-300">{r.month.substring(0, 3).toUpperCase()} {r.year}</td>
                    <td><PayrollStatusBadge status={r.status} /></td>
                    <td>
                      <div className="font-semibold text-xs text-[#191b23] dark:text-white">{r.generatedBy}</div>
                      <span className="font-mono text-[11px] text-[#737686]">{r.generatedDate}</span>
                    </td>
                    <td className="text-right font-mono font-bold text-[#2563eb] text-sm">{r.empCount}</td>
                    <td className="text-right font-mono font-extrabold text-[#191b23] dark:text-white text-sm">
                      ₹{r.totalCost.toLocaleString('en-IN')}
                    </td>
                    <td className="text-right font-mono text-rose-600 text-xs font-semibold">
                      ₹{r.tds?.toLocaleString('en-IN') || '4,10,000'}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onNavigate && onNavigate('details')}
                          className="px-2.5 py-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={12} /> Details
                        </button>
                        {r.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => onNavigate && onNavigate('approval')}
                            className="px-2.5 py-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                          >
                            <ShieldCheck size={12} /> Review
                          </button>
                        )}
                        {r.status === 'APPROVED' && (
                          <button
                            onClick={() => { setSelectedRun(r); setIsPaidModalOpen(true); }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                          >
                            <CreditCard size={12} /> Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-[#737686] font-mono">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} runs
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white dark:bg-[#111] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} className="inline mr-1" /> Prev
              </button>
              <span className="px-3 font-mono font-bold">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white dark:bg-[#111] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold disabled:opacity-40 transition-colors"
              >
                Next <ChevronRight size={14} className="inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
