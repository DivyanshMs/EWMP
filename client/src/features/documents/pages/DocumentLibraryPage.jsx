import React, { useState } from 'react';
import { Search, SlidersHorizontal, RefreshCw, LayoutGrid, List, Folder, UploadCloud, FolderPlus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { DocumentCard, FolderCard } from '../components/DocumentCards';
import { DocumentTable } from '../components/DocumentTables';
import { NoDocuments, NoSearchResults } from '../components/DocumentEmptyStates';

/**
 * DocumentLibraryPage.jsx
 * Comprehensive enterprise repository supporting Grid View, Table View, Folder View,
 * search, advanced filters, sorting, and pagination.
 */
export const DocumentLibraryPage = ({
  documents = [],
  folders = [],
  onSelectDoc,
  onDownload,
  onVerify,
  onDelete,
  onShare,
  onUpload,
  onCreateFolder,
  onExport
}) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid' | 'folder'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fileTypeFilter, setFileTypeFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DATE');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = documents.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      d.name?.toLowerCase().includes(q) ||
      d.id?.toLowerCase().includes(q) ||
      d.owner?.toLowerCase().includes(q) ||
      d.department?.toLowerCase().includes(q) ||
      d.tags?.some(t => t.toLowerCase().includes(q));
    const matchCat  = categoryFilter  === 'ALL' || d.category === categoryFilter;
    const matchStat = statusFilter    === 'ALL' || d.status    === statusFilter;
    const matchType = fileTypeFilter  === 'ALL' || d.fileType  === fileTypeFilter;
    const matchDept = departmentFilter === 'ALL' || d.department === departmentFilter;
    const matchScope = scopeFilter    === 'ALL' || d.scope     === scopeFilter;
    return matchSearch && matchCat && matchStat && matchType && matchDept && matchScope;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'NAME') return a.name?.localeCompare(b.name);
    if (sortBy === 'OWNER') return a.owner?.localeCompare(b.owner);
    if (sortBy === 'CATEGORY') return a.category?.localeCompare(b.category);
    if (sortBy === 'SIZE') return parseFloat(a.size) - parseFloat(b.size);
    return b.id?.localeCompare(a.id); // Default: newest first
  });

  const totalPages  = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated   = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasFilters  = searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || fileTypeFilter !== 'ALL' || departmentFilter !== 'ALL' || scopeFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setFileTypeFilter('ALL');
    setDepartmentFilter('ALL');
    setScopeFilter('ALL');
    setCurrentPage(1);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = (allIds) => {
    if (selectedIds.length === allIds.length) setSelectedIds([]);
    else setSelectedIds(allIds);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 border border-purple-200">
              CENTRAL REPOSITORY
            </span>
            <span className="text-xs text-[#737686] font-mono">AWS S3 Cloud &amp; Local Index</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Document Library
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onExport}
            className="px-3.5 py-2 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 shadow-2xs"
          >
            <Download size={15} /> Export Index
          </button>
          <button
            onClick={onCreateFolder}
            className="px-3.5 py-2 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 shadow-2xs"
          >
            <FolderPlus size={15} /> New Folder
          </button>
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <UploadCloud size={15} /> Upload Document
          </button>
        </div>
      </div>

      {/* View Switcher & Search Bar */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* View Mode Pills */}
          <div className="flex items-center gap-1 bg-[#faf8ff] dark:bg-gray-900 p-1 rounded-xl border border-[#e1e2ed] dark:border-gray-800 font-mono text-xs w-full sm:w-auto justify-center">
            {[
              { id: 'table',  label: 'Table View',  icon: List },
              { id: 'grid',   label: 'Grid View',   icon: LayoutGrid },
              { id: 'folder', label: 'Folder View', icon: Folder },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === v.id ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} /> {v.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by filename, document ID, owner, department, or tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
            />
          </div>

          {/* Sort & Filters Trigger */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono"
            >
              <option value="DATE">Sort: Newest Upload</option>
              <option value="NAME">Sort: Name (A-Z)</option>
              <option value="OWNER">Sort: Owner</option>
              <option value="CATEGORY">Sort: Category</option>
              <option value="SIZE">Sort: Size</option>
            </select>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`p-2.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showFilters ? 'bg-[#2563eb] text-white border-[#2563eb]' : 'bg-[#faf8ff] dark:bg-[#161616] text-[#191b23] dark:text-white border-[#c3c6d7]'
              }`}
            >
              <SlidersHorizontal size={15} /> Filters
              {hasFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-[#2563eb] rounded text-[10px] font-bold font-mono">
                  {[categoryFilter, statusFilter, fileTypeFilter, departmentFilter, scopeFilter].filter(f => f !== 'ALL').length}
                </span>
              )}
            </button>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="p-2.5 text-gray-500 hover:text-rose-600 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors"
                title="Reset Filters"
              >
                <RefreshCw size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-3 border-t border-[#e1e2ed] dark:border-gray-800 animate-fade-in">
            {[
              { label: 'Category', value: categoryFilter, onChange: v => setCategoryFilter(v), options: [['ALL','All Categories'],['POLICY','Policy & SLA'],['CONTRACT','Legal Contract'],['COMPLIANCE','Compliance Audit'],['ID_PROOF','ID Verification'],['TAX','Tax & Financial'],['MEDICAL','Medical Record'],['PAYSLIP','Payroll & Payslip'],['CERTIFICATE','Certification'],['TEMPLATE','Template'],['ANNOUNCEMENT','Announcement'],['OTHER','Other']] },
              { label: 'Verification Status', value: statusFilter, onChange: v => setStatusFilter(v), options: [['ALL','All Statuses'],['VERIFIED','Verified'],['PENDING','Pending Review'],['REJECTED','Rejected'],['EXPIRED','Expired / Action Req.'],['DRAFT','Draft']] },
              { label: 'File Type', value: fileTypeFilter, onChange: v => setFileTypeFilter(v), options: [['ALL','All File Types'],['PDF','PDF Document'],['DOCX','Word DOCX'],['XLSX','Excel XLSX'],['PPTX','PowerPoint'],['PNG','Image PNG'],['JPG','Image JPG'],['ZIP','Archive ZIP']] },
              { label: 'Department', value: departmentFilter, onChange: v => setDepartmentFilter(v), options: [['ALL','All Departments'],['Engineering','Engineering'],['HR','HR & Operations'],['Finance','Finance'],['Sales','Sales'],['IT','IT & InfoSec'],['Marketing','Marketing']] },
              { label: 'Scope', value: scopeFilter, onChange: v => setScopeFilter(v), options: [['ALL','All Scopes'],['EMPLOYEE','Employee Personnel'],['ORGANIZATION','Organization Policy']] },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[10px] text-[#737686] uppercase mb-1 font-sans font-bold">{f.label}</label>
                <select
                  value={f.value}
                  onChange={(e) => { f.onChange(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg text-xs font-semibold font-mono"
                >
                  {f.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Selection Bar if any selected */}
      {selectedIds.length > 0 && (
        <div className="bg-[#2563eb] text-white px-5 py-3 rounded-xl flex items-center justify-between text-xs font-sans shadow-md animate-slide-up">
          <div className="flex items-center gap-2 font-bold">
            <span className="px-2 py-0.5 bg-white text-[#2563eb] rounded font-mono">{selectedIds.length}</span>
            <span>documents selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => selectedIds.forEach(id => { const d = documents.find(x => x.id === id); if(d) onDownload && onDownload(d); })} className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Download size={13} /> Bulk Download
            </button>
            <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 bg-transparent hover:bg-blue-800 rounded-lg text-xs font-semibold">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Content Render: Folder View | Grid View | Table View */}
      {viewMode === 'folder' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#737686]">
            <span>Corporate Repository Folders ({folders.length} active directories)</span>
            <span>Click folder to explore contents</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map(folder => (
              <FolderCard key={folder.id} folder={folder} onSelect={(f) => onSelectDoc && onSelectDoc({ ...f, isFolder: true })} />
            ))}
          </div>
        </div>
      ) : sorted.length === 0 ? (
        documents.length === 0 ? <NoDocuments onUpload={onUpload} onCreateFolder={onCreateFolder} /> : <NoSearchResults onReset={resetFilters} />
      ) : viewMode === 'grid' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginated.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onSelect={onSelectDoc}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[#737686]">
              Showing <strong className="text-[#191b23] dark:text-white">{(currentPage-1)*itemsPerPage+1}</strong> – <strong className="text-[#191b23] dark:text-white">{Math.min(currentPage*itemsPerPage, sorted.length)}</strong> of <strong className="text-[#2563eb]">{sorted.length}</strong> documents
            </span>
            <div className="flex items-center gap-2 font-sans">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg font-bold font-mono ${currentPage===i+1 ? 'bg-[#2563eb] text-white' : 'hover:bg-[#faf8ff] text-[#737686]'}`}>
                  {i+1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <DocumentTable
            documents={paginated}
            onSelectDoc={onSelectDoc}
            onDownload={onDownload}
            onVerify={onVerify}
            onDelete={onDelete}
            onShare={onShare}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[#737686]">
              Showing <strong className="text-[#191b23] dark:text-white">{(currentPage-1)*itemsPerPage+1}</strong> – <strong className="text-[#191b23] dark:text-white">{Math.min(currentPage*itemsPerPage, sorted.length)}</strong> of <strong className="text-[#2563eb]">{sorted.length}</strong> documents
            </span>
            <div className="flex items-center gap-2 font-sans">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg font-bold font-mono ${currentPage===i+1 ? 'bg-[#2563eb] text-white' : 'hover:bg-[#faf8ff] text-[#737686]'}`}>
                  {i+1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
