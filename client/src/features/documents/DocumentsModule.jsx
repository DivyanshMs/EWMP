import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, Download, Eye, FileArchive, FileCheck, FileText, FolderOpen, History, LayoutDashboard, LayoutGrid, MoreHorizontal, RefreshCw, Replace, Search, Trash2, UploadCloud, Users } from 'lucide-react';
import axios from '../../lib/axios';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Table,
  Tabs,
} from '../../components/shared';

const PAGE_SIZE = 8;
const CATEGORIES = ['HR', 'Employee', 'Payroll', 'Project', 'Asset', 'Legal', 'Finance', 'Policy', 'Other'];

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload;
const getId = (record) => record?._id || record?.id;
const buildQueryString = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  return search.toString();
};

const normalizePaged = (payload) => {
  const value = unwrap(payload);
  if (Array.isArray(value)) return { items: value, total: value.length, page: 1, limit: value.length || PAGE_SIZE, totalPages: 1 };
  if (Array.isArray(value?.items)) {
    return {
      items: value.items,
      total: value.total ?? value.items.length,
      page: value.page ?? 1,
      limit: value.limit ?? PAGE_SIZE,
      totalPages: value.totalPages ?? Math.max(1, Math.ceil((value.total ?? value.items.length) / (value.limit ?? PAGE_SIZE))),
    };
  }
  if (Array.isArray(value?.data)) {
    return {
      items: value.data,
      total: value.total ?? value.data.length,
      page: value.page ?? 1,
      limit: value.limit ?? PAGE_SIZE,
      totalPages: value.totalPages ?? Math.max(1, Math.ceil((value.total ?? value.data.length) / (value.limit ?? PAGE_SIZE))),
    };
  }
  return { items: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };
};
const normalizeList = (payload) => normalizePaged(payload).items;

const displayName = (record, fallback = 'Unassigned') => {
  if (!record) return fallback;
  if (typeof record === 'string') return record;
  return record.name || record.title || record.fullName || [record.firstName, record.lastName].filter(Boolean).join(' ') || record.employeeCode || fallback;
};
const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};
const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString(undefined, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const formatBytes = (size) => {
  const bytes = Number(size || 0);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
const fileType = (doc) => {
  const source = doc?.mimeType || doc?.filename || doc?.originalName || '';
  if (source.includes('pdf') || source.toLowerCase().endsWith('.pdf')) return 'PDF';
  if (source.includes('spreadsheet') || /\.(xlsx|xls|csv)$/i.test(source)) return 'Sheet';
  if (source.includes('word') || /\.(docx|doc)$/i.test(source)) return 'Doc';
  if (source.includes('image') || /\.(png|jpg|jpeg|webp)$/i.test(source)) return 'Image';
  return 'File';
};
const statusVariant = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('active') || normalized.includes('verified')) return 'success';
  if (normalized.includes('archived')) return 'warning';
  if (normalized.includes('deleted') || normalized.includes('rejected')) return 'danger';
  return 'info';
};

const OptionList = ({ items, labelFor = displayName }) => (
  <>
    {items.map((item) => <option key={getId(item)} value={getId(item)}>{labelFor(item)}</option>)}
  </>
);

const MetricCard = ({ title, value, helper, icon, tone = 'blue' }) => {
  const toneClass = {
    blue: 'bg-blue-50 text-[#2563eb] border-blue-100 dark:bg-blue-500/10 dark:border-blue-900/60',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-900/60',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-900/60',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-900/60',
  }[tone];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#434655] dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#191b23] dark:text-white">{value}</p>
        </div>
        <div className={`rounded-lg border p-3 ${toneClass}`}>{icon}</div>
      </div>
      <p className="mt-4 border-t border-[#e2e8f0]/70 pt-3 text-xs text-[#434655] dark:text-slate-400">{helper}</p>
    </Card>
  );
};

const DocumentFilters = ({ filters, onChange }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search filename or original name"
      />
      <Select label="Category" value={filters.category} onChange={(event) => onChange({ category: event.target.value, page: 1 })}>
        <option value="">All categories</option>
        {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      </Select>
      <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
        <option value="-createdAt">Newest first</option>
        <option value="filename">Filename A-Z</option>
        <option value="-size">Largest files</option>
        <option value="-versionNumber">Latest versions</option>
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => onChange({ search: '', category: '', sort: '-createdAt', page: 1 })}>Reset</Button>
    </div>
  </Card>
);

