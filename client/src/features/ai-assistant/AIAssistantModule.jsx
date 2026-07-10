import React, { useState } from 'react';
import { Sparkles, MessageSquare, Lightbulb, Activity, Layers, Cpu, History, Radio, Search, Plus, ShieldCheck, X, ArrowUpRight } from 'lucide-react';

import { AIWorkspacePage } from './pages/AIWorkspacePage';
import { ChatInterfacePage } from './pages/ChatInterfacePage';
import { RecommendationsCenterPage } from './pages/RecommendationsCenterPage';
import { InsightsDashboardPage } from './pages/InsightsDashboardPage';
import { WorkflowPlannerPage } from './pages/WorkflowPlannerPage';
import { PluginExplorerPage } from './pages/PluginExplorerPage';
import { ConversationHistoryPage } from './pages/ConversationHistoryPage';
import { AIHealthDashboardPage } from './pages/AIHealthDashboardPage';

/**
 * AIAssistantModule.jsx
 * Master orchestrator and navigation hub for EWMP's flagship AI Assistant Workspace.
 * Manages tab switching across all 8 AI views, global search, quick action triggers, and interactive notification toasts.
 */
export const AIAssistantModule = () => {
  const [activeTab, setActiveTab] = useState('workspace');
  const [toastMessage, setToastMessage] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const navTabs = [
    { id: 'workspace', label: 'AI Workspace', icon: Sparkles, badge: 'FLAGSHIP' },
    { id: 'chat', label: 'Chat Interface', icon: MessageSquare },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, count: 8 },
    { id: 'insights', label: 'Insights Dashboard', icon: Activity, count: 8 },
    { id: 'workflows', label: 'Workflow Planner', icon: Layers },
    { id: 'plugins', label: 'Plugin Explorer', icon: Cpu, count: 12 },
    { id: 'history', label: 'Conversation History', icon: History },
    { id: 'health', label: 'AI Health & DevOps', icon: Radio, dot: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0a0a0a] text-[#191b23] dark:text-gray-100 pb-16 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191b23] dark:bg-[#2563eb] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700 font-mono text-xs animate-slide-up">
          <Sparkles size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X size={15} />
          </button>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-[#2563eb] rounded-xl">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#191b23] dark:text-white">
                    Start New AI Conversational Session
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    Connected to Gemini 3.1 Pro Engine
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1.5 text-gray-400 hover:text-[#191b23] dark:hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#737686] dark:text-gray-300 leading-relaxed">
              Select an enterprise data scope or template to initialize your new conversational session with pre-configured domain instructions.
            </p>

            <div className="space-y-2.5">
              {[
                { title: 'Full Workforce Intelligence (All 8 Domains)', desc: 'Unrestricted cross-module telemetry & SQL query generation.', cat: 'ALL' },
                { title: 'Payroll & Taxation Variance Auditor', desc: 'Pre-configured for ledger reconciliations & salary band checks.', cat: 'PAYROLL' },
                { title: 'Attendance & Shift Adherence Review', desc: 'Focuses on overtime spikes, late arrivals, and PTO balances.', cat: 'ATTENDANCE' },
                { title: 'CMDB IT Asset Warranty & Hardware Planner', desc: 'Analyzes laptop depreciation limits and device inventories.', cat: 'ASSETS' },
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowNewChatModal(false);
                    setActiveTab('chat');
                    showToast(`Initialized new session: "${tmpl.title}"`);
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#faf8ff] dark:bg-[#111111] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb] transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors">
                      {tmpl.title}
                    </h4>
                    <p className="text-[11px] text-[#737686] mt-0.5">{tmpl.desc}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-[#737686] group-hover:text-[#2563eb] shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#191b23] dark:text-white rounded-xl text-xs font-bold font-mono transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Header & Global Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center shadow-md shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-[#191b23] dark:text-white tracking-tight">
                  EWMP AI Assistant Workspace
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
                  GEMINI 3.1 PRO
                </span>
              </div>
              <p className="text-xs text-[#737686] font-mono flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck size={13} /> Enterprise Guardrails Online
                </span>
                <span className="hidden sm:inline">| Latency: 115ms | SOC2 Audit Active</span>
              </p>
            </div>
          </div>

          {/* Global Search Box */}
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search conversations, insights, plugins..."
                className="w-full bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-2xl pl-9 pr-4 py-2 text-xs text-[#191b23] dark:text-white focus:outline-hidden focus:border-[#2563eb] transition-all"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
            </div>

            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-2xl text-xs font-bold font-mono transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus size={15} /> <span>New Session</span>
            </button>
          </div>
        </div>

        {/* Interactive Navigation Tab Strip */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-[#737686] hover:text-[#191b23] dark:hover:text-white hover:bg-[#faf8ff] dark:hover:bg-[#161616]'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-white' : 'text-[#2563eb]'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${isActive ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-950 text-[#2563eb]'}`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-[#737686]'}`}>
                    {tab.count}
                  </span>
                )}
                {tab.dot && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Page Content Routing */}
        <div className="min-h-[600px]">
          {activeTab === 'workspace' && (
            <AIWorkspacePage
              onNavigate={(tab) => setActiveTab(tab)}
              onStartNewChat={() => setShowNewChatModal(true)}
              onToast={showToast}
            />
          )}
          {activeTab === 'chat' && (
            <ChatInterfacePage
              onNavigate={(tab) => setActiveTab(tab)}
              onToast={showToast}
            />
          )}
          {activeTab === 'recommendations' && (
            <RecommendationsCenterPage onToast={showToast} />
          )}
          {activeTab === 'insights' && (
            <InsightsDashboardPage
              onNavigate={(tab) => setActiveTab(tab)}
              onToast={showToast}
            />
          )}
          {activeTab === 'workflows' && (
            <WorkflowPlannerPage onToast={showToast} />
          )}
          {activeTab === 'plugins' && (
            <PluginExplorerPage onToast={showToast} />
          )}
          {activeTab === 'history' && (
            <ConversationHistoryPage
              onNavigate={(tab) => setActiveTab(tab)}
              onToast={showToast}
            />
          )}
          {activeTab === 'health' && (
            <AIHealthDashboardPage onToast={showToast} />
          )}
        </div>
      </div>
    </div>
  );
};
