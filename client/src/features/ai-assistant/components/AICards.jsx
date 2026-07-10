import React from 'react';
import { Sparkles, CheckCircle2, Clock, Play, Pin, Trash2, Edit3, Zap, Cpu, ArrowUpRight, Check, X, Layers } from 'lucide-react';

/**
 * AICards.jsx
 * Reusable enterprise card library for EWMP's flagship AI Assistant Workspace.
 * Includes SuggestionCard, RecommendationCard, InsightCard, WorkflowCard, PluginCard, ConversationCard, StatusBadge, and HealthIndicator.
 */

// Status Pill Badge Component
export const StatusBadge = ({ status }) => {
  const styles = {
    New: 'bg-blue-50 dark:bg-blue-950 text-[#2563eb] border-blue-200 dark:border-blue-800',
    'In Review': 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200 dark:border-amber-800',
    Applied: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800',
    Dismissed: 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700',
    Active: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800',
    Installed: 'bg-blue-50 dark:bg-blue-950 text-[#2563eb] border-blue-200 dark:border-blue-800',
    Configured: 'bg-purple-50 dark:bg-purple-950 text-purple-600 border-purple-200 dark:border-purple-800',
    Disabled: 'bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-200 dark:border-rose-800',
    Running: 'bg-blue-50 dark:bg-blue-950 text-[#2563eb] border-blue-200 dark:border-blue-800 animate-pulse',
    Completed: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200 dark:border-emerald-800',
  };

  const style = styles[status] || 'bg-gray-50 dark:bg-gray-900 text-[#737686] border-gray-200';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${style}`}>
      {status}
    </span>
  );
};

// Pulsing Health Indicator Component
export const HealthIndicator = ({ status = 'HEALTHY', latency = '120ms', uptime = '99.9%' }) => {
  const isHealthy = status === 'HEALTHY' || status === 'ONLINE' || status === 'NORMAL';
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isHealthy ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />
      </span>
      <span className="font-bold text-[#191b23] dark:text-gray-200">{status}</span>
      {latency && <span className="text-[#737686] text-[11px]">| {latency}</span>}
      {uptime && <span className="text-emerald-600 font-bold text-[11px]">({uptime})</span>}
    </div>
  );
};

// Prompt Suggestion Card
export const SuggestionCard = ({ title, description, icon: Icon = Sparkles, category, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-[#161616] hover:bg-[#faf8ff] dark:hover:bg-[#1f1f1f] border border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb] dark:hover:border-[#2563eb] rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs group flex items-start gap-3.5"
  >
    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] group-hover:scale-110 transition-transform shrink-0">
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-xs text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors truncate">
          {title}
        </h4>
        {category && (
          <span className="text-[9px] font-mono font-bold uppercase text-[#737686] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded shrink-0">
            {category}
          </span>
        )}
      </div>
      <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
        {description}
      </p>
    </div>
  </button>
);

// AI Recommendation Card with Priority & Workflow Status
export const RecommendationCard = ({
  title,
  description,
  category = 'ATTENDANCE',
  priority = 'HIGH',
  status = 'New',
  impact,
  onApply,
  onDismiss,
  onReview
}) => {
  const priorityColors = {
    CRITICAL: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300',
    HIGH: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300',
    MEDIUM: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300',
    LOW: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300',
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs hover:border-gray-400 dark:hover:border-gray-700 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200">
              {category}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase ${priorityColors[priority] || priorityColors.MEDIUM}`}>
              {priority} PRIORITY
            </span>
          </div>
          <StatusBadge status={status} />
        </div>

        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-[#2563eb] shrink-0" />
            {title}
          </h3>
          <p className="text-xs text-[#737686] dark:text-gray-300 mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        {impact && (
          <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-3 flex items-center gap-2 text-xs font-mono">
            <Zap size={15} className="text-amber-500 shrink-0" />
            <span className="text-[#191b23] dark:text-gray-200 font-bold">Estimated Impact:</span>
            <span className="text-emerald-600 font-bold">{impact}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f1f6] dark:border-gray-800/80">
        {status !== 'Dismissed' && status !== 'Applied' && (
          <>
            <button
              onClick={onDismiss}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono text-[#737686] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={onReview}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono text-[#191b23] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              In Review
            </button>
            <button
              onClick={onApply}
              className="px-4 py-1.5 rounded-xl text-xs font-bold font-mono text-white bg-[#2563eb] hover:bg-[#004ac6] transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Recommendation
            </button>
          </>
        )}
        {status === 'Applied' && (
          <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1 py-1">
            <CheckCircle2 size={15} /> Successfully Applied to Backend
          </span>
        )}
        {status === 'Dismissed' && (
          <span className="text-xs font-mono text-gray-400 flex items-center gap-1 py-1">
            <X size={15} /> Recommendation Archived
          </span>
        )}
      </div>
    </div>
  );
};

