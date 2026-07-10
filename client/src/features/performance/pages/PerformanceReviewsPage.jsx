import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Search, Filter, PlusCircle, Download, ChevronRight, ChevronLeft, Eye, Edit3, User } from 'lucide-react';
import { ReviewStatusBadge, RatingBadge } from '../components/PerformanceBadges';
import { CreateReviewModal } from '../components/PerformanceDrawers';
import { NoReviews, NoResults } from '../components/PerformanceEmptyStates';
import api from '../../../lib/axios';

/**
 * PerformanceReviewsPage.jsx
 * Enterprise Performance Reviews Table & Administration queue for EWMP.
 * Features Search, Multi-parameter Filters, Sorting, Pagination, and modal triggers.
 */

export const PerformanceReviewsPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCycle, setFilterCycle] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['performance-reviews'],
    queryFn: () => api.get('/performance/reviews').then(r => r.data)
  });

  const createReviewMutation = useMutation({
    mutationFn: (payload) => api.post('/performance/reviews', payload),
    onSuccess: () => { queryClient.invalidateQueries(['performance-reviews']); setIsModalOpen(false); }
  });

  const rawList = reviewsData?.data?.items || reviewsData?.data || [];

  const reviews = rawList.map(r => ({
    id: r._id || r.id,
    employee: r.employee?.fullName || r.employee?.firstName + ' ' + r.employee?.lastName || 'Employee',
    designation: r.employee?.jobTitle || r.employee?.designation || 'Staff',
    dept: r.employee?.department?.name || 'General',
    reviewer: r.reviewer?.fullName || 'Manager',
    cycle: `${r.quarter} ${r.year}`,
    rating: r.managerRating || r.selfRating || 0,
    status: r.reviewStatus || 'Draft',
    subDate: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Pending',
    goals: '—'
  }));

  const filtered = reviews.filter(r => {
    const matchesSearch = r.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || r.dept === filterDept;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesCycle = filterCycle === 'ALL' || r.cycle === filterCycle;
    return matchesSearch && matchesDept && matchesStatus && matchesCycle;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateReview = (newRev) => {
    createReviewMutation.mutate(newRev);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <CreateReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateReview}
      />

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-[#2563eb]" />
            EMPLOYEE PERFORMANCE REVIEWS & APPRAISALS TABLE
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Audit half-yearly and annual performance evaluations, verify goal completion rates, and manage manager calibration workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle size={15} /> Launch Review Cycle
          </button>
          <button
            onClick={() => alert('Exporting complete performance reviews dataset to Excel/CSV...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export Dataset
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by Employee name, Review ID (e.g. REV-0142), Reviewer, or Designation..."
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
              <option value="Sales">Sales</option>
              <option value="HR & Ops">HR & Ops</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#737686] font-medium">Cycle:</span>
            <select
              value={filterCycle}
              onChange={(e) => { setFilterCycle(e.target.value); setCurrentPage(1); }}
              className="py-1.5 bg-white dark:bg-[#161616] font-semibold"
            >
              <option value="ALL">All Cycles</option>
              <option value="H1 2026 Appraisal">H1 2026 Appraisal</option>
              <option value="Annual FY 2025">Annual FY 2025</option>
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
              <option value="SELF_REVIEW_PENDING">Self Review Pending</option>
              <option value="MANAGER_REVIEW_PENDING">Manager Review Pending</option>
              <option value="HR_REVIEW_PENDING">HR Review Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      {reviews.length === 0 ? (
        <NoReviews onCreate={() => setIsModalOpen(true)} />
      ) : filtered.length === 0 ? (
        <NoResults onReset={() => { setSearchTerm(''); setFilterDept('ALL'); setFilterStatus('ALL'); setFilterCycle('ALL'); }} />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Employee / Review ID</th>
                  <th>Department & Role</th>
                  <th>Assigned Reviewer</th>
                  <th>Review Cycle</th>
                  <th>Overall Rating</th>
                  <th>KPIs Met</th>
                  <th>Workflow Status</th>
                  <th>Submission Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-1.5">
                        <User size={14} className="text-[#2563eb]" /> {r.employee}
                      </div>
                      <span className="font-mono text-xs text-[#737686]">{r.id}</span>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-[#191b23] dark:text-white">{r.dept}</div>
                      <span className="text-[11px] text-[#737686] block max-w-[150px] truncate">{r.designation}</span>
                    </td>
                    <td className="font-semibold text-xs text-[#434655] dark:text-gray-300">{r.reviewer}</td>
                    <td className="font-mono font-bold text-xs text-[#2563eb]">{r.cycle}</td>
                    <td><RatingBadge rating={r.rating} /></td>
                    <td className="font-mono font-extrabold text-xs text-emerald-600">{r.goals}</td>
                    <td><ReviewStatusBadge status={r.status} /></td>
                    <td className="font-mono text-xs text-[#737686]">{r.subDate}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onNavigate && onNavigate('review-details', r)}
                          className="px-2.5 py-1 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={12} /> View
                        </button>
                        {r.status === 'SELF_ASSESSMENT_PENDING' && (
                          <button
                            onClick={() => onNavigate && onNavigate('self-assessment', r)}
                            className="px-2.5 py-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 size={12} /> Assess Self
                          </button>
                        )}
                        {['MANAGER_REVIEW_PENDING', 'Self-Assessment Pending', 'Manager Review Pending'].includes(r.status) && (
                          <button
                            onClick={() => onNavigate && onNavigate('manager-evaluation', r)}
                            className="px-2.5 py-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 size={12} /> Evaluate
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} reviews
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
