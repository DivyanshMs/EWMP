import React from 'react';
import { Plus, UserCheck, CheckCircle2, BarChart3, ArrowRight, Laptop, Users, DollarSign, PlayCircle, ShieldAlert } from 'lucide-react';
import { HelpDeskAnalyticsCard, TicketCard } from '../components/HelpDeskCards';

/**
 * HelpDeskDashboardPage.jsx
 * Multi-departmental service desk command center inspired by ServiceNow / Freshservice.
 * Monitors Open, My, Resolved, and Critical tickets, SLA compliance metrics, Average Resolution Time, and Quick Actions.
 */
export const HelpDeskDashboardPage = ({
  tickets = [],
  onNavigate,
  onSelectTicket,
  onQuickCreate
}) => {
  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'ESCALATED').length;
  const myCount = tickets.filter(t => t.assignedTo?.includes('Alex') || t.assignedTo?.includes('You')).length || 4;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const criticalCount = tickets.filter(t => t.priority === 'CRITICAL').length;

  const recentOpen = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').slice(0, 4);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
              SERVICE MANAGEMENT HUB
            </span>
            <span className="text-xs text-[#737686] font-mono">IT • HR • Finance • Facilities • Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Help Desk Dashboard
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Unified service delivery and SLA compliance tracking across organizational departments.
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('directory')}
            className="px-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-bold font-mono transition-colors shadow-2xs"
          >
            Directory ({tickets.length})
          </button>
          <button
            onClick={() => onNavigate && onNavigate('assignment')}
            className="px-4 py-2.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UserCheck size={15} /> Staff Triage
          </button>
          <button
            onClick={() => onNavigate && onNavigate('analytics')}
            className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <BarChart3 size={15} /> Analytics
          </button>
          <button
            onClick={() => onNavigate ? onNavigate('create') : onQuickCreate && onQuickCreate()}
            className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus size={16} /> Create Ticket
          </button>
        </div>
      </div>

      {/* Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HelpDeskAnalyticsCard
          title="Open Service Requests"
          value={openCount}
          subtitle="Active IT, HR & Facilities tickets"
          icon={PlayCircle}
          change="+3 vs yesterday"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <HelpDeskAnalyticsCard
          title="My Assigned Queue"
          value={myCount}
          subtitle="Tickets awaiting your resolution"
          icon={UserCheck}
          change="SLA On Track"
          trend="up"
          color="text-purple-600"
          bg="bg-purple-50 dark:bg-purple-950/60"
        />
        <HelpDeskAnalyticsCard
          title="Resolved & Archived"
          value={resolvedCount}
          subtitle="Completed in FY2026/Q3"
          icon={CheckCircle2}
          change="98.4% CSAT Score"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <HelpDeskAnalyticsCard
          title="Critical Escalations"
          value={criticalCount}
          subtitle="Immediate triage required"
          icon={ShieldAlert}
          change="1 At Risk"
          trend="down"
          color="text-rose-600"
          bg="bg-rose-50 dark:bg-rose-950/60"
        />
      </div>

      {/* SLA & Resolution Velocity Meter */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold uppercase">
              SLA HEALTH: EXCELLENT
            </span>
            <span className="text-xs text-blue-200 font-mono">Real-time Telemetry Sync</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight">
            Average Resolution Velocity: 4.2 Hours
          </h3>
          <p className="text-xs text-blue-100 leading-relaxed font-sans">
            Our multi-tier automated routing has reduced IT &amp; HR ticket resolution times by 18% month-over-month. Over 98.4% of service agreements are currently met within initial SLA windows.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 font-mono text-xs">
          <div className="text-center">
            <strong className="text-xl font-black block text-emerald-400">98.4%</strong>
            <span className="text-[10px] text-blue-200 uppercase">SLA Compliance</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <strong className="text-xl font-black block text-amber-300">&lt; 15m</strong>
            <span className="text-[10px] text-blue-200 uppercase">First Response</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <strong className="text-xl font-black block text-white">4.9/5</strong>
            <span className="text-[10px] text-blue-200 uppercase">CSAT Rating</span>
          </div>
        </div>
      </div>

      {/* Recent Open Tickets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
              Urgent &amp; Recent Service Requests
            </h3>
            <p className="text-xs text-[#737686]">Showing top priority requests across IT, HR, and Finance queues.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('directory')}
            className="text-[#2563eb] hover:underline font-bold text-xs font-mono flex items-center gap-1"
          >
            View Complete Directory ({tickets.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentOpen.map(t => (
            <TicketCard
              key={t.id}
              ticket={t}
              onSelect={onSelectTicket}
            />
          ))}
        </div>
      </div>

      {/* Department SLA Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {[
          { name: 'IT Infrastructure & Cloud Ops', icon: Laptop, open: 6, avgTime: '3.1 hrs', sla: '99.1%', color: 'text-[#2563eb]' },
          { name: 'HR Operations & Benefits', icon: Users, open: 4, avgTime: '5.4 hrs', sla: '98.0%', color: 'text-purple-600' },
          { name: 'Finance, Payroll & Expense Tax', icon: DollarSign, open: 2, avgTime: '4.8 hrs', sla: '97.5%', color: 'text-emerald-600' },
        ].map((dept, idx) => {
          const Icon = dept.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-[#faf8ff] dark:bg-[#161616] ${dept.color} border border-current/10 shadow-2xs`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#191b23] dark:text-white">{dept.name}</h4>
                  <span className="text-[11px] font-mono text-[#737686]">{dept.open} Open Requests · Avg: {dept.avgTime}</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <strong className="text-sm font-black text-emerald-600 block">{dept.sla}</strong>
                <span className="text-[9px] text-[#737686] uppercase">SLA Target</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
