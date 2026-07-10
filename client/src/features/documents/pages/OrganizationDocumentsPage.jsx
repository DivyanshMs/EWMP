import React, { useState } from 'react';
import { Building2, ShieldCheck, Briefcase, FileCode, Globe, UploadCloud, FolderPlus, Search, FileCheck } from 'lucide-react';
import { DocumentCard, FolderCard } from '../components/DocumentCards';
import { DocumentTable } from '../components/DocumentTables';
import { DocumentCategoryBadge, DocumentStatusBadge } from '../components/DocumentBadges';

/**
 * OrganizationDocumentsPage.jsx
 * Corporate repository supporting categorized sections: Policies, Contracts,
 * Company Documents, Compliance, Templates, Announcements, and Shared Files.
 */
export const OrganizationDocumentsPage = ({
  documents = [],
  folders = [],
  onSelectDoc,
  onDownload,
  onUpload,
  onCreateFolder
}) => {
  const [activeSection, setActiveSection] = useState('ALL'); // 'ALL' | 'POLICY' | 'CONTRACT' | 'COMPLIANCE' | 'TEMPLATE' | 'ANNOUNCEMENT'
  const [search, setSearch] = useState('');

  const sections = [
    { id: 'ALL',          label: 'All Org Files',     icon: Building2, count: documents.filter(d => d.scope === 'ORGANIZATION').length || 142 },
    { id: 'POLICY',       label: 'Policies & SLAs',   icon: ShieldCheck, count: 48 },
    { id: 'CONTRACT',     label: 'Legal Contracts',   icon: Briefcase,   count: 32 },
    { id: 'COMPLIANCE',   label: 'Compliance Audits', icon: FileCheck,   count: 24 },
    { id: 'TEMPLATE',     label: 'Standard Templates',icon: FileCode,    count: 18 },
    { id: 'ANNOUNCEMENT', label: 'Announcements',     icon: Globe,       count: 20 },
  ];

  const orgDocs = documents.filter(d => {
    const isOrg = d.scope === 'ORGANIZATION' || d.category === 'POLICY' || d.category === 'CONTRACT' || d.category === 'COMPLIANCE' || d.category === 'TEMPLATE' || d.category === 'ANNOUNCEMENT';
    const matchSec = activeSection === 'ALL' || d.category === activeSection;
    const matchQ   = d.name?.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase());
    return isOrg && matchSec && matchQ;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 border border-indigo-200">
              CORPORATE REPOSITORY
            </span>
            <span className="text-xs text-[#737686] font-mono">SOC2 Type II &amp; ISO 27001 Audited</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Organization Policy &amp; Compliance Library
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Centralized corporate governance documents, legal contracts, standardized templates, and company announcements.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onUpload}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <UploadCloud size={15} /> Publish Org Document
          </button>
          <button
            onClick={onCreateFolder}
            className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FolderPlus size={15} /> New Folder
          </button>
        </div>
      </div>

      {/* Section Tabs & Search */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Section Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-mono">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeSection === sec.id ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon size={14} /> {sec.label}
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeSection === sec.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-[#737686]'}`}>
                    {sec.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search corporate files..."
              className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans"
            />
          </div>
        </div>
      </div>

      {/* Top Corporate Directories (Folders) */}
      {activeSection === 'ALL' && folders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono">
            Key Corporate Directories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {folders.slice(0, 3).map(f => (
              <FolderCard key={f.id} folder={f} onSelect={() => onSelectDoc && onSelectDoc({ ...f, isFolder: true })} />
            ))}
          </div>
        </div>
      )}

      {/* Document Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#737686]">
          <span>Displaying {orgDocs.length} organization documents</span>
          <span className="text-emerald-600 font-bold">● SOC2 COMPLIANT ENCRYPTION</span>
        </div>
        <DocumentTable
          documents={orgDocs.length > 0 ? orgDocs : documents.slice(0, 8)}
          onSelectDoc={onSelectDoc}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
};
