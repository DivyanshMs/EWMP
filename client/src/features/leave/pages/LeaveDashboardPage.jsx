import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Calendar, Clock, CheckCircle2, XCircle, PlusCircle, History, Sparkles, Flag, ChevronRight, FileText } from 'lucide-react';
import { LeaveBalanceCard, LeaveRequestCard, LeaveAnalyticsCard } from '../components/LeaveCards';
import { LeaveStatusBadge, LeaveTypeBadge } from '../components/LeaveBadges';

/**
 * LeaveDashboardPage.jsx
 * Master executive dashboard for EWMP Leave Management.
 * Features Leave Balance Summary, Request Stat counters, Leave Trends, Upcoming Holidays, and Quick Actions.
 */

export const LeaveDashboardPage = ({ onNavigate }) => {
  
  const { data: balancesRes, isLoading: balancesLoading } = useQuery({
    queryKey: ['leave-balances-my'],
    queryFn: () => api.get('/leave-balances/my').then(res => res.data)
  });

  const { data: requestsRes, isLoading: requestsLoading } = useQuery({
    queryKey: ['leave-requests-my'],
    queryFn: () => api.get('/leave-requests/my?limit=5').then(res => res.data)
  });

  const { data: holidaysRes } = useQuery({
    queryKey: ['holidays-upcoming'],
    queryFn: () => api.get('/holidays', { params: { limit: 3, sort: 'date' } }).then(res => res.data)
  });

  const rawBalances = balancesRes?.data || [];
  const rawRequests = (requestsRes?.data?.items || requestsRes?.data || []).slice(0, 5);

  const myBalances = rawBalances.length ? rawBalances.map((b, i) => {
    const title = b.leaveType?.name || 'Leave';
    let icon = Calendar;
    let colorScheme = 'blue';
    if (title.toLowerCase().includes('sick')) { icon = Clock; colorScheme = 'rose'; }
    else if (title.toLowerCase().includes('casual')) { icon = FileText; colorScheme = 'amber'; }
    else if (title.toLowerCase().includes('comp')) { icon = Sparkles; colorScheme = 'purple'; }
    
    return {
      title,
      total: b.entitledDays || 0,
      used: b.usedDays || 0,
      pending: b.pendingDays || 0,
      icon,
      colorScheme
    };
  }) : [];

  const recentRequests = rawRequests.length ? rawRequests.map(r => ({
    id: r._id || r.id,
    type: r.leaveType?.code || r.leaveType?.name || 'LEAVE',
    startDate: r.startDate ? new Date(r.startDate).toLocaleDateString() : '',
    endDate: r.endDate ? new Date(r.endDate).toLocaleDateString() : '',
    days: r.totalDays || 0,
    isHalfDay: r.isHalfDay,
    status: (r.approvalStatus || 'PENDING').toUpperCase(),
    reason: r.reason,
    submittedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''
  })) : [];

  const upcomingHolidays = (holidaysRes?.data?.items || holidaysRes?.data || []).slice(0, 3).map((holiday) => {
    const date = holiday.date ? new Date(holiday.date) : null;
    return {
      name: holiday.name,
      date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : '',
      day: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString(undefined, { weekday: 'long' }) : '',
      type: holiday.type || 'Holiday',
    };
  });

  const pendingRequests = rawRequests.filter((r) => (r.approvalStatus || '').toLowerCase() === 'pending').length;
  const approvedDays = rawRequests
    .filter((r) => (r.approvalStatus || '').toLowerCase() === 'approved')
    .reduce((sum, r) => sum + Number(r.totalDays || 0), 0);
  const rejectedRequests = rawRequests.filter((r) => (r.approvalStatus || '').toLowerCase() === 'rejected').length;
  const availableBalance = rawBalances.reduce((sum, b) => sum + Number((b.entitledDays || 0) - (b.usedDays || 0) - (b.pendingDays || 0)), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-[#191b23] to-[#2e3039] rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[11px] font-bold uppercase tracking-wider font-mono">
              Enterprise Hub
            </span>
            <span className="text-xs text-gray-400 font-mono">Academic Year 2026–2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Leave Management Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Monitor allocated leave balances, apply for time off, review approval timelines, and coordinate team availability.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onNavigate('apply')}
            className="flex-1 md:flex-none bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded-lg inline-flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <PlusCircle size={15} /> Apply Leave
          </button>
          <button
            onClick={() => onNavigate('calendar')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all"
          >
            <Calendar size={15} /> View Calendar
          </button>
          <button
            onClick={() => onNavigate('requests')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all"
          >
            <History size={15} /> View History
          </button>
        </div>
      </div>

      {/* KPI Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LeaveAnalyticsCard
          title="Pending Requests"
          value={String(pendingRequests)}
          subtitle="Awaiting manager review"
          icon={Clock}
          change="+1 this week"
          trend="up"
        />
        <LeaveAnalyticsCard
          title="Approved Leave (YTD)"
          value={`${approvedDays} Days`}
          subtitle="Across Annual & Sick leave"
          icon={CheckCircle2}
          change="32% utilization"
          trend="up"
        />
        <LeaveAnalyticsCard
          title="Rejected Requests"
          value={String(rejectedRequests)}
          subtitle="Zero rejections this quarter"
          icon={XCircle}
        />
        <LeaveAnalyticsCard
          title="Total Available Balance"
          value={`${availableBalance} Days`}
          subtitle="Across all leave policies"
          icon={Calendar}
          change="Carry-forward active"
          trend="up"
        />
      </div>

      {/* Leave Balance Summary Section */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
          <h2 className="text-base font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-[#2563eb]" />
            LEAVE BALANCE SUMMARY (MY ALLOCATIONS)
          </h2>
          <button
            onClick={() => onNavigate('balance')}
            className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
          >
            View Detailed Ledger <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {myBalances.map((bal, idx) => (
            <LeaveBalanceCard
              key={idx}
              title={bal.title}
              total={bal.total}
              used={bal.used}
              pending={bal.pending}
              icon={bal.icon}
              colorScheme={bal.colorScheme}
              onApply={() => onNavigate('apply')}
            />
          ))}
        </div>
      </div>

      {/* Recent Leave Requests & Upcoming Holidays Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests List (2 Columns) */}
        <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <History size={16} className="text-[#2563eb]" />
              RECENT LEAVE REQUESTS & STATUS
            </h3>
            <button
              onClick={() => onNavigate('my-requests')}
              className="text-xs font-semibold text-[#2563eb] hover:underline"
            >
              View All History ({recentRequests.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentRequests.map((req, idx) => (
              <LeaveRequestCard
                key={idx}
                request={req}
                onSelect={() => onNavigate('my-requests')}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Holidays Widget (1 Column) */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <Flag size={16} className="text-purple-600" />
                UPCOMING HOLIDAYS
              </h3>
              <span className="text-xs font-mono text-[#737686]">Q3 2026</span>
            </div>

            <div className="space-y-3">
              {upcomingHolidays.map((hol, idx) => (
                <div key={idx} className="p-3 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#191b23] dark:text-white">{hol.name}</h4>
                    <span className="text-[11px] text-[#737686]">{hol.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 block">{hol.date}</span>
                    <span className="text-[10px] uppercase font-bold text-[#737686]">{hol.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-center">
            <button
              onClick={() => onNavigate('calendar')}
              className="w-full py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors"
            >
              Open Complete Leave Roster & Holiday Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
