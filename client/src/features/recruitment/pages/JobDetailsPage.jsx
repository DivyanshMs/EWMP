import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, ArrowLeft, Share2, Edit3, UserCheck, FileText, Sparkles } from 'lucide-react';
import { JobStatusBadge, StageBadge, EmploymentTypeBadge } from '../components/RecruitmentBadges';
import { CandidateCard } from '../components/RecruitmentCards';
import api from '../../../lib/axios';

/**
 * JobDetailsPage.jsx
 * Detailed requisition dossier, hiring team, application pipeline, and applicant statistics for EWMP Recruitment.
 */

export default function JobDetailsPage({ jobData, onBack, onSelectCandidate }) {
  const [activeTab, setActiveTab] = useState('DESCRIPTION');

  const { data: candidatesData } = useQuery({
    queryKey: ['recruitment-candidates'],
    queryFn: () => api.get('/recruitment/candidates').then(r => r.data)
  });

  const rawCandidates = candidatesData?.data?.items || candidatesData?.data || [];

  const job = jobData || {
    id: 'JOB-—',
    title: 'Unknown Requisition',
    department: 'General',
    location: 'Office HQ',
    type: 'FULL_TIME',
    salary: 'Negotiable',
    openings: 1,
    applicantsCount: 0,
    status: 'PUBLISHED',
    hiringManager: 'Marcus Tech VP',
    recruiter: 'Emily Vance',
    createdDate: '—',
    description: '',
    responsibilities: [],
    requirements: [],
    skills: []
  };

  const filteredCandidates = rawCandidates.filter(c => c.appliedForDesignation?._id === job.id || c.appliedForDesignation === job.id);

  const sampleApplications = filteredCandidates.map(c => ({
    id: c._id || c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    appliedRole: job.title,
    experience: String(c.experience || 0),
    stage: c.recruitmentStatus || 'Applied',
    photo: ''
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-[#ffffff] dark:bg-[#111111] hover:bg-[#ededf9] dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 transition-colors shadow-2xs"
        >
          <ArrowLeft size={16} /> Back to Job Requisitions
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Copying public job application link to clipboard...')}
            className="px-3.5 py-2 bg-[#ffffff] dark:bg-[#111111] hover:bg-[#ededf9] border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <Share2 size={14} /> Share Link
          </button>
          <button
            onClick={() => alert('Opening Requisition Editor...')}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            <Edit3 size={14} /> Edit Requisition
          </button>
        </div>
      </div>

      {/* Job Hero Header Card */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 font-mono">
              <span className="text-xs font-bold text-[#2563eb]">{job.id}</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-[#737686]">{job.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191b23] dark:text-white tracking-tight">
              {job.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <JobStatusBadge status={job.status} />
            <EmploymentTypeBadge type={job.type} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 font-mono text-xs">
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50">
            <span className="text-[11px] text-[#737686] uppercase block">Location</span>
            <strong className="text-[#191b23] dark:text-white font-sans flex items-center gap-1 mt-0.5"><MapPin size={13} className="text-[#2563eb]" /> {job.location}</strong>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50">
            <span className="text-[11px] text-[#737686] uppercase block">Compensation Band</span>
            <strong className="text-emerald-600 font-sans font-bold mt-0.5 block">{job.salary}</strong>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50">
            <span className="text-[11px] text-[#737686] uppercase block">Target Openings</span>
            <strong className="text-[#191b23] dark:text-white font-sans font-bold mt-0.5 block">{job.openings} Approved Positions</strong>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50">
            <span className="text-[11px] text-[#737686] uppercase block">Total Applications</span>
            <strong className="text-[#2563eb] font-sans font-bold mt-0.5 block flex items-center gap-1"><Users size={14} /> {job.applicantsCount} Active Candidates</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e1e2ed] dark:border-gray-800 gap-6 font-semibold text-xs overflow-x-auto">
        {[
          { key: 'DESCRIPTION', label: 'Job Description & Skills', icon: FileText },
          { key: 'APPLICATIONS', label: `Active Applications (${sampleApplications.length})`, icon: Users },
          { key: 'TEAM', label: 'Hiring Team & Governance', icon: UserCheck },
          { key: 'STATISTICS', label: 'Candidate Pipeline Statistics', icon: Sparkles },
        ].map((t) => {
          const IconComp = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                activeTab === t.key
                  ? 'border-[#2563eb] text-[#2563eb] font-extrabold'
                  : 'border-transparent text-[#737686] hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              <IconComp size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Description & Skills */}
      {activeTab === 'DESCRIPTION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                Role Overview & Purpose
              </h3>
              <p className="text-xs sm:text-sm text-[#434655] dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                Key Responsibilities & Deliverables
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#434655] dark:text-gray-300 list-disc pl-5">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                Mandatory Technical Qualifications & Experience
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#434655] dark:text-gray-300 list-disc pl-5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="leading-relaxed">{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Required Skills & Keywords */}
          <div className="space-y-6">
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                Required Skills & Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] dark:text-blue-300 rounded-full font-mono font-bold text-xs border border-[#2563eb]/20">
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#faf8ff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#737686]">Requisition Metadata</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Created On:</span> <strong className="text-[#191b23] dark:text-white">{job.createdDate}</strong></div>
                <div className="flex justify-between"><span>Hiring SLA Target:</span> <strong className="text-emerald-600">30 Days</strong></div>
                <div className="flex justify-between"><span>Budget Approval:</span> <strong className="text-[#2563eb]">Approved #ENG-2026-B</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Active Applications */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#ffffff] dark:bg-[#111111] p-4 rounded-xl border border-[#e1e2ed] dark:border-gray-800 text-xs">
            <span className="font-semibold text-[#737686]">Showing <strong className="text-[#191b23] dark:text-white">{sampleApplications.length} candidates</strong> applying for this requisition</span>
            <button onClick={() => alert('Opening candidate invite modal...')} className="px-3 py-1.5 bg-[#2563eb] text-white font-semibold rounded shadow-xs">
              + Add Applicant to Job
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleApplications.map((cand) => (
              <CandidateCard key={cand.id} candidate={cand} onSelect={() => onSelectCandidate && onSelectCandidate(cand)} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hiring Team */}
      {activeTab === 'TEAM' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            Assigned Hiring Team & Evaluation Governance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Hiring Manager (Decision Maker)', name: 'Marcus Tech VP', title: 'VP of Engineering', email: 'marcus@ewmp.enterprise' },
              { role: 'Lead Talent Acquisition Partner', name: 'Emily Vance', title: 'Senior HR Recruiter', email: 'emily.vance@ewmp.enterprise' },
              { role: 'Executive Calibration Officer', name: 'Sarah HR VP', title: 'VP of People Operations', email: 'sarah@ewmp.enterprise' },
            ].map((m, idx) => (
              <div key={idx} className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#2563eb] block">{m.role}</span>
                <h4 className="font-bold text-sm text-[#191b23] dark:text-white">{m.name}</h4>
                <p className="text-xs text-[#737686]">{m.title}</p>
                <span className="text-xs font-mono text-[#434655] dark:text-gray-400 block pt-1">{m.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Statistics */}
      {activeTab === 'STATISTICS' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
            <span>Candidate Conversion Analytics for Requisition #{job.id}</span>
            <span className="text-xs font-mono text-emerald-600">Health: Excellent</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]">
              <span className="text-xs text-[#737686] block uppercase">Avg Time in Stage</span>
              <strong className="text-2xl font-extrabold text-[#191b23] dark:text-white">3.2 Days</strong>
            </div>
            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]">
              <span className="text-xs text-[#737686] block uppercase">Screening to Tech Ratio</span>
              <strong className="text-2xl font-extrabold text-[#2563eb]">38.5%</strong>
            </div>
            <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]">
              <span className="text-xs text-[#737686] block uppercase">Offer Acceptance</span>
              <strong className="text-2xl font-extrabold text-emerald-600">100% (1/1)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