const UploadModal = ({ isOpen, onClose, onSubmit, employees, projects, assets, isLoading, replaceDocument }) => {
  const [form, setForm] = useState({ file: null, category: 'Other', tags: '', employeeId: '', projectId: '', assetId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({ file: null, category: replaceDocument?.category || 'Other', tags: replaceDocument?.tags?.join(', ') || '', employeeId: getId(replaceDocument?.employeeId) || '', projectId: getId(replaceDocument?.projectId) || '', assetId: getId(replaceDocument?.assetId) || '' });
  }, [isOpen, replaceDocument]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const submit = () => {
    if (!form.file) return setError('Select a file to upload.');
    if (!replaceDocument && !form.category) return setError('Category is required.');
    const data = new FormData();
    data.append('file', form.file);
    if (!replaceDocument) {
      data.append('category', form.category);
      if (form.tags.trim()) data.append('tags', form.tags.trim());
      if (form.employeeId) data.append('employeeId', form.employeeId);
      if (form.projectId) data.append('projectId', form.projectId);
      if (form.assetId) data.append('assetId', form.assetId);
    }
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={replaceDocument ? 'Replace Document' : 'Upload Document'} subtitle={replaceDocument ? `New version for ${replaceDocument.filename}` : 'Add a file to the enterprise document library.'} size="xl">
      <ModalBody className="space-y-5">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="rounded-lg border border-dashed border-[#c3c6d7] bg-[#f8fafc] p-6 text-center dark:border-slate-700 dark:bg-[#0d0d0d]">
          <UploadCloud size={28} className="mx-auto text-[#2563eb]" />
          <p className="mt-2 text-sm font-semibold text-[#191b23] dark:text-white">{form.file ? form.file.name : 'Drop file here or choose from device'}</p>
          <p className="mt-1 text-xs text-[#737686]">{form.file ? formatBytes(form.file.size) : 'PDF, Office documents, sheets, and images use the existing upload API.'}</p>
          <div className="mx-auto mt-4 max-w-sm">
            <Input label="File" type="file" onChange={(event) => update({ file: event.target.files?.[0] || null })} disabled={isLoading} />
          </div>
        </div>
        {!replaceDocument ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Category" required value={form.category} onChange={(event) => update({ category: event.target.value })} disabled={isLoading}>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </Select>
            <Input label="Tags" helper="Comma separated tags" value={form.tags} onChange={(event) => update({ tags: event.target.value })} disabled={isLoading} />
            <Select label="Employee Scope" value={form.employeeId} onChange={(event) => update({ employeeId: event.target.value, projectId: '', assetId: '' })} disabled={isLoading}>
              <option value="">No employee link</option>
              <OptionList items={employees} />
            </Select>
            <Select label="Project Scope" value={form.projectId} onChange={(event) => update({ projectId: event.target.value, employeeId: '', assetId: '' })} disabled={isLoading}>
              <option value="">No project link</option>
              <OptionList items={projects} labelFor={(project) => project.name ? `${project.name} (${project.code || '-'})` : displayName(project)} />
            </Select>
            <Select label="Asset Scope" value={form.assetId} onChange={(event) => update({ assetId: event.target.value, employeeId: '', projectId: '' })} disabled={isLoading}>
              <option value="">No asset link</option>
              <OptionList items={assets} labelFor={(asset) => asset.name ? `${asset.name} (${asset.assetTag || '-'})` : displayName(asset)} />
            </Select>
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={replaceDocument ? <Replace size={15} /> : <UploadCloud size={15} />} isLoading={isLoading} onClick={submit}>{replaceDocument ? 'Replace File' : 'Upload Document'}</Button>
      </ModalFooter>
    </Modal>
  );
};

const DocumentsTable = ({ rows, isLoading, sort, onSort, onView, onDownload, onReplace, onDelete }) => {
  const columns = [
    {
      key: 'filename',
      header: 'Document',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#2563eb] dark:border-slate-800 dark:bg-[#0d0d0d]"><FileText size={17} /></div>
          <div>
            <p className="font-semibold text-[#191b23] dark:text-white">{row.filename || row.originalName}</p>
            <p className="text-xs text-[#737686]">v{row.versionNumber || 1} - {formatBytes(row.size)}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true, render: (row) => <Badge variant="info">{row.category}</Badge> },
    { key: 'mimeType', header: 'Type', render: (row) => <Badge variant="outlined" dot={false}>{fileType(row)}</Badge> },
    { key: 'employeeId', header: 'Scope', render: (row) => row.employeeId ? displayName(row.employeeId) : row.projectId ? displayName(row.projectId) : row.assetId ? displayName(row.assetId) : 'Organization' },
    { key: 'documentStatus', header: 'Status', sortable: true, render: (row) => <Badge variant={statusVariant(row.documentStatus)}>{row.documentStatus || 'Active'}</Badge> },
    { key: 'createdAt', header: 'Uploaded', sortable: true, render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" leftIcon={<Eye size={14} />} onClick={() => onView(row)}>View</Button>
          <Button size="sm" variant="ghost" leftIcon={<Download size={14} />} disabled={!row.cloudinaryUrl} onClick={() => onDownload(row)}>Download</Button>
          <Button size="sm" variant="ghost" leftIcon={<MoreHorizontal size={14} />} onClick={() => onReplace(row)}>Replace</Button>
          <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => onDelete(row)}>Delete</Button>
        </div>
      ),
    },
  ];
  return <Table columns={columns} rows={rows} isLoading={isLoading} sortColumn={sort.column} sortDirection={sort.direction} onSort={onSort} emptyTitle="No documents found" emptySubtitle="Documents matching this view will appear here." emptyIcon={FileText} getRowKey={(row, index) => getId(row) || index} />;
};

