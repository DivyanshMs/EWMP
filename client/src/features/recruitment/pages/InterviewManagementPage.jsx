import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, PlusCircle, Search, Filter, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import { InterviewModeBadge } from '../components/RecruitmentBadges';
import { InterviewCard } from '../components/RecruitmentCards';
import { ScheduleInterviewModal } from '../components/RecruitmentDrawers';
import { NoInterviews } from '../components/RecruitmentEmptyStates';
import api from '../../../lib/axios';

/**
 * InterviewManagementPage.jsx
 * Calendar view, interview schedules, panel assignments, and scorecard feedback for EWMP Recruitment.
 */

export default function InterviewManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roundFilter, setRoundFilter] = useState('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState(null);
  const [scorecardRating, setScorecardRating] = useState('STRONG_YES');
  const [scorecardComment, setScorecardComment] = useState('');

  // Fetch candidates first, then get interviews for each active candidate
  const { data: candidatesData } = useQuery({
    queryKey: ['recruitment-candidates'],
    queryFn: () => api.get('/recruitment/candidates').then(r => r.data)
  });

  const rawCandidates = candidatesData?.data?.items || candidatesData?.data || [];

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['recruitment-interviews-traverse', rawCandidates.map(c => c._id).join(',')],
    queryFn: async () => {
      if (rawCandidates.length === 0) return [];
      const promises = rawCandidates.slice(0, 10).map(c =>
        api.get(`/recruitment/candidates/${c._id}/interviews`)
          .then(res => (res.data?.data || res.data || []).map(i => ({
            ...i,
            candidateName: `${c.firstName} ${c.lastName}`,
            appliedRole: c.appliedForDesignation?.title || 'General Position'
          })))
          .catch(() => [])
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: rawCandidates.length > 0
  });

  const scheduleInterviewMutation = useMutation({
    mutationFn: (payload) => api.post('/recruitment/interviews', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
      setShowScheduleModal(false);
    }
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/recruitment/interviews/${id}/feedback`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recruitment-candidates']);
      setSelectedInterviewForFeedback(null);
      setScorecardComment('');
    }
  });

  const interviewsList = interviews || [];

  const filteredInterviews = interviewsList.map(intv => ({
    id: intv._id || intv.id,
    candidateName: intv.candidateName || 'Candidate',
    appliedRole: intv.appliedRole || 'Position',
    round: intv.round || 'Technical',
    interviewer: intv.interviewerId?.fullName || 'Hiring Panel',
    mode: intv.mode || 'VIDEO',
    date: intv.scheduledAt ? new Date(intv.scheduledAt).toLocaleDateString() : '—',
    time: intv.scheduledAt ? new Date(intv.scheduledAt).toLocaleTimeString() : '—',
    meetLink: intv.meetingLink || '—',
    feedbackStatus: intv.interviewStatus === 'Completed' ? `Submitted (${intv.recommendation})` : 'Pending Feedback'
  })).filter(intv => {
    const matchesSearch = intv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          intv.interviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          intv.appliedRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRound = roundFilter === 'ALL' || intv.round.includes(roundFilter);
    return matchesSearch && matchesRound;
  });

  const handleSubmitScorecard = (e) => {
    e.preventDefault();
    if (!selectedInterviewForFeedback) return;
    const recMap = {
      'STRONG_YES': 'Proceed',
      'YES': 'Proceed',
      'WEAK_NO': 'Hold',
      'DEFINITE_NO': 'Reject'
    };
    feedbackMutation.mutate({
      id: selectedInterviewForFeedback.id,
      data: {
        feedbackScore: scorecardRating === 'STRONG_YES' ? 9 : scorecardRating === 'YES' ? 8 : scorecardRating === 'WEAK_NO' ? 5 : 2,
        feedbackNotes: scorecardComment,
        recommendation: recMap[scorecardRating] || 'Hold',
        interviewStatus: 'Completed'
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2">
            <Calendar size={24} className="text-[#2563eb]" /> Interview Schedule & Panel Management
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Manage upcoming video and on-site interview rosters, generate virtual meeting links, and submit standardized evaluation scorecards.
          </p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={15} /> Schedule New Interview
        </button>
      </div>

      {/* Calendar Strip Preview */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-3">
          <span className="text-xs font-bold font-mono uppercase text-[#737686]">July 2026 Interview Calendar Week View</span>
          <span className="text-xs font-semibold text-[#2563eb]">{interviews.length} Total Sessions Roster</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-7 gap-2 text-center font-mono text-xs">
          {[
            { day: 'Mon', date: 'Jul 6', count: 1, active: false },
            { day: 'Tue', date: 'Jul 7', count: 0, active: false },
            { day: 'Wed', date: 'Jul 8 (Today)', count: 3, active: true },
            { day: 'Thu', date: 'Jul 9', count: 2, active: false },
            { day: 'Fri', date: 'Jul 10', count: 0, active: false },
            { day: 'Sat', date: 'Jul 11', count: 0, active: false },
            { day: 'Sun', date: 'Jul 12', count: 0, active: false },
          ].map((d, i) => (
            <div
              key={i}
              onClick={() => alert(`Filtering interviews for ${d.date}...`)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                d.active
                  ? 'bg-[#2563eb] text-white border-[#2563eb] font-extrabold shadow-xs'
                  : 'bg-[#faf8ff] dark:bg-gray-900/40 border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-gray-300 hover:border-[#2563eb]'
              }`}
            >
              <span className="text-[10px] uppercase block opacity-80">{d.day}</span>
              <span className="text-sm block">{d.date.split(' ')[1]}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${d.active ? 'bg-white/20 text-white' : 'bg-[#ededf9] dark:bg-gray-800 text-[#2563eb]'}`}>
                {d.count} Sessions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Candidate Name, Interviewer Panel Lead, or Job Title..."
            className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#2563eb]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Interview Rounds</option>
            <option value="Screening">1. HR Screening</option>
            <option value="Technical">2. Technical Architecture</option>
            <option value="Manager">3. Manager Fit Panel</option>
            <option value="Executive">4. Executive Calibration</option>
          </select>

          {(searchTerm || roundFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setRoundFilter('ALL'); }}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Interview Roster Cards Grid */}
      {filteredInterviews.length === 0 ? (
        <NoInterviews onSchedule={() => setShowScheduleModal(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((intv) => (
            <InterviewCard
              key={intv.id}
              interview={intv}
              onFeedback={(selected) => setSelectedInterviewForFeedback(selected)}
            />
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onConfirm={(newIntv) => {
          if (!newIntv.interviewerId) {
            alert('Please select a real interviewer before scheduling.');
            return;
          }
          scheduleInterviewMutation.mutate({
            candidateId: newIntv.candidateId || rawCandidates[0]?._id,
            interviewerId: newIntv.interviewerId,
            round: newIntv.round || 'Technical',
            scheduledAt: newIntv.scheduledAt || new Date().toISOString()
          });
        }}
      />

      {/* Scorecard Feedback Modal */}
      {selectedInterviewForFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#191b23] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#2563eb]" />
                <h3 className="font-bold text-sm">SUBMIT INTERVIEW SCORECARD • {selectedInterviewForFeedback.candidateName}</h3>
              </div>
              <button onClick={() => setSelectedInterviewForFeedback(null)} className="p-1 text-gray-400 hover:text-white rounded">✕</button>
            </div>

            <form onSubmit={handleSubmitScorecard} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed] font-mono">
                <span className="text-[#737686] block">Round: <strong className="text-[#191b23] dark:text-white">{selectedInterviewForFeedback.round}</strong></span>
                <span className="text-[#737686] block mt-0.5">Role: <strong className="text-[#2563eb]">{selectedInterviewForFeedback.appliedRole}</strong></span>
              </div>

              <div>
                <label className="block font-bold text-[#191b23] dark:text-white mb-2">Overall Recommendation & Rating <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { val: 'STRONG_YES', label: '★ Strong Yes (Advance / Hire)', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                    { val: 'YES', label: '✓ Yes (Advance)', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                    { val: 'WEAK_NO', label: '⚠️ Weak No / Hesitant', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                    { val: 'DEFINITE_NO', label: '✕ Definite No (Reject)', color: 'border-rose-500 bg-rose-50 text-rose-800' },
                  ].map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => setScorecardRating(opt.val)}
                      className={`p-3 rounded-lg border-2 cursor-pointer font-bold transition-all text-center ${
                        scorecardRating === opt.val ? `${opt.color} shadow-xs` : 'border-[#e1e2ed] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616] text-[#737686]'
                      }`}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#191b23] dark:text-white mb-1">Qualitative Feedback & Scorecard Justification <span className="text-rose-500">*</span></label>
                <textarea
                  rows="4"
                  value={scorecardComment}
                  onChange={(e) => setScorecardComment(e.target.value)}
                  placeholder="Evaluate candidate problem-solving speed, technical depth, architectural clarity, and alignment with EWMP core culture..."
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-sans"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelectedInterviewForFeedback(null)}
                  className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Submit Final Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
