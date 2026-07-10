import React, { useState } from 'react';
import { Bell, CheckCircle2, Trash2, Search, Filter, Sparkles, DollarSign, Clock, Calendar, CheckSquare, ShieldAlert, Settings, X, Check, ArrowUpRight } from 'lucide-react';
import { NotificationCard } from '../components/NotificationCards';
import { NoNotifications, NoSearchResults } from '../components/NotificationEmptyStates';

/**
 * NotificationCenterPage.jsx
 * Centralized notification command center supporting categorizations:
 * System Alerts, Payroll Alerts, Attendance Alerts, Leave Alerts, Task Alerts, and AI Recommendations.
 * Includes Unread/Read tabs, Notification Preferences, Mark All Read, Delete, Search, and Filters.
 */
export const NotificationCenterPage = ({
  notifications = [],
  onToggleRead,
  onMarkAllRead,
  onDeleteNotification,
  onDeleteAllRead,
  onActionClick,
  onOpenAnnouncements
}) => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ' | 'SYSTEM' | 'PAYROLL' | 'ATTENDANCE' | 'LEAVE' | 'TASK' | 'AI_REC'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL' | 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW'
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference state simulation
  const [prefs, setPrefs] = useState({
    systemEmail: true, systemPush: true,
    payrollEmail: true, payrollPush: true,
    attendanceEmail: false, attendancePush: true,
    leaveEmail: true, leavePush: true,
    taskEmail: true, taskPush: true,
    aiEmail: false, aiPush: true,
  });

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const tabs = [
    { id: 'ALL',        label: 'All Alerts',      icon: Bell,        count: notifications.length },
    { id: 'UNREAD',     label: 'Unread',          icon: CheckCircle2,count: unreadCount, badgeColor: 'bg-[#2563eb] text-white' },
    { id: 'READ',       label: 'Read History',    icon: Clock,       count: notifications.length - unreadCount },
    { id: 'SYSTEM',     label: 'System',          icon: ShieldAlert, count: notifications.filter(n => n.category === 'SYSTEM').length },
    { id: 'PAYROLL',    label: 'Payroll',         icon: DollarSign,  count: notifications.filter(n => n.category === 'PAYROLL').length },
    { id: 'ATTENDANCE', label: 'Attendance',      icon: Clock,       count: notifications.filter(n => n.category === 'ATTENDANCE').length },
    { id: 'LEAVE',      label: 'Leave',           icon: Calendar,    count: notifications.filter(n => n.category === 'LEAVE').length },
    { id: 'TASK',       label: 'Tasks',           icon: CheckSquare, count: notifications.filter(n => n.category === 'TASK').length },
    { id: 'AI_REC',     label: 'AI Insights',     icon: Sparkles,    count: notifications.filter(n => n.category === 'AI_REC').length, badgeColor: 'bg-violet-600 text-white animate-pulse' },
  ];

  const filtered = notifications.filter(n => {
    const matchTab =
      activeTab === 'ALL' ? true :
      activeTab === 'UNREAD' ? n.isUnread :
      activeTab === 'READ' ? !n.isUnread :
      n.category === activeTab;
    const matchPriority = priorityFilter === 'ALL' || n.priority === priorityFilter;
    const matchSearch   = n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || n.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchPriority && matchSearch;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
              REAL-TIME NOTIFY GATEWAY
            </span>
            <span className="text-xs text-[#737686] font-mono">SOC2 Compliant Event Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Notification Center
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Real-time automated system alerts, payroll confirmations, leave approvals, task deadlines, and AI recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAnnouncements}
            className="px-4 py-2 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ArrowUpRight size={15} /> Org Broadcasts
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="px-4 py-2 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Notification Preferences"
          >
            <Settings size={15} /> Preferences
          </button>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 size={15} /> Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-[#2563eb] rounded-xl">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Notification Delivery Preferences</h3>
                  <p className="text-xs text-[#737686]">Manage real-time Email, Push, and In-App alert routing.</p>
                </div>
              </div>
              <button onClick={() => setShowPreferences(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1 text-xs font-sans">
              {[
                { key: 'system', label: 'System & Security Alerts', desc: 'Password changes, security logins, audit events.' },
                { key: 'payroll', label: 'Payroll & Compensation', desc: 'Payslip published, salary revisions, tax declarations.' },
                { key: 'attendance', label: 'Attendance & Overtime Audits', desc: 'Missed punches, overtime approval notices, shift changes.' },
                { key: 'leave', label: 'Leave Requests & Approvals', desc: 'Leave status updates, manager approval reminders.' },
                { key: 'task', label: 'Task Assignments & Deadlines', desc: 'New task assigned, milestone due dates, status changes.' },
                { key: 'ai', label: 'AI Recommendations & Schedule Optimizations', desc: 'Automated AI suggestions for workforce efficiency.' },
              ].map((item) => (
                <div key={item.key} className="p-3.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <strong className="font-bold text-sm text-[#191b23] dark:text-white block">{item.label}</strong>
                    <span className="text-[11px] text-[#737686]">{item.desc}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs[`${item.key}Email`]}
                        onChange={(e) => setPrefs({ ...prefs, [`${item.key}Email`]: e.target.checked })}
                        className="rounded text-[#2563eb]"
                      />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs[`${item.key}Push`]}
                        onChange={(e) => setPrefs({ ...prefs, [`${item.key}Push`]: e.target.checked })}
                        className="rounded text-[#2563eb]"
                      />
                      <span>Push</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check size={16} /> Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Search Filter Row */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs font-mono">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-2xs'
                      : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-gray-100 dark:bg-gray-800 text-[#737686]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search & Priority Filter */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts..."
                className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold"
            >
              <option value="ALL">Priority: All</option>
              <option value="URGENT">Urgent Only</option>
              <option value="HIGH">High Priority</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#737686] px-1">
          <span>Showing {filtered.length} of {notifications.length} notifications</span>
          <div className="flex items-center gap-4">
            {activeTab === 'READ' && notifications.some(n => !n.isUnread) && (
              <button
                onClick={onDeleteAllRead}
                className="text-rose-600 hover:underline font-bold flex items-center gap-1"
              >
                <Trash2 size={13} /> Clear All Read
              </button>
            )}
            <span className="text-emerald-600 font-bold">● LIVE WEBSOCKET SYNC</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          searchQuery || priorityFilter !== 'ALL' ? (
            <NoSearchResults query={searchQuery || `${priorityFilter} Priority`} onClear={() => { setSearchQuery(''); setPriorityFilter('ALL'); }} />
          ) : (
            <NoNotifications onResetFilter={() => setActiveTab('ALL')} />
          )
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onToggleRead={onToggleRead}
                onDelete={onDeleteNotification}
                onActionClick={onActionClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
