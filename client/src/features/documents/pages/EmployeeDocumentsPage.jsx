import React, { useState } from 'react';
import { FileText, UploadCloud, Download, Eye, UserCheck, Briefcase, Lock, HeartPulse, Landmark } from 'lucide-react';
import { DocumentStatusBadge, DocumentCategoryBadge, FileTypeBadge } from '../components/DocumentBadges';
import { DocumentCard } from '../components/DocumentCards';

/**
 * EmployeeDocumentsPage.jsx
 * Employee personnel repository: Required Documents checklist, Uploaded vs Pending records,
 * Verification SLA status, and Expiry date warnings.
 */
export const EmployeeDocumentsPage = ({
  documents = [],
  onSelectDoc,
  onDownload,
  onUpload,
  onVerify
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('Alex Turner');

  const empDocs = documents.filter(d => d.scope === 'EMPLOYEE' || d.owner === selectedEmployee);
  const verifiedCount = empDocs.filter(d => d.status === 'VERIFIED').length;
  const pendingCount  = empDocs.filter(d => d.status === 'PENDING').length;
  const expiredCount  = empDocs.filter(d => d.status === 'EXPIRED').length;

  const requiredList = [
    { name: 'Government ID Proof (Passport / SSN)', category: 'ID_PROOF', icon: Lock, status: 'VERIFIED', expiry: 'Jul 2028', docId: 'DOC-8102' },
    { name: 'Employee Non-Disclosure Agreement', category: 'CONTRACT', icon: Briefcase, status: 'VERIFIED', expiry: 'Permanent', docId: 'DOC-8103' },
    { name: 'Tax W-4 / Withholding Form', category: 'TAX', icon: Landmark, status: 'VERIFIED', expiry: 'Annual', docId: 'DOC-8104' },
    { name: 'Medical Fitness & Insurance Declaration', category: 'MEDICAL', icon: HeartPulse, status: 'EXPIRED', expiry: 'Jul 04, 2026', docId: 'DOC-8105' },
    { name: 'Direct Deposit Banking Authorization', category: 'PAYSLIP', icon: FileText, status: 'PENDING', expiry: 'Permanent', docId: 'DOC-8106' },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Employee Selector & Profile Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-xl uppercase shadow-sm shrink-0">
            {selectedEmployee.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 border border-purple-200">
                PERSONNEL FILE
              </span>
              <span className="text-xs text-[#737686] font-mono">EMP-0042 · Engineering</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-1 truncate">
              {selectedEmployee} — Document Dossier
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
          >
            <option value="Alex Turner">Alex Turner (Lead Backend Eng)</option>
            <option value="Samantha Wu">Samantha Wu (Compliance Lead)</option>
            <option value="David Chen">David Chen (Sales VP)</option>
            <option value="Elena Rostova">Elena Rostova (Frontend Eng)</option>
          </select>
          <button
            onClick={onUpload}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <UploadCloud size={15} /> Upload Record
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[#737686] font-bold uppercase font-mono text-[10px]">Total Employee Files</span>
          <h3 className="text-2xl font-black text-[#191b23] dark:text-white font-mono">{empDocs.length || 18}</h3>
        </div>
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-emerald-600 font-bold uppercase font-mono text-[10px]">Verified &amp; Compliant</span>
          <h3 className="text-2xl font-black text-emerald-600 font-mono">{verifiedCount || 14}</h3>
        </div>
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-amber-600 font-bold uppercase font-mono text-[10px]">Pending HR Verification</span>
          <h3 className="text-2xl font-black text-amber-600 font-mono">{pendingCount || 3}</h3>
        </div>
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-rose-600 font-bold uppercase font-mono text-[10px]">Expired / Action Req.</span>
          <h3 className="text-2xl font-black text-rose-600 font-mono">{expiredCount || 1}</h3>
        </div>
      </div>

      {/* Required Documents Checklist */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <h3 className="font-extrabold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
            <UserCheck size={18} className="text-[#2563eb]" /> Mandatory Onboarding &amp; Annual Compliance Documents
          </h3>
          <span className="text-[11px] font-mono font-bold text-emerald-600">● 4 OF 5 VERIFIED</span>
        </div>
        <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
          {requiredList.map((req, i) => {
            const Icon = req.icon;
            return (
              <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200 shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <strong className="text-sm font-bold text-[#191b23] dark:text-white block truncate">{req.name}</strong>
                    <span className="text-[11px] font-mono text-[#737686]">ID: {req.docId} · Expiry SLA: {req.expiry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-11 sm:ml-0">
                  <DocumentCategoryBadge category={req.category} size="sm" />
                  <DocumentStatusBadge status={req.status} size="sm" />
                  <button
                    onClick={() => onSelectDoc && onSelectDoc({ id: req.docId, name: `${req.name}.pdf`, category: req.category, status: req.status, owner: selectedEmployee })}
                    className="p-1.5 text-gray-500 hover:text-[#2563eb] rounded-lg transition-colors"
                    title="Preview Record"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onDownload && onDownload({ name: req.name })}
                    className="p-1.5 text-gray-500 hover:text-[#2563eb] rounded-lg transition-colors"
                    title="Download Copy"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#737686]">
          <span>All Uploaded Employee Files ({empDocs.length} records)</span>
          <span>Showing verified and pending submissions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(empDocs.length > 0 ? empDocs : documents.slice(0, 4)).map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onSelect={onSelectDoc}
              onDownload={onDownload}
              onVerify={onVerify}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
