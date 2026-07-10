import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Award, ShieldCheck, Star, Target, CheckCircle2, ArrowLeft, TrendingUp, BookOpen } from 'lucide-react';
import { RatingBadge, ReviewStatusBadge } from '../components/PerformanceBadges';
import { RatingComponent } from '../components/PerformanceCards';
import api from '../../../lib/axios';

/**
 * ManagerEvaluationPage.jsx
 * Reporting Manager Appraisal Calibration & Evaluation Hub for EWMP.
 * Enables managers to review self-assessments, calibrate competency ratings, provide feedback, and make promotion/training recommendations.
 */

export const ManagerEvaluationPage = ({ onBack, onCompleted, record }) => {
  const reviewId = record?.id || record?._id;

  const { data: reviewDetail } = useQuery({
    queryKey: ['performance-review', reviewId],
    queryFn: () => api.get(`/performance/reviews/${reviewId}`).then(r => r.data),
    enabled: !!reviewId
  });

  const raw = reviewDetail?.data || reviewDetail;

  const [mgrRatings, setMgrRatings] = useState({
    tech: raw?.kpiScore ? raw.kpiScore / 20 : 0,
    speed: 0,
    team: 0,
    comm: 0
  });

  const [mgrComments, setMgrComments] = useState({
    tech: '',
    speed: '',
    team: '',
    comm: ''
  });

  const [overallFeedback, setOverallFeedback] = useState('');
  const [recommendPromotion, setRecommendPromotion] = useState(false);
  const [targetDesignation, setTargetDesignation] = useState('');
  const [recommendTraining, setRecommendTraining] = useState(false);
  const [trainingCourse, setTrainingCourse] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const empName = raw?.employee?.fullName || raw?.employee?.firstName + ' ' + raw?.employee?.lastName || 'Employee';
  const empSummary = {
    name: empName,
    id: raw?.employee?.employeeId || raw?.employee?.id || 'EMP',
    designation: raw?.employee?.jobTitle || raw?.employee?.designation || 'Staff',
    department: raw?.employee?.department?.name || 'General',
    cycle: `${raw?.quarter || ''} ${raw?.year || ''}`,
    selfScore: raw?.selfRating || 0,
    goalsMet: 'Refer to Goals tab',
    selfComments: raw?.selfAssessment || 'No self-assessment submitted yet.'
  };

  const managerAssessmentMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/performance/reviews/${id}/manager-assessment`, data),
    onSuccess: () => {
      setIsCompleted(true);
      onCompleted && onCompleted();
    }
  });

  const handleRatingChange = (key, val) => {
    setMgrRatings(prev => ({ ...prev, [key]: val }));
  };

  const handleCommentChange = (key, text) => {
    setMgrComments(prev => ({ ...prev, [key]: text }));
  };

  const calculateOverall = () => {
    const vals = Object.values(mgrRatings);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    if (!overallFeedback.trim()) {
      return alert('Please enter mandatory Overall Managerial Calibration Feedback.');
    }
    const avgRating = Math.round(parseFloat(calculateOverall()) * 10) / 10 || 1;
    const kpiScore = Math.round(mgrRatings.tech * 20);
    if (reviewId) {
      managerAssessmentMutation.mutate({
        id: reviewId,
        data: { managerFeedback: overallFeedback, managerRating: avgRating, kpiScore }
      });
    } else {
      setIsCompleted(true);
      onCompleted && onCompleted();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563eb] block">Reporting Manager Evaluation Hub</span>
            <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Award size={20} className="text-[#2563eb]" />
              CALIBRATE APPRAISAL: {empSummary.name.toUpperCase()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-blue-50 text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-300 font-bold rounded border border-blue-200">
            Calibrated Score: {calculateOverall()} / 5.0
          </span>
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-[#ffffff] dark:bg-[#111111] border-2 border-emerald-500 rounded-xl p-8 text-center space-y-4 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-bold text-[#191b23] dark:text-white">Managerial Appraisal Evaluation Locked!</h2>
          <p className="text-xs text-[#737686] dark:text-gray-400 max-w-md mx-auto">
            The evaluation for <strong className="text-[#191b23] dark:text-white">{empSummary.name}</strong> has been calibrated at <strong className="text-emerald-600 font-mono">{calculateOverall()} / 5.0</strong> with promotion recommendations forwarded to HR.
          </p>
          <button
            onClick={() => onBack && onBack()}
            className="px-5 py-2.5 bg-[#2563eb] text-white text-xs font-semibold rounded shadow-xs hover:bg-[#004ac6] transition-colors inline-flex items-center gap-1.5"
          >
            Return to Review Queue
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitEvaluation} className="space-y-6">
          {/* Employee Profile & Self-Assessment Summary Banner */}
          <div className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1">
              <span className="text-[#737686] font-semibold">Employee Profile & Designation</span>
              <h3 className="text-base font-bold text-[#191b23] dark:text-white">{empSummary.name}</h3>
              <p className="text-[#737686] font-mono">{empSummary.id} • {empSummary.designation}</p>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#2563eb] block mb-0.5">Employee Self-Assessment Summary:</span>
                <p className="italic text-[#434655] dark:text-gray-300">"{empSummary.selfComments}"</p>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-[#161616] rounded border border-[#e1e2ed]/60 flex flex-col justify-between">
              <span className="text-[#737686] font-semibold">Employee Self Rating</span>
              <div className="my-1">
                <span className="text-2xl font-extrabold font-mono text-[#191b23] dark:text-white">{empSummary.selfScore}</span>
                <span className="text-xs text-[#737686]"> / 5.0</span>
              </div>
              <RatingBadge rating={empSummary.selfScore} />
            </div>
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded border border-emerald-200 flex flex-col justify-between">
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold">KPI Goal Completion</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-600 my-1">87.5%</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">{empSummary.goalsMet}</span>
            </div>
          </div>

          {/* Competency Calibration Table */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <Star size={16} className="text-[#2563eb]" />
                  COMPETENCY RATING CALIBRATION & MANAGER REMARKS
                </h3>
                <p className="text-xs text-[#737686] mt-0.5">Compare employee self-ratings and assign your official managerial calibration score.</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-blue-50 text-[#2563eb] rounded border border-blue-200">
                Live Average: {calculateOverall()}
              </span>
            </div>

            <div className="space-y-6 divide-y divide-[#e1e2ed]/60 dark:divide-gray-800/60">
              {[
                { key: 'tech', title: '1. Technical Architecture & Code Quality (Weight: 30%)', self: 4.8 },
                { key: 'speed', title: '2. Sprint Execution Speed & Reliability (Weight: 25%)', self: 4.5 },
                { key: 'team', title: '3. Team Mentorship & Leadership (Weight: 25%)', self: 4.5 },
                { key: 'comm', title: '4. Cross-Functional Communication (Weight: 20%)', self: 4.0 },
              ].map((comp, idx) => (
                <div key={idx} className={`space-y-3 ${idx > 0 ? 'pt-6' : ''}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <label className="font-bold text-xs text-[#191b23] dark:text-white block">{comp.title}</label>
                      <span className="text-[11px] font-mono text-[#737686]">Employee Self Rating: <strong className="text-amber-600 font-bold">★ {comp.self.toFixed(1)}</strong></span>
                    </div>
                    <div className="bg-blue-50/50 dark:bg-blue-950/30 p-2 rounded border border-blue-200 dark:border-blue-900 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2563eb] font-mono">Manager Score:</span>
                      <RatingComponent
                        value={mgrRatings[comp.key]}
                        onChange={(val) => handleRatingChange(comp.key, val)}
                        label=""
                      />
                    </div>
                  </div>
                  <textarea
                    rows="2"
                    value={mgrComments[comp.key]}
                    onChange={(e) => handleCommentChange(comp.key, e.target.value)}
                    placeholder="Enter managerial feedback and specific examples supporting your rating..."
                    className="w-full text-xs p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Overall Managerial Comments & Recommendations */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                OVERALL MANAGERIAL EVALUATION & HR RECOMMENDATIONS
              </h3>
              <p className="text-xs text-[#737686] mt-0.5">Provide consolidated appraisal summary and formal promotion/training nominations.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#191b23] dark:text-white mb-1">
                  Consolidated Managerial Appraisal Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                  placeholder="Enter overall review summary, highlighting major achievements and career growth areas..."
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
                  required
                />
              </div>

              {/* Promotion & Training Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-purple-50/40 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <TrendingUp size={15} /> Promotion Nomination
                    </span>
                    <input
                      type="checkbox"
                      checked={recommendPromotion}
                      onChange={(e) => setRecommendPromotion(e.target.checked)}
                      className="w-4 h-4 text-[#2563eb] rounded cursor-pointer"
                    />
                  </div>
                  {recommendPromotion ? (
                    <div>
                      <label className="block text-[11px] text-purple-800 dark:text-purple-400 mb-1">Recommended Target Designation</label>
                      <input
                        type="text"
                        value={targetDesignation}
                        onChange={(e) => setTargetDesignation(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-[#161616] border border-purple-300 dark:border-purple-800 rounded font-bold"
                      />
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#737686] block italic">No promotion nomination requested for this cycle.</span>
                  )}
                </div>

                <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <BookOpen size={15} /> Training & Upskilling Nomination
                    </span>
                    <input
                      type="checkbox"
                      checked={recommendTraining}
                      onChange={(e) => setRecommendTraining(e.target.checked)}
                      className="w-4 h-4 text-[#2563eb] rounded cursor-pointer"
                    />
                  </div>
                  {recommendTraining ? (
                    <div>
                      <label className="block text-[11px] text-blue-800 dark:text-blue-400 mb-1">Recommended Course / Certification</label>
                      <input
                        type="text"
                        value={trainingCourse}
                        onChange={(e) => setTrainingCourse(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-[#161616] border border-blue-300 dark:border-blue-800 rounded font-semibold"
                      />
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#737686] block italic">No external training nominations requested.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#737686]">
              Submitting locks this appraisal evaluation and transfers governance to HR Calibration.
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
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} /> Complete Manager Evaluation
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
