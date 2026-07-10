import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, ArrowLeft, X, ShieldCheck, Tag, Users, Calendar, Lock } from 'lucide-react';

/**
 * UploadDocumentPage.jsx
 * Multi-step wizard for uploading documents into EWMP repository:
 * Step 1: Select File (Drag & Drop)
 * Step 2: Document Type & Category
 * Step 3: Scope, Department & Employee Owner
 * Step 4: Description, Tags & Permissions
 * Step 5: Review & Confirm Upload
 */
export const UploadDocumentPage = ({ onCancel, onUploadComplete }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'POLICY',
    fileType: 'PDF',
    scope: 'EMPLOYEE', // 'EMPLOYEE' | 'ORGANIZATION'
    department: 'Engineering',
    owner: 'Alex Turner',
    expiryDate: '2027-07-07',
    description: '',
    tagsInput: 'Policy, Confidential, HR',
    accessLevel: 'RESTRICTED_HR_MANAGER', // 'PUBLIC_ORG' | 'RESTRICTED_HR_MANAGER' | 'OWNER_ONLY'
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) {
      setFile(dropped);
      setFormData(prev => ({
        ...prev,
        name: dropped.name,
        fileType: dropped.name.split('.').pop()?.toUpperCase() || 'PDF',
      }));
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFormData(prev => ({
        ...prev,
        name: selected.name,
        fileType: selected.name.split('.').pop()?.toUpperCase() || 'PDF',
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && !file && !formData.name) {
      // Simulate demo file if none dropped
      setFile({ name: 'EWMP_Employee_Contract_2026.pdf', size: 2450000 });
      setFormData(prev => ({ ...prev, name: 'EWMP_Employee_Contract_2026.pdf', fileType: 'PDF' }));
    }
    setStep(s => Math.min(5, s + 1));
  };

  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleFinish = () => {
    const newDoc = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name || 'Untitled_Document.pdf',
      category: formData.category,
      fileType: formData.fileType,
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB',
      status: 'PENDING',
      owner: formData.owner,
      department: formData.department,
      scope: formData.scope,
      uploadDate: 'Jul 07, 2026',
      expiryDate: formData.expiryDate,
      description: formData.description || 'Uploaded via EWMP multi-step document wizard.',
      tags: formData.tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };
    onUploadComplete && onUploadComplete(newDoc);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans animate-fade-in">
      {/* Top Card & Progress Bar */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200">
              UPLOAD WIZARD — STEP {step} OF 5
            </span>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
              Add New Document to Enterprise Library
            </h2>
          </div>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
          {[
            { s: 1, label: 'Select File' },
            { s: 2, label: 'Type & Category' },
            { s: 3, label: 'Owner & Dept' },
            { s: 4, label: 'Metadata & Tags' },
            { s: 5, label: 'Review & Confirm' },
          ].map((item) => (
            <div key={item.s} className="space-y-1.5">
              <div className={`h-2 rounded-full transition-all ${
                step > item.s ? 'bg-emerald-500' : step === item.s ? 'bg-[#2563eb] shadow-2xs' : 'bg-[#e1e2ed] dark:bg-gray-800'
              }`} />
              <span className={`text-[11px] font-mono font-bold block truncate ${
                step === item.s ? 'text-[#2563eb]' : step > item.s ? 'text-emerald-600' : 'text-[#737686]'
              }`}>
                {item.s}. {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Box */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-6 min-h-[380px] flex flex-col justify-between">
        {/* Step 1: Drag & Drop */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <UploadCloud size={18} className="text-[#2563eb]" /> Step 1: Select or Drag &amp; Drop Document File
            </h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#2563eb]/40 hover:border-[#2563eb] bg-[#faf8ff] dark:bg-[#161616] rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer group"
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input id="file-upload-input" type="file" className="hidden" onChange={handleFileSelect} />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <UploadCloud size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#191b23] dark:text-white">
                  {file ? `Selected: ${file.name}` : 'Click to browse or drag file into this dropzone'}
                </p>
                <p className="text-xs text-[#737686] max-w-sm mx-auto">
                  Supports PDF, DOCX, XLSX, PPTX, PNG, JPG, ZIP up to 100 MB per file. Multipart chunking enabled for large files.
                </p>
              </div>
              {file && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 text-xs font-mono font-bold border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Ready for metadata enrichment ({Math.round((file.size || 2400000) / 1024)} KB)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Document Type & Category */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-purple-600" /> Step 2: Set Document Category &amp; Taxonomy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Document Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
                  placeholder="e.g. Employee_Agreement_2026.pdf"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Document Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
                >
                  <option value="POLICY">Policy &amp; SLA</option>
                  <option value="CONTRACT">Legal Contract</option>
                  <option value="COMPLIANCE">Compliance Audit</option>
                  <option value="ID_PROOF">ID Verification Proof</option>
                  <option value="TAX">Tax &amp; Financial Record</option>
                  <option value="MEDICAL">Medical Record</option>
                  <option value="PAYSLIP">Payroll &amp; Payslip</option>
                  <option value="CERTIFICATE">Certification &amp; Award</option>
                  <option value="TEMPLATE">Standard Template</option>
                  <option value="ANNOUNCEMENT">Announcement Notice</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Scope, Department & Owner */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <Users size={18} className="text-emerald-600" /> Step 3: Assign Scope, Department &amp; Document Owner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Scope / Target</label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
                >
                  <option value="EMPLOYEE">Employee Record</option>
                  <option value="ORGANIZATION">Organization Policy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR &amp; Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales &amp; Marketing</option>
                  <option value="IT">IT &amp; InfoSec</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Document Owner / Employee</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold"
                  placeholder="e.g. Alex Turner"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-rose-500" /> Expiry Date (optional for compliance SLA)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full md:w-1/3 p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono font-semibold"
              />
            </div>
          </div>
        )}

        {/* Step 4: Description & Tags */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <Tag size={18} className="text-amber-500" /> Step 4: Description, Tags &amp; Access Control
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Description &amp; Admin Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans"
                  placeholder="Provide context, revision notes, or instructions for HR verification..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5">Keywords &amp; Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                    className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-mono"
                    placeholder="e.g. Policy, Confidential, HR"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#191b23] dark:text-white uppercase mb-1.5 flex items-center gap-1.5">
                    <Lock size={14} className="text-[#2563eb]" /> Access Permission Level
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                    className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
                  >
                    <option value="RESTRICTED_HR_MANAGER">Restricted: HR Managers &amp; Admins Only</option>
                    <option value="PUBLIC_ORG">Organization-wide Read Access</option>
                    <option value="OWNER_ONLY">Private: Owner Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Confirm */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" /> Step 5: Review Document Ledger &amp; Confirm Upload
            </h3>
            <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                <span className="text-[#737686]">File Name:</span>
                <strong className="text-[#191b23] dark:text-white">{formData.name || 'Contract_2026.pdf'}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                <span className="text-[#737686]">Category &amp; Scope:</span>
                <strong className="text-[#2563eb]">{formData.category} ({formData.scope})</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                <span className="text-[#737686]">Owner &amp; Dept:</span>
                <strong className="text-[#191b23] dark:text-white">{formData.owner} — {formData.department}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
                <span className="text-[#737686]">Expiry Date:</span>
                <strong className="text-rose-600">{formData.expiryDate || 'None'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737686]">Initial Status:</span>
                <strong className="text-amber-600">PENDING COMPLIANCE VERIFICATION</strong>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Row */}
        <div className="flex items-center justify-between pt-6 border-t border-[#e1e2ed] dark:border-gray-800">
          <button
            onClick={step === 1 ? onCancel : handlePrev}
            className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-[#e1e2ed] dark:border-gray-700 hover:bg-[#faf8ff] rounded-xl text-xs font-bold text-[#191b23] dark:text-white flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} /> {step === 1 ? 'Cancel Upload' : 'Previous Step'}
          </button>
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all animate-pulse"
            >
              <CheckCircle2 size={16} /> Confirm &amp; Commit to S3
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
