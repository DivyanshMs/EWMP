import React from 'react';
import { CheckCircle2, Trash2, ArrowRight, Pin, Paperclip, Download, Calendar, Users, Building2, Clock } from 'lucide-react';
import { NotificationPriorityBadge, NotificationCategoryBadge, UnreadDot } from './NotificationBadges';

/**
 * NotificationCards.jsx
 * Enterprise cards for Notification feed items and Organization Broadcast announcements.
 */

export const NotificationCard = ({
  notification,
  onToggleRead,
  onDelete,
  onActionClick
}) => {
  const {
    id,
    title,
    message,
    category = 'SYSTEM',
    priority = 'NORMAL',
    timestamp,
    isUnread = false,
    actionLabel,
    actionUrl,
    sender = 'System Automated Service'
  } = notification;

  const isAI = category === 'AI_REC';

  return (
    <div className={`group relative bg-white dark:bg-[#111111] border rounded-2xl p-5 transition-all shadow-2xs hover:shadow-sm ${
      isUnread
        ? 'border-blue-300 dark:border-blue-800 bg-gradient-to-r from-blue-50/40 via-white to-white dark:from-blue-950/20 dark:via-[#111111] dark:to-[#111111]'
        : 'border-[#e1e2ed] dark:border-gray-800'
    } ${isAI ? 'ring-1 ring-violet-300 dark:ring-violet-800' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="pt-1">
            <UnreadDot isUnread={isUnread} />
          </div>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <NotificationCategoryBadge category={category} size="sm" />
              <NotificationPriorityBadge priority={priority} size="sm" />
              <span className="text-[11px] font-mono text-[#737686] flex items-center gap-1">
                <Clock size={11} /> {timestamp}
              </span>
            </div>

            <h4 className={`text-sm font-extrabold tracking-tight ${
              isUnread ? 'text-[#191b23] dark:text-white font-black' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {title}
            </h4>

            <p className="text-xs text-[#737686] dark:text-gray-400 leading-relaxed font-sans max-w-3xl">
              {message}
            </p>

            <div className="flex items-center gap-4 pt-1 text-[11px] font-mono text-[#737686]">
              <span>From: <strong className="text-gray-700 dark:text-gray-300">{sender}</strong></span>
              {actionLabel && (
                <button
                  onClick={() => onActionClick && onActionClick(notification)}
                  className="font-sans font-bold text-xs text-[#2563eb] hover:underline flex items-center gap-1 transition-colors"
                >
                  {actionLabel} <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleRead && onToggleRead(id)}
            className={`p-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isUnread
                ? 'text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-950/60'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
          >
            <CheckCircle2 size={17} className={isUnread ? 'text-[#2563eb]' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors"
            title="Delete Notification"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AnnouncementCard = ({
  announcement,
  onSelect,
  onDownloadAttachment
}) => {
  const {
    id,
    title,
    content,
    priority = 'NORMAL',
    audience = 'Organization-wide',
    department = 'All Departments',
    expirationDate,
    isPinned = false,
    author = 'Executive Communications',
    createdDate,
    attachments = []
  } = announcement;

  return (
    <div className={`bg-white dark:bg-[#111111] border rounded-2xl p-6 shadow-xs transition-all hover:shadow-sm space-y-4 ${
      isPinned ? 'border-[#2563eb] ring-1 ring-[#2563eb]/20 bg-gradient-to-b from-blue-50/20 to-white dark:from-blue-950/10 dark:to-[#111111]' : 'border-[#e1e2ed] dark:border-gray-800'
    }`}>
      {/* Top Meta Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
        <div className="flex items-center gap-2">
          {isPinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-[#2563eb] text-white shadow-2xs animate-pulse">
              <Pin size={12} className="rotate-45" /> PINNED BROADCAST
            </span>
          )}
          <NotificationPriorityBadge priority={priority} size="sm" />
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
            <Users size={11} /> {audience} ({department})
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[#737686]">
          <span>Posted: <strong>{createdDate}</strong></span>
          {expirationDate && (
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <Calendar size={12} /> Expires: {expirationDate}
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="space-y-2 cursor-pointer" onClick={() => onSelect && onSelect(announcement)}>
        <h3 className="text-base sm:text-lg font-black text-[#191b23] dark:text-white hover:text-[#2563eb] transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#737686] dark:text-gray-300 leading-relaxed font-sans whitespace-pre-line">
          {content}
        </p>
      </div>

      {/* Attachments & Author Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#e1e2ed] dark:border-gray-800 text-xs">
        <div className="flex items-center gap-2 text-[#737686] font-mono text-[11px]">
          <Building2 size={14} className="text-[#2563eb]" />
          <span>Broadcast Author: <strong className="text-[#191b23] dark:text-white font-sans">{author}</strong></span>
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#737686] flex items-center gap-1">
              <Paperclip size={13} /> {attachments.length} Attachment(s):
            </span>
            {attachments.map((file, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); onDownloadAttachment && onDownloadAttachment(file); }}
                className="px-2.5 py-1 rounded-lg bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 hover:border-[#2563eb] text-[#2563eb] font-mono font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-2xs"
                title="Download Attachment"
              >
                <span>{file.name}</span>
                <Download size={12} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
