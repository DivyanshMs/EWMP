import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowLeft } from 'lucide-react';
import { TicketDirectoryTable } from '../components/HelpDeskTables';
import { NoTickets, NoTicketSearchResults } from '../components/HelpDeskEmptyStates';

/**
 * TicketDirectoryPage.jsx
 * Comprehensive service management directory inventory table across IT, HR, Finance, Facilities, and Administration.
 * Supports multi-column keyword search, multi-factor category/priority/status filters, sorting, and pagination.
 */
export const TicketDirectoryPage = ({
  tickets = [],
  onSelectTicket,
  onAssignTicket,
  onResolveTicket,
  onQuickCreate,
  onBackToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'IT' | 'HR' | 'FINANCE' | 'FACILITIES' | 'ADMIN'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'ESCALATED' | 'RESOLVED'
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

  const filtered = tickets.filter(t => {
    const matchCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.createdBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchPriority && matchSearch;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 border border-purple-200">
              ENTERPRISE CMDB REPOSITORY
            </span>
            <span className="text-xs text-[#737686] font-mono">Total Tickets Logged: {tickets.length}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Service Ticket Directory &amp; Triage Inventory
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Search, filter, assign, and resolve service agreements across IT, HR, Finance, Facilities, and Admin departments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ArrowLeft size={15} /> Dashboard
          </button>
          <button
            onClick={onQuickCreate}
            className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus size={16} /> Create New Request
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, subject, staff or creator..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold"
          >
            <option value="ALL">Category: All Departments</option>
            <option value="IT">IT Support &amp; Cloud</option>
            <option value="HR">HR &amp; Payroll Operations</option>
            <option value="FINANCE">Finance &amp; Expense Audit</option>
            <option value="FACILITIES">Facilities &amp; Office Ops</option>
            <option value="ADMIN">Administration &amp; Legal</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold"
          >
            <option value="ALL">Status: All Active &amp; Archived</option>
            <option value="OPEN">Open Queues</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING_CUSTOMER">Pending Customer Reply</option>
            <option value="ESCALATED">Escalated Priority</option>
            <option value="RESOLVED">Resolved &amp; Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold"
          >
            <option value="ALL">Priority: All Levels</option>
            <option value="CRITICAL">Critical (Urgent Triage)</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#737686] px-1">
          <span>Showing {filtered.length} matching tickets out of {tickets.length} total</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); setStatusFilter('ALL'); setPriorityFilter('ALL'); }}
              className="text-[#2563eb] hover:underline font-bold"
            >
              Reset All Filters
            </button>
            <span className="text-emerald-600 font-bold">● CLOUD DB SYNCED</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' ? (
            <NoTicketSearchResults query={searchQuery || 'Filtered Query'} onClear={() => { setSearchQuery(''); setCategoryFilter('ALL'); setStatusFilter('ALL'); setPriorityFilter('ALL'); }} />
          ) : (
            <NoTickets onCreateClick={onQuickCreate} />
          )
        ) : (
          <TicketDirectoryTable
            tickets={filtered}
            onSelectTicket={onSelectTicket}
            onAssignTicket={onAssignTicket}
            onResolveTicket={onResolveTicket}
          />
        )}
      </div>
    </div>
  );
};
