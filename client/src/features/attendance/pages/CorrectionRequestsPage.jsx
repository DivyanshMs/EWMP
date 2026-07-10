import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';

import { CorrectionCard } from '../components/AttendanceCards';
import { AttendanceEmptyState } from '../components/AttendanceEmptyStates';
import { AttendanceStatusBadge } from '../components/AttendanceBadges';

/**
 * CorrectionRequestsPage.jsx
 * Page 5: Enterprise attendance regularization and correction request queue for EWMP.
 * Displays Request List with Employee, Date, Reason, Status, Manager, Submitted Date, and Approval Timeline.
 * Allows managers to Approve, Reject, and post audit Comments.
 */

const getItems = (payload) => payload?.data?.items || payload?.data || [];
const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
};
const nameFor = (employee) =>
  [employee?.firstName, employee?.lastName].filter(Boolean).join(' ') ||
  employee?.name ||
  employee?.employeeCode ||
  'Employee';
const mapCorrection = (record) => ({
  id: record._id || record.id,
  employeeId: record.employeeId?.employeeCode || record.employeeId?._id || 'Employee',
  employeeName: nameFor(record.employeeId),
  department: record.employeeId?.departmentId?.name || 'Unassigned',
  photoUrl: record.employeeId?.photoUrl || null,
  targetDate: formatDate(record.date),
  submittedDate: formatDate(record.updatedAt || record.createdAt),
  requestedChange: 'Attendance correction requested',
  reason: record.correctionRequestId?.correctionNotes || record.correctionNotes || 'Correction details are stored in the attendance record.',
  status: record.correctionStatus === 'Pending' ? 'Pending Review' : record.correctionStatus || 'Pending Review',
  manager: record.correctionApprovedBy ? nameFor(record.correctionApprovedBy) : 'Approver queue',
  timeline: [
    `Created: ${formatDate(record.createdAt)}`,
    record.correctionStatus ? `Correction status: ${record.correctionStatus}` : 'Correction submitted',
  ],
});

export const CorrectionRequestsPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending Review');

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-correction-requests'],
    queryFn: () => api.get('/attendance', { params: { limit: 100, correctionStatus: 'Pending' } }).then((res) => res.data),
  });

  const requests = useMemo(() => getItems(data).filter((record) => record.correctionStatus).map(mapCorrection), [data]);

  const correctionMutation = useMutation({
    mutationFn: ({ id, approved, notes }) => api.patch(`/attendance/${id}/correction/approve`, { approved, approverNotes: notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance-correction-requests'] }),
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        req.employeeName.toLowerCase().includes(q) ||
        req.employeeId.toLowerCase().includes(q) ||
        req.department.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q) ||
        req.requestedChange.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || req.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleApprove = (req) => {
    if (window.confirm(`Approve attendance regularization for ${req.employeeName} (${req.targetDate})?`)) {
      correctionMutation.mutate({ id: req.id, approved: true, notes: 'Approved from correction queue.' });
    }
  };

  const handleReject = (req) => {
    const reason = window.prompt(`Enter rejection justification for ${req.employeeName}:`);
    if (reason !== null) {
      correctionMutation.mutate({ id: req.id, approved: false, notes: reason || 'Rejected from correction queue.' });
    }
  };

  const handleComment = (req, comment) => {
    if (!comment || !comment.trim()) return;
    correctionMutation.mutate({ id: req.id, approved: true, notes: comment.trim() });
  };

  const handleBulkApproveAllPending = () => {
    const pendingCount = requests.filter((r) => r.status === 'Pending Review').length;
    if (pendingCount === 0) {
      alert('No pending correction requests in queue.');
      return;
    }
    if (window.confirm(`Authorize and approve all ${pendingCount} pending attendance regularization requests?`)) {
      requests
        .filter((item) => item.status === 'Pending Review')
        .forEach((item) => correctionMutation.mutate({ id: item.id, approved: true, notes: 'Bulk approved from correction queue.' }));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Regularization Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileText className="text-blue-600 dark:text-blue-400 shrink-0" size={30} />
            Attendance Correction Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Review and resolve employee time regularization requests, offline kiosk manual overrides, geofence boundary exceptions, and overtime claims.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleBulkApproveAllPending}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Approve All Pending ({requests.filter((r) => r.status === 'Pending Review').length})</span>
          </button>
        </div>
      </div>

      {/* 2. Status Pills Filter & Search Bar */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { label: 'Pending Review', count: requests.filter((r) => r.status === 'Pending Review').length },
              { label: 'All', count: requests.length },
              { label: 'Approved', count: requests.filter((r) => r.status === 'Approved').length },
              { label: 'Rejected', count: requests.filter((r) => r.status === 'Rejected').length },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.label)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold font-mono transition-all shrink-0 flex items-center gap-2 ${
                  statusFilter === tab.label
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-[#161616] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-lg text-[10px] ${statusFilter === tab.label ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee, reason, date..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Request Card Queue */}
      {isLoading || filteredRequests.length === 0 ? (
        <AttendanceEmptyState
          type="corrections"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('All');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <CorrectionCard
              key={req.id}
              request={req}
              onApprove={handleApprove}
              onReject={handleReject}
              onComment={handleComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CorrectionRequestsPage;
