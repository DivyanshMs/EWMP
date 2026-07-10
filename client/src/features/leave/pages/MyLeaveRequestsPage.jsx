import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { History, Search, Filter, ChevronRight, Download, PlusCircle } from 'lucide-react';
import { LeaveStatusBadge, LeaveTypeBadge, LeaveDurationBadge } from '../components/LeaveBadges';
import { NoLeaveRequests, NoLeaveResults } from '../components/LeaveEmptyStates';

/**
 * MyLeaveRequestsPage.jsx
 * Employee leave request history ledger with multi-column filtering, search, pagination, and cancellation support.
 */

export const MyLeaveRequestsPage = ({ onApply, onSelectRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterYear, setFilterYear] = useState('2026');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [requests, setRequests] = useState([
    { id: 'LR-8091', type: 'ANNUAL', startDate: '2026-07-15', endDate: '2026-07-19', days: 5, status: 'APPROVED', reason: 'Family vacation to Goa with advance booking.', managerComment: 'Approved. Handover plan verified.', submittedAt: '2026-07-01' },
    { id: 'LR-8104', type: 'SICK', startDate: '2026-07-08', endDate: '2026-07-08', days: 1, status: 'PENDING', reason: 'Severe viral fever and migraine. Medical certificate attached.', managerComment: 'Under HR verification.', submittedAt: '2026-07-07' },
    { id: 'LR-7955', type: 'CASUAL', startDate: '2026-06-20', endDate: '2026-06-20', days: 0.5, isHalfDay: true, status: 'APPROVED', reason: 'Personal banking work in afternoon session.', managerComment: 'Approved for 2nd half.', submittedAt: '2026-06-18' },
    { id: 'LR-7422', type: 'ANNUAL', startDate: '2026-05-10', endDate: '2026-05-14', days: 5, status: 'APPROVED', reason: 'Attending cousin wedding in hometown.', managerComment: 'Approved by reporting manager.', submittedAt: '2026-04-25' },
    { id: 'LR-6981', type: 'COMPENSATORY', startDate: '2026-04-03', endDate: '2026-04-03', days: 1, status: 'REJECTED', reason: 'Taking comp-off for Sunday release.', managerComment: 'Rejected due to critical customer audit week. Please reschedule.', submittedAt: '2026-03-29' },
    { id: 'LR-6500', type: 'SICK', startDate: '2026-03-12', endDate: '2026-03-13', days: 2, status: 'APPROVED', reason: 'Dental surgery and post-op recovery.', managerComment: 'Medical doc verified.', submittedAt: '2026-03-10' },
    { id: 'LR-6102', type: 'CASUAL', startDate: '2026-02-14', endDate: '2026-02-14', days: 1, status: 'CANCELLED', reason: 'Personal leave cancelled by employee.', managerComment: 'Cancelled upon employee request.', submittedAt: '2026-02-10' },
  ]);

  // Filter logic
  const filtered = requests.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || req.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
    const matchesYear = req.startDate.startsWith(filterYear);
    return matchesSearch && matchesType && matchesStatus && matchesYear;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCancelRequest = (id) => {
    if (window.confirm(`Are you sure you want to cancel leave request ${id}? This action will release reserved balances immediately.`)) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: 'CANCELLED', managerComment: 'Cancelled by employee before commencement.' } : r));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & New Application Button */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <History size={20} className="text-[#2563eb]" />
            MY LEAVE REQUESTS & AUDIT HISTORY
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Track all submitted leave applications, managerial review feedback, and authorization timestamps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onApply}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle size={15} /> New Leave Application
          </button>
          <button
            onClick={() => alert('Exporting personal leave ledger to CSV...')}
            className="px-3 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
            title="Export CSV Report"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by request ID (e.g. LR-8091) or reason keyword..."
            className="w-full pl-9 py-2 bg-[#faf8ff] dark:bg-[#161616]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-[#737686]" />
            <span className="text-[#737686] font-medium">Type:</span>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Leave Types</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="COMPENSATORY">Compensatory</option>
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
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#737686] font-medium">Year:</span>
            <select
              value={filterYear}
              onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-mono font-bold"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table Section */}
      {filtered.length === 0 ? (
        <NoLeaveResults onReset={() => { setSearchTerm(''); setFilterType('ALL'); setFilterStatus('ALL'); }} />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Leave Policy Type</th>
                  <th>Date Range & Duration</th>
                  <th>Submitted</th>
                  <th>Authorization Status</th>
                  <th>Manager Review Comment</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((req) => (
                  <tr key={req.id}>
                    <td className="font-mono font-bold text-[#2563eb]">{req.id}</td>
                    <td><LeaveTypeBadge type={req.type} /></td>
                    <td>
                      <div className="font-mono font-bold text-[#191b23] dark:text-white">
                        {req.startDate} — {req.endDate}
                      </div>
                      <div className="mt-1"><LeaveDurationBadge days={req.days} isHalfDay={req.isHalfDay} /></div>
                    </td>
                    <td className="font-mono text-xs text-[#737686]">{req.submittedAt}</td>
                    <td><LeaveStatusBadge status={req.status} /></td>
                    <td className="max-w-xs">
                      <p className="text-xs text-[#434655] dark:text-gray-300 truncate italic" title={req.managerComment}>
                        "{req.managerComment || 'Awaiting managerial review'}"
                      </p>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded border border-rose-200 dark:border-rose-800 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => onSelectRequest ? onSelectRequest(req) : alert(`Opening full approval timeline & audit log for ${req.id}...`)}
                          className="text-xs font-semibold text-[#2563eb] hover:text-[#004ac6] bg-[#ededf9] dark:bg-gray-800 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          View Audit <ChevronRight size={13} />
                        </button>
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} records
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white dark:bg-[#111] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 font-mono font-bold">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white dark:bg-[#111] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
