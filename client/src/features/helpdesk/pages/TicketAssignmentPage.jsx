import React, { useState } from 'react';
import { UserPlus, ArrowLeft, ShieldAlert, AlertTriangle } from 'lucide-react';
import { TicketPriorityBadge, TicketStatusBadge, TicketCategoryBadge, TicketSLABadge } from '../components/HelpDeskBadges';

/**
 * TicketAssignmentPage.jsx
 * Staff assignment and triage workspace supporting department routing,
 * priority overrides, SLA resolution estimation, and critical escalation triggers.
 */
export const TicketAssignmentPage = ({
  tickets = [],
  onAssignStaff,
  onEscalateTicket,
  onBackToDashboard
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || '');
  const [assignee, setAssignee] = useState('Michael Vance (IT VP & Lead)');
  const [targetDept, setTargetDept] = useState('Engineering');
  const [priorityOverride, setPriorityOverride] = useState('HIGH');
  const [estimatedResolution, setEstimatedResolution] = useState('4 Hours');
  const [escalationReason, setEscalationReason] = useState('');

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleApplyAssignment = (e) => {
    e.preventDefault();
    if (!activeTicket) return;

    const updated = {
      ...activeTicket,
      assignedTo: assignee,
      department: targetDept,
      priority: priorityOverride,
      slaTarget: estimatedResolution,
      status: activeTicket.status === 'OPEN' ? 'IN_PROGRESS' : activeTicket.status,
      updatedDate: 'Just now'
    };

    onAssignStaff && onAssignStaff(updated);
  };

  const handleTriggerEscalation = () => {
    if (!activeTicket) return;

    const updated = {
      ...activeTicket,
      status: 'ESCALATED',
      priority: 'CRITICAL',
      slaStatus: 'AT_RISK',
      escalationReason: escalationReason || 'Urgent executive escalation requested by triage lead.',
      updatedDate: 'Just now'
    };

    onEscalateTicket && onEscalateTicket(updated);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 border border-purple-200">
              SLA TRIAGE &amp; ROUTING GATEWAY
            </span>
            <span className="text-xs text-[#737686] font-mono">Unassigned / Pending Tickets</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Service Ticket Assignment &amp; Escalation Portal
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Assign staff engineers, override department routing, set target SLA resolution windows, or trigger urgent escalations.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
        >
          <ArrowLeft size={15} /> Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Ticket Selection List */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3 lg:col-span-1 max-h-[640px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-extrabold text-xs uppercase font-mono text-[#737686]">Select Ticket to Triage</h3>
            <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-[#2563eb] px-2 py-0.5 rounded font-bold">
              {tickets.length} available
            </span>
          </div>

          <div className="space-y-2.5">
            {tickets.map((t) => {
              const isSelected = t.id === (activeTicket?.id || '');
              return (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTicketId(t.id); setPriorityOverride(t.priority || 'HIGH'); setTargetDept(t.department || 'Engineering'); }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#2563eb] ring-1 ring-[#2563eb]/30 shadow-2xs'
                      : 'bg-[#faf8ff] dark:bg-[#161616] border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-xs text-[#2563eb]">{t.id}</span>
                    <TicketPriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-[#191b23] dark:text-white line-clamp-2">
                    {t.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#737686] pt-1">
                    <span>Assignee: <strong className="text-gray-700 dark:text-gray-300">{t.assignedTo}</strong></span>
                    <TicketStatusBadge status={t.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Assignment & Escalation Controls */}
        <div className="lg:col-span-2 space-y-6">
          {activeTicket ? (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#e1e2ed] dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#2563eb]">{activeTicket.id}</span>
                    <TicketCategoryBadge category={activeTicket.category} size="sm" />
                    <TicketSLABadge status={activeTicket.slaStatus || 'ON_TRACK'} size="sm" />
                  </div>
                  <h3 className="text-lg font-black text-[#191b23] dark:text-white mt-1">
                    {activeTicket.title}
                  </h3>
                </div>
                <div className="text-right font-mono text-xs text-[#737686]">
                  <span>Creator: <strong className="text-[#191b23] dark:text-white">{activeTicket.createdBy}</strong></span>
                  <span className="block text-[10px]">{activeTicket.updatedDate}</span>
                </div>
              </div>

              {/* Triage Form */}
              <form onSubmit={handleApplyAssignment} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">
                      Assign Staff Reviewer / Engineer *
                    </label>
                    <select
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold"
                    >
                      <option value="Michael Vance (IT VP & Lead)">Michael Vance (IT VP &amp; Lead)</option>
                      <option value="Samantha Wu (HR & Ops Lead)">Samantha Wu (HR &amp; Ops Lead)</option>
                      <option value="Alex Turner (Senior Engineer)">Alex Turner (Senior Engineer)</option>
                      <option value="Elena Rostova (Security Ops)">Elena Rostova (Security Ops)</option>
                      <option value="Marcus Vance (Facilities Mgr)">Marcus Vance (Facilities Mgr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">
                      Department Routing Override
                    </label>
                    <select
                      value={targetDept}
                      onChange={(e) => setTargetDept(e.target.value)}
                      className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold"
                    >
                      <option value="Engineering">Engineering Department</option>
                      <option value="HR & Operations">HR &amp; Operations</option>
                      <option value="IT & InfoSec">IT &amp; InfoSec</option>
                      <option value="Finance & Tax">Finance &amp; Tax</option>
                      <option value="Facilities">Facilities &amp; Office Ops</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">
                      Priority Assessment Override
                    </label>
                    <select
                      value={priorityOverride}
                      onChange={(e) => setPriorityOverride(e.target.value)}
                      className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold text-[#2563eb]"
                    >
                      <option value="CRITICAL">CRITICAL (System Down)</option>
                      <option value="HIGH">HIGH Priority</option>
                      <option value="MEDIUM">MEDIUM Priority</option>
                      <option value="LOW">LOW Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">
                      Target SLA Resolution Window
                    </label>
                    <select
                      value={estimatedResolution}
                      onChange={(e) => setEstimatedResolution(e.target.value)}
                      className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold text-emerald-600"
                    >
                      <option value="2 Hours">2 Hours (Immediate Triage)</option>
                      <option value="4 Hours">4 Hours (Standard High)</option>
                      <option value="24 Hours">24 Hours (Next Business Day)</option>
                      <option value="48 Hours">48 Hours (General SLA)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#2563eb] hover:bg-[#004ac6] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <UserPlus size={16} /> Apply Assignment &amp; Routing
                  </button>
                </div>
              </form>

              {/* Critical Escalation Trigger Card */}
              <div className="p-5 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 rounded-2xl space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-600 shrink-0" />
                  <h4 className="font-extrabold text-sm text-rose-800 dark:text-rose-300">
                    Executive Escalation &amp; SLA Emergency Override
                  </h4>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed font-sans">
                  Triggering an escalation immediately broadcasts high-priority alerts to the Department Lead and Super Admin, marking the SLA status as <strong>AT RISK</strong> or <strong>BREACHED</strong>.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <input
                    type="text"
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    placeholder="Enter reason for emergency escalation..."
                    className="flex-1 p-2.5 bg-white dark:bg-[#161616] border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerEscalation}
                    className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
                  >
                    <AlertTriangle size={15} /> Trigger Escalation
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#111111] rounded-2xl border text-[#737686]">
              Select a ticket from the queue on the left to begin triage and assignment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
