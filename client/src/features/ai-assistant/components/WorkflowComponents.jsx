import React from 'react';
import { CheckCircle2, Clock, Layers, Play, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './AICards';

/**
 * WorkflowComponents.jsx
 * Visual automation components for EWMP AI Assistant Workspace.
 * Includes WorkflowTimeline, step execution trackers, dependency visualization, and validation results.
 */

export const WorkflowTimeline = ({ steps = [], onExecuteStep, isSimulating }) => {
  return (
    <div className="space-y-4 font-sans animate-fade-in my-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#737686] font-mono flex items-center gap-1.5">
          <Layers size={14} className="text-[#2563eb]" /> Sequential Execution Pipeline &amp; Dependency Tree
        </h4>
        <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
          <ShieldCheck size={14} /> All 4 Dependencies Satisfied
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e1e2ed] dark:before:bg-gray-800">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'Completed';
          const isRunning = step.status === 'Running' || (isSimulating && idx === 1);
          const isFailed = step.status === 'Failed';

          return (
            <div key={step.id || idx} className="relative group">
              {/* Timeline Bullet */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isRunning
                    ? 'bg-[#2563eb] text-white animate-pulse scale-110'
                    : isFailed
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={12} /> : idx + 1}
              </div>

              {/* Step Card */}
              <div
                className={`bg-white dark:bg-[#111111] border rounded-2xl p-4 shadow-2xs transition-all ${
                  isRunning
                    ? 'border-[#2563eb] ring-2 ring-blue-500/20 dark:ring-blue-500/10'
                    : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#191b23] dark:text-white">
                      Step {idx + 1}: {step.title}
                    </span>
                    {step.module && (
                      <span className="text-[9px] font-mono font-bold uppercase bg-blue-50 dark:bg-blue-950 text-[#2563eb] px-2 py-0.5 rounded border border-blue-200">
                        {step.module}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#737686] flex items-center gap-1">
                      <Clock size={12} /> {step.duration || '2s'}
                    </span>
                    <StatusBadge status={step.status || 'Pending'} />
                  </div>
                </div>

                <p className="text-xs text-[#737686] dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                  {step.description}
                </p>

                {/* Step Dependencies / Validation Checks */}
                {step.validation && (
                  <div className="mt-3 pt-2 border-t border-[#f0f1f6] dark:border-gray-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <ShieldCheck size={13} /> Validation: {step.validation}
                    </span>
                    <span className="text-[#737686]">Target: {step.target || 'EWMP SQL API'}</span>
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

export const WorkflowValidationBanner = ({
  isValid = true,
  estimatedDuration = '45 Seconds',
  targetModules = ['Attendance', 'Payroll', 'CMDB'],
  onStartSimulation
}) => (
  <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-[#2563eb] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans">
    <div className="space-y-1.5 max-w-2xl">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-white uppercase">
          VALIDATION PASSED
        </span>
        <span className="text-xs font-mono text-[#737686] font-bold">
          Zero Syntax or RBAC Permission Errors Detected
        </span>
      </div>
      <h4 className="font-extrabold text-sm sm:text-base text-[#191b23] dark:text-white">
        Ready for Autonomous Multi-Step Execution
      </h4>
      <p className="text-xs text-[#737686] dark:text-gray-300">
        Will interact across <strong className="text-[#2563eb] dark:text-blue-400 font-bold">{targetModules.join(', ')}</strong> with SOC2 auditing enabled.
      </p>
    </div>

    <div className="flex items-center gap-3 shrink-0">
      <div className="text-right font-mono text-xs hidden sm:block">
        <span className="text-[#737686] block text-[10px] uppercase">Total Estimated Duration</span>
        <strong className="text-[#191b23] dark:text-white font-black">{estimatedDuration}</strong>
      </div>
      <button
        onClick={onStartSimulation}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-2"
      >
        <Play size={15} className="fill-current" /> Execute Workflow
      </button>
    </div>
  </div>
);
