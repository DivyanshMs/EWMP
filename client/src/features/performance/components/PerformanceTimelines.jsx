import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, Target, UserCheck, MessageSquare, Award } from 'lucide-react';

/**
 * PerformanceTimelines.jsx
 * Appraisal review stages and goal KPI progress timelines for EWMP Performance Management.
 */

export const ReviewTimeline = ({ steps = [] }) => {
  const defaultSteps = [
    {
      title: 'Appraisal Cycle Launched & Goals Locked',
      actor: 'HR Operations / System Auto',
      timestamp: 'June 1, 2026 at 09:00 AM',
      status: 'COMPLETED',
      comment: 'H1 2026 review cycle opened. 8 KPIs and goals locked for evaluation.',
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Employee Self-Assessment Submitted',
      actor: 'Sarah SDE-II (Employee)',
      timestamp: 'June 15, 2026 at 04:30 PM',
      status: 'COMPLETED',
      comment: 'Completed self-assessment questionnaire. Self-rated at 4.6 / 5.0 across technical and leadership competencies.',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      title: 'Managerial Evaluation & Feedback',
      actor: 'Marcus Tech VP (Reporting Manager)',
      timestamp: 'June 28, 2026 at 02:15 PM',
      status: 'COMPLETED',
      comment: 'Manager review completed. Rated at 4.5 / 5.0. Recommended for Senior Tech Lead promotion.',
      icon: Award,
      color: 'emerald'
    },
    {
      title: 'HR Calibration & Executive Sign-off',
      actor: 'Divyansh Super Admin / Emily HR Director',
      timestamp: 'Estimated July 10, 2026',
      status: 'PENDING',
      comment: 'Final calibration check across Engineering grade bell curve.',
      icon: ShieldCheck,
      color: 'amber'
    }
  ];

  const timelineSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs">
      <h3 className="text-sm font-bold text-[#191b23] dark:text-white mb-6 pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-[#2563eb]" />
          APPRAISAL WORKFLOW & CALIBRATION TIMELINE
        </span>
        <span className="text-xs font-mono text-[#737686] font-normal">3 of 4 stages complete</span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e1e2ed] dark:before:bg-gray-800">
        {timelineSteps.map((step, idx) => {
          const IconComp = step.icon || CheckCircle2;
          
          const iconColors = {
            blue: 'bg-[#2563eb] text-white border-blue-100 dark:border-blue-900',
            emerald: 'bg-emerald-600 text-white border-emerald-100 dark:border-emerald-900',
            amber: 'bg-amber-500 text-white border-amber-100 dark:border-amber-900',
            rose: 'bg-rose-600 text-white border-rose-100 dark:border-rose-900',
          };

          const colorStyle = iconColors[step.color] || iconColors.emerald;

          return (
            <div key={idx} className="relative group">
              <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-2xs ${colorStyle}`}>
                <IconComp size={12} />
              </div>

              <div className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 transition-all hover:border-[#c3c6d7]">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#191b23] dark:text-white">{step.title}</h4>
                    <span className="text-xs font-medium text-[#2563eb] dark:text-blue-400">{step.actor}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#737686] dark:text-gray-400 bg-white dark:bg-[#161616] px-2 py-0.5 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
                    {step.timestamp}
                  </span>
                </div>

                {step.comment && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#e1e2ed]/60 dark:border-gray-800/60 flex items-start gap-2">
                    <MessageSquare size={14} className="text-[#737686] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#434655] dark:text-gray-300 italic bg-white dark:bg-[#161616] p-2.5 rounded w-full border border-[#e1e2ed]/40 dark:border-gray-800/40">
                      "{step.comment}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const GoalProgressTimeline = ({ milestones = [] }) => {
  const defaultMilestones = [
    { title: 'Milestone 1: Architectural RFC & Security Review Approved', date: 'May 15, 2026', done: true, desc: 'Passed InfoSec vulnerability assessment with zero critical findings.' },
    { title: 'Milestone 2: OAuth 2.0 Provider Integration & Sandbox Testing', date: 'June 10, 2026', done: true, desc: 'Integrated Okta and Azure AD SSO connectors in staging environment.' },
    { title: 'Milestone 3: Production Canary Deployment (10% Traffic)', date: 'July 5, 2026', done: true, desc: 'Zero latency degradation observed over 72-hour burn-in period.' },
    { title: 'Milestone 4: 100% Multi-Tenant Cutover & Legacy SSO Deprecation', date: 'Target Sep 30, 2026', done: false, desc: 'Final phase pending quarterly customer maintenance window.' },
  ];

  const items = milestones.length > 0 ? milestones : defaultMilestones;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
        <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <Target size={16} className="text-[#2563eb]" />
          Goal Milestone Progress Checklist
        </h4>
        <span className="text-xs font-mono text-[#737686]">3 of 4 Milestones Achieved (75%)</span>
      </div>

      <div className="space-y-3">
        {items.map((ms, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded border border-[#e1e2ed]/50 dark:border-gray-800/50">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${ms.done ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'}`}>
              {ms.done ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs">
                <strong className={`font-bold ${ms.done ? 'text-[#191b23] dark:text-white' : 'text-amber-700 dark:text-amber-400'}`}>{ms.title}</strong>
                <span className="font-mono text-[11px] text-[#737686]">{ms.date}</span>
              </div>
              <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">{ms.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
