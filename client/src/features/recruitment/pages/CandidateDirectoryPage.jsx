import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, Filter, PlusCircle, FileText, Mail, Eye, RefreshCw } from 'lucide-react';
import { StageBadge } from '../components/RecruitmentBadges';
import { AddCandidateModal, ResumeViewerModal } from '../components/RecruitmentDrawers';
import { NoResults } from '../components/RecruitmentEmptyStates';
import api from '../../../lib/axios';

/**
 * CandidateDirectoryPage.jsx
 * Comprehensive talent ledger and applicant database for EWMP Recruitment.
 */

export default function CandidateDirectoryPage({ onSelectCandidate }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [expFilter, setExpFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResumeCand, setSelectedResumeCand] = useState(null);

  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['recruitment-candidates'],
    queryFn: () => api.get('/recruitment/candidates').then(r => r.data)
  });

  const addCandidateMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/candidates', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
      setShowAddModal(false);
    }
  });

  const rawList = candidatesData?.data?.items || candidatesData?.data || [];

  const candidates = rawList.map(c => ({
    id: c._id || c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    phone: c.mobile || '—',
    appliedRole: c.appliedForDesignation?.title || 'General Position',
    experience: String(c.experience || 0),
    stage: c.recruitmentStatus || 'Applied',
    resume: 'Resume.pdf',
    status: c.recruitmentStatus === 'Joined' ? 'Hired' : c.recruitmentStatus === 'Rejected' ? 'Archived' : 'Active',
    photo: ''
  }));

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.appliedRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || c.stage === stageFilter;
    const matchesExp = expFilter === 'ALL' || (expFilter === 'SENIOR' && Number(c.experience) >= 6) || (expFilter === 'JUNIOR' && Number(c.experience) < 6);
    return matchesSearch && matchesStage && matchesExp;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2">
            <Users size={24} className="text-[#2563eb]" /> Candidate Talent Directory
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Search across {candidates.length} candidate profiles, inspect parsed resumes, check interview progress, and manage talent pool pipelines.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={15} /> Add Candidate Profile
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Candidate Name, Email, ID (e.g. CAN-0142), or Applied Job Role..."
            className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#2563eb]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Hiring Stages ({candidates.length})</option>
            <option value="APPLIED">1. Applied</option>
            <option value="SCREENING">2. HR Screening</option>
            <option value="INTERVIEW">3. Manager Interview</option>
            <option value="TECHNICAL_ROUND">4. Tech / Case Round</option>
            <option value="HR_ROUND">5. HR Final Round</option>
            <option value="OFFER">6. Offer Extended</option>
            <option value="HIRED">★ Hired</option>
            <option value="REJECTED">✕ Rejected</option>
          </select>

          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Experience Levels</option>
            <option value="SENIOR">Senior / Principal (6+ Yrs)</option>
            <option value="JUNIOR">Mid / Junior (0-5 Yrs)</option>
          </select>

          {(searchTerm || stageFilter !== 'ALL' || expFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setStageFilter('ALL'); setExpFilter('ALL'); }}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Candidates Table */}
      {filteredCandidates.length === 0 ? (
        <NoResults onReset={() => { setSearchTerm(''); setStageFilter('ALL'); setExpFilter('ALL'); }} />
      ) : (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] font-mono uppercase tracking-wider sticky top-0 z-10">
                  <th className="py-3 px-4">Candidate Profile & Contact</th>
                  <th className="py-3 px-4">Applied Job Position</th>
                  <th className="py-3 px-4 text-center">Experience</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Resume / CV Document</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors group">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563eb] to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs font-mono">
                          {cand.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-[#737686] block">{cand.id}</span>
                          <span
                            onClick={() => onSelectCandidate && onSelectCandidate(cand)}
                            className="font-bold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors cursor-pointer block"
                          >
                            {cand.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#737686] flex items-center gap-1 mt-0.5">
                            <Mail size={11} /> {cand.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-[#191b23] dark:text-white max-w-[200px] truncate">
                      {cand.appliedRole}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#191b23] dark:text-white">
                      {cand.experience} Yrs
                    </td>
                    <td className="py-3.5 px-4">
                      <StageBadge stage={cand.stage} />
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedResumeCand(cand)}
                        className="px-2.5 py-1 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-900 dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded text-[11px] font-semibold text-[#191b23] dark:text-white inline-flex items-center gap-1 transition-colors"
                      >
                        <FileText size={13} className="text-[#2563eb]" /> {cand.resume}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectCandidate && onSelectCandidate(cand)}
                        className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Eye size={13} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-between text-xs font-mono text-[#737686]">
            <span>Showing <strong className="text-[#191b23] dark:text-white">1 - {filteredCandidates.length}</strong> of {filteredCandidates.length} Candidates</span>
            <div className="flex items-center gap-1">
              <button disabled className="px-3 py-1 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded opacity-50 cursor-not-allowed font-semibold">Prev</button>
              <button className="px-3 py-1 bg-[#2563eb] text-white font-bold rounded">1</button>
              <button className="px-3 py-1 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded hover:bg-[#ededf9] font-semibold">2</button>
              <button className="px-3 py-1 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 rounded hover:bg-[#ededf9] font-semibold">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddCandidateModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={(newCand) => {
          addCandidateMutation.mutate({
            firstName: newCand.name.split(' ')[0] || 'First',
            lastName: newCand.name.split(' ').slice(1).join(' ') || 'Last',
            email: newCand.email,
            experience: Number(newCand.experience || 0),
            sourceChannel: 'LinkedIn'
          });
        }}
      />

      <ResumeViewerModal
        isOpen={!!selectedResumeCand}
        onClose={() => setSelectedResumeCand(null)}
        candidateName={selectedResumeCand?.name}
        fileName={selectedResumeCand?.resume}
      />
    </div>
  );
}
