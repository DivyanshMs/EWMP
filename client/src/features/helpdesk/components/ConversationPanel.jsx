import React, { useState } from 'react';
import { MessageSquare, Lock, Send, Paperclip, CheckCircle2, Smile, Star, Clock, Download } from 'lucide-react';

/**
 * ConversationPanel.jsx
 * Interactive ticket thread and collaboration panel inspired by Zendesk / Freshservice.
 * Supports toggling between Customer Replies and Internal Staff Notes, attachment uploads,
 * and an interactive Customer Satisfaction (CSAT) rating placeholder.
 */
export const ConversationPanel = ({
  messages = [],
  onSendMessage,
  isResolved = false,
  onSubmitCSAT
}) => {
  const [replyType, setReplyType] = useState('PUBLIC'); // 'PUBLIC' | 'INTERNAL'
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg = {
      id: `MSG-${Date.now()}`,
      author: 'Samantha Wu (Compliance Lead)',
      role: replyType === 'INTERNAL' ? 'Staff Reviewer (Private)' : 'Support Agent',
      timestamp: 'Just now',
      content: text,
      isInternal: replyType === 'INTERNAL',
      avatar: 'S',
    };

    onSendMessage && onSendMessage(newMsg);
    setText('');
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6 flex flex-col justify-between font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#2563eb]" />
          <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
            Ticket Conversation &amp; Collaboration Thread
          </h3>
        </div>
        <span className="text-xs font-mono text-[#737686]">
          {messages.length} messages logged · SOC2 Encrypted
        </span>
      </div>

      {/* CSAT Widget Placeholder if Resolved */}
      {isResolved && !csatSubmitted && (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
              <Smile size={18} className="text-emerald-600" /> Customer Satisfaction (CSAT) Evaluation
            </h4>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
              RESOLVED TICKET SURVEY
            </span>
          </div>
          <p className="text-xs text-[#737686]">
            How satisfied are you with the resolution provided by IT Support for this service ticket?
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-xl border transition-all ${
                  rating >= star
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-110'
                    : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-300 hover:text-amber-500'
                }`}
              >
                <Star size={18} className={rating >= star ? 'fill-current' : ''} />
              </button>
            ))}
            {rating > 0 && (
              <button
                onClick={() => { setCsatSubmitted(true); onSubmitCSAT && onSubmitCSAT(rating); }}
                className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                Submit {rating}-Star Feedback
              </button>
            )}
          </div>
        </div>
      )}

      {isResolved && csatSubmitted && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-2">
          <CheckCircle2 size={16} /> Thank you! Your Customer Satisfaction rating has been recorded in SLA analytics.
        </div>
      )}

      {/* Messages Feed */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 text-xs font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-2xl border transition-all space-y-2 ${
              msg.isInternal
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 ml-8 ring-1 ring-amber-300/40'
                : 'bg-[#faf8ff] dark:bg-[#161616] border-[#e1e2ed] dark:border-gray-800'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-current/10 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[10px] ${
                  msg.isInternal ? 'bg-amber-600' : 'bg-[#2563eb]'
                }`}>
                  {msg.avatar || msg.author?.charAt(0) || 'U'}
                </div>
                <strong className="text-[#191b23] dark:text-white font-sans font-bold">{msg.author}</strong>
                <span className={`px-2 py-0.2 rounded text-[10px] ${
                  msg.isInternal ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold' : 'bg-blue-100 dark:bg-blue-900 text-[#2563eb] dark:text-blue-200'
                }`}>
                  {msg.isInternal ? '🔒 INTERNAL STAFF NOTE' : msg.role || 'Reply'}
                </span>
              </div>
              <span className="text-[#737686] flex items-center gap-1">
                <Clock size={11} /> {msg.timestamp}
              </span>
            </div>

            <p className="text-sm text-[#191b23] dark:text-gray-200 leading-relaxed font-sans whitespace-pre-line pt-1">
              {msg.content}
            </p>

            {msg.attachments?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-current/10">
                {msg.attachments.map((file, i) => (
                  <button
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border text-[11px] font-mono text-[#2563eb] flex items-center gap-1 hover:underline"
                  >
                    <Paperclip size={12} />
                    <span>{file.name}</span>
                    <Download size={11} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="space-y-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#faf8ff] dark:bg-[#161616] p-1 rounded-xl border border-[#c3c6d7] dark:border-gray-800 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setReplyType('PUBLIC')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                replyType === 'PUBLIC'
                  ? 'bg-[#2563eb] text-white shadow-2xs'
                  : 'text-[#737686] hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <MessageSquare size={13} /> Customer Reply
            </button>
            <button
              type="button"
              onClick={() => setReplyType('INTERNAL')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                replyType === 'INTERNAL'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-800'
              }`}
            >
              <Lock size={13} /> Internal Note
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#737686]">
            {replyType === 'PUBLIC' ? '● Visible to ticket creator & team' : '● Hidden from employee creator'}
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              replyType === 'PUBLIC'
                ? "Type reply to customer... (supports markdown & file attachments)"
                : "Type internal note or escalation handoff note for IT/HR agents..."
            }
            className={`w-full p-3.5 pr-24 rounded-xl text-xs font-sans border transition-colors ${
              replyType === 'INTERNAL'
                ? 'bg-amber-50/40 dark:bg-[#161616] border-amber-300 dark:border-amber-800 focus:border-amber-600'
                : 'bg-[#faf8ff] dark:bg-[#161616] border-[#c3c6d7] dark:border-gray-800 focus:border-[#2563eb]'
            }`}
          />
          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-[#2563eb] rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xs"
              title="Attach screenshot or log file"
            >
              <Paperclip size={15} />
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all ${
                !text.trim()
                  ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed'
                  : replyType === 'INTERNAL' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#2563eb] hover:bg-[#004ac6]'
              }`}
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
