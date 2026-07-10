import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, UserPlus, Clock, MessageSquare, History, CheckCircle } from 'lucide-react';
import { TicketPriorityBadge, TicketStatusBadge, TicketSLABadge, TicketCategoryBadge } from '../components/HelpDeskBadges';
import { ConversationPanel } from '../components/ConversationPanel';

/**
 * TicketDetailsPage.jsx
 * Complete 360° service dossier and audit trail inspired by ServiceNow / Zendesk.
 * Incorporates interactive Conversation thread, Internal Notes toggle, Status & Assignment history timelines,
 * resolution sign-off capture, and Customer Satisfaction rating evaluation.
 */
export const TicketDetailsPage = ({
  ticket,
  onBack,
  onResolveTicket,
  onAssignTicket,
  onSendMessage,
  onSubmitCSAT
}) => {
  if (!ticket) return null;

  const [activeTab, setActiveTab] = useState('conversation'); // 'conversation' | 'timeline' | 'resolution'
  const [resolutionText, setResolutionText] = useState(ticket.resolutionNotes || '');
  const [showResolveModal, setShowResolveModal] = useState(false);

  const mockTimeline = ticket.timeline || [
    { id: 1, type: 'CREATE', author: ticket.createdBy, timestamp: 'Jul 06, 2026 at 09:14', text: 'Service ticket initialized and assigned to IT department triage queue.' },
    { id: 2, type: 'ASSIGN', author: 'System Triage Engine', timestamp: 'Jul 06, 2026 at 09:16', text: `Ticket automatically assigned to ${ticket.assignedTo} based on category routing rules.` },
    { id: 3, type: 'STATUS', author: ticket.assignedTo, timestamp: 'Jul 06, 2026 at 10:45', text: 'Status changed from OPEN to IN_PROGRESS. Diagnostic logs under review.' },
  ];

  const mockMessages = ticket.messages || [
    {
      id: 'MSG-1',
      author: ticket.createdBy,
      role: 'Ticket Creator',
      timestamp: 'Jul 06, 2026 at 09:14',
      content: ticket.description || 'We are experiencing an SSL certificate renewal warning on the primary API gateway.',
      isInternal: false,
      attachments: ticket.attachments || []
    },
    {
      id: 'MSG-2',
      author: ticket.assignedTo || 'Support Engineer',
      role: 'Support Agent',
      timestamp: 'Jul 06, 2026 at 10:48',
      content: 'We have initiated automated validation with AWS Certificate Manager. Will confirm once the new SSL wildcard cert is propagated across CloudFront distributions.',
      isInternal: false,
    },
    {
      id: 'MSG-3',
      author: 'Michael Vance (IT VP)',
      role: 'SLA Reviewer',
      timestamp: 'Jul 06, 2026 at 11:15',
      content: 'Verified that DNS validation records match Route53 zone. Proceeding with seamless zero-downtime cutover during low traffic window.',
      isInternal: true,
    }
  ];

  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    if (!resolutionText.trim()) return;

    const updated = {
      ...ticket,
      status: 'RESOLVED',
      resolutionNotes: resolutionText,
      updatedDate: 'Just now'
    };
    onResolveTicket && onResolveTicket(updated);
    setShowResolveModal(false);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-16">
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 bg-white dark:bg-[#111111] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <ArrowLeft size={15} /> Back to Directory
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onAssignTicket && onAssignTicket(ticket)}
            className="px-4 py-2 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UserPlus size={15} /> Re-Assign Staff
          </button>
          {!isResolved && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 size={15} /> Resolve Ticket
            </button>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Record Formal Ticket Resolution</h3>
                <p className="text-xs text-[#737686]">Summarize root cause analysis and resolution steps for SLA archive.</p>
              </div>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">
                  Resolution Summary &amp; Handover Notes *
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Explain what actions were taken to resolve the issue..."
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1"
                >
                  <CheckCircle size={15} /> Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Dossier Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
                {ticket.id}
              </span>
              <TicketCategoryBadge category={ticket.category} size="sm" />
              <TicketPriorityBadge priority={ticket.priority} size="sm" />
              <TicketStatusBadge status={ticket.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#191b23] dark:text-white mt-1">
              {ticket.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <TicketSLABadge status={ticket.slaStatus || 'ON_TRACK'} />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
            <span className="text-[#737686] block text-[10px] uppercase">Assigned Staff Lead</span>
            <strong className="text-[#191b23] dark:text-white font-sans text-xs font-extrabold truncate block mt-0.5">
              {ticket.assignedTo}
            </strong>
          </div>

          <div className="p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
            <span className="text-[#737686] block text-[10px] uppercase">Ticket Creator</span>
            <strong className="text-[#191b23] dark:text-white font-sans text-xs font-extrabold truncate block mt-0.5">
              {ticket.createdBy} ({ticket.department})
            </strong>
          </div>

          <div className="p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
            <span className="text-[#737686] block text-[10px] uppercase">SLA Target Window</span>
            <strong className="text-emerald-600 font-sans text-xs font-extrabold truncate block mt-0.5">
              &lt; 4 Hours (On Target)
            </strong>
          </div>

          <div className="p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
            <span className="text-[#737686] block text-[10px] uppercase">Last Updated</span>
            <strong className="text-[#191b23] dark:text-white font-sans text-xs font-extrabold truncate block mt-0.5">
              {ticket.updatedDate}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e1e2ed] dark:border-gray-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('conversation')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'conversation'
              ? 'bg-[#2563eb] text-white shadow-2xs'
              : 'text-[#737686] hover:bg-white dark:hover:bg-gray-800'
          }`}
        >
          <MessageSquare size={15} /> Conversation Thread ({mockMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'timeline'
              ? 'bg-[#2563eb] text-white shadow-2xs'
              : 'text-[#737686] hover:bg-white dark:hover:bg-gray-800'
          }`}
        >
          <History size={15} /> Status &amp; Audit Log ({mockTimeline.length})
        </button>
        {isResolved && (
          <button
            onClick={() => setActiveTab('resolution')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'resolution'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
            }`}
          >
            <CheckCircle size={15} /> Resolution Summary
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'conversation' && (
        <ConversationPanel
          messages={mockMessages}
          onSendMessage={onSendMessage}
          isResolved={isResolved}
          onSubmitCSAT={onSubmitCSAT}
        />
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <History size={18} className="text-[#2563eb]" /> Chronological Audit Log &amp; Status Transitions
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold">● IMMUTABLE SLA LEDGER</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e1e2ed] dark:before:bg-gray-800">
            {mockTimeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4 text-xs font-sans">
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center ring-4 ring-white dark:ring-[#111111] shadow-2xs">
                  <Clock size={11} />
                </div>
                <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 flex-1 space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#737686]">
                    <span>Event Type: <strong className="text-[#191b23] dark:text-white uppercase">{item.type}</strong></span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#191b23] dark:text-gray-200">
                    {item.text}
                  </p>
                  <span className="text-[11px] font-mono text-[#737686] block pt-1">
                    Executed by: <strong className="text-gray-700 dark:text-gray-300">{item.author}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resolution' && isResolved && (
        <div className="bg-white dark:bg-[#111111] border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-3 border-b border-current/10">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                Formal Resolution Sign-off Report
              </h3>
              <span className="text-xs font-mono text-[#737686]">SLA Complied &amp; Verified by {ticket.assignedTo}</span>
            </div>
          </div>

          <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800 space-y-2 text-xs font-sans">
            <strong className="font-mono text-[11px] text-[#737686] uppercase block">Root Cause Analysis &amp; Handover Summary:</strong>
            <p className="text-sm text-[#191b23] dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {ticket.resolutionNotes || 'All primary API gateway certificates were renewed via AWS Certificate Manager and validated across global edge locations. Zero packet drop observed.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