// AI Insight Card
export const InsightCard = ({ title, summary, module = 'PAYROLL', confidence = '98%', metrics = [], onExplore }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
          {module} INSIGHT
        </span>
        <span className="text-[11px] font-mono text-[#737686] flex items-center gap-1 font-bold">
          <Cpu size={13} className="text-purple-500" /> Confidence: {confidence}
        </span>
      </div>
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        {title}
      </h3>
      <p className="text-xs text-[#737686] dark:text-gray-300 leading-relaxed">
        {summary}
      </p>
    </div>

    {metrics && metrics.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#f0f1f6] dark:border-gray-800">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-[#faf8ff] dark:bg-[#161616] p-2.5 rounded-xl border border-[#f0f1f6] dark:border-gray-800">
            <span className="text-[10px] font-mono text-[#737686] block">{m.label}</span>
            <strong className="text-sm font-black text-[#191b23] dark:text-white mt-0.5 block">{m.value}</strong>
          </div>
        ))}
      </div>
    )}

    <button
      onClick={onExplore}
      className="w-full py-2 bg-[#faf8ff] dark:bg-[#161616] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#2563eb] rounded-xl text-xs font-bold font-mono border border-[#e1e2ed] dark:border-gray-800 hover:border-blue-300 transition-all flex items-center justify-center gap-1.5"
    >
      <span>Explore Full AI Telemetry</span>
      <ArrowUpRight size={14} />
    </button>
  </div>
);

// Workflow Automation Card
export const WorkflowCard = ({ title, prompt, stepsCount = 4, duration = '45s', status = 'Ready', onExecute, onPreview }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs hover:border-[#2563eb] transition-all flex flex-col justify-between space-y-4">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-200">
          AUTOMATED WORKFLOW
        </span>
        <StatusBadge status={status === 'Ready' ? 'Configured' : status} />
      </div>
      <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
        {title}
      </h3>
      <p className="text-xs font-mono text-[#737686] bg-[#faf8ff] dark:bg-[#161616] p-2.5 rounded-xl border border-[#e1e2ed] dark:border-gray-800 line-clamp-2">
        "{prompt}"
      </p>
    </div>

    <div className="flex items-center justify-between text-xs font-mono text-[#737686] pt-2 border-t border-[#f0f1f6] dark:border-gray-800">
      <span className="flex items-center gap-1">
        <Layers size={14} className="text-[#2563eb]" /> {stepsCount} Sequential Steps
      </span>
      <span className="flex items-center gap-1 font-bold text-[#191b23] dark:text-gray-300">
        <Clock size={14} /> Est: {duration}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={onPreview}
        className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#191b23] dark:text-white rounded-xl text-xs font-bold font-mono transition-colors"
      >
        Preview Steps
      </button>
      <button
        onClick={onExecute}
        className="flex-1 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center justify-center gap-1.5"
      >
        <Play size={13} className="fill-current" /> Simulate Run
      </button>
    </div>
  </div>
);

// AI Plugin Card
export const PluginCard = ({ name, description, category, status = 'Active', health = 'HEALTHY', latency = '110ms', onConfigure, onToggle }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs hover:border-gray-400 dark:hover:border-gray-700 transition-all flex flex-col justify-between space-y-4">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-600 border border-cyan-200">
          {category} PLUGIN
        </span>
        <StatusBadge status={status} />
      </div>
      <div>
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
          <Cpu size={18} className="text-[#2563eb]" /> {name}
        </h3>
        <p className="text-xs text-[#737686] dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-[#f0f1f6] dark:border-gray-800 text-xs">
      <HealthIndicator status={health} latency={latency} />
      <div className="flex items-center gap-1.5">
        <button
          onClick={onConfigure}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#737686] hover:text-[#191b23] dark:hover:text-white transition-colors"
          title="Configure Plugin Settings"
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={() => onToggle && onToggle(status === 'Active' ? 'Disabled' : 'Active')}
          className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
            status === 'Active'
              ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100'
              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          {status === 'Active' ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  </div>
);

// Conversation History List Item Card
export const ConversationCard = ({ id, title, lastMessage, timestamp, isPinned, onSelect, onPin, onDelete, onRename }) => (
  <div
    onClick={() => onSelect && onSelect(id)}
    className="bg-white dark:bg-[#161616] hover:bg-[#faf8ff] dark:hover:bg-[#1f1f1f] border border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb] rounded-xl p-3.5 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
  >
    <div className="flex items-start gap-3 min-w-0 flex-1">
      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isPinned ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500' : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb]'}`}>
        {isPinned ? <Pin size={16} className="fill-current" /> : <Sparkles size={16} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-xs text-[#191b23] dark:text-white truncate group-hover:text-[#2563eb] transition-colors">
            {title}
          </h4>
          <span className="text-[10px] font-mono text-[#737686] shrink-0">{timestamp}</span>
        </div>
        <p className="text-[11px] text-[#737686] dark:text-gray-400 mt-0.5 truncate">
          {lastMessage}
        </p>
      </div>
    </div>

    {/* Hover Actions Strip */}
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => onPin && onPin(id)}
        className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'text-amber-500 hover:bg-amber-50' : 'text-[#737686] hover:text-[#191b23] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        title={isPinned ? 'Unpin Conversation' : 'Pin Conversation'}
      >
        <Pin size={14} />
      </button>
      <button
        onClick={() => onRename && onRename(id)}
        className="p-1.5 text-[#737686] hover:text-[#191b23] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Rename Session"
      >
        <Edit3 size={14} />
      </button>
      <button
        onClick={() => onDelete && onDelete(id)}
        className="p-1.5 text-[#737686] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
        title="Delete Session"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);
