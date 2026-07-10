import React, { useState } from 'react';
import { ArrowLeft, Upload, Paperclip, X, CheckCircle2, Sparkles } from 'lucide-react';
import { TicketPriorityBadge, TicketCategoryBadge } from '../components/HelpDeskBadges';

/**
 * CreateTicketPage.jsx
 * Enterprise ticket submission form with automated departmental routing,
 * priority assessment, drag-and-drop file attachments, and a pre-submit review step.
 */
export const CreateTicketPage = ({
  onCreateTicket,
  onCancel
}) => {
  const [step, setStep] = useState(1); // 1: Form | 2: Review
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'MEDIUM',
    department: 'Engineering',
    contactEmail: 'alex.turner@ewmp.enterprise',
    attachments: [
      { name: 'console_error_trace.log', size: '240 KB' }
    ],
  });

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }]
      }));
    }
  };

  const handleRemoveAttachment = (idx) => {
    setForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      department: form.department,
      status: 'OPEN',
      slaStatus: 'ON_TRACK',
      assignedTo: form.category === 'IT' ? 'Michael Vance (IT Lead)' : form.category === 'HR' ? 'Samantha Wu (HR Ops)' : 'Triage Team',
      createdBy: 'Alex Turner',
      updatedDate: 'Just now',
      commentsCount: 0,
      attachmentsCount: form.attachments.length,
      attachments: form.attachments,
      timeline: [
        { id: 1, type: 'CREATE', author: 'Alex Turner', timestamp: 'Just now', text: 'Service ticket initialized and routed to department triage queue.' }
      ]
    };

    onCreateTicket && onCreateTicket(newTicket);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2.5 rounded-xl bg-[#faf8ff] dark:bg-[#161616] border hover:border-[#2563eb] text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#2563eb] block">
              STEP {step} OF 2 • {step === 1 ? 'REQUEST DETAILS' : 'PRE-SUBMIT REVIEW'}
            </span>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-0.5">
              Submit New Service Support Request
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#2563eb]' : 'bg-gray-300'}`} />
          <span className="w-8 h-0.5 bg-gray-300" />
          <span className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-[#2563eb]' : 'bg-gray-300'}`} />
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6 animate-slide-up">
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono mb-1">
                Request Subject / Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Need AWS CloudFront SSL Certificate renewal for production API"
                className="w-full p-3.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-bold text-sm focus:border-[#2563eb] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono mb-1">
                Detailed Problem Description *
              </label>
              <textarea
                rows={5}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the issue, steps to reproduce, or specific equipment/access required..."
                className="w-full p-3.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans focus:border-[#2563eb] outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono mb-1">
                  Service Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold"
                >
                  <option value="IT">IT Support &amp; Hardware</option>
                  <option value="HR">HR &amp; Benefits Admin</option>
                  <option value="FINANCE">Finance &amp; Expense Audit</option>
                  <option value="FACILITIES">Facilities &amp; Office Ops</option>
                  <option value="ADMIN">Administration &amp; Legal</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono mb-1">
                  Urgency / Priority Level
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold"
                >
                  <option value="CRITICAL">CRITICAL (System Down - Immediate Triage)</option>
                  <option value="HIGH">HIGH (Blocking Productivity)</option>
                  <option value="MEDIUM">MEDIUM (Standard Service Request)</option>
                  <option value="LOW">LOW (General Inquiry)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono mb-1">
                  Requesting Department
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="HR & Operations">HR &amp; Operations</option>
                  <option value="Finance & Tax">Finance &amp; Tax</option>
                  <option value="Sales & Growth">Sales &amp; Growth</option>
                  <option value="Executive Suite">Executive Suite</option>
                </select>
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            <div className="space-y-2 pt-2">
              <label className="block font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono">
                Attach Diagnostic Logs, Screenshots or Documents
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
                  dragActive
                    ? 'border-[#2563eb] bg-blue-50/40 dark:bg-blue-950/20'
                    : 'border-[#c3c6d7] dark:border-gray-800 bg-[#faf8ff] dark:bg-[#161616]'
                }`}
              >
                <Upload size={24} className="mx-auto text-[#2563eb] mb-2" />
                <p className="text-xs font-bold text-[#191b23] dark:text-white">
                  Drag and drop diagnostic files here, or click to browse
                </p>
                <span className="text-[10px] font-mono text-[#737686] block mt-1">
                  Supports PDF, PNG, JPG, LOG, and DOCX (max 15 MB)
                </span>
              </div>

              {form.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.attachments.map((file, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 flex items-center gap-2 text-xs font-mono">
                      <Paperclip size={13} className="text-[#2563eb]" />
                      <span>{file.name} ({file.size})</span>
                      <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-gray-400 hover:text-rose-600 ml-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-xs"
            >
              Cancel Request
            </button>
            <button
              type="submit"
              disabled={!form.title || !form.description}
              className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              Proceed to SLA Review <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6 animate-slide-up">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
            <Sparkles size={20} className="text-[#2563eb] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs font-sans">
              <h4 className="font-extrabold text-[#191b23] dark:text-white">
                Automated SLA Assessment &amp; Routing Preview
              </h4>
              <p className="text-[#737686] dark:text-gray-300">
                Based on your selected category (<strong>{form.category}</strong>) and priority (<strong>{form.priority}</strong>), this request will be routed directly to the <strong>{form.category === 'IT' ? 'IT Infrastructure & Cloud Ops' : form.category === 'HR' ? 'HR Operations Lead' : 'Departmental Triage'}</strong> queue with an estimated initial response window of <strong>&lt; 30 minutes</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans border-t border-b border-[#e1e2ed] dark:border-gray-800 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[#737686] block">Subject Title:</span>
                <strong className="text-base font-extrabold text-[#191b23] dark:text-white">{form.title}</strong>
              </div>
              <div className="flex items-center gap-2">
                <TicketCategoryBadge category={form.category} />
                <TicketPriorityBadge priority={form.priority} />
              </div>
            </div>

            <div>
              <span className="font-mono text-[#737686] block mb-1">Detailed Description:</span>
              <p className="p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800 text-[#191b23] dark:text-gray-200 whitespace-pre-line leading-relaxed">
                {form.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px]">
              <div>
                <span className="text-[#737686]">Requesting Dept:</span>
                <strong className="block text-[#191b23] dark:text-white text-xs">{form.department}</strong>
              </div>
              <div>
                <span className="text-[#737686]">Attached Diagnostic Files:</span>
                <strong className="block text-[#191b23] dark:text-white text-xs">{form.attachments.length} file(s) ready for upload</strong>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Edit Form
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#2563eb] hover:bg-[#004ac6] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all scale-105"
            >
              <CheckCircle2 size={18} /> Confirm &amp; Submit Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
