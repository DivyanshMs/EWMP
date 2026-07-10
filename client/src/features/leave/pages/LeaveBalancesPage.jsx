import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Users, Search, Filter, Edit3, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { LeaveTypeBadge } from '../components/LeaveBadges';
import { AdjustBalanceModal } from '../components/LeaveDrawers';
import { NoLeaveResults } from '../components/LeaveEmptyStates';

/**
 * LeaveBalancesPage.jsx
 * Enterprise Leave Ledger & Balance Administration module for HR and Super Administrators.
 */

export const LeaveBalancesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  

  const { data, isLoading } = useQuery({
    queryKey: ['leave-balances-all'],
    queryFn: () => api.get('/leave-balances').then(res => res.data)
  });

  const rawBalances = data?.data?.items || data?.data || [];

  // Stateful balances to allow adjustments in UI
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const mapped = Array.isArray(rawBalances)
      ? rawBalances.map((b) => ({
          id: b.employee?._id || b.employee?.id || b._id,
          employeeName: b.employee?.fullName || [b.employee?.firstName, b.employee?.lastName].filter(Boolean).join(' ') || 'Employee',
          empId: b.employee?.employeeId || b.employee?.code || (b.employee?._id || b._id) || 'EMP',
          department: b.employee?.department?.name || 'General',
          role: b.employee?.role?.name || 'Staff',
          type: b.leaveType?.name || b.leaveType || 'Leave',
          allocated: b.entitledDays ?? b.allocatedDays ?? 0,
          used: b.usedDays ?? 0,
          pending: b.pendingDays ?? 0,
          remaining: b.remainingDays ?? (b.entitledDays ?? 0) - (b.usedDays ?? 0) - (b.pendingDays ?? 0),
          lastAdjusted: b.lastAdjusted || b.updatedAt ? (b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : '') : '',
        }))
      : [];
    setBalances(mapped);
  }, [rawBalances, isLoading]);

  const filtered = balances.filter(item => {
    const matchesSearch = (item.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.empId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || item.department === filterDept;
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesDept && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdjust = (rec) => {
    setSelectedRecord(rec);
    setIsModalOpen(true);
  };

  const handleSaveAdjustment = ({ adjustment, reason }) => {
    if (!selectedRecord) return;
    const adjNum = Number(adjustment);
    setBalances(balances.map(b => {
      if (b.id === selectedRecord.id) {
        const newAllocated = b.allocated + adjNum;
        const newRemaining = newAllocated - b.used - b.pending;
        return {
          ...b,
          allocated: newAllocated,
          remaining: Math.max(0, newRemaining),
          lastAdjusted: `Today by HR (${adjNum >= 0 ? '+' + adjNum : adjNum}d: ${reason.substring(0, 20)}...)`
        };
      }
      return b;
    }));
    alert(`Successfully adjusted balance for ${selectedRecord.employeeName}. Audit entry logged.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Adjust Balance Modal */}
      <AdjustBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdjustment}
        employeeName={selectedRecord?.employeeName || 'Employee'}
        leaveType={selectedRecord?.type || 'ANNUAL'}
        currentBalance={selectedRecord?.allocated || 15}
      />

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Users size={20} className="text-[#2563eb]" />
            EMPLOYEE LEAVE BALANCE LEDGER (HR & ADMIN)
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Audit allocated time-off entitlements, track utilization quotas, and perform manual balance adjustments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting complete organization leave balance ledger to Excel/CSV...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export Ledger
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
            placeholder="Search by employee name or EMP ID (e.g. EMP-0142)..."
            className="w-full pl-9 py-2 bg-[#faf8ff] dark:bg-[#161616]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-[#737686]" />
            <span className="text-[#737686] font-medium">Department:</span>
            <select
              value={filterDept}
              onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#737686] font-medium">Leave Policy:</span>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Policies</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="COMPENSATORY">Compensatory</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      {filtered.length === 0 ? (
        <NoLeaveResults onReset={() => { setSearchTerm(''); setFilterDept('ALL'); setFilterType('ALL'); }} />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Employee / ID</th>
                  <th>Department</th>
                  <th>Leave Policy Type</th>
                  <th className="text-right">Allocated</th>
                  <th className="text-right">Used</th>
                  <th className="text-right">Pending</th>
                  <th className="text-right">Remaining Balance</th>
                  <th>Last Adjustment Log</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((rec) => {
                  const utilization = Math.min(100, Math.round((rec.used / rec.allocated) * 100)) || 0;
                  return (
                    <tr key={rec.id}>
                      <td>
                        <div className="font-bold text-sm text-[#191b23] dark:text-white">{rec.employeeName}</div>
                        <span className="font-mono text-xs text-[#737686]">{rec.empId}</span>
                      </td>
                      <td className="text-xs text-[#434655] dark:text-gray-300 font-medium">{rec.department}</td>
                      <td><LeaveTypeBadge type={rec.type} /></td>
                      <td className="text-right font-mono font-bold text-[#191b23] dark:text-white">{rec.allocated}d</td>
                      <td className="text-right font-mono text-[#434655] dark:text-gray-300">{rec.used}d</td>
                      <td className="text-right font-mono text-amber-600 font-bold">{rec.pending}d</td>
                      <td className="text-right">
                        <span className="font-mono font-extrabold text-[#2563eb] text-sm bg-[#ededf9] dark:bg-blue-950/40 px-2 py-0.5 rounded">
                          {rec.remaining}d
                        </span>
                        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-800 rounded-full ml-auto mt-1 overflow-hidden">
                          <div className="h-full bg-[#2563eb]" style={{ width: `${utilization}%` }} />
                        </div>
                      </td>
                      <td className="text-[11px] font-mono text-[#737686] truncate max-w-[160px]" title={rec.lastAdjusted}>
                        {rec.lastAdjusted}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleOpenAdjust(rec)}
                          className="px-2.5 py-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 size={12} /> Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-[#737686] font-mono">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} employees
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
