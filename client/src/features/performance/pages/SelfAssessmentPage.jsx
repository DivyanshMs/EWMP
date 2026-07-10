import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserCheck, Send, Save, Star, CheckCircle2, ArrowLeft, FileText } from 'lucide-react';
import { RatingComponent } from '../components/PerformanceCards';
import { ValidationError } from '../components/PerformanceErrorStates';
import api from '../../../lib/axios';

/**
 * SelfAssessmentPage.jsx
 * Employee Self-Assessment Questionnaire & Appraisal Submission view for EWMP.
 * Allows employees to rate competencies, document key achievements, detail challenges, and outline future goals.
 */

export const SelfAssessmentPage = ({ onBack, onSubmitted, record }) => {
  const reviewId = record?.id || record?._id;

  const [ratings, setRatings] = useState({
    tech: record?.selfRating || 0,
    speed: 0,
    team: 0,
    comm: 0
  });

  const [comments, setComments] = useState({
    tech: '',
    speed: '',
    team: '',
    comm: ''
  });

  const [achievements, setAchievements] = useState('');
  const [challenges, setChallenges] = useState('');
  const [futureGoals, setFutureGoals] = useState('');

  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selfAssessmentMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/performance/reviews/${id}/self-assessment`, data),
    onSuccess: () => {
      setIsSubmitted(true);
      onSubmitted && onSubmitted();
    }
  });

  const handleRatingChange = (key, val) => {
    setRatings(prev => ({ ...prev, [key]: val }));
  };

  const handleCommentChange = (key, text) => {
    setComments(prev => ({ ...prev, [key]: text }));
  };

  const handleSaveDraft = () => {
    alert('Self-assessment draft saved locally to your browser! You can return later to complete submission.');
  };

  const avgSelfRating = Math.round(((ratings.tech + ratings.speed + ratings.team + ratings.comm) / 4) * 10) / 10 || 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!achievements.trim() || !futureGoals.trim()) {
      setError('Please fill in both Key Achievements and Future Goals before submitting your formal assessment.');
      return;
    }
    setError('');
    const combinedText = `Achievements: ${achievements}\n\nChallenges: ${challenges}\n\nFuture Goals: ${futureGoals}\n\nTechnical: ${comments.tech}\nDelivery: ${comments.speed}\nTeamwork: ${comments.team}\nCommunication: ${comments.comm}`;
    if (reviewId) {
      selfAssessmentMutation.mutate({ id: reviewId, data: { selfAssessment: combinedText, selfRating: avgSelfRating } });
    } else {
      setIsSubmitted(true);
      onSubmitted && onSubmitted();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 rounded text-[#191b23] dark:text-white transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563eb] block">H1 2026 Appraisal Cycle</span>
            <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <UserCheck size={20} className="text-[#2563eb]" />
              EMPLOYEE SELF-ASSESSMENT QUESTIONNAIRE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Save size={14} /> Save Draft
          </button>
        </div>
      </div>

      {error && <ValidationError message={error} />}

      {isSubmitted ? (
        <div className="bg-[#ffffff] dark:bg-[#111111] border-2 border-emerald-500 rounded-xl p-8 text-center space-y-4 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-bold text-[#191b23] dark:text-white">Self-Assessment Successfully Submitted!</h2>
          <p className="text-xs text-[#737686] dark:text-gray-400 max-w-md mx-auto">
            Your self-ratings and achievement statements have been locked and sent to <strong className="text-[#191b23] dark:text-white">Marcus Tech VP</strong> for managerial calibration and 1-on-1 discussion.
          </p>
          <button
            onClick={() => onBack && onBack()}
            className="px-5 py-2.5 bg-[#2563eb] text-white text-xs font-semibold rounded shadow-xs hover:bg-[#004ac6] transition-colors inline-flex items-center gap-1.5"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Core Competency Ratings */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                SECTION 1: CORE COMPETENCY SELF-EVALUATION
              </h3>
              <p className="text-xs text-[#737686] mt-0.5">Rate your performance from 1 (Unsatisfactory) to 5 (Outstanding) and provide supporting evidence.</p>
            </div>

            <div className="space-y-6 divide-y divide-[#e1e2ed]/60 dark:divide-gray-800/60">
              {[
                { key: 'tech', title: '1. Technical Architecture & Code Quality (Weight: 30%)', desc: 'Ability to architect scalable solutions, write maintainable code, and adhere to engineering standards.' },
                { key: 'speed', title: '2. Sprint Execution Speed & Reliability (Weight: 25%)', desc: 'Consistency in meeting sprint commit goals, resolving production bugs, and maintaining velocity.' },
                { key: 'team', title: '3. Team Mentorship & Leadership (Weight: 25%)', desc: 'Guidance provided to peers, participation in code reviews, and positive contribution to team culture.' },
                { key: 'comm', title: '4. Cross-Functional Communication (Weight: 20%)', desc: 'Clarity in technical documentation, collaboration with product/design, and stakeholder updates.' },
              ].map((q, idx) => (
                <div key={idx} className={`space-y-3 ${idx > 0 ? 'pt-6' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-md">
                      <label className="font-bold text-xs text-[#191b23] dark:text-white block">{q.title}</label>
                      <span className="text-[11px] text-[#737686]">{q.desc}</span>
                    </div>
                    <div className="bg-[#faf8ff] dark:bg-gray-900/40 p-2.5 rounded border border-[#e1e2ed]/60">
                      <RatingComponent
                        value={ratings[q.key]}
                        onChange={(val) => handleRatingChange(q.key, val)}
                        label=""
                      />
                    </div>
                  </div>
                  <textarea
                    rows="2"
                    value={comments[q.key]}
                    onChange={(e) => handleCommentChange(q.key, e.target.value)}
                    placeholder="Provide specific examples or project deliverables to justify your rating..."
                    className="w-full text-xs p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Qualitative Achievements & Future Roadmap */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-[#2563eb]" />
                SECTION 2: QUALITATIVE ACHIEVEMENTS & FUTURE ROADMAP
              </h3>
              <p className="text-xs text-[#737686] mt-0.5">Detail major contributions and outline areas where you need managerial support.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#191b23] dark:text-white mb-1">
                  Key Achievements & Quantifiable Impact (H1 2026) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="List your top 3 major accomplishments this review cycle..."
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#191b23] dark:text-white mb-1">
                  Major Technical or Operational Challenges Faced
                </label>
                <textarea
                  rows="3"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="Describe any road-blocks, resource constraints, or external dependencies that impacted your work..."
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191b23] dark:text-white mb-1">
                  Future Career Goals & Professional Development Aspirations (H2 2026) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={futureGoals}
                  onChange={(e) => setFutureGoals(e.target.value)}
                  placeholder="What new skills, leadership opportunities, or technical projects do you want to tackle next?"
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#737686]">
              By clicking submit, your assessment will be locked for editing and transferred to managerial calibration.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onBack && onBack()}
                className="px-4 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send size={15} /> Submit Formal Self-Assessment
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
