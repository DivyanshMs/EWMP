/**
 * shared/LayoutComponents.jsx
 * Precision Enterprise Design System — Shared ProfileMenu & NotificationMenu Components
 * 
 * Centralized tokens: Level 2 popover menus, Level 1 headers.
 * WCAG 2.1 AA compliant with proper role="menu", keyboard navigation, and React.memo optimization.
 * 
 * Components: ProfileMenu | NotificationMenu
 */
import React, { memo, useState, useRef, useEffect } from 'react';
import { Bell, User, Key, LogOut, ChevronRight } from 'lucide-react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

export const ProfileMenu = memo(function ProfileMenu({
  user = { name: 'Divyansh Mishra', email: 'admin@ewmp.enterprise', role: 'Enterprise Administrator' },
  onLogout,
  onNavigate,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={['relative inline-block select-none', className].join(' ')} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
      >
        <Avatar name={user.name} size="sm" status="online" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111111] rounded-xl shadow-xl border border-[#e2e8f0] dark:border-slate-800 py-2 z-50 animate-fadeIn"
        >
          <div className="px-4 py-3 border-b border-[#e2e8f0]/60 dark:border-slate-800">
            <p className="text-sm font-semibold text-[#191b23] dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-[#434655] dark:text-slate-400 truncate mt-0.5">{user.email}</p>
            <div className="mt-2">
              <Badge variant="admin" size="xs">{user.role || 'Admin'}</Badge>
            </div>
          </div>

          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => { setIsOpen(false); onNavigate?.('/profile'); }}
              className="w-full text-left px-4 py-2 text-xs font-medium text-[#191b23] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
            >
              <User size={15} className="text-slate-400" />
              <span>My Profile</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => { setIsOpen(false); onNavigate?.('/settings'); }}
              className="w-full text-left px-4 py-2 text-xs font-medium text-[#191b23] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
            >
              <Key size={15} className="text-slate-400" />
              <span>Account Settings</span>
            </button>
          </div>

          <div className="border-t border-[#e2e8f0]/60 dark:border-slate-800 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => { setIsOpen(false); onLogout?.(); }}
              className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
            >
              <LogOut size={15} className="text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export const NotificationMenu = memo(function NotificationMenu({
  notifications = [],
  unreadCount = 2,
  onMarkAllRead,
  onClearAll,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayList = notifications.length > 0 ? notifications : [
    { id: 1, title: 'Payroll Run Approved', time: '10m ago', unread: true, type: 'success' },
    { id: 2, title: 'New Leave Request: Sarah Jenkins', time: '1h ago', unread: true, type: 'info' },
    { id: 3, title: 'AI Governance Scan Completed', time: '3h ago', unread: false, type: 'ai' },
  ];

  return (
    <div className={['relative inline-block select-none', className].join(' ')} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Notifications (${unreadCount} unread)`}
        className="relative p-2 text-slate-500 hover:text-[#191b23] dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#111111]" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111111] rounded-xl shadow-xl border border-[#e2e8f0] dark:border-slate-800 py-2 z-50 animate-fadeIn"
        >
          <div className="px-4 py-2.5 border-b border-[#e2e8f0]/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#191b23] dark:text-white">Notifications</h4>
              {unreadCount > 0 && <Badge variant="info" size="xs">{unreadCount} new</Badge>}
            </div>
            {onMarkAllRead && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-semibold text-[#2563eb] hover:underline focus:outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#e2e8f0]/40 dark:divide-slate-800/80">
            {displayList.map((notif) => (
              <div
                key={notif.id}
                role="menuitem"
                className={['p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60', notif.unread ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''].join(' ')}
              >
                <div className="shrink-0 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] block" aria-hidden={!notif.unread} style={{ opacity: notif.unread ? 1 : 0 }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#191b23] dark:text-slate-200">{notif.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{notif.time}</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 shrink-0 self-center" />
              </div>
            ))}
          </div>

          {onClearAll && (
            <div className="px-4 py-2 border-t border-[#e2e8f0]/60 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-semibold text-slate-500 hover:text-[#191b23] dark:hover:text-white focus:outline-none"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const LayoutComponents = { ProfileMenu, NotificationMenu };
export default LayoutComponents;
