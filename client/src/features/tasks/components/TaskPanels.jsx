import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, MessageSquare, Send, Paperclip, Clock, PlayCircle, PauseCircle, CheckCircle2, Activity } from 'lucide-react';
import { ProgressBar } from './TaskCards';

/**
 * TaskPanels.jsx
 * Interactive sub-panels for EWMP Task Details: Checklist, CommentPanel, TaskTimeline, and TimeTrackingWidget.
 */

export const Checklist = ({ items = [], onToggle, onAdd, onDelete }) => {
  const [newItemText, setNewItemText] = useState('');

  const doneCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAdd && onAdd(newItemText.trim());
    setNewItemText('');
  };

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
        <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
          <CheckSquare size={16} className="text-[#2563eb]" /> Task Execution Checklist ({doneCount}/{totalCount})
        </h4>
        <span className="text-xs font-mono font-bold text-[#2563eb]">{progressPct}% Complete</span>
      </div>

      <ProgressBar progress={progressPct} size="sm" showLabel={false} color={progressPct === 100 ? 'bg-emerald-600' : 'bg-[#2563eb]'} />

      {/* Checklist Items */}
      <div className="space-y-2 pt-1 font-sans text-xs">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onToggle && onToggle(item.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
              item.completed 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 text-gray-500 line-through' 
                : 'bg-[#faf8ff] dark:bg-gray-900/40 border-[#e1e2ed]/60 text-[#191b23] dark:text-gray-200 hover:border-[#2563eb]'
            }`}
          >
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={item.completed} 
                onChange={() => {}} // Handled by div click
                className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" 
              />
              <span className="font-semibold text-xs">{item.title}</span>
            </div>
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="text-gray-400 hover:text-rose-600 p-1"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-gray-400 font-mono py-4 text-xs">No checklist subtasks defined.</p>
        )}
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
        <input 
          type="text" 
          value={newItemText} 
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add a new checklist subtask deliverable..." 
          className="flex-1 py-1.5 px-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-sans focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
        />
        <button 
          type="submit"
          className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
        >
          <Plus size={14} /> Add Item
        </button>
      </form>
    </div>
  );
};

export const CommentPanel = ({ comments = [], onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment && onAddComment({
      id: `CMT-${Date.now()}`,
      author: 'Divyansh Super Admin',
      role: 'SUPER_ADMIN',
      avatar: 'D',
      timestamp: 'Just now',
      content: commentText.trim()
    });
    setCommentText('');
  };

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
            <MessageSquare size={16} className="text-[#2563eb]" /> Discussion & Stakeholder Thread ({comments.length})
          </h4>
          <span className="text-xs font-mono text-[#737686]">Supports @mentions & Markdown</span>
        </div>

        {/* Comments Feed */}
        <div className="space-y-4 py-4 max-h-[380px] overflow-y-auto pr-2 font-sans">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-xl border border-[#e1e2ed]/60">
              <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-2xs">
                {c.avatar || c.author?.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#191b23] dark:text-white flex items-center gap-1.5">
                    {c.author}
                    <span className="text-[10px] font-mono font-normal text-[#2563eb] bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded border border-blue-200">
                      {c.role}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-[#737686]">{c.timestamp}</span>
                </div>
                <p className="text-xs text-[#434655] dark:text-gray-300 leading-relaxed">
                  {c.content}
                </p>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-center text-gray-400 font-mono py-6 text-xs">No comments posted yet. Start the conversation.</p>
          )}
        </div>
      </div>

      {/* Add Comment Box */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 space-y-2">
        <div className="relative">
          <textarea 
            rows="3" 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment... Use @Alex Turner to mention team members or paste links..." 
            className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-sans focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1 text-gray-400">
            <button type="button" className="p-1 hover:text-[#2563eb]" title="Attach file"><Paperclip size={15} /></button>
          </div>
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-[#737686]">
          <span>Tip: Press Ctrl+Enter to submit directly</span>
          <button 
            type="submit"
            className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Send size={13} /> Post Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export const TaskTimeline = ({ activityLog = [] }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
        <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
          <Activity size={16} className="text-[#2563eb]" /> Complete Audit Trail & Lifecycle Timeline
        </h4>
        <span className="text-xs font-mono text-[#737686]">Verified via EWMP Auth Gateway</span>
      </div>

      <div className="space-y-4 py-2 font-sans text-xs">
        {activityLog.map((log, idx) => (
          <div key={idx} className="flex items-start gap-3 relative">
            {idx < activityLog.length - 1 && (
              <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-[#e1e2ed] dark:bg-gray-800 -z-10" />
            )}
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200 flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} />
            </div>
            <div className="flex-1 pb-2">
              <p className="text-xs text-[#191b23] dark:text-gray-200">
                <strong className="font-bold text-[#2563eb]">{log.user}</strong> {log.action}: <strong className="font-semibold">{log.target}</strong>
              </p>
              <span className="text-[11px] font-mono text-[#737686] block mt-0.5">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TimeTrackingWidget = ({ estimatedHours = 16, loggedHours = 12 }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const pct = Math.round((loggedHours / estimatedHours) * 100);

  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800 font-sans">
        <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
          <Clock size={16} className="text-[#2563eb]" /> Workforce Time Tracking Telemetry
        </h4>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isRunning ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
          {isRunning ? '● RECORDING TIME' : '⏸ IDLE'}
        </span>
      </div>

      <div className="flex items-center justify-between bg-[#faf8ff] dark:bg-gray-900/40 p-4 rounded-xl border border-[#e1e2ed]/60">
        <div>
          <span className="text-[11px] text-[#737686] uppercase block font-sans">Current Session</span>
          <span className="text-2xl font-extrabold text-[#191b23] dark:text-white tracking-wider block mt-0.5">
            00:{seconds < 10 ? `0${seconds}` : seconds}:00
          </span>
        </div>
        <button
          onClick={() => {
            setIsRunning(!isRunning);
            if (!isRunning) setSeconds(s => s + 1);
          }}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 shadow-2xs transition-all ${
            isRunning 
              ? 'bg-rose-600 hover:bg-rose-700 text-white' 
              : 'bg-[#2563eb] hover:bg-[#004ac6] text-white'
          }`}
        >
          {isRunning ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
          {isRunning ? 'Pause Timer' : 'Start Timer'}
        </button>
      </div>

      <div className="space-y-2 text-xs font-sans">
        <div className="flex justify-between font-mono">
          <span className="text-[#737686]">Logged: <strong className="text-[#191b23] dark:text-white">{loggedHours}h</strong> / {estimatedHours}h est.</span>
          <span className="font-bold text-[#2563eb]">{pct}% utilized</span>
        </div>
        <ProgressBar progress={pct} size="sm" showLabel={false} color={pct > 100 ? 'bg-rose-600' : 'bg-[#2563eb]'} />
      </div>

      <div className="pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-[11px] text-[#737686] flex justify-between items-center">
        <span>Billable Rate: <strong>$145/hr</strong></span>
        <span>Total Cost: <strong className="text-[#191b23] dark:text-white">${loggedHours * 145}</strong></span>
      </div>
    </div>
  );
};
