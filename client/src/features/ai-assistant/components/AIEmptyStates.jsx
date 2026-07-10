import React from 'react';
import { Sparkles, MessageSquare, Lightbulb, Activity, Layers, Plus, RefreshCw } from 'lucide-react';

/**
 * AIEmptyStates.jsx
 * Reusable zero-state placeholders for EWMP AI Assistant Workspace.
 * Covers NoConversations, NoRecommendations, NoInsights, and NoWorkflows.
 */

export const NoConversations = ({ onStartChat }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs my-4 font-sans animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center shadow-2xs">
      <MessageSquare size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Active AI Conversations
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 leading-relaxed">
        Your conversational history with EWMP Gemini 3.1 Pro is currently empty. Start a new session to query HR metrics, draft documents, or analyze attendance data.
      </p>
    </div>
    {onStartChat && (
      <button
        onClick={onStartChat}
        className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
      >
        <Plus size={15} /> Start New AI Session
      </button>
    )}
  </div>
);

export const NoRecommendations = ({ onResetFilter, onGenerate }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs my-4 font-sans animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-2xs">
      <Lightbulb size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Recommendations Available
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 leading-relaxed">
        The AI Engine has not identified any pending anomalies or optimization opportunities matching your selected priority or category filters.
      </p>
    </div>
    <div className="flex items-center gap-2">
      {onResetFilter && (
        <button
          onClick={onResetFilter}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#191b23] dark:text-white rounded-xl text-xs font-bold font-mono transition-colors"
        >
          Reset Filters
        </button>
      )}
      {onGenerate && (
        <button
          onClick={onGenerate}
          className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
        >
          <RefreshCw size={14} className="animate-spin" /> Run Anomaly Scan
        </button>
      )}
    </div>
  </div>
);

export const NoInsights = ({ onRunTelemetry }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs my-4 font-sans animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-2xs">
      <Activity size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Cross-Module Insights Generated
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 leading-relaxed">
        Synthesize cross-departmental correlation analytics across attendance, payroll, leave, performance, and asset inventories.
      </p>
    </div>
    {onRunTelemetry && (
      <button
        onClick={onRunTelemetry}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
      >
        <Sparkles size={15} /> Synthesize Executive Insights
      </button>
    )}
  </div>
);

export const NoWorkflows = ({ onCreateWorkflow }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs my-4 font-sans animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shadow-2xs">
      <Layers size={32} />
    </div>
    <div className="space-y-1 max-w-md mx-auto">
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        No Automated Workflows Configured
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-400 leading-relaxed">
        Use natural language to plan and automate multi-step operational tasks across attendance approvals, payroll ledger entries, or asset assignments.
      </p>
    </div>
    {onCreateWorkflow && (
      <button
        onClick={onCreateWorkflow}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5"
      >
        <Plus size={15} /> Create Natural Language Workflow
      </button>
    )}
  </div>
);
