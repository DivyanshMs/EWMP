import React from 'react';
import { CheckCircle2, Clock, UserCheck, Send, MessageSquare } from 'lucide-react';
import { LeaveStatusBadge } from './LeaveBadges';

/**
 * LeaveTimeline.jsx
 * Approval workflow and audit history timeline for EWMP Leave Management.
 * Renders submitted timestamp, managerial reviews, comments, and final HR decision.
 */

export const LeaveTimeline = ({ steps = [] }) => {
  const defaultSteps = [
    {
      title: 'Leave Request Submitted',
      actor: 'Sarah SDE-II (Employee)',
      timestamp: 'July 2, 2026 at 10:15 AM',
      status: 'COMPLETED',
      comment: 'Submitted annual leave request for family vacation. All current sprint tasks transferred to Alex.',
      icon: Send,
      color: 'blue'
    },
    {
      title: 'Team Manager Review',
      actor: 'Michael Tech Lead (Manager)',
      timestamp: 'July 2, 2026 at 02:45 PM',
      status: 'COMPLETED',
      comment: 'Approved. Handover plan verified with sprint backlog. Enjoy the vacation!',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      title: 'HR Operations & Payroll Authorization',
      actor: 'Emily HR Specialist (HR Manager)',
      timestamp: 'July 3, 2026 at 09:30 AM',
      status: 'COMPLETED',
      comment: 'Final approval granted. 5 days deducted from Annual Leave balance.',
      icon: CheckCircle2,
      color: 'emerald'
    }
  ];

  const timelineSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs">
      <h3 className="text-sm font-bold text-[#191b23] dark:text-white mb-6 pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-[#2563eb]" />
          LEAVE APPROVAL TIMELINE & AUDIT TRAIL
        </span>
        <span className="text-xs font-mono text-[#737686] font-normal">3 steps completed</span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#e1e2ed] dark:before:bg-gray-800">
        {timelineSteps.map((step, idx) => {
          const IconComp = step.icon || CheckCircle2;
          const isLast = idx === timelineSteps.length - 1;
          
          const iconColors = {
            blue: 'bg-[#2563eb] text-white border-blue-100 dark:border-blue-900',
            emerald: 'bg-emerald-600 text-white border-emerald-100 dark:border-emerald-900',
            amber: 'bg-amber-500 text-white border-amber-100 dark:border-amber-900',
            rose: 'bg-rose-600 text-white border-rose-100 dark:border-rose-900',
          };

          const colorStyle = iconColors[step.color] || iconColors.emerald;

          return (
            <div key={idx} className="relative group">
              {/* Timeline dot icon */}
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
