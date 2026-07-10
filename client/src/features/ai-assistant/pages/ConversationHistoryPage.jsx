import React, { useState } from 'react';
import { MessageSquare, Search, Pin, Trash2, Edit3, ArrowRight, Download, Filter, Eye, ShieldCheck } from 'lucide-react';
import { Card, CardBody, Button, Input, Badge } from '../../../components/shared';
import { ConversationCard, StatusBadge } from '../components/AICards';
import { NoConversations } from '../components/AIEmptyStates';

/**
 * ConversationHistoryPage.jsx
 * Conversation History - Audit archive of previous AI conversational sessions for EWMP.
 * Features full-text search history, pinned session filtering, rename/delete controls, and detailed session preview drawers.
 * Following Stitch Precision Enterprise Design System.
 */
export const ConversationHistoryPage = ({ onNavigate, onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'PINNED' | 'TODAY'
  const [selectedSession, setSelectedSession] = useState(null);

  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      title: 'Q3 Executive Workforce Briefing & Cross-Module Slicing',
      lastMessage: 'Synthesized 8 live recommendations for Engineering and Customer Ops...',
      timestamp: 'Today, 09:00 AM',
      date: '2026-07-08',
      tokens: '14,250 Tokens',
      model: 'Gemini 3.1 Pro Engine',
      isPinned: true,
      details: [
        { sender: 'USER', text: 'Summarize key risks in our Q3 workforce allocation.' },
        { sender: 'AI', text: 'Analyzed 482 CMDB devices and $2.84M payroll spend. Identified 2 critical anomalies in attendance and project sprint velocity.' }
      ]
    },
    {
      id: 'session-2',
      title: 'Engineering Overtime vs Sprint Burn Down Investigation',
      lastMessage: 'Analyzed 820 hrs overtime in Engineering R&D due to PRJ-101...',
      timestamp: 'Yesterday, 16:45 PM',
      date: '2026-07-07',
      tokens: '9,840 Tokens',
      model: 'Gemini 3.1 Pro Engine',
      isPinned: true,
      details: [
        { sender: 'USER', text: 'Why is engineering overtime spiking this month?' },
        { sender: 'AI', text: 'Overtime correlates with milestone deadlines on Cloud Migration PRJ-101. Reallocating 2 junior DevOps engineers is recommended.' }
      ]
    },
    {
      id: 'session-3',
      title: 'Parental Leave Policy Optimization & Q4 Memorandum Drafting',
      lastMessage: 'Drafted updated Q4 HR memorandum compliant with UK statutory limits...',
      timestamp: 'Jul 05, 2026',
      date: '2026-07-05',
      tokens: '6,120 Tokens',
      model: 'Gemini 3.1 Pro Engine',
      isPinned: false,
      details: [
        { sender: 'USER', text: 'Draft an HR announcement for our new parental leave benefits.' },
        { sender: 'AI', text: 'Drafted professional announcement highlighting 16-week paid leave and phased return schedules.' }
      ]
    },
    {
      id: 'session-4',
      title: 'CMDB Hardware Refresh Audit & Battery Health Scan',
      lastMessage: 'Identified 14 MacBook Pro units assigned to backend architects reaching 3-yr limit...',
      timestamp: 'Jul 02, 2026',
      date: '2026-07-02',
      tokens: '8,400 Tokens',
      model: 'Gemini 3.1 Pro Engine',
      isPinned: false,
      details: [
        { sender: 'USER', text: 'Which laptops need replacement before Q4?' },
        { sender: 'AI', text: 'Scanned 482 devices. 14 Apple MacBook Pro M1 Max units show <80% battery capacity.' }
      ]
    },
    {
      id: 'session-5',
      title: 'Sales Department Quota vs Appraisal Normalization',
      lastMessage: 'Calculated positive rating skew in Sales & Growth (Avg 4.45 vs 4.20 target)...',
      timestamp: 'Jun 28, 2026',
      date: '2026-06-28',
      tokens: '11,900 Tokens',
      model: 'Gemini 3.1 Pro Engine',
      isPinned: false,
      details: [
        { sender: 'USER', text: 'Are performance review scores in Sales inflated?' },
        { sender: 'AI', text: 'Yes, current average is 4.45/5.0 compared to normal target of 4.20. Recommended calibration review.' }
      ]
    }
  ]);

  const handleTogglePin = (id) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
    if (onToast) onToast('Session pin status updated.');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this AI conversation session?')) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSession?.id === id) setSelectedSession(null);
      if (onToast) onToast('Session archived and removed from audit log.');
    }
  };

  const handleRename = (id) => {
    const newName = prompt('Enter new session title:');
    if (newName && newName.trim()) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: newName.trim() } : s))
      );
      if (onToast) onToast('Session renamed successfully.');
    }
  };

  const filtered = sessions.filter((s) => {
    if (filterType === 'PINNED' && !s.isPinned) return false;
    if (filterType === 'TODAY' && !s.timestamp.includes('Today')) return false;
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) && !s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner */}
      <Card elevation="level1" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
        <CardBody className="p-0">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950 text-[#2563eb] border-blue-200">
              AUDIT ARCHIVE &amp; MEMORY
            </Badge>
            <span className="text-xs font-mono text-[#737686]">SOC2 Tamper-Proof Log</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            AI Conversation History &amp; Session Archive
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Search previous conversational interactions, review token utilization metadata, or restore pinned sessions to the active command center.
          </p>
        </CardBody>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToast && onToast('Exporting session audit logs as encrypted CSV...')}
            leftIcon={<Download size={15} />}
          >
            <Download size={14} /> Export Logs
          </Button>
        </div>
      </Card>

      {/* Slicers & Search Strip */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversation history by prompt or topic..."
            className="w-full bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-[#191b23] dark:text-white focus:outline-hidden focus:border-[#2563eb]"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#737686] flex items-center gap-1">
            <Filter size={14} className="text-[#2563eb]" /> Filter Sessions:
          </span>
          {['ALL', 'PINNED', 'TODAY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                filterType === f
                  ? 'bg-[#2563eb] text-white shadow-2xs'
                  : 'bg-[#faf8ff] dark:bg-[#161616] text-[#737686] hover:text-[#191b23] dark:hover:text-white border border-[#e1e2ed] dark:border-gray-800'
              }`}
            >
              {f === 'ALL' ? 'All Sessions' : f === 'PINNED' ? 'Pinned Only' : 'Today'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Sessions Feed & Details Preview Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Session List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <NoConversations onStartChat={() => onNavigate && onNavigate('workspace')} />
          ) : (
            filtered.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`bg-white dark:bg-[#111111] border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-xs flex items-start justify-between gap-4 ${
                  selectedSession?.id === session.id
                    ? 'border-[#2563eb] ring-2 ring-blue-500/20'
                    : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${session.isPinned ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500' : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb]'}`}>
                    {session.isPinned ? <Pin size={18} className="fill-current" /> : <MessageSquare size={18} />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white truncate">
                        {session.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#737686] shrink-0 bg-[#faf8ff] dark:bg-[#161616] px-2 py-0.5 rounded border border-[#e1e2ed] dark:border-gray-800">
                        {session.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#737686] dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {session.lastMessage}
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-[#737686]">
                      <span>Model: {session.model}</span>
                      <span>|</span>
                      <span className="text-[#2563eb] font-bold">{session.tokens}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleTogglePin(session.id)}
                    className={`p-2 rounded-lg transition-colors ${session.isPinned ? 'text-amber-500 hover:bg-amber-50' : 'text-[#737686] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Pin Session"
                  >
                    <Pin size={15} />
                  </button>
                  <button
                    onClick={() => handleRename(session.id)}
                    className="p-2 text-[#737686] hover:text-[#191b23] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Rename"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="p-2 text-[#737686] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Session Details Drawer / Preview */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4 sticky top-6">
          <div className="pb-3 border-b border-[#f0f1f6] dark:border-gray-800">
            <span className="text-[10px] font-mono font-bold uppercase text-[#737686] block">
              Session Details &amp; Metadata
            </span>
            <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white mt-1">
              {selectedSession ? selectedSession.title : 'Select a conversation session'}
            </h3>
          </div>

          {selectedSession ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-2 bg-[#faf8ff] dark:bg-[#161616] p-3.5 rounded-xl border border-[#e1e2ed] dark:border-gray-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#737686]">Session ID:</span>
                  <strong className="text-[#191b23] dark:text-white">{selectedSession.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Date Logged:</span>
                  <strong className="text-[#191b23] dark:text-white">{selectedSession.date}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Token Usage:</span>
                  <strong className="text-[#2563eb]">{selectedSession.tokens}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Security Guard:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>
              </div>

              {/* Message Transcript Preview */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-bold uppercase text-[#737686] block">
                  Transcript Preview:
                </span>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {selectedSession.details?.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        m.sender === 'USER'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 text-[#191b23] dark:text-white font-medium'
                          : 'bg-white dark:bg-[#161616] border-[#e1e2ed] dark:border-gray-800 text-[#737686] dark:text-gray-300'
                      }`}
                    >
                      <span className="text-[9px] font-mono font-bold uppercase block text-[#2563eb] mb-1">
                        {m.sender === 'USER' ? 'User Prompt:' : 'AI Synthesis:'}
                      </span>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onNavigate) onNavigate('workspace');
                  if (onToast) onToast(`Restoring session "${selectedSession.title}" to active workspace.`);
                }}
                className="w-full py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl font-mono font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Resume Session in Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-[#737686] space-y-2">
              <Eye size={28} className="mx-auto opacity-40" />
              <p className="text-xs">Click any session on the left to inspect full audit metadata and transcript previews.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