const DocumentGrid = ({ documents, onView, onDownload }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {documents.map((doc) => (
      <Card key={getId(doc)} className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#2563eb] dark:border-slate-800 dark:bg-[#0d0d0d]">
            <FileText size={19} />
          </div>
          <Badge variant="outlined" dot={false}>{fileType(doc)}</Badge>
        </div>
        <button type="button" onClick={() => onView(doc)} className="mt-4 w-full text-left">
          <p className="line-clamp-2 text-sm font-semibold text-[#191b23] dark:text-white">{doc.filename || doc.originalName}</p>
          <p className="mt-1 text-xs text-[#737686]">{doc.category} - {formatBytes(doc.size)}</p>
        </button>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Badge variant={statusVariant(doc.documentStatus)}>{doc.documentStatus || 'Active'}</Badge>
          <Button size="sm" variant="ghost" disabled={!doc.cloudinaryUrl} onClick={() => onDownload(doc)}>Download</Button>
        </div>
      </Card>
    ))}
  </div>
);

const DocumentDetails = ({ document, detail, onDownload, onReplace, onDelete }) => {
  const current = detail || document;
  if (!current) return <EmptyState icon={FileText} title="Select a document" description="Open a document from the library to preview metadata, scope, versions, and download history." />;
  const history = current.downloadHistory || [];
  const isPreviewableImage = String(current.mimeType || '').startsWith('image/');
  const isPreviewablePdf = String(current.mimeType || '').includes('pdf');

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader title={current.filename || current.originalName} subtitle={`${current.category} - version ${current.versionNumber || 1}`} action={<Badge variant={statusVariant(current.documentStatus)}>{current.documentStatus || 'Active'}</Badge>} />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="File Type" value={fileType(current)} helper={current.mimeType || 'Unknown mime type'} icon={<FileArchive size={20} />} />
            <MetricCard title="Size" value={formatBytes(current.size)} helper="Stored file size" icon={<Archive size={20} />} tone="green" />
            <MetricCard title="Version" value={`v${current.versionNumber || 1}`} helper="Current file version" icon={<History size={20} />} tone="amber" />
            <MetricCard title="Downloads" value={history.length} helper="Recorded access count" icon={<Download size={20} />} tone="rose" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader title="Document Preview" subtitle="Inline preview when the stored file type allows it" action={<Button size="sm" variant="secondary" disabled={!current.cloudinaryUrl} onClick={() => onDownload(current)}>Download</Button>} />
              <CardBody>
                <div className="flex min-h-80 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-slate-800 dark:bg-[#0d0d0d]">
                  {isPreviewableImage && current.cloudinaryUrl ? (
                    <img src={current.cloudinaryUrl} alt={current.filename} className="max-h-96 max-w-full rounded border border-[#e2e8f0] object-contain dark:border-slate-800" />
                  ) : isPreviewablePdf && current.cloudinaryUrl ? (
                    <iframe title={current.filename} src={current.cloudinaryUrl} className="h-96 w-full rounded border border-[#e2e8f0] bg-white dark:border-slate-800" />
                  ) : (
                    <EmptyState icon={FileText} title="Preview unavailable" description="Use Download or Open to inspect this file type." />
                  )}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Metadata" subtitle="Scope, uploader, category, and tags" />
              <CardBody className="space-y-3 text-sm">
                {[
                  ['Uploaded By', displayName(current.uploadedBy)],
                  ['Uploaded', formatDateTime(current.createdAt)],
                  ['Employee', displayName(current.employeeId, '-')],
                  ['Project', displayName(current.projectId, '-')],
                  ['Asset', displayName(current.assetId, '-')],
                  ['Original Name', current.originalName || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded border border-[#e2e8f0] px-3 py-2 dark:border-slate-800">
                    <span className="text-[#434655] dark:text-slate-400">{label}</span>
                    <span className="max-w-40 truncate font-semibold text-[#191b23] dark:text-white">{value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(current.tags || []).map((tag) => <Badge key={tag} variant="outlined" dot={false}>{tag}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                  <Button size="sm" variant="primary" disabled={!current.cloudinaryUrl} onClick={() => onDownload(current)}>Download</Button>
                  <Button size="sm" variant="secondary" onClick={() => onReplace(current)}>Replace</Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(current)}>Delete</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Download History" subtitle="Access trail recorded by the existing document API" />
        <CardBody>
          {history.map((item, index) => (
            <div key={`${item.downloadedAt}-${index}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white"><Download size={14} /></span>
                {index < history.length - 1 ? <span className="h-9 w-px bg-[#e2e8f0] dark:bg-slate-800" /> : null}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-[#191b23] dark:text-white">{displayName(item.downloadedBy, 'User')}</p>
                <p className="text-xs text-[#737686]">{formatDateTime(item.downloadedAt)}</p>
              </div>
            </div>
          ))}
          {!history.length ? <EmptyState icon={History} title="No history yet" description="Opening a document detail records access history on the backend." /> : null}
        </CardBody>
      </Card>
    </div>
  );
};

export const DocumentsModule = ({ initialView = 'dashboard' }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [replaceDocument, setReplaceDocument] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '-createdAt', page: 1 });
  const [sort, setSort] = useState({ column: 'createdAt', direction: 'desc' });

  const params = useMemo(() => ({ ...filters, limit: PAGE_SIZE, sort: sort.direction === 'asc' ? sort.column : `-${sort.column}` }), [filters, sort]);
  const documentsQuery = useQuery({ queryKey: ['documents', params], queryFn: () => axios.get(`/documents?${buildQueryString(params)}`) });
  const allDocumentsQuery = useQuery({ queryKey: ['documents-summary'], queryFn: () => axios.get('/documents?limit=100&sort=-createdAt') });
  const detailQuery = useQuery({ queryKey: ['document-detail', getId(selectedDocument)], queryFn: () => axios.get(`/documents/${getId(selectedDocument)}`), enabled: Boolean(getId(selectedDocument)) });
  const employeesQuery = useQuery({ queryKey: ['employees-options'], queryFn: () => axios.get('/employees?limit=200') });
  const projectsQuery = useQuery({ queryKey: ['projects-options'], queryFn: () => axios.get('/projects?limit=200') });
  const assetsQuery = useQuery({ queryKey: ['assets-options'], queryFn: () => axios.get('/assets?limit=200') });

  const documentsPage = normalizePaged(documentsQuery.data);
  const summaryDocuments = normalizePaged(allDocumentsQuery.data).items;
  const detailDocument = unwrap(detailQuery.data);
  const employees = normalizeList(employeesQuery.data);
  const projects = normalizeList(projectsQuery.data);
  const assets = normalizeList(assetsQuery.data);

  const filteredDocuments = documentsPage.items.filter((doc) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return [doc.filename, doc.originalName, doc.category, ...(doc.tags || [])].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const invalidateDocuments = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    queryClient.invalidateQueries({ queryKey: ['documents-summary'] });
    queryClient.invalidateQueries({ queryKey: ['document-detail'] });
  };

  const uploadMutation = useMutation({
    mutationFn: (formData) => axios.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: (response) => {
      const saved = unwrap(response);
      if (saved) {
        setSelectedDocument(saved);
        setActiveTab('details');
      }
      setUploadOpen(false);
      invalidateDocuments();
    },
  });
  const replaceMutation = useMutation({
    mutationFn: ({ document, formData }) => axios.put(`/documents/${getId(document)}/replace`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: (response) => {
      const saved = unwrap(response);
      if (saved) setSelectedDocument(saved);
      setReplaceDocument(null);
      invalidateDocuments();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (document) => axios.delete(`/documents/${getId(document)}`),
    onSuccess: (_, deleted) => {
      if (getId(selectedDocument) === getId(deleted)) {
        setSelectedDocument(null);
        setActiveTab('library');
      }
      invalidateDocuments();
    },
  });

  const handleSort = (column) => setSort((prev) => ({ column, direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const openDocument = (doc) => {
    setSelectedDocument(doc);
    setActiveTab('details');
  };
  const downloadDocument = (doc) => {
    if (doc.cloudinaryUrl) window.open(doc.cloudinaryUrl, '_blank', 'noopener,noreferrer');
  };

  const documentTable = (
    <>
      <DocumentsTable
        rows={filteredDocuments}
        isLoading={documentsQuery.isLoading}
        sort={sort}
        onSort={handleSort}
        onView={openDocument}
        onDownload={downloadDocument}
        onReplace={setReplaceDocument}
        onDelete={(doc) => deleteMutation.mutate(doc)}
      />
      <Pagination currentPage={documentsPage.page} totalPages={documentsPage.totalPages} totalItems={documentsPage.total} itemsPerPage={documentsPage.limit || PAGE_SIZE} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </>
  );

  const categoryCounts = CATEGORIES.map((category) => ({ category, count: summaryDocuments.filter((doc) => doc.category === category).length }));
  const employeeDocuments = summaryDocuments.filter((doc) => doc.employeeId);
  const stats = {
    total: allDocumentsQuery.isLoading ? documentsPage.total : summaryDocuments.length,
    employee: employeeDocuments.length,
    active: summaryDocuments.filter((doc) => (doc.documentStatus || 'Active') === 'Active').length,
    categories: new Set(summaryDocuments.map((doc) => doc.category)).size,
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={15} />,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Total Documents" value={stats.total} helper="Library documents visible to your role" icon={<FileText size={20} />} />
            <MetricCard title="Employee Files" value={stats.employee} helper="Linked to employee records" icon={<Users size={20} />} tone="green" />
            <MetricCard title="Active" value={stats.active} helper="Active repository records" icon={<FileCheck size={20} />} tone="amber" />
            <MetricCard title="Categories" value={stats.categories} helper="Document taxonomy coverage" icon={<FolderOpen size={20} />} tone="rose" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader title="Recent Documents" subtitle="Document library table with preview, download, replace, and delete actions" action={<Button size="sm" variant="primary" leftIcon={<UploadCloud size={15} />} onClick={() => setUploadOpen(true)}>Upload</Button>} />
              <CardBody>{documentTable}</CardBody>
            </Card>
            <Card>
              <CardHeader title="Categories" subtitle="Repository distribution by category" />
              <CardBody className="space-y-3">
                {categoryCounts.map((item) => {
                  const pct = Math.round((item.count / Math.max(1, summaryDocuments.length)) * 100);
                  return (
                    <button key={item.category} type="button" onClick={() => { setFilters((prev) => ({ ...prev, category: item.category, page: 1 })); setActiveTab('library'); }} className="w-full rounded-lg border border-[#e2e8f0] p-3 text-left hover:bg-[#f8fafc] dark:border-slate-800 dark:hover:bg-[#161616]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <FolderOpen size={17} className="text-[#2563eb]" />
                          <span className="text-sm font-semibold text-[#191b23] dark:text-white">{item.category}</span>
                        </div>
                        <Badge variant="info">{item.count}</Badge>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${Math.max(4, pct)}%` }} />
                      </div>
                    </button>
                  );
                })}
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'library',
      label: 'Document Library',
      icon: <LayoutGrid size={15} />,
      content: (
        <div className="space-y-6">
          <DocumentFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} />
          <DocumentGrid documents={filteredDocuments} onView={openDocument} onDownload={downloadDocument} />
          {documentTable}
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Document Details',
      icon: <Eye size={15} />,
      content: <DocumentDetails document={selectedDocument} detail={detailDocument} onDownload={downloadDocument} onReplace={setReplaceDocument} onDelete={(doc) => deleteMutation.mutate(doc)} />,
    },
    {
      id: 'upload',
      label: 'Upload Document',
      icon: <UploadCloud size={15} />,
      content: (
        <Card>
          <CardHeader title="Upload Document" subtitle="Use the modal upload wizard to select a file, category, owner scope, and tags." action={<Button variant="primary" leftIcon={<UploadCloud size={15} />} onClick={() => setUploadOpen(true)}>Upload Document</Button>} />
          <CardBody>
            <div className="rounded-lg border border-dashed border-[#c3c6d7] bg-[#f8fafc] p-10 text-center dark:border-slate-700 dark:bg-[#0d0d0d]">
              <UploadCloud size={34} className="mx-auto text-[#2563eb]" />
              <p className="mt-3 text-base font-semibold text-[#191b23] dark:text-white">Upload Wizard</p>
              <p className="mx-auto mt-1 max-w-xl text-sm text-[#737686]">Follow the Stitch wizard pattern: select file, assign type/category, scope to employee/project/asset, add metadata tags, then submit to the existing multipart document API.</p>
              <Button className="mt-5" variant="primary" onClick={() => setUploadOpen(true)}>Choose File</Button>
            </div>
          </CardBody>
        </Card>
      ),
    },
    {
      id: 'employee',
      label: 'Employee Documents',
      icon: <Users size={15} />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Employee Documents" subtitle="Documents scoped to employee records" action={<Badge variant="info">{employeeDocuments.length} linked</Badge>} />
            <CardBody>
              <DocumentGrid documents={employeeDocuments} onView={openDocument} onDownload={downloadDocument} />
              {!employeeDocuments.length ? <EmptyState icon={Users} title="No employee documents" description="Upload documents and link them to employee records to populate this view." /> : null}
            </CardBody>
          </Card>
        </div>
      ),
    },
    {
      id: 'preview',
      label: 'Document Preview',
      icon: <FileCheck size={15} />,
      content: <DocumentDetails document={selectedDocument || filteredDocuments[0]} detail={selectedDocument ? detailDocument : undefined} onDownload={downloadDocument} onReplace={setReplaceDocument} onDelete={(doc) => deleteMutation.mutate(doc)} />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Documents"
        description="Enterprise document library, uploads, previews, employee files, version replacement, and repository actions."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Documents' }]}
        primaryAction={<Button variant="primary" leftIcon={<UploadCloud size={16} />} onClick={() => setUploadOpen(true)}>Upload Document</Button>}
        secondaryAction={<Button variant="secondary" leftIcon={<Search size={16} />} onClick={() => setActiveTab('library')}>Browse Library</Button>}
      />
      {documentsQuery.isError ? (
        <Card className="mb-6 p-4 text-sm text-rose-700 dark:text-rose-400">
          {documentsQuery.error?.response?.data?.message || 'Unable to load documents. Please retry after confirming your session.'}
        </Card>
      ) : null}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        employees={employees}
        projects={projects}
        assets={assets}
        isLoading={uploadMutation.isPending}
        onSubmit={(formData) => uploadMutation.mutate(formData)}
      />
      <UploadModal
        isOpen={Boolean(replaceDocument)}
        onClose={() => setReplaceDocument(null)}
        replaceDocument={replaceDocument}
        employees={employees}
        projects={projects}
        assets={assets}
        isLoading={replaceMutation.isPending}
        onSubmit={(formData) => replaceMutation.mutate({ document: replaceDocument, formData })}
      />
    </div>
  );
};

export default DocumentsModule;
