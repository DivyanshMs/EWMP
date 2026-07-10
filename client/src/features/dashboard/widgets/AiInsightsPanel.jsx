import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Lightbulb, 
  ArrowRight, 
  Send, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';

/**
 * AiInsightsPanel.jsx
 * Flagship Autonomous AI Governance & Insights Panel for EWMP Executive Dashboard.
 * Delivers real-time risk alerts, predictive recommendations, anomalies, and quick autonomous actions.
 */

export const AiInsightsPanel = ({ onOpenAiWorkspace }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [promptQuery, setPromptQuery] = useState('');

  const insights = [
    {
      id: 'alert_attendance',
      type: 'risk',
      category: 'Attendance Anomaly',
      title: '14% Spike in Monday Morning Late Arrivals',
      description:
        'Late check-ins across Engineering and Product divisions increased by 14% over three consecutive Mondays. AI correlation model indicates high friction with the recent hybrid return-to-office schedule adjustment.',
      impact: 'High Operational Friction',
      icon: ShieldAlert,
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      actionLabel: 'Review Hybrid Schedule Policy',
    },
    {
      id: 'alert_payroll',
      type: 'risk',
      category: 'Payroll Anomaly',
      title: 'Customer Support Overtime Exceeded Run-Rate by $18,400',
      description:
        'Unplanned overtime payouts in Tier-2 Helpdesk operations surged +22% above budget baseline. Analysis points to ticket volume spikes following the v2.4 mobile app release without proportional headcount regularization.',
      impact: 'Financial Budget Variance',
      icon: DollarSign,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      actionLabel: 'Simulate Headcount Regularization',
    },
    {
      id: 'rec_leave',
      type: 'recommendation',
      category: 'Leave Prediction',
      title: '38% Surge in PTO Forecasted for July Holiday Window',
      description:
        'Predictive leave models project that 38% of senior technical staff will request concurrent PTO between July 1st and July 8th. Recommend freezing non-critical infrastructure deployments during this window.',
      impact: 'Prevent SLA Breach',
      icon: Lightbulb,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      actionLabel: 'Apply Deployment Freeze Rule',
    },
    {
      id: 'rec_recruitment',
      type: 'recommendation',
      category: 'Recruitment Suggestion',
      title: 'Senior DevOps Vacancy (Req #104) Stalled at Day 42',
      description:
        'Time-to-fill for Req #104 has exceeded corporate benchmark by 18 days. Candidate pipeline analysis reveals compensation offers are lagging 12% behind current market P70 percentiles.',
      impact: 'Hiring Velocity Drop',
      icon: Users,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      actionLabel: 'Adjust Compensation Band',
    },
    {
      id: 'rec_productivity',
      type: 'recommendation',
      category: 'Productivity Insight',
      title: '+12.4% Velocity Increase Post-Automated Sprint Planning',
      description:
        'Cross-functional task completion rates across 14 agile teams improved significantly after integrating automated weekly AI task prioritization and workload balancing.',
      impact: 'Operational Efficiency',
      icon: TrendingUp,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      actionLabel: 'View Productivity Report',
    },
  ];

  const filteredInsights =
    activeTab === 'all'
      ? insights
      : activeTab === 'risks'
      ? insights.filter((item) => item.type === 'risk')
      : insights.filter((item) => item.type === 'recommendation');

  const handleShortcutSubmit = (e) => {
    e.preventDefault();
    if (!promptQuery.trim()) return;
    if (onOpenAiWorkspace) onOpenAiWorkspace();
    setPromptQuery('');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 text-white border border-indigo-500/30 shadow-xl p-6 sm:p-8">
      {/* Background glowing orb accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-indigo-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-medium tracking-wide">
            <Cpu size={14} className="text-indigo-400 animate-pulse" />
            AUTONOMOUS GOVERNANCE ENGINE v2.0
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
            Today&apos;s AI Operational Insights
            <span className="text-sm font-mono font-normal text-indigo-300 bg-indigo-900/50 px-2.5 py-0.5 rounded-md border border-indigo-700/50">
              5 Active Telemetry Nodes
            </span>
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time synthesis of cross-tenant attendance, payroll disbursements, predictive leave patterns, and recruiting bottlenecks powered by Gemini 2.0 Flash.
          </p>
        </div>

        {/* Primary action to launch full AI workspace */}
        <div className="shrink-0">
          <button
            onClick={onOpenAiWorkspace}
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={18} className="text-indigo-200" />
            View Full AI Workspace
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Actions bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            All Insights (5)
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'risks'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <AlertTriangle size={13} className={activeTab === 'risks' ? 'text-white' : 'text-rose-400'} />
            Risk Alerts (2)
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'recommendations'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Lightbulb size={13} className={activeTab === 'recommendations' ? 'text-white' : 'text-emerald-400'} />
            Recommendations (3)
          </button>
        </div>

        {/* Quick AI Autonomous Simulation Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-slate-400 uppercase mr-1 shrink-0">Quick Actions:</span>
          <button
            onClick={() => onOpenAiWorkspace && onOpenAiWorkspace()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-all whitespace-nowrap"
          >
            <Zap size={13} className="text-amber-400" />
            Simulate Payroll Run
          </button>
          <button
            onClick={() => onOpenAiWorkspace && onOpenAiWorkspace()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-all whitespace-nowrap"
          >
            <BarChart3 size={13} className="text-blue-400" />
            Audit Attrition Risk
          </button>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        {filteredInsights.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${item.badgeColor}`}>
                  <item.icon size={13} />
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Impact: <strong className="text-slate-200">{item.impact}</strong>
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> Confidence Score: 98.4%
              </span>
              <button
                onClick={() => onOpenAiWorkspace && onOpenAiWorkspace()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-200 transition-colors group-hover:underline"
              >
                {item.actionLabel}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Conversation Shortcut Bar */}
      <div className="relative z-10 mt-6 pt-5 border-t border-indigo-500/20">
        <form onSubmit={handleShortcutSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <Sparkles size={18} />
            </div>
            <input
              type="text"
              value={promptQuery}
              onChange={(e) => setPromptQuery(e.target.value)}
              placeholder="Ask AI Assistant any workforce query (e.g., 'Show salary distribution across remote teams in Q2')..."
              className="w-full pl-11 pr-24 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
                ⌘K
              </kbd>
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shrink-0"
          >
            <Send size={16} />
            Ask Assistant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiInsightsPanel;
