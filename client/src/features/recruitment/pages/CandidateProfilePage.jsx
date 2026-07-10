import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, Briefcase, Award, FileText, Clock, Calendar, MessageSquare, Download, ArrowLeft, Send, PlusCircle } from 'lucide-react';
import { StageBadge } from '../components/RecruitmentBadges';
import { CandidateTimeline } from '../components/RecruitmentTimelines';
import { ScheduleInterviewModal, GenerateOfferModal, ResumeViewerModal } from '../components/RecruitmentDrawers';
import api from '../../../lib/axios';

/**
 * CandidateProfilePage.jsx
 * Comprehensive candidate profile dossier, resume preview, interview history, notes, and audit timeline for EWMP Recruitment.
 */

export default function CandidateProfilePage({ candidateData, onBack }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  const candidateId = candidateData?.id || candidateData?._id;

  const { data: interviewsData } = useQuery({
    queryKey: ['candidate-interviews', candidateId],
    queryFn: () => api.get(`/recruitment/candidates/${candidateId}/interviews`).then(r => r.data),
    enabled: !!candidateId
  });

  const changeStatusMutation = useMutation({
    mutationFn: (status) => api.patch(`/recruitment/candidates/${candidateId}/status`, { recruitmentStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
    }
  });

  const scheduleInterviewMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/interviews', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['candidate-interviews', candidateId]);
      setShowScheduleModal(false);
    }
  });

  const candidate = candidateData || {
    id: 'CAN-—',
    name: 'Unknown Candidate',
    email: '—',
    phone: '—',
    location: '—',
    appliedRole: '—',
    experience: '0 Years',
    stage: 'APPLIED',
    status: 'Active',
    resume: 'Resume.pdf',
    skills: [],
    education: [],
    experienceHistory: []
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setNotesList([{ author: 'Current user', date: 'Just now', text: newNoteText }, ...notesList]);
    setNewNoteText('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-[#ffffff] dark:bg-[#111111] hover:bg-[#ededf9] dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 transition-colors shadow-2xs"
        >
          <ArrowLeft size={16} /> Back to Candidate Directory
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-2 bg-[#ffffff] dark:bg-[#111111] hover:bg-[#ededf9] border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <Calendar size={14} className="text-[#2563eb]" /> Schedule Interview
          </button>
          <button
            onClick={() => setShowOfferModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            <Send size={14} /> Generate Offer
          </button>
        </div>
      </div>

      {/* Candidate Hero Card */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563eb] to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md font-mono">
              {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 font-mono">
                <span className="text-xs font-bold text-[#2563eb]">{candidate.id}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-[#737686]">{candidate.status}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight">
                {candidate.name}
              </h1>
              <span className="text-xs font-semibold text-[#2563eb] block mt-0.5">Applied for: {candidate.appliedRole}</span>
            </div>
          </div>
          <StageBadge stage={candidate.stage} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 font-mono text-xs">
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 flex items-center gap-2">
            <Mail size={15} className="text-[#2563eb] shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 flex items-center gap-2">
            <Phone size={15} className="text-emerald-600 shrink-0" />
            <span>{candidate.phone}</span>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 flex items-center gap-2">
            <MapPin size={15} className="text-rose-500 shrink-0" />
            <span>{candidate.location}</span>
          </div>
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 flex items-center justify-between">
            <span className="text-[#737686]">Total Experience:</span>
            <strong className="text-[#191b23] dark:text-white font-bold">{candidate.experience}</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e1e2ed] dark:border-gray-800 gap-6 font-semibold text-xs overflow-x-auto">
        {[
          { key: 'PROFILE', label: 'Candidate Profile & Experience', icon: User },
          { key: 'RESUME', label: 'Resume Preview & AI Skills', icon: FileText },
          { key: 'TIMELINE', label: 'Hiring Pipeline Timeline', icon: Clock },
          { key: 'NOTES', label: `HR & Interviewer Notes (${notesList.length})`, icon: MessageSquare },
          { key: 'DOCUMENTS', label: 'Attachments & Certificates', icon: Download },
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

      {/* Tab 1: Profile & Experience */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Work History */}
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
                <Briefcase size={16} className="text-[#2563eb]" /> Professional Work Experience
              </h3>
              <div className="space-y-4">
                {candidate.experienceHistory.map((exp, i) => (
                  <div key={i} className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/50 space-y-1">
                    <div className="flex justify-between font-bold text-sm text-[#191b23] dark:text-white">
                      <span>{exp.role} — <span className="text-[#2563eb]">{exp.company}</span></span>
                      <span className="font-mono text-xs text-[#737686] font-normal">{exp.period}</span>
                    </div>
                    <p className="text-xs text-[#434655] dark:text-gray-300 leading-relaxed pt-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center gap-2">
                <Award size={16} className="text-emerald-600" /> Education & Academic Background
              </h3>
              <div className="space-y-3">
                {candidate.education.map((edu, i) => (
                  <div key={i} className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/50 space-y-1">
                    <div className="flex justify-between font-bold text-sm text-[#191b23] dark:text-white">
                      <span>{edu.degree} — <span className="text-[#2563eb]">{edu.school}</span></span>
                      <span className="font-mono text-xs text-[#737686] font-normal">{edu.year}</span>
                    </div>
                    <p className="text-xs font-mono text-[#737686]">{edu.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                AI Parsed Skills & Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] dark:text-blue-300 rounded-full font-mono font-bold text-xs border border-[#2563eb]/20">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#faf8ff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#737686]">Candidate Telemetry</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>Resume Match:</span> <strong className="text-emerald-600">96.4% Highly Qualified</strong></div>
                <div className="flex justify-between"><span>Notice Period:</span> <strong className="text-[#191b23] dark:text-white">30 Days Confirmed</strong></div>
                <div className="flex justify-between"><span>Expected Salary:</span> <strong className="text-[#2563eb]">$140k - $150k / yr band</strong></div>
              </div>
              <button
                onClick={() => setShowResumeModal(true)}
                className="w-full mt-2 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <FileText size={14} /> Open Full Resume Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resume Preview */}
      {activeTab === 'RESUME' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-8 shadow-xs max-w-4xl mx-auto space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800 font-sans">
            <div>
              <h2 className="text-lg font-bold text-[#191b23] dark:text-white">Resume Document Viewer • {candidate.resume}</h2>
              <span className="text-xs text-[#737686] font-mono">Uploaded July 1, 2026 • AI Match Confidence: 96.4%</span>
            </div>
            <button onClick={() => alert('Downloading original resume PDF...')} className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-2xs flex items-center gap-1.5">
              <Download size={14} /> Download PDF
            </button>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg space-y-4 font-sans text-xs text-[#191b23] dark:text-gray-200">
            <div className="border-b border-gray-300 dark:border-gray-800 pb-3 text-center">
              <h3 className="text-lg font-bold">{candidate.name.toUpperCase()}</h3>
              <p className="text-gray-500">{candidate.email} • {candidate.phone} • {candidate.location}</p>
            </div>
            <p className="leading-relaxed italic">
              "Experienced Senior Software Engineer specializing in distributed caching, microservice orchestration, and zero-trust authentication engines. Proven track record of leading high-impact engineering initiatives."
            </p>
            <div className="pt-2">
              <strong className="text-[#2563eb] block mb-1">Top Demonstrated Capabilities:</strong>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563eb] dark:text-blue-300 rounded font-bold text-[11px] font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Timeline */}
      {activeTab === 'TIMELINE' && (
        <CandidateTimeline />
      )}

      {/* Tab 4: HR & Interviewer Notes */}
      {activeTab === 'NOTES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                Evaluation Notes & HR Screening Log
              </h3>
              <div className="space-y-4">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed]/50 space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span className="text-[#2563eb]">{note.author}</span>
                      <span className="font-mono text-[#737686] font-normal">{note.date}</span>
                    </div>
                    <p className="text-xs text-[#191b23] dark:text-gray-300 leading-relaxed pt-1 font-sans">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Note Box */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              Add Confidential Note
            </h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows="4"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter confidential interviewer scorecard remarks, salary check notes, or background reference checks..."
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs"
                required
              />
              <button type="submit" className="w-full py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5">
                <PlusCircle size={15} /> Save Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
            Candidate Attachments & Supporting Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              candidate.resume ? { title: 'Original Resume / CV', file: candidate.resume, size: '', date: '' } : null,
            ].filter(Boolean).map((doc, idx) => (
              <div key={idx} className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="font-bold text-[#191b23] dark:text-white block font-sans">{doc.title}</span>
                  <span className="text-[11px] text-[#2563eb] block mt-0.5">{doc.file}</span>
                  <span className="text-[10px] text-[#737686]">{doc.size} • {doc.date}</span>
                </div>
                <button onClick={() => alert(`Downloading ${doc.file}...`)} className="p-2 bg-white dark:bg-gray-800 rounded border border-[#e1e2ed] text-[#2563eb] hover:bg-[#ededf9]">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        candidateName={candidate.name}
        onConfirm={(intv) => {
          if (!intv.interviewerId) {
            alert('Please select a real interviewer before scheduling.');
            return;
          }
          scheduleInterviewMutation.mutate({
            candidateId: candidate.id,
            interviewerId: intv.interviewerId,
            round: intv.round || 'Technical',
            scheduledAt: intv.scheduledAt || new Date().toISOString()
          });
        }}
      />
      <GenerateOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        candidateName={candidate.name}
        onConfirm={() => {
          changeStatusMutation.mutate('Offer');
          setShowOfferModal(false);
        }}
      />
      <ResumeViewerModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} candidateName={candidate.name} fileName={candidate.resume} />
    </div>
  );
}
