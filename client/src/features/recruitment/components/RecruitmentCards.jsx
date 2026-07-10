import React from 'react';
import { Briefcase, MapPin, Users, Calendar, Clock, Video, FileText, CheckCircle2, ChevronRight, Sparkles, Mail, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { JobStatusBadge, StageBadge, EmploymentTypeBadge, OfferStatusBadge, InterviewModeBadge } from './RecruitmentBadges';

/**
 * RecruitmentCards.jsx
 * Enterprise reusable cards and widgets for EWMP Recruitment Management.
 */

export const JobCard = ({ job, onSelect, onEdit }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs hover:shadow-md hover:border-[#c3c6d7] transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#2563eb] dark:text-blue-400 uppercase tracking-wider block mb-0.5">
              {job.department}
            </span>
            <h3 className="text-base font-bold text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors line-clamp-1">
              {job.title}
            </h3>
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#737686] dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-[#2563eb]" /> {job.location}
          </span>
          <span>•</span>
          <EmploymentTypeBadge type={job.type || 'FULL_TIME'} />
        </div>

        <p className="text-xs text-[#434655] dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
          {job.description || 'Responsible for driving engineering excellence, mentoring team members, and delivering mission-critical enterprise systems.'}
        </p>
      </div>

      <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-[#191b23] dark:text-white font-bold flex items-center gap-1" title="Open Positions">
            <Briefcase size={14} className="text-[#737686]" /> {job.openings} Openings
          </span>
          <span className="text-[#2563eb] font-bold flex items-center gap-1" title="Total Applications">
            <Users size={14} className="text-[#2563eb]" /> {job.applicants || 14} Applicants
          </span>
        </div>
        <button
          onClick={() => onSelect && onSelect(job)}
          className="px-3 py-1.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white font-semibold rounded transition-colors inline-flex items-center gap-1"
        >
          Manage <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export const CandidateCard = ({ candidate, onSelect, onViewResume }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs hover:border-[#c3c6d7] transition-all flex flex-col justify-between">
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563eb] to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center font-mono shrink-0 shadow-2xs">
          {candidate.photo ? (
            <img src={candidate.photo} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-[#191b23] dark:text-white truncate hover:text-[#2563eb] cursor-pointer" onClick={() => onSelect && onSelect(candidate)}>
              {candidate.name}
            </h4>
            <span className="text-[10px] font-mono text-[#737686] shrink-0">{candidate.experience} yrs exp</span>
          </div>
          <span className="text-xs font-semibold text-[#2563eb] block truncate">{candidate.appliedRole || 'Senior Software Engineer'}</span>
          <div className="flex items-center gap-3 text-[11px] text-[#737686] mt-1 truncate font-mono">
            <span className="flex items-center gap-1 truncate"><Mail size={11} /> {candidate.email}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between gap-2">
        <StageBadge stage={candidate.stage || 'SCREENING'} />
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewResume && onViewResume(candidate)}
            className="px-2.5 py-1 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-900 dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-white text-[11px] font-semibold rounded inline-flex items-center gap-1 transition-colors"
            title="View Resume PDF"
          >
            <FileText size={12} className="text-[#2563eb]" /> Resume
          </button>
          <button
            onClick={() => onSelect && onSelect(candidate)}
            className="px-2.5 py-1 bg-[#2563eb] hover:bg-[#004ac6] text-white text-[11px] font-semibold rounded transition-colors inline-flex items-center gap-1"
          >
            Profile <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const InterviewCard = ({ interview, onJoin, onFeedback }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 shadow-xs hover:border-[#2563eb] transition-all space-y-3">
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#e1e2ed] dark:border-gray-800">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#737686] uppercase block">Scheduled Interview • {interview.round || 'Technical Round'}</span>
          <h4 className="font-bold text-sm text-[#191b23] dark:text-white">{interview.candidateName}</h4>
          <span className="text-xs text-[#2563eb] font-medium block">{interview.appliedRole}</span>
        </div>
        <InterviewModeBadge mode={interview.mode || 'VIDEO'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#faf8ff] dark:bg-gray-900/40 p-2.5 rounded border border-[#e1e2ed]/50 font-mono">
        <div className="flex items-center gap-1.5 text-[#191b23] dark:text-gray-300">
          <Calendar size={13} className="text-[#2563eb] shrink-0" />
          <span>{interview.date || 'July 8, 2026'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#191b23] dark:text-gray-300">
          <Clock size={13} className="text-amber-600 shrink-0" />
          <span>{interview.time || '10:30 AM - 11:30 AM'}</span>
        </div>
      </div>

      <div className="text-xs flex items-center justify-between text-[#737686]">
        <span>Panel: <strong className="text-[#191b23] dark:text-white">{interview.interviewer || 'Marcus Tech VP'}</strong></span>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800">
          {interview.feedbackStatus || 'Pending Feedback'}
        </span>
      </div>

      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#e1e2ed] dark:border-gray-800">
        <a
          href={interview.meetLink || 'https://meet.ewmp.enterprise/room-482'}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-2xs transition-colors truncate max-w-[190px]"
        >
          <Video size={13} /> Launch Meeting Room
        </a>
        <button
          onClick={() => onFeedback && onFeedback(interview)}
          className="px-3 py-1.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors"
        >
          Submit Score
        </button>
      </div>
    </div>
  );
};

export const PipelineColumn = ({ title, count = 0, stageKey, children, onAdd }) => {
  const borderColors = {
    APPLIED: 'border-t-blue-500',
    SCREENING: 'border-t-indigo-500',
    INTERVIEW: 'border-t-purple-500',
    TECHNICAL_ROUND: 'border-t-amber-500',
    HR_ROUND: 'border-t-teal-500',
    OFFER: 'border-t-emerald-500',
    HIRED: 'border-t-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/10',
    REJECTED: 'border-t-rose-500 opacity-80',
  };

  const appliedBorder = borderColors[stageKey] || 'border-t-[#2563eb]';

  return (
    <div className={`flex flex-col bg-[#faf8ff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg w-72 shrink-0 border-t-4 ${appliedBorder} shadow-2xs max-h-[750px]`}>
      <div className="p-3.5 bg-white dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between rounded-t-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-xs text-[#191b23] dark:text-white uppercase tracking-wider">{title}</h4>
          <span className="w-5 h-5 rounded-full bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] dark:text-blue-400 text-[11px] font-mono font-extrabold flex items-center justify-center">
            {count}
          </span>
        </div>
        {onAdd && (
          <button onClick={() => onAdd(stageKey)} className="p-1 hover:bg-[#ededf9] dark:hover:bg-gray-800 rounded text-[#737686] hover:text-[#191b23] dark:hover:text-white transition-colors" title="Add candidate to stage">
            +
          </button>
        )}
      </div>

      <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
        {children || (
          <div className="p-6 border-2 border-dashed border-[#c3c6d7] dark:border-gray-800 rounded text-center text-xs text-[#737686]">
            Drag & Drop candidate cards here
          </div>
        )}
      </div>
    </div>
  );
};

export const OfferCard = ({ offer, onAccept, onReject, onWithdraw }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border-2 border-[#2563eb] dark:border-blue-800 rounded-xl p-6 shadow-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
        <div>
          <span className="text-xs font-mono font-bold text-[#2563eb] uppercase tracking-wider">Formal Employment Offer Letter • {offer.id || 'OFF-2026-089'}</span>
          <h3 className="text-lg font-bold text-[#191b23] dark:text-white">{offer.candidateName}</h3>
          <span className="text-xs text-[#737686] font-medium block">Role: <strong className="text-[#191b23] dark:text-white">{offer.role || 'Senior Tech Lead (SDE-III)'}</strong> • Dept: {offer.department || 'Engineering'}</span>
        </div>
        <OfferStatusBadge status={offer.status || 'PENDING'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg border border-[#e1e2ed] dark:border-gray-800 font-mono">
        <div>
          <span className="text-[11px] text-[#737686] uppercase block">Base Salary Package</span>
          <strong className="text-base font-extrabold text-[#191b23] dark:text-white">{offer.salary || '$145,000 / annum'}</strong>
        </div>
        <div>
          <span className="text-[11px] text-[#737686] uppercase block">Target Bonus & Equity</span>
          <strong className="text-base font-extrabold text-emerald-600">{offer.bonus || '15% Bonus + 2,500 RSUs'}</strong>
        </div>
        <div>
          <span className="text-[11px] text-[#737686] uppercase block">Target Joining Date</span>
          <strong className="text-base font-extrabold text-[#2563eb]">{offer.joiningDate || 'August 16, 2026'}</strong>
        </div>
      </div>

      <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900 text-xs text-[#434655] dark:text-gray-300 italic leading-relaxed">
        "We are thrilled to extend this formal offer of employment to join our engineering organization at EWMP. This offer includes full executive healthcare benefits, flexible global remote work, and annual learning stipends."
      </div>

      <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-mono text-[#737686]">Offer Expiration: <strong className="text-rose-600">7 Days from Issuance</strong></span>
        <div className="flex items-center gap-2">
          {offer.status === 'PENDING' && (
            <>
              <button
                onClick={() => onWithdraw && onWithdraw(offer)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded transition-colors"
              >
                Withdraw Offer
              </button>
              <button
                onClick={() => onReject && onReject(offer)}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 font-semibold rounded border border-rose-200 transition-colors"
              >
                Mark Declined
              </button>
              <button
                onClick={() => onAccept && onAccept(offer)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1"
              >
                <CheckCircle2 size={14} /> Mark Accepted!
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const PerformanceAnalyticsCard = ({ title, value, subtitle, icon: IconComp, change, trend = 'up' }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs hover:border-[#c3c6d7] transition-all flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-semibold text-[#737686] uppercase tracking-wider">{title}</span>
      {IconComp && (
        <div className="w-8 h-8 rounded-lg bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] flex items-center justify-center shrink-0">
          <IconComp size={16} />
        </div>
      )}
    </div>
    <div>
      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#191b23] dark:text-white block tracking-tight">{value}</span>
      {subtitle && <span className="text-xs text-[#737686] block mt-0.5">{subtitle}</span>}
    </div>
    {change && (
      <div className="mt-3 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800/60 flex items-center justify-between text-xs font-mono">
        <span className="text-[#737686]">vs prior period</span>
        <span className={`inline-flex items-center gap-1 font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>
    )}
  </div>
);

export const ChartPlaceholder = ({ title, height = 'h-64', type = 'bar' }) => (
  <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
    <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4">
      <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
        <Sparkles size={16} className="text-[#2563eb]" /> {title}
      </h3>
      <span className="text-xs font-mono text-[#737686]">Live Telemetry Feed</span>
    </div>
    <div className={`w-full ${height} bg-[#faf8ff] dark:bg-[#161616] border border-dashed border-[#c3c6d7] dark:border-gray-800 rounded-lg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
      <div className="flex items-end justify-center gap-3 w-full h-3/4 pb-4 border-b border-[#e1e2ed] dark:border-gray-800 px-8">
        {[45, 75, 60, 90, 80, 100, 65, 85].map((val, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-[#2563eb] to-indigo-500 rounded-t-sm transition-all group-hover:opacity-90 relative" style={{ height: `${val}%` }}>
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#737686] opacity-0 group-hover:opacity-100 transition-opacity">{val}%</span>
          </div>
        ))}
      </div>
      <span className="text-xs font-mono text-[#737686] mt-3">Statistical conversion distribution over active hiring stages</span>
    </div>
  </div>
);
