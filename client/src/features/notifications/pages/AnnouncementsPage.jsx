import React, { useState } from 'react';
import { Megaphone, Pin, Plus, Search, Filter, Users, Calendar, Paperclip, ArrowLeft, Download, X } from 'lucide-react';
import { AnnouncementCard } from '../components/NotificationCards';
import { NoAnnouncements } from '../components/NotificationEmptyStates';

/**
 * AnnouncementsPage.jsx
 * Organization broadcasts and departmental announcements feed.
 * Supports Pinned Broadcasts, Department/Audience filters, Create Announcement modal,
 * and detailed view with file attachment download triggers.
 */
export const AnnouncementsPage = ({
  announcements = [],
  onCreateAnnouncement,
  onDownloadAttachment,
  onBackToCenter
}) => {
  const [activeDepartment, setActiveDepartment] = useState('ALL'); // 'ALL' | 'Organization-wide' | 'Engineering' | 'HR' | 'Finance' | 'IT' | 'Sales'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Form state for new announcement
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'HIGH',
    audience: 'Organization-wide',
    department: 'All Departments',
    expirationDate: '2026-08-31',
    isPinned: true,
  });

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    const newAnn = {
      id: `ANN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: form.title,
      content: form.content,
      priority: form.priority,
      audience: form.audience,
      department: form.department,
      expirationDate: form.expirationDate,
      isPinned: form.isPinned,
      author: 'Alex Turner (HR Lead)',
      createdDate: 'Jul 07, 2026',
      attachments: [{ name: 'EWMP_Policy_Brief_2026.pdf', size: '1.2 MB' }],
    };

    onCreateAnnouncement && onCreateAnnouncement(newAnn);
    setShowCreateModal(false);
    setForm({ title: '', content: '', priority: 'HIGH', audience: 'Organization-wide', department: 'All Departments', expirationDate: '2026-08-31', isPinned: true });
  };

  const filtered = announcements.filter(item => {
    const matchDept = activeDepartment === 'ALL' || item.audience === activeDepartment || item.department === activeDepartment;
    const matchSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const pinnedList = filtered.filter(a => a.isPinned);
  const regularList = filtered.filter(a => !a.isPinned);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 border border-purple-200">
              EXECUTIVE BROADCASTS
            </span>
            <span className="text-xs text-[#737686] font-mono">Company-wide &amp; Departmental Notices</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Organization Broadcasts &amp; Announcements
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Important policy updates, executive town halls, IT maintenance schedules, and holiday notices.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToCenter}
            className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#191b23] dark:text-white border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ArrowLeft size={15} /> Back to Notification Center
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus size={16} /> Create Announcement
          </button>
        </div>
      </div>

      {/* Department Filter & Search */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All Broadcasts' },
              { id: 'Organization-wide', label: 'Org-Wide' },
              { id: 'Engineering', label: 'Engineering' },
              { id: 'HR & Operations', label: 'HR' },
              { id: 'IT & InfoSec', label: 'IT & InfoSec' },
              { id: 'Finance', label: 'Finance' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDepartment(d.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeDepartment === d.id
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans"
            />
          </div>
        </div>
      </div>

      {/* Announcement Details Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200 uppercase">
                  {selectedAnnouncement.priority} PRIORITY
                </span>
                <span className="text-xs font-mono text-[#737686]">{selectedAnnouncement.createdDate}</span>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black text-[#191b23] dark:text-white">
                {selectedAnnouncement.title}
              </h3>
              <p className="text-sm text-[#737686] dark:text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                {selectedAnnouncement.content}
              </p>
            </div>

            <div className="p-4 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#737686]">Target Audience:</span>
                <strong className="text-[#191b23] dark:text-white">{selectedAnnouncement.audience} ({selectedAnnouncement.department})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737686]">Broadcast Author:</span>
                <strong className="text-[#191b23] dark:text-white">{selectedAnnouncement.author}</strong>
              </div>
              {selectedAnnouncement.expirationDate && (
                <div className="flex justify-between">
                  <span className="text-[#737686]">Expiration Date:</span>
                  <strong className="text-rose-600">{selectedAnnouncement.expirationDate}</strong>
                </div>
              )}
            </div>

            {selectedAnnouncement.attachments?.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold font-mono text-[#737686] uppercase block">Attached Resources</span>
                <div className="flex flex-wrap gap-2">
                  {selectedAnnouncement.attachments.map((file, i) => (
                    <button
                      key={i}
                      onClick={() => onDownloadAttachment && onDownloadAttachment(file)}
                      className="px-3 py-2 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 hover:border-[#2563eb] rounded-xl text-xs font-mono font-bold text-[#2563eb] flex items-center gap-2 shadow-2xs"
                    >
                      <Paperclip size={14} />
                      <span>{file.name}</span>
                      <Download size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#e1e2ed] dark:border-gray-800">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2.5 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 text-[#2563eb] rounded-xl">
                  <Megaphone size={18} />
                </div>
                <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Publish New Broadcast Announcement</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">Broadcast Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Q3 Executive Town Hall & Policy Updates"
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">Announcement Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Enter full announcement details..."
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">Priority Level</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono font-semibold"
                  >
                    <option value="URGENT">URGENT (Top Pulse)</option>
                    <option value="HIGH">HIGH (Standard Executive)</option>
                    <option value="NORMAL">NORMAL (Departmental)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1">Target Audience Scope</label>
                  <select
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value, department: e.target.value === 'Organization-wide' ? 'All Departments' : 'Engineering' })}
                    className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono font-semibold"
                  >
                    <option value="Organization-wide">Organization-wide (All Users)</option>
                    <option value="Engineering">Engineering Department</option>
                    <option value="HR & Operations">HR &amp; Operations</option>
                    <option value="IT & InfoSec">IT &amp; InfoSec</option>
                    <option value="Finance">Finance &amp; Legal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-rose-500" /> Expiration Date
                  </label>
                  <input
                    type="date"
                    value={form.expirationDate}
                    onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
                    className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono font-semibold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold font-mono text-sm text-[#191b23] dark:text-white">
                    <input
                      type="checkbox"
                      checked={form.isPinned}
                      onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                      className="rounded text-[#2563eb] w-4 h-4"
                    />
                    <Pin size={16} className="text-[#2563eb] rotate-45" /> Pin to Top of Broadcast Feed
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Megaphone size={15} /> Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pinned Broadcasts Section */}
      {pinnedList.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs font-mono text-[#2563eb] uppercase tracking-wider flex items-center gap-1.5">
            <Pin size={14} className="rotate-45" /> Pinned &amp; High-Priority Organization Broadcasts
          </h3>
          <div className="space-y-4">
            {pinnedList.map(item => (
              <AnnouncementCard
                key={item.id}
                announcement={item}
                onSelect={setSelectedAnnouncement}
                onDownloadAttachment={onDownloadAttachment}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#737686]">
          <span>Showing {regularList.length} regular announcements</span>
          <span>● ARCHIVED EXPIRED BROADCASTS</span>
        </div>

        {filtered.length === 0 ? (
          <NoAnnouncements onCreateClick={() => setShowCreateModal(true)} />
        ) : (
          <div className="space-y-4">
            {regularList.map(item => (
              <AnnouncementCard
                key={item.id}
                announcement={item}
                onSelect={setSelectedAnnouncement}
                onDownloadAttachment={onDownloadAttachment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
