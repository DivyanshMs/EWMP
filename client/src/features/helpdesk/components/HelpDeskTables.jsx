import React, { useState } from 'react';
import { Eye, UserPlus, CheckCircle2, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { TicketPriorityBadge, TicketStatusBadge, TicketSLABadge, TicketCategoryBadge } from './HelpDeskBadges';

/**
 * HelpDeskTables.jsx
 * Enterprise multi-column tables for ticket directories and SLA compliance monitors.
 * Supports sorting, multi-row checkbox selection, inline assignment triggers, and pagination.
 */
export const TicketDirectoryTable = ({
  tickets = [],
  onSelectTicket,
  onAssignTicket,
  onResolveTicket
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('updatedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(tickets.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // Sort logic
  const sorted = [...tickets].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (sortField === 'priority') {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      valA = order[a.priority] || 0;
      valB = order[b.priority] || 0;
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const pageSlice = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 font-sans">
      {/* Bulk Selection Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#2563eb] text-white rounded-2xl p-4 shadow-md flex items-center justify-between animate-slide-up text-xs font-mono font-bold">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white text-[#2563eb]">{selectedIds.length}</span>
            <span>tickets selected across department queues</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              Batch Re-Assign Staff
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Mark Selected Resolved
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf8ff] dark:bg-[#161616] text-[#737686] uppercase font-bold text-[11px] border-b border-[#e1e2ed] dark:border-gray-800 font-mono select-none">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === tickets.length && tickets.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-[#2563eb]"
                  />
                </th>
                <th
                  onClick={() => { setSortField('id'); setSortAsc(!sortAsc); }}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#191b23] dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Ticket Number</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3.5 px-4 min-w-[200px]">Title &amp; Subject</th>
                <th className="py-3.5 px-4">Category</th>
                <th
                  onClick={() => { setSortField('priority'); setSortAsc(!sortAsc); }}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#191b23] dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status &amp; SLA</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4">Created By / Dept</th>
                <th className="py-3.5 px-4">Updated Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
              {pageSlice.map((ticket) => {
                const isSelected = selectedIds.includes(ticket.id);
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelectTicket && onSelectTicket(ticket)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/60 dark:bg-blue-950/40'
                        : 'hover:bg-[#faf8ff] dark:hover:bg-gray-900/40'
                    }`}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => handleToggleRow(ticket.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-[#2563eb]"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-[#2563eb]">
                      {ticket.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#191b23] dark:text-white max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <TicketCategoryBadge category={ticket.category} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <TicketPriorityBadge priority={ticket.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <TicketStatusBadge status={ticket.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TicketSLABadge status={ticket.slaStatus || 'ON_TRACK'} size="sm" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                          {ticket.assignedTo?.charAt(0) || 'U'}
                        </div>
                        <span className="font-mono text-xs font-semibold truncate max-w-[110px]">
                          {ticket.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-gray-800 dark:text-gray-200 truncate max-w-[120px]">{ticket.createdBy}</strong>
                      <span className="text-[10px] font-mono text-[#737686]">{ticket.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#737686] whitespace-nowrap">
                      {ticket.updatedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectTicket && onSelectTicket(ticket)}
                          className="p-1.5 text-gray-400 hover:text-[#2563eb] rounded-lg transition-colors"
                          title="Open Ticket Dossier"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onAssignTicket && onAssignTicket(ticket)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                          title="Assign or Re-route Ticket"
                        >
                          <UserPlus size={16} />
                        </button>
                        {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                          <button
                            onClick={() => onResolveTicket && onResolveTicket(ticket)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors"
                            title="Resolve Ticket"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#e1e2ed] dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[#737686]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length} tickets
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border flex items-center gap-1 transition-all ${
                currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-[#191b23] dark:text-white border-[#c3c6d7] hover:border-[#2563eb]'
              }`}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-[#2563eb] text-white font-bold shadow-2xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border flex items-center gap-1 transition-all ${
                currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-[#191b23] dark:text-white border-[#c3c6d7] hover:border-[#2563eb]'
              }`}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
