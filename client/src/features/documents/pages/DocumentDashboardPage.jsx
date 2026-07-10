import React from 'react';
import { FileText, CheckCircle2, Clock, XCircle, Users, Building2, UploadCloud, FolderPlus, ShieldCheck, ArrowRight, Zap, HardDrive, Activity, Eye, FileCheck } from 'lucide-react';
import { DocumentAnalyticsCard, StorageProgressBar } from '../components/DocumentCards';
import { DocumentStatusBadge, DocumentCategoryBadge, FileTypeBadge } from '../components/DocumentBadges';

/**
 * DocumentDashboardPage.jsx
 * Executive command center for EWMP Document Management.
 * Displays Total, Verified, Pending, Rejected, Employee vs Org breakdown, Storage Usage, and Recent Uploads.
 */
export const DocumentDashboardPage = ({
  documents = [],
  onUpload,
  onCreateFolder,
  onVerifyQueue,
  onSelectDoc,
  onNavigate
}) => {
  const total      = documents.length || 384;
  const verified   = documents.filter(d => d.status === 'VERIFIED').length || 298;
  const pending    = documents.filter(d => d.status === 'PENDING').length  || 64;
  const rejected   = documents.filter(d => d.status === 'REJECTED').length || 14;
  const expired    = documents.filter(d => d.status === 'EXPIRED').length  || 8;

  const employeeDocs = documents.filter(d => d.scope === 'EMPLOYEE' || d.category === 'ID_PROOF' || d.category === 'PAYSLIP' || d.category === 'MEDICAL' || d.category === 'TAX').length || 242;
  const orgDocs      = documents.filter(d => d.scope === 'ORGANIZATION' || d.category === 'POLICY' || d.category === 'CONTRACT' || d.category === 'COMPLIANCE' || d.category === 'ANNOUNCEMENT').length || 142;

  const recentUploads = documents.slice(0, 5);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200">
              SHAREPOINT &amp; GOOGLE DRIVE SYNCED
            </span>
            <span className="text-xs text-[#737686] font-mono">Q3 Document Repository Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Workforce Document Management
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Secure cloud storage, automated HR verification workflows, compliance tracking, and version-controlled document ledgers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <UploadCloud size={15} /> Upload Document
          </button>
          <button
            onClick={onCreateFolder}
            className="px-4 py-2 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FolderPlus size={15} /> Create Folder
          </button>
          <button
            onClick={onVerifyQueue}
            className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-colors"
          >
            <FileCheck size={15} /> Verify Queue ({pending})
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <DocumentAnalyticsCard title="Total Documents"    value={total}    subtitle="Active in repository" icon={FileText}     change="+24 this week"   trend="up"      color="text-[#2563eb]"   bg="bg-blue-50 dark:bg-blue-950/60" />
        <DocumentAnalyticsCard title="Verified Docs"      value={verified} subtitle="HR / Compliance approved" icon={CheckCircle2} change="78% verification"  trend="up"      color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/60" />
        <DocumentAnalyticsCard title="Pending Review"     value={pending}  subtitle="Awaiting verification" icon={Clock}        change="Action required" trend="down"    color="text-amber-600"   bg="bg-amber-50 dark:bg-amber-950/60" />
        <DocumentAnalyticsCard title="Rejected Docs"      value={rejected} subtitle="Failed verification"  icon={XCircle}      change="Resubmission needed" trend="down" color="text-rose-600"    bg="bg-rose-50 dark:bg-rose-950/60" />
        <DocumentAnalyticsCard title="Employee Files"     value={employeeDocs} subtitle="Personnel records"  icon={Users}        change="63% of repository" trend="neutral" color="text-purple-600"  bg="bg-purple-50 dark:bg-purple-950/60" />
        <DocumentAnalyticsCard title="Org & Policy Docs"  value={orgDocs}  subtitle="Corporate repository" icon={Building2}    change="37% of repository" trend="neutral" color="text-indigo-600"  bg="bg-indigo-50 dark:bg-indigo-950/60" />
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <span className="font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> Admin &amp; Employee Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Upload Document',   icon: UploadCloud, color: 'text-[#2563eb]',  action: onUpload },
            { label: 'Create Folder',     icon: FolderPlus,  color: 'text-purple-600', action: onCreateFolder },
            { label: 'Verify Documents',  icon: FileCheck,   color: 'text-emerald-600',action: onVerifyQueue },
            { label: 'Employee Library',  icon: Users,       color: 'text-amber-600',  action: () => onNavigate && onNavigate('employee') },
            { label: 'Org Repository',    icon: Building2,   color: 'text-indigo-600', action: () => onNavigate && onNavigate('org') },
            { label: 'Storage Analytics', icon: HardDrive,   color: 'text-rose-600',   action: () => onNavigate && onNavigate('analytics') },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-[#e1e2ed] dark:border-gray-800 rounded-lg hover:border-[#2563eb] transition-colors font-semibold text-[#191b23] dark:text-gray-200 flex items-center gap-1.5"
            >
              <btn.icon size={14} className={btn.color} /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Storage Usage + Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Storage Quota + Verification Notice */}
        <div className="space-y-6">
          <StorageProgressBar usedGB={342} totalGB={500} label="AWS S3 Enterprise Storage Quota" />

          {/* Compliance & Expiry Notice */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-purple-600" /> Compliance &amp; Expiry Alerts
              </h3>
              <span className="text-[11px] font-mono text-rose-600 font-bold">{expired} expired</span>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'ISO 27001 Security Audit Cert', dept: 'InfoSec', expires: 'Jul 01, 2026', status: 'EXPIRED' },
                { name: 'Alex Turner Medical Fitness Form', dept: 'Engineering', expires: 'Jul 04, 2026', status: 'EXPIRED' },
                { name: 'AWS Cloud SLA Agreement 2026', dept: 'IT Ops', expires: 'Aug 15, 2026', status: 'PENDING' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed]/80 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <strong className="font-bold text-xs text-[#191b23] dark:text-white block truncate">{item.name}</strong>
                    <span className="text-[10px] font-mono text-[#737686]">{item.dept} · Expires: {item.expires}</span>
                  </div>
                  <DocumentStatusBadge status={item.status} size="sm" />
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate && onNavigate('library')}
              className="w-full py-2 text-xs font-bold text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              View All Document Alerts <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Recent Uploads */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            <h3 className="font-bold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-[#2563eb]" /> Recent Document Uploads
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('library')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
            >
              Open Document Library <ArrowRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
            {recentUploads.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDoc && onSelectDoc(doc)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileTypeBadge fileType={doc.fileType || 'PDF'} size="sm" />
                  <div className="min-w-0">
                    <strong className="text-sm font-bold text-[#191b23] dark:text-white block truncate hover:text-[#2563eb] transition-colors">
                      {doc.name}
                    </strong>
                    <span className="text-xs text-[#737686] font-mono">
                      Uploaded by {doc.owner} ({doc.department}) · {doc.uploadDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <DocumentCategoryBadge category={doc.category} size="sm" />
                  <DocumentStatusBadge status={doc.status} size="sm" />
                  <button className="p-1.5 text-gray-400 hover:text-[#2563eb] rounded-lg">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
