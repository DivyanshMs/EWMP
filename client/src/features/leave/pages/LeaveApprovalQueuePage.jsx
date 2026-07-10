import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { CheckCircle2, Search, Filter, Clock } from 'lucide-react';
import { ApprovalCard } from '../components/LeaveCards';
import { LeaveStatusBadge, LeaveTypeBadge, LeaveDurationBadge } from '../components/LeaveBadges';
import { NoPendingApprovals, NoLeaveResults } from '../components/LeaveEmptyStates';
import { LeaveApprovalDrawer } from '../components/LeaveDrawers';

/**
 * LeaveApprovalQueuePage.jsx
 * Managerial and HR authorization hub for reviewing and bulk-approving employee leave applications.
 */

export const LeaveApprovalQueuePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [queue, setQueue] = useState([
    { id: 'LR-8104', employeeName: 'John DevOps', department: 'Engineering', designation: 'DevOps Engineer', type: 'SICK', startDate: '2026-07-08', endDate: '2026-07-08', days: 1, status: 'PENDING', reason: 'Severe viral fever and migraine. Doctor prescribed 24 hours complete rest.', submittedAt: '2026-07-07' },
    { id: 'LR-8112', employeeName: 'Emily HR Specialist', department: 'Human Resources', designation: 'Senior HR Associate', type: 'CASUAL', startDate: '2026-07-14', endDate: '2026-07-15', days: 2, status: 'PENDING', reason: 'Attending family religious function in hometown.', submittedAt: '2026-07-06' },
    { id: 'LR-8125', employeeName: 'Alex Frontend Dev', department: 'Engineering', designation: 'SDE-I', type: 'ANNUAL', startDate: '2026-07-20', endDate: '2026-07-24', days: 5, status: 'PENDING', reason: 'Annual vacation trip to Himachal. All sprint tasks completed.', submittedAt: '2026-07-05' },
    { id: 'LR-8130', employeeName: 'David Finance Mgr', department: 'Finance', designation: 'Finance Controller', type: 'COMPENSATORY', startDate: '2026-07-22', endDate: '2026-07-22', days: 1, status: 'PENDING', reason: 'Comp-off against Saturday audit closure work.', submittedAt: '2026-07-04' },
  ]);

  const filtered = queue.filter(item => {
    const matchesSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || item.department === filterDept;
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesDept && matchesType && item.status === 'PENDING';
  });

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(item => item.id));
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApprove = (request, comment = 'Approved by manager') => {
    setQueue(queue.map(item => item.id === request.id ? { ...item, status: 'APPROVED' } : item));
    setSelectedIds(selectedIds.filter(id => id !== request.id));
  };

  const handleReject = (request, comment = 'Rejected by manager') => {
    setQueue(queue.map(item => item.id === request.id ? { ...item, status: 'REJECTED' } : item));
    setSelectedIds(selectedIds.filter(id => id !== request.id));
  };

  const handleRequestInfo = (request) => {
    const question = window.prompt(`Enter clarifying question or missing information request for ${request.employeeName}:`, 'Please provide doctor prescription or confirm handover contact person.');
    if (question) {
      setQueue(queue.map(item => item.id === request.id ? { ...item, status: 'INFO_REQUESTED' } : item));
      alert(`Information request sent to ${request.employeeName}. Status changed to INFO REQUESTED.`);
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Authorize and approve ${selectedIds.length} selected employee leave applications simultaneously?`)) {
      setQueue(queue.map(item => selectedIds.includes(item.id) ? { ...item, status: 'APPROVED' } : item));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Approval Drawer Modal */}
      <LeaveApprovalDrawer
        request={activeRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Header & Bulk Actions Toolbar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono">
              {filtered.length} Pending Actions
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-[#2563eb]" />
            LEAVE APPROVAL QUEUE (MANAGERIAL AUTHORIZATION)
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Review supporting documentation, evaluate team availability schedules, and authorize time-off applications.
          </p>
        </div>

        {/* Bulk Approval Action Button */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-[#2563eb] p-3 rounded-lg flex items-center gap-3 animate-fade-in shadow-sm">
            <span className="text-xs font-bold text-[#2563eb] dark:text-blue-300 font-mono">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={handleBulkApprove}
              className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-all"
            >
              <CheckCircle2 size={15} /> Bulk Authorize & Approve ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name, department, or request ID..."
            className="w-full pl-9 py-2 bg-[#faf8ff] dark:bg-[#161616]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-[#737686]" />
            <span className="text-[#737686] font-medium">Department:</span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#737686] font-medium">Policy Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Leave Types</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="COMPENSATORY">Compensatory</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Display Content */}
      {filtered.length === 0 ? (
        <NoPendingApprovals />
      ) : (
        <div className="space-y-4">
          {/* Select All Bar for table/cards */}
          <div className="px-4 py-2.5 bg-[#ededf9] dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg flex items-center justify-between text-xs font-semibold text-[#434655] dark:text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === filtered.length && filtered.length > 0}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 text-[#2563eb] rounded border-gray-300 focus:ring-[#2563eb]"
              />
              <span>Select All ({filtered.length} Requests in Queue)</span>
            </label>
            <span className="font-mono text-[#737686]">Click any card or row to open full audit drawer</span>
          </div>

          {/* Grid of Approval Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="relative group">
                {/* Selection Checkbox Overlay */}
                <div className="absolute top-4 right-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleToggleSelect(item.id)}
                    className="w-4 h-4 text-[#2563eb] rounded border-gray-300 focus:ring-[#2563eb] cursor-pointer shadow-sm"
                  />
                </div>

                <div onClick={() => { setActiveRequest(item); setIsDrawerOpen(true); }} className="cursor-pointer">
                  <ApprovalCard
                    request={item}
                    onApprove={(req) => { handleApprove(req); }}
                    onReject={(req) => { handleReject(req); }}
                    onRequestInfo={(req) => { handleRequestInfo(req); }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
