import React from 'react';
import { CheckCircle2, Clock, UserCheck, Video, Award, FileText, Send, DollarSign } from 'lucide-react';

/**
 * RecruitmentTimelines.jsx
 * Stage progression timelines for candidates and offers in EWMP Recruitment Management.
 */

export const CandidateTimeline = ({ steps = [] }) => {
  const defaultSteps = [
    {
      title: '1. Application Submitted via LinkedIn Career Portal',
      actor: 'System Auto-Ingestion',
      timestamp: 'July 1, 2026 at 10:15 AM',
      status: 'COMPLETED',
      comment: 'Resume parsed successfully. Match score: 92% against Senior Software Engineer job requirements.',
      icon: FileText,
      color: 'blue'
    },
    {
      title: '2. HR Initial Screening & Telephonic Check',
      actor: 'Emily Vance (HR Recruiter)',
      timestamp: 'July 3, 2026 at 02:30 PM',
      status: 'COMPLETED',
      comment: 'Candidate confirmed notice period (30 days) and compensation expectations ($140k-$150k). Good communication skills.',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      title: '3. Technical Architecture & Coding Round',
      actor: 'Marcus Tech VP (Panel Lead)',
      timestamp: 'July 8, 2026 at 11:00 AM',
      status: 'COMPLETED',
      comment: 'Excellent performance on distributed caching and zero-trust system design. Strong recommendation to advance.',
      icon: Video,
      color: 'emerald'
    },
    {
      title: '4. Executive HR Calibration & Culture Fit Round',
      actor: 'Sarah HR VP',
      timestamp: 'July 11, 2026 at 04:00 PM',
      status: 'COMPLETED',
      comment: 'Aligned with company core values and team leadership culture. Approved for formal offer generation.',
      icon: Award,
      color: 'emerald'
    },
    {
      title: '5. Formal Employment Offer Dispatched',
      actor: 'Divyansh Super Admin / Emily Vance',
      timestamp: 'July 12, 2026 at 09:00 AM',
      status: 'PENDING',
      comment: 'Offer letter OFF-2026-089 generated with $145,000 base salary + 2,500 RSUs. Awaiting candidate e-signature.',
      icon: Send,
      color: 'amber'
    }
  ];

  const timelineSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs">
      <h3 className="text-sm font-bold text-[#191b23] dark:text-white mb-6 pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-[#2563eb]" />
          CANDIDATE HIRING PIPELINE & INTERVIEW AUDIT TIMELINE
        </span>
        <span className="text-xs font-mono text-[#737686] font-normal">4 of 5 stages complete (80%)</span>
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

export const OfferTimeline = ({ steps = [] }) => {
  const defaultSteps = [
    { title: 'Offer Terms Drafted by HR Recruiter', date: 'July 11, 2026 04:30 PM', done: true, desc: 'Base: $145,000 | Bonus: 15% | Equity: 2,500 RSUs (4-year vest).' },
    { title: 'Finance & Organization Admin Sign-Off', date: 'July 11, 2026 06:00 PM', done: true, desc: 'Approved against H2 Engineering Headcount Budget code #ENG-2026-B.' },
    { title: 'Formal Offer Dispatched via Email to Candidate', date: 'July 12, 2026 09:00 AM', done: true, desc: 'Secure signing link sent to alex.turner@dev.io with 7-day expiration.' },
    { title: 'Candidate Acceptance & E-Signature Verified', date: 'Pending Acceptance', done: false, desc: 'Once signed, automatic employee onboarding onboarding workflow will trigger.' },
  ];

  const items = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
        <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <DollarSign size={16} className="text-[#2563eb]" />
          Offer Generation & Governance Timeline
        </h4>
        <span className="text-xs font-mono text-[#737686]">3 of 4 Steps Completed</span>
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
