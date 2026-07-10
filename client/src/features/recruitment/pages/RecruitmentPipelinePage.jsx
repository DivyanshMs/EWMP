import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter, Search, PlusCircle, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { PipelineColumn, CandidateCard } from '../components/RecruitmentCards';
import { AddCandidateModal } from '../components/RecruitmentDrawers';
import api from '../../../lib/axios';

/**
 * RecruitmentPipelinePage.jsx
 * Visual Kanban board for EWMP Recruitment across 8 stages:
 * Applied -> Screening -> Interview -> Technical Round -> HR Round -> Offer -> Hired -> Rejected
 */

export default function RecruitmentPipelinePage({ onSelectCandidate }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStageForAdd, setSelectedStageForAdd] = useState('APPLIED');

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

  const moveStageMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/recruitment/candidates/${id}/status`, { recruitmentStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
    }
  });

  const rawList = candidatesData?.data?.items || candidatesData?.data || [];

  const candidates = rawList.map(c => ({
    id: c._id || c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    appliedRole: c.appliedForDesignation?.title || 'General Position',
    experience: String(c.experience || 0),
    stage: c.recruitmentStatus === 'Technical Interview' ? 'TECHNICAL_ROUND' : c.recruitmentStatus === 'HR Interview' ? 'HR_ROUND' : c.recruitmentStatus === 'Joined' ? 'HIRED' : c.recruitmentStatus === 'Rejected' ? 'REJECTED' : c.recruitmentStatus === 'Offer' ? 'OFFER' : c.recruitmentStatus === 'Screening' ? 'SCREENING' : 'APPLIED',
    department: c.appliedForDepartment?.name || 'General'
  }));

  const stages = [
    { key: 'APPLIED', title: '1. Applied / Ingested' },
    { key: 'SCREENING', title: '2. HR Screening' },
    { key: 'INTERVIEW', title: '3. Manager Interview' },
    { key: 'TECHNICAL_ROUND', title: '4. Tech / Case Round' },
    { key: 'HR_ROUND', title: '5. HR Final Round' },
    { key: 'OFFER', title: '6. Offer Extended' },
    { key: 'HIRED', title: '★ Hired / Onboarded' },
    { key: 'REJECTED', title: '✕ Rejected' },
  ];

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.appliedRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleMoveStage = (candId, newStage) => {
    const statusMap = {
      'TECHNICAL_ROUND': 'Technical Interview',
      'HR_ROUND': 'HR Interview',
      'HIRED': 'Joined',
      'REJECTED': 'Rejected',
      'OFFER': 'Offer',
      'SCREENING': 'Screening',
      'APPLIED': 'Applied',
      'INTERVIEW': 'Technical Interview'
    };
    moveStageMutation.mutate({ id: candId, status: statusMap[newStage] || newStage });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles size={24} className="text-[#2563eb]" /> Visual Recruitment Kanban Pipeline
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Drag-and-drop or use quick action triggers to move candidate profiles across 8 structured enterprise acquisition stages.
          </p>
        </div>
        <button
          onClick={() => { setSelectedStageForAdd('APPLIED'); setShowAddModal(true); }}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={15} /> Add Candidate to Pipeline
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
            placeholder="Filter pipeline cards by Candidate Name, Email, or Applied Job Requisition..."
            className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Departments ({candidates.length})</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="HR & Ops">HR & Ops</option>
            <option value="Finance">Finance</option>
          </select>

          {(searchTerm || departmentFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setDepartmentFilter('ALL'); }}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 scrollbar-thin">
        {stages.map((stg) => {
          const stageCandidates = filteredCandidates.filter(c => c.stage === stg.key);
          const stageIdx = stages.findIndex(s => s.key === stg.key);
          const nextStageKey = stageIdx < stages.length - 2 ? stages[stageIdx + 1].key : null;

          return (
            <PipelineColumn
              key={stg.key}
              title={stg.title}
              count={stageCandidates.length}
              stageKey={stg.key}
              onAdd={(key) => { setSelectedStageForAdd(key); setShowAddModal(true); }}
            >
              {stageCandidates.map((cand) => (
                <div key={cand.id} className="relative group">
                  <CandidateCard
                    candidate={cand}
                    onSelect={() => onSelectCandidate && onSelectCandidate(cand)}
                    onViewResume={() => alert(`Opening PDF resume for ${cand.name}...`)}
                  />

                  {/* Quick Stage Move Action Buttons */}
                  <div className="mt-2 pt-2 border-t border-[#e1e2ed]/60 dark:border-gray-800/60 flex items-center justify-between text-[11px] font-mono">
                    {nextStageKey && (
                      <button
                        onClick={() => handleMoveStage(cand.id, nextStageKey)}
                        className="px-2 py-1 bg-[#2563eb]/10 hover:bg-[#2563eb] text-[#2563eb] hover:text-white rounded font-bold transition-colors flex items-center gap-1 w-full justify-center"
                        title={`Move to ${stages[stageIdx + 1].title}`}
                      >
                        Advance Stage <ArrowRight size={12} />
                      </button>
                    )}
                    {stg.key === 'OFFER' && (
                      <button
                        onClick={() => handleMoveStage(cand.id, 'HIRED')}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-extrabold transition-colors flex items-center gap-1 w-full justify-center"
                      >
                        ★ Mark Hired
                      </button>
                    )}
                    {stg.key !== 'REJECTED' && stg.key !== 'HIRED' && (
                      <button
                        onClick={() => handleMoveStage(cand.id, 'REJECTED')}
                        className="p-1 hover:bg-rose-100 text-rose-600 rounded ml-1"
                        title="Move to Rejected"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </PipelineColumn>
          );
        })}
      </div>

      {/* Modal */}
      <AddCandidateModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={(newCand) => {
          const statusMap = {
            'TECHNICAL_ROUND': 'Technical Interview',
            'HR_ROUND': 'HR Interview',
            'HIRED': 'Joined',
            'REJECTED': 'Rejected',
            'OFFER': 'Offer',
            'SCREENING': 'Screening',
            'APPLIED': 'Applied',
            'INTERVIEW': 'Technical Interview'
          };
          addCandidateMutation.mutate({
            firstName: newCand.name.split(' ')[0] || 'First',
            lastName: newCand.name.split(' ').slice(1).join(' ') || 'Last',
            email: newCand.email,
            experience: Number(newCand.experience || 0),
            sourceChannel: 'LinkedIn',
            recruitmentStatus: statusMap[selectedStageForAdd] || 'Applied'
          });
        }}
      />
    </div>
  );
}
