import React, { useState } from 'react';
import { Sparkles, Plus, Send, MessageSquare, Lightbulb, Activity, Layers, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Input, Badge } from '../../../components/shared';
import { SuggestionCard, ConversationCard, StatusBadge, HealthIndicator } from '../components/AICards';
import { ChatBubble, TypingIndicator, PromptSuggestionPill } from '../components/ChatComponents';
import { sendChatMessage, toAssistantListItems } from '../utils/aiChatApi';

/**
 * AIWorkspacePage.jsx
 * AI Dashboard - Flagship command center for EWMP AI Assistant Workspace.
 * Features a large split-screen chat interface, conversation list sidebar (Pinned & Recent), suggested prompts, and quick action buttons.
 * Following Stitch Precision Enterprise Design System.
 */
export const AIWorkspacePage = ({
  onNavigate,
  onQuickAction,
  onStartNewChat,
  onToast
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'AI',
      timestamp: 'Today, 09:00 AM',
      content: "Hello! I am your EWMP Executive AI Assistant powered by the Gemini 3.1 Pro Engine.\n\nI have real-time read/write authorization across Attendance, Leave, Payroll, Performance, Recruitment, Projects, and IT Assets. How can I assist your organizational workflow today?",
      tableData: {
        headers: ['Platform Domain', 'Active Telemetry Status', 'Anomalies Detected', 'Last Sync'],
        rows: [
          ['Attendance & Shift Adherence', '98.4% Compliance Rate', '2 Late Shifts Flagged', 'Just now'],
          ['Payroll & Taxation Ledger', '$2.84M Monthly Gross Spend', '0 Variance Anomalies', '2 mins ago'],
          ['IT Asset Inventory (CMDB)', '482 Cataloged Devices', '14 Expirations Pending', '5 mins ago']
        ]
      }
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState('session-1');

  // Sample Conversations List
  const [conversations, setConversations] = useState([
    { id: 'session-1', title: 'Q3 Executive Workforce Briefing', lastMessage: 'Here is the cross-module correlation table...', timestamp: '09:00 AM', isPinned: true },
    { id: 'session-2', title: 'Engineering Overtime vs Sprint Burn', lastMessage: 'Analyzed 820 hrs overtime in Engineering...', timestamp: 'Yesterday', isPinned: true },
    { id: 'session-3', title: 'Parental Leave Policy Optimization', lastMessage: 'Drafted updated Q4 HR memorandum...', timestamp: 'Jul 05', isPinned: false },
    { id: 'session-4', title: 'CMDB Hardware Refresh Audit', lastMessage: 'Identified 14 MacBook Pro units expiring...', timestamp: 'Jul 02', isPinned: false },
  ]);

  const handleSendMessage = (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : inputPrompt;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'USER',
      timestamp: 'Just now',
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInputPrompt('');
    setIsSynthesizing(true);

    (async () => {
      try {
        const result = await sendChatMessage(text);
        const responseText = result.response || 'The AI service returned an empty response.';

        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: 'AI',
          timestamp: 'Just now',
          content: responseText,
          listItems: toAssistantListItems(result),
        }]);

        if (onToast) onToast('AI response generated successfully.');
      } catch (error) {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: 'AI',
          timestamp: 'Just now',
          content: error?.response?.data?.message || error?.message || 'Unable to reach the AI service right now.',
        }]);

        if (onToast) onToast('AI request failed.');
      } finally {
        setIsSynthesizing(false);
      }
    })();
  };

  const handleTogglePin = (id) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
    if (onToast) onToast('Conversation pin status updated.');
  };

  const handleDeleteConversation = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (onToast) onToast('Conversation archived from session store.');
  };

  const handleRenameConversation = (id) => {
    const newName = prompt('Enter a new title for this AI conversation session:');
    if (newName && newName.trim()) {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: newName.trim() } : c))
      );
      if (onToast) onToast('Conversation renamed successfully.');
    }
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newConvo = {
      id: newId,
      title: 'New AI Telemetry Session',
      lastMessage: 'Session initialized...',
      timestamp: 'Just now',
      isPinned: false
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveSessionId(newId);
    setMessages([
      {
        id: Date.now(),
        sender: 'AI',
        timestamp: 'Just now',
        content: "New session started! How can I analyze your workforce telemetry today?"
      }
    ]);
    if (onStartNewChat) onStartNewChat();
    if (onToast) onToast('New AI conversational session initialized.');
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner & Quick Actions Strip */}
      <Card elevation="level2" className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] text-white border-none overflow-hidden">
        <CardBody className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="space-y-1.5 z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="bg-white/20 backdrop-blur-xs border-white/30 text-white">
                FLAGSHIP AI COMMAND CENTER
              </Badge>
              <span className="text-xs font-mono text-blue-100 flex items-center gap-1 font-bold">
                <ShieldCheck size={13} className="text-emerald-400" /> Prompt Security Guardrails Online
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              EWMP Executive AI Assistant Workspace
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
              Autonomous business intelligence, cross-module anomaly detection, natural language workflow automation, and predictive labor modeling across all 8 enterprise domains.
            </p>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex flex-wrap items-center gap-2 z-10 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleNewChat}
              leftIcon={<Plus size={15} />}
            >
              New Chat
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate && onNavigate('recommendations')}
              leftIcon={<Lightbulb size={15} className="text-amber-500" />}
            >
              Generate Recommendation
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate && onNavigate('insights')}
              leftIcon={<Activity size={15} className="text-emerald-500" />}
            >
              Generate Insight
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate && onNavigate('workflows')}
              leftIcon={<Layers size={15} className="text-purple-500" />}
            >
              Create Workflow
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate && onNavigate('plugins')}
              leftIcon={<Cpu size={15} className="text-cyan-500" />}
            >
              View Plugins
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Split Screen Workspace: Sidebar & Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar: Conversation List */}
        <Card elevation="level1" className="lg:col-span-1 space-y-4">
          <CardBody className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f1f6] dark:border-gray-800">
              <h3 className="font-extrabold text-xs text-[#191b23] dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#2563eb]" /> Session History
              </h3>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleNewChat}
                leftIcon={<Plus size={14} />}
              >
                New
              </Button>
            </div>

            {/* Pinned Conversations */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#737686] block px-1">
                Pinned Conversations ({conversations.filter(c => c.isPinned).length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {conversations.filter(c => c.isPinned).map((c) => (
                  <ConversationCard
                    key={c.id}
                    {...c}
                    onSelect={setActiveSessionId}
                    onPin={handleTogglePin}
                    onDelete={handleDeleteConversation}
                    onRename={handleRenameConversation}
                  />
                ))}
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="space-y-2 pt-2 border-t border-[#f0f1f6] dark:border-gray-800">
              <span className="text-[10px] font-mono font-bold uppercase text-[#737686] block px-1">
                Recent Conversations ({conversations.filter(c => !c.isPinned).length})
              </span>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {conversations.filter(c => !c.isPinned).map((c) => (
                  <ConversationCard
                    key={c.id}
                    {...c}
                    onSelect={setActiveSessionId}
                    onPin={handleTogglePin}
                    onDelete={handleDeleteConversation}
                    onRename={handleRenameConversation}
                  />
                ))}
              </div>
            </div>

            {/* Quick System Health Status */}
            <Card elevation="level0" className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[#737686]">Engine Status:</span>
                <HealthIndicator status="HEALTHY" latency="115ms" />
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#737686]">Memory Store:</span>
                <span className="text-emerald-600 font-bold">Active &amp; Encrypted</span>
              </div>
            </Card>
          </CardBody>
        </Card>

        {/* Center / Right: Interactive Chat Workspace */}
        <Card elevation="level1" className="lg:col-span-3 flex flex-col h-[700px] overflow-hidden">
          {/* Workspace Chat Header */}
          <div className="p-4 sm:p-5 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between bg-[#faf8ff] dark:bg-[#161616]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#191b23] dark:text-white">
                    {conversations.find(c => c.id === activeSessionId)?.title || 'AI Conversational Session'}
                  </h3>
                  <Badge variant="success" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-200">
                    GEMINI 3.1 PRO ONLINE
                  </Badge>
                </div>
                <p className="text-xs text-[#737686] font-mono">
                  Synthesizing cross-module telemetry across Attendance, Payroll, Leave &amp; Projects
                </p>
              </div>
            </div>

            <Button
              variant="outlined"
              size="sm"
              onClick={() => onNavigate && onNavigate('chat')}
              rightIcon={<ArrowRight size={14} />}
            >
              Fullscreen Chat View
            </Button>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#fcfbff] dark:bg-[#0a0a0a]">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} {...msg} />
            ))}
            {isSynthesizing && <TypingIndicator />}
          </div>

          {/* Suggested Prompts Strip */}
          <div className="px-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#f0f1f6] dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono font-bold uppercase text-[#737686] shrink-0">
              Suggested Prompts:
            </span>
            <PromptSuggestionPill label="Analyze Engineering Payroll Spend" onClick={handleSendMessage} />
            <PromptSuggestionPill label="Generate Attendance Heatmap Report" onClick={handleSendMessage} />
            <PromptSuggestionPill label="Audit Expiring Laptop Warranties" onClick={handleSendMessage} />
            <PromptSuggestionPill label="Draft Q4 Leave Policy Memo" onClick={handleSendMessage} />
          </div>

          {/* Message Input Box */}
          <div className="p-4 bg-white dark:bg-[#111111] border-t border-[#e1e2ed] dark:border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask EWMP AI anything (e.g., 'Compare overtime in Sales vs Engineering', 'Create a leave approval workflow')..."
                  className="pr-10"
                />
                <div className="absolute right-3 top-3.5 text-[#737686]">
                  <Sparkles size={16} />
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputPrompt.trim() || isSynthesizing}
                rightIcon={<Send size={15} />}
              >
                Ask AI
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Suggested Prompts Catalog Grid */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-500" /> Automated AI Prompt Starters &amp; Slicers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SuggestionCard
            title="Attendance Variance Audit"
            description="Scan daily shift adherence logs for late arrivals and overtime spikes across engineering teams."
            category="ATTENDANCE"
            onClick={() => handleSendMessage("Run Attendance Variance Audit")}
          />
          <SuggestionCard
            title="Payroll Tax Reconciliation"
            description="Reconcile FY26 gross compensation ledgers against state and federal tax deductions."
            category="PAYROLL"
            onClick={() => handleSendMessage("Perform Payroll Tax Reconciliation")}
          />
          <SuggestionCard
            title="Parental Leave Forecast"
            description="Project departmental staffing balance ratios during upcoming summer vacation cycles."
            category="LEAVE"
            onClick={() => handleSendMessage("Generate Parental Leave Forecast")}
          />
          <SuggestionCard
            title="CMDB Warranty Expiry Alert"
            description="Identify assigned hardware devices reaching their 3-year depreciation limit within 60 days."
            category="ASSETS"
            onClick={() => handleSendMessage("Check CMDB Warranty Expiry Alerts")}
          />
        </div>
      </div>
    </div>
  );
};
