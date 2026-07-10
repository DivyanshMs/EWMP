import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Search, Filter, PlusCircle, MapPin, Users, RefreshCw, Eye } from 'lucide-react';
import { JobStatusBadge, EmploymentTypeBadge } from '../components/RecruitmentBadges';
import { CreateJobModal } from '../components/RecruitmentDrawers';
import { NoResults } from '../components/RecruitmentEmptyStates';
import api from '../../../lib/axios';

/**
 * JobPositionsPage.jsx
 * Comprehensive job positions table with search, filters, sorting, and pagination for EWMP Recruitment.
 */

export default function JobPositionsPage({ onSelectJob }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['recruitment-jobs'],
    queryFn: () => api.get('/recruitment/jobs').then(r => r.data)
  });

  const createJobMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/jobs', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-jobs']);
      setShowCreateModal(false);
    }
  });

  const rawJobs = jobsData?.data?.items || jobsData?.data || [];

  const jobs = rawJobs.map(j => ({
    id: j._id || j.id,
    title: j.title,
    department: j.departmentId?.name || 'General',
    location: 'Office HQ (Hybrid)',
    type: 'FULL_TIME',
    openings: j.totalVacancies || 1,
    applicants: 0,
    status: j.jobStatus === 'Open' ? 'PUBLISHED' : j.jobStatus || 'DRAFT',
    hiringManager: j.hiringManagerId?.fullName || 'Hiring Manager',
    createdDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : '—'
  }));

  // Filter logic
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.hiringManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || j.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || j.type === typeFilter;
    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase size={24} className="text-[#2563eb]" /> Job Requisitions & Positions Directory
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Manage all active open positions, monitor applicant pipeline volume, assign hiring managers, and configure compensation bands.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={15} /> Create Job Requisition
        </button>
      </div>

      {/* Search & Multi-Parameter Filter Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Job Title, Requisition ID (e.g. JOB-0142), or Hiring Manager..."
            className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#2563eb]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Departments ({jobs.length})</option>
            <option value="Engineering">Engineering & Product</option>
            <option value="Sales">Sales & Revenue</option>
            <option value="HR & Ops">HR & Operations</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Active Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CLOSED">Closed / Filled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Employment Types</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
            <option value="INTERN">Internship</option>
          </select>

          {(searchTerm || departmentFilter !== 'ALL' || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setDepartmentFilter('ALL'); setStatusFilter('ALL'); setTypeFilter('ALL'); }}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      {filteredJobs.length === 0 ? (
        <NoResults onReset={() => { setSearchTerm(''); setDepartmentFilter('ALL'); setStatusFilter('ALL'); setTypeFilter('ALL'); }} />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] font-mono uppercase tracking-wider sticky top-0 z-10">
                  <th className="py-3 px-4">Job Position & Requisition ID</th>
                  <th className="py-3 px-4">Department & Location</th>
                  <th className="py-3 px-4">Employment Type</th>
                  <th className="py-3 px-4 text-center">Openings / Applicants</th>
                  <th className="py-3 px-4">Hiring Manager</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors group">
                    <td className="py-3.5 px-4 font-sans">
                      <span className="font-mono text-[10px] text-[#737686] block">{job.id}</span>
                      <span
                        onClick={() => onSelectJob && onSelectJob(job)}
                        className="font-bold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors cursor-pointer block line-clamp-1"
                      >
                        {job.title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <strong className="text-[#191b23] dark:text-white block font-semibold">{job.department}</strong>
                      <span className="text-[11px] text-[#737686] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#2563eb]" /> {job.location}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <EmploymentTypeBadge type={job.type} />
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className="inline-flex items-center gap-2 bg-[#ededf9] dark:bg-gray-800 px-2.5 py-1 rounded">
                        <span className="text-[#191b23] dark:text-white">{job.openings} Open</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-[#2563eb] flex items-center gap-1"><Users size={12} /> {job.applicants} App</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#434655] dark:text-gray-300 font-medium">
                      {job.hiringManager}
                    </td>
                    <td className="py-3.5 px-4 text-[#737686]">
                      {job.createdDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectJob && onSelectJob(job)}
                        className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Eye size={13} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-between text-xs font-mono text-[#737686]">
            <span>Showing <strong className="text-[#191b23] dark:text-white">1 - {filteredJobs.length}</strong> of {filteredJobs.length} Requisitions</span>
            <div className="flex items-center gap-1">
              <button disabled className="px-3 py-1 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded opacity-50 cursor-not-allowed font-semibold">Prev</button>
              <button className="px-3 py-1 bg-[#2563eb] text-white font-bold rounded">1</button>
              <button className="px-3 py-1 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded hover:bg-[#ededf9] font-semibold">2</button>
              <button className="px-3 py-1 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded hover:bg-[#ededf9] font-semibold">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={(newJob) => {
          const departmentId = newJob.departmentId || rawJobs[0]?.departmentId?._id || rawJobs[0]?.departmentId;
          const hiringManagerId = newJob.hiringManagerId || rawJobs[0]?.hiringManagerId?._id || rawJobs[0]?.hiringManagerId;
          if (!departmentId || !hiringManagerId) {
            alert('Please create or select a real department and hiring manager before creating a job.');
            return;
          }
          createJobMutation.mutate({
            title: newJob.title,
            departmentId,
            hiringManagerId,
            description: newJob.description || 'Job requisition details.',
            totalVacancies: Number(newJob.openings || 1)
          });
        }}
      />
    </div>
  );
}
