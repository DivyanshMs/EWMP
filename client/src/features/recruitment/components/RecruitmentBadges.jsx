import React from 'react';

/**
 * RecruitmentBadges.jsx
 * Precision Enterprise status badges and stage chips for EWMP Recruitment Management.
 * Adheres strictly to Stitch MCP Precision Enterprise Design System rules.
 */

export const JobStatusBadge = ({ status }) => {
  const styles = {
    PUBLISHED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    DRAFT: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    ON_HOLD: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    CLOSED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
    URGENT: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
  };

  const labels = {
    PUBLISHED: 'Active Open',
    DRAFT: 'Draft Stage',
    ON_HOLD: 'On Hold',
    CLOSED: 'Filled / Closed',
    URGENT: 'Urgent Hire',
  };

  const appliedStyle = styles[status] || styles.DRAFT;
  const label = labels[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border shadow-2xs ${appliedStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
};

export const StageBadge = ({ stage }) => {
  const styles = {
    APPLIED: 'bg-blue-100 text-[#2563eb] dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    SCREENING: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
    INTERVIEW: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900',
    TECHNICAL_ROUND: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    HR_ROUND: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900',
    OFFER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    HIRED: 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white border-emerald-600 font-extrabold shadow-xs',
    REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900 line-through',
  };

  const labels = {
    APPLIED: '1. Applied',
    SCREENING: '2. HR Screening',
    INTERVIEW: '3. Manager Interview',
    TECHNICAL_ROUND: '4. Tech / Case Round',
    HR_ROUND: '5. Final HR Round',
    OFFER: '6. Offer Extended',
    HIRED: '★ Hired Onboarded',
    REJECTED: '✕ Rejected',
  };

  const appliedStyle = styles[stage] || styles.APPLIED;
  const label = labels[stage] || stage;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${appliedStyle}`}>
      {label}
    </span>
  );
};

export const EmploymentTypeBadge = ({ type }) => {
  const styles = {
    FULL_TIME: 'bg-[#faf8ff] text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-300 border-[#2563eb]/40',
    CONTRACT: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    INTERN: 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    REMOTE: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  };

  const labels = {
    FULL_TIME: 'Full-Time (Permanent)',
    CONTRACT: 'Contract / Consultant',
    INTERN: 'Internship / Trainee',
    REMOTE: '100% Remote Global',
  };

  const appliedStyle = styles[type] || styles.FULL_TIME;
  const label = labels[type] || type;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${appliedStyle}`}>
      {label}
    </span>
  );
};

export const OfferStatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
    ACCEPTED: 'bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-xs',
    REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
    WITHDRAWN: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-400',
  };

  const labels = {
    PENDING: '⏳ Awaiting Candidate Acceptance',
    ACCEPTED: '✓ Offer Accepted!',
    REJECTED: '✕ Offer Declined',
    WITHDRAWN: '⛔ Offer Withdrawn by HR',
  };

  const appliedStyle = styles[status] || styles.PENDING;
  const label = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-bold border ${appliedStyle}`}>
      {label}
    </span>
  );
};

export const InterviewModeBadge = ({ mode }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
    mode === 'VIDEO' || mode === 'Online'
      ? 'bg-blue-50 text-[#2563eb] border-blue-200 dark:bg-blue-950/40 dark:border-blue-900'
      : 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900'
  }`}>
    {mode === 'VIDEO' || mode === 'Online' ? '🎥 Video Meet' : '🏢 On-Site Office'}
  </span>
);
