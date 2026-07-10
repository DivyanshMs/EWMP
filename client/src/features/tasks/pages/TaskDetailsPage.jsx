import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, CheckCircle2, Clock, FolderKanban, Paperclip, MessageSquare, CheckSquare, Activity, FileText, Download } from 'lucide-react';
import { PriorityBadge, StatusBadge, TagChip } from '../components/TaskBadges';
import { Checklist, CommentPanel, TaskTimeline, TimeTrackingWidget } from '../components/TaskPanels';

/**
 * TaskDetailsPage.jsx
 * Comprehensive Task Dossier for EWMP Task Management.
 * Features: Task Description, Project Information, Priority, Status, Timeline, Attachments, Comments, Checklist, Activity Log, and Time Tracking.
 */

export const TaskDetailsPage = ({ 
  task, 
  onBack, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onAssign
}) => {
  const [activeTab, setActiveTab] = useState('execution'); // execution, comments, time, audit

  const t = task || {
    id: 'TSK-1042',
    title: 'Implement OAuth 2.0 PKCE challenge verification for iOS client API',
    description: '### Technical Specification & Deliverable Scope\nImplement Proof Key for Code Exchange (PKCE) RFC 7636 challenge verification across all iOS client authentication gateways. This enhancement is mandated by the EWMP Q3 Security Audit to eliminate Authorization Code Interception Attacks on mobile clients.\n\n#### Key Architectural Requirements:\n1. Code Verifier Generation: Must generate a cryptographically random string using unreserved characters (min 43, max 128 chars).\n2. SHA-256 Hashing: Transform the verifier using ASCII encoding and SHA-256 to create the code challenge sent to the /oauth/authorize endpoint.\n3. Redis Session Partitioning: Store code challenges in the Redis cluster with an enforced 10-minute TTL expiration.\n4. Unit & Integration Test Coverage: Ensure 100% automated test coverage across authentication controllers before submitting PR to staging-core.',
    project: 'PRJ-101 (EWMP Core Engine)',
    projectCode: 'PRJ-101',
    assignee: 'Alex Turner',
    role: 'Lead Backend Engineer',
    assignedBy: 'Marcus Tech VP',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    dueDate: 'Today at 5:00 PM',
    createdAt: 'Jul 01, 2026',
    estimatedHours: 24,
    loggedHours: 18,
    checklist: [
      { id: 'chk-1', title: 'Draft OAuth 2.0 PKCE RFC 7636 architectural blueprint', completed: true },
      { id: 'chk-2', title: 'Implement SHA-256 verifier generator utility in Java/Spring boot auth module', completed: true },
      { id: 'chk-3', title: 'Configure Redis session cluster TTL rules for code challenge storage', completed: true },
      { id: 'chk-4', title: 'Build automated penetration integration tests for iOS client gateway', completed: false }
    ],
    comments: [
      { id: 'cmt-1', author: 'Elena Rostova', role: 'SECURITY_ARCHITECT', avatar: 'E', timestamp: 'Yesterday at 3:15 PM', content: 'Make sure we use base64url encoding without padding (=) when formatting the SHA-256 challenge string. Apple iOS networking stacks reject standard base64 padding!' },
      { id: 'cmt-2', author: 'Alex Turner', role: 'LEAD_ENGINEER', avatar: 'A', timestamp: 'Today at 10:40 AM', content: 'Good catch Elena! I have added a custom base64url stripper utility in `CryptoUtils.java`. All 14 unit tests are passing cleanly now.' }
    ],
    attachments: [
      { id: 'att-1', name: 'RFC-7636-PKCE-Spec-EWMP.pdf', size: '2.4 MB', type: 'PDF Document', uploadedBy: 'Marcus Tech VP', date: 'Jul 01' },
      { id: 'att-2', name: 'iOS_Auth_Gateway_Architecture_v2.png', size: '1.1 MB', type: 'System Diagram', uploadedBy: 'Elena Rostova', date: 'Jul 02' }
    ],
    activityLog: [
      { user: 'Alex Turner', action: 'changed status to', target: 'IN_PROGRESS', timestamp: 'Today at 9:00 AM' },
      { user: 'Alex Turner', action: 'completed checklist subtask', target: 'Configure Redis session cluster TTL', timestamp: 'Yesterday at 4:30 PM' },
      { user: 'Elena Rostova', action: 'posted security note in', target: 'Discussion Thread', timestamp: 'Yesterday at 3:15 PM' },
      { user: 'Marcus Tech VP', action: 'assigned task deliverable to', target: 'Alex Turner', timestamp: 'Jul 01 at 11:00 AM' }
    ],
    tags: ['Security', 'API', 'iOS', 'OAuth', 'PKCE']
  };

  const [checklistItems, setChecklistItems] = useState(t.checklist || []);
  const [commentsList, setCommentsList] = useState(t.comments || []);

  const handleToggleChecklist = (id) => {
    setChecklistItems(items => items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const handleAddChecklist = (title) => {
    setChecklistItems(items => [...items, { id: `chk-${Date.now()}`, title, completed: false }]);
  };

  const handleDeleteChecklist = (id) => {
    setChecklistItems(items => items.filter(i => i.id !== id));
  };

  const handleAddComment = (newCmt) => {
    setCommentsList(list => [...list, newCmt]);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in max-w-7xl mx-auto">
      {/* Top Navigation & Action Header */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBack && onBack()}
            className="p-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white rounded-xl border border-[#e1e2ed] dark:border-gray-700 transition-colors shadow-2xs"
            title="Return to Tasks Directory"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-[#2563eb] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">
                {t.id}
              </span>
              <span className="text-xs font-mono text-[#737686]">● Created {t.createdAt}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1 line-clamp-1">
              {t.title}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onEdit && onEdit(t)}
            className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 size={15} /> Edit Task
          </button>
          <button
            onClick={() => onStatusChange && onStatusChange(t.id, 'COMPLETED')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 size={15} /> Mark Completed
          </button>
          <button
            onClick={() => onDelete && onDelete(t.id)}
            className="p-2 text-gray-400 hover:text-rose-600 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors"
            title="Delete task"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Left Content (2 cols) vs Right Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Task Specifications & Sub-tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Description Card */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={t.priority} size="md" />
                <StatusBadge status={t.status} size="md" />
              </div>
              <div className="flex items-center gap-1.5">
                {t.tags && t.tags.map((tag, i) => (
                  <TagChip key={i} tag={tag} />
                ))}
              </div>
            </div>

            {/* Markdown Description Render */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-[#191b23] dark:text-gray-200 leading-relaxed font-sans space-y-3">
              <h4 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-[#2563eb]" /> Task Description & Scope
              </h4>
              <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/40 rounded-xl border border-[#e1e2ed]/80 whitespace-pre-line font-sans text-xs sm:text-sm leading-relaxed">
                {t.description}
              </div>
            </div>

            {/* Attached Documents Section */}
            <div className="pt-4 border-t border-[#e1e2ed] dark:border-gray-800 space-y-3">
              <h5 className="font-bold text-xs text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Paperclip size={14} className="text-[#2563eb]" /> Attached Specifications & SLA Files ({t.attachments?.length || 0})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.attachments?.map((att) => (
                  <div key={att.id} className="p-3 rounded-xl bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed]/80 flex items-center justify-between gap-3 group hover:border-[#2563eb] transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#2563eb] font-bold text-xs shrink-0 font-mono">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#191b23] dark:text-white truncate">{att.name}</p>
                        <span className="text-[10px] font-mono text-[#737686]">{att.size} • By {att.uploadedBy}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 group-hover:text-[#2563eb] p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-2xs">
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-tabs Navigation Header */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-2 flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('execution')}
              className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'execution' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
              }`}
            >
              <CheckSquare size={15} /> Checklist Subtasks
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'comments' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
              }`}
            >
              <MessageSquare size={15} /> Comments ({commentsList.length})
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'time' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
              }`}
            >
              <Clock size={15} /> Time Telemetry
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
              }`}
            >
              <Activity size={15} /> Activity Log
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'execution' && (
            <Checklist 
              items={checklistItems} 
              onToggle={handleToggleChecklist} 
              onAdd={handleAddChecklist} 
              onDelete={handleDeleteChecklist} 
            />
          )}

          {activeTab === 'comments' && (
            <CommentPanel 
              comments={commentsList} 
              onAddComment={handleAddComment} 
            />
          )}

          {activeTab === 'time' && (
            <TimeTrackingWidget 
              estimatedHours={t.estimatedHours} 
              loggedHours={t.loggedHours} 
            />
          )}

          {activeTab === 'audit' && (
            <TaskTimeline activityLog={t.activityLog} />
          )}
        </div>

        {/* Right 1 Column: Metadata & Project Information Sidebar */}
        <div className="space-y-6">
          {/* Assignee & Responsibility Card */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              Workforce Assignment
            </h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                  {t.assignee ? t.assignee.charAt(0) : 'U'}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#191b23] dark:text-white">{t.assignee}</h5>
                  <span className="text-xs text-[#737686] block">{t.role || 'Senior Software Engineer'}</span>
                </div>
              </div>
              <button 
                onClick={() => onAssign && onAssign(t)}
                className="text-xs text-[#2563eb] font-semibold hover:underline"
              >
                Reassign
              </button>
            </div>

            <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#737686]">Assigned By:</span>
                <span className="font-bold text-[#191b23] dark:text-white">{t.assignedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737686]">Target Due Date:</span>
                <span className="font-extrabold text-rose-600">{t.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Project Information Box */}
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4 font-mono">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
              Associated Project Scope
            </h4>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 shrink-0">
                <FolderKanban size={20} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded">
                  {t.projectCode || 'PRJ-101'}
                </span>
                <h5 className="font-bold text-sm text-[#191b23] dark:text-white mt-1 font-sans">{t.project}</h5>
                <p className="text-xs text-[#737686] font-sans mt-0.5">Primary initiative for Q3 Enterprise Workforce scaling.</p>
              </div>
            </div>

            <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-xl border border-[#e1e2ed] space-y-1.5 text-xs font-sans">
              <div className="flex justify-between font-mono">
                <span className="text-[#737686]">Project Budget:</span>
                <strong className="text-[#191b23] dark:text-white">$450,000</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#737686]">SLA Compliance:</span>
                <strong className="text-emerald-600">99.4% Validated</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
