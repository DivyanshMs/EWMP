import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  Bell, 
  Megaphone, 
  Calendar, 
  Gift, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

/**
 * NotificationSummaryWidget.jsx
 * Executive Notification Summary for EWMP Dashboard.
 * Organizes recent alerts, company announcements, upcoming holidays, birthdays, and corporate events.
 */

export const NotificationSummaryWidget = () => {
  
  const [activeTab, setActiveTab] = useState('alerts');
  const { data: notifRes } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(res => res.data)
  });
  const notifData = notifRes?.data || [];
  const unreadCount = notifData.filter(n => !n.isRead).length;

  const dynamicAlerts = notifData.slice(0, 5).map(n => ({
    id: n._id || n.id,
    title: n.title || 'Notification',
    desc: n.message || 'No details',
    time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now',
    type: n.priority === 'High' ? 'warning' : 'info',
    unread: !n.isRead
  }));


  const alerts = [
    {
      id: 'notif_1',
      title: 'Q2 Compliance Certification Expiring Soon',
      desc: '14 IT administrators must complete ISO-27001 renewal by Friday.',
      time: '1h ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 'notif_2',
      title: 'Cloudinary CDN Storage Reached 84% Quota',
      desc: 'Consider archiving legacy document attachments older than 2024.',
      time: '3h ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 'notif_3',
      title: 'AI Workflow Simulation Sandbox Updated',
      desc: 'Gemini 2.0 Flash integration successfully verified on staging node.',
      time: '6h ago',
      type: 'info',
      unread: false,
    },
  ];

  const announcements = [
    {
      id: 'ann_1',
      title: 'Global All-Hands & Q3 Roadmap Broadcast',
      desc: 'Join Executive Leadership this Thursday at 10:00 AM EST via Zoom.',
      date: 'Jul 10, 2026',
      author: 'CEO Office',
    },
    {
      id: 'ann_2',
      title: 'New Health & Wellness Stipend Guidelines',
      desc: 'Employees can now claim up to $1,200 annually for fitness and mental wellness.',
      date: 'Jul 04, 2026',
      author: 'HR Dept',
    },
  ];

  const holidays = [
    {
      id: 'hol_1',
      title: 'Independence Day (Observed)',
      date: 'July 04, 2026',
      daysLeft: 'Observed',
      type: 'National Holiday',
    },
    {
      id: 'hol_2',
      title: 'Labor Day',
      date: 'September 07, 2026',
      daysLeft: 'in 62 days',
      type: 'National Holiday',
    },
  ];

  const celebrations = [
    {
      id: 'cel_1',
      name: 'David Kim',
      role: 'Lead Architect',
      event: 'Birthday Today 🎂',
      dept: 'Engineering',
    },
    {
      id: 'cel_2',
      name: 'Elena Rostova',
      role: 'Senior DevOps',
      event: '1 Year Work Anniversary 🏆',
      dept: 'Infrastructure',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Executive Notifications
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 rounded-full">
            {unreadCount} Unread
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-xl mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'alerts'
                ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'announcements'
                ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'holidays'
                ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Holidays
          </button>
          <button
            onClick={() => setActiveTab('celebrations')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'celebrations'
                ? 'bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Events
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-3 min-h-[220px]">
          {activeTab === 'alerts' &&
            dynamicAlerts.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.unread
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                    : 'bg-gray-50 dark:bg-[#161616] border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {item.type === 'warning' ? (
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        {item.title}
                        {item.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 shrink-0">{item.time}</span>
                </div>
              </div>
            ))}

          {activeTab === 'announcements' &&
            announcements.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-purple-600 dark:text-purple-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Megaphone size={13} /> {item.author}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}

          {activeTab === 'holidays' &&
            holidays.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.date}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
                  {item.daysLeft}
                </span>
              </div>
            ))}

          {activeTab === 'celebrations' &&
            celebrations.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                    <Gift size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.name}</h4>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.role} • {item.dept}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800/40">
                  {item.event}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
        <button
          onClick={() => window.location.assign('/notifications')}
          className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 mx-auto"
        >
          View All Notifications & Alerts
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default NotificationSummaryWidget;
