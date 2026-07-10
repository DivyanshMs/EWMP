import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Clock, Eye, FileUp, History, LayoutDashboard, LifeBuoy, ListFilter, MessageSquare, Paperclip, Plus, RefreshCw, Send, Star, UserCheck, Wrench } from 'lucide-react';
import axios from '../../lib/axios';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Skeleton,
  Table,
  Tabs,
  Textarea,
} from '../../components/shared';

const PAGE_SIZE = 8;
const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'HR Query', 'Payroll Query', 'Policy Query', 'Other'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened'];

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
  const fallbackItems = Array.isArray(payload?.data?.message) ? payload.data.message : null;
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
  if (fallbackItems) return { items: fallbackItems, total: fallbackItems.length, page: 1, limit: fallbackItems.length || PAGE_SIZE, totalPages: 1 };
  return { items: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };
};
const normalizeList = (payload) => normalizePaged(payload).items;
const normalizeRecord = (payload) => {
  const value = unwrap(payload);
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  return payload?.data?.message && typeof payload.data.message === 'object' ? payload.data.message : value;
};

const displayName = (record, fallback = 'Unassigned') => {
  if (!record) return fallback;
  if (typeof record === 'string') return record;
  return record.name || record.fullName || [record.firstName, record.lastName].filter(Boolean).join(' ') || record.employeeCode || fallback;
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString(undefined, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const statusVariant = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('resolved') || normalized.includes('closed')) return 'success';
  if (normalized.includes('progress')) return 'info';
  if (normalized.includes('open') || normalized.includes('reopened')) return 'warning';
  return 'pending';
};
const priorityVariant = (priority) => {
  const normalized = String(priority || '').toLowerCase();
  if (normalized === 'critical') return 'critical';
  if (normalized === 'high') return 'danger';
  if (normalized === 'medium') return 'warning';
  if (normalized === 'low') return 'pending';
  return 'pending';
};
const categoryVariant = (category) => {
  const normalized = String(category || '').toLowerCase();
  if (normalized.includes('hr') || normalized.includes('policy')) return 'admin';
  if (normalized.includes('payroll')) return 'success';
  if (normalized.includes('network') || normalized.includes('access') || normalized.includes('software')) return 'info';
  if (normalized.includes('hardware')) return 'warning';
  return 'pending';
};

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

const TicketFilters = ({ filters, onChange }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search ticket number, subject"
      />
      <Select label="Category" value={filters.category} onChange={(event) => onChange({ category: event.target.value, page: 1 })}>
        <option value="">All categories</option>
        {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      </Select>
      <Select label="Priority" value={filters.priority} onChange={(event) => onChange({ priority: event.target.value, page: 1 })}>
        <option value="">All priorities</option>
        {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
      </Select>
      <Select label="Status" value={filters.ticketStatus} onChange={(event) => onChange({ ticketStatus: event.target.value, page: 1 })}>
        <option value="">All statuses</option>
        {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
      </Select>
      <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
        <option value="-createdAt">Newest first</option>
        <option value="createdAt">Oldest first</option>
        <option value="priority">Priority A-Z</option>
        <option value="ticketStatus">Status A-Z</option>
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => onChange({ search: '', category: '', priority: '', ticketStatus: '', sort: '-createdAt', page: 1 })}>Reset</Button>
    </div>
  </Card>
);

const TicketTable = ({ rows, isLoading, onOpen, onAssign, onResolve }) => {
  const columns = [
    {
      key: 'ticketNumber',
      header: 'Ticket',
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-[#191b23] dark:text-white">{row.subject}</p>
          <p className="text-xs text-[#737686]">{row.ticketNumber} - {formatDateTime(row.createdAt)}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true, render: (row) => <Badge variant={categoryVariant(row.category)}>{row.category}</Badge> },
    { key: 'priority', header: 'Priority', sortable: true, render: (row) => <Badge variant={priorityVariant(row.priority)}>{row.priority}</Badge> },
    { key: 'ticketStatus', header: 'Status', sortable: true, render: (row) => <Badge variant={statusVariant(row.ticketStatus)}>{row.ticketStatus}</Badge> },
    {
      key: 'assignedToId',
      header: 'Assignee',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={displayName(row.assignedToId)} src={row.assignedToId?.profilePhotoUrl} size="xs" />
          <span>{displayName(row.assignedToId)}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton title="Open dossier" icon={<Eye size={15} />} onClick={(event) => { event.stopPropagation(); onOpen(row); }} />
          <IconButton title="Assign ticket" icon={<UserCheck size={15} />} onClick={(event) => { event.stopPropagation(); onAssign(row); }} />
          <IconButton title="Resolve ticket" disabled={['Resolved', 'Closed'].includes(row.ticketStatus)} icon={<CheckCircle2 size={15} />} onClick={(event) => { event.stopPropagation(); onResolve(row); }} />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      onRowClick={onOpen}
      emptyIcon={LifeBuoy}
      emptyTitle="No tickets found"
      emptySubtitle="Ticket requests matching this queue will appear here."
      getRowKey={(row, index) => getId(row) || row.ticketNumber || index}
    />
  );
};

const CreateTicketModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ category: 'Hardware', priority: 'Medium', subject: '', description: '', attachmentName: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({ category: 'Hardware', priority: 'Medium', subject: '', description: '', attachmentName: '' });
  }, [isOpen]);

  const submit = () => {
    if (form.subject.trim().length < 5) return setError('Subject must be at least 5 characters.');
    if (form.description.trim().length < 10) return setError('Description must be at least 10 characters.');
    onSubmit({
      category: form.category,
      priority: form.priority,
      subject: form.subject.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Ticket" subtitle="Submit a service request with category, priority, description, and attachment context." size="xl">
      <ModalBody className="space-y-5">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <Input label="Subject Title" required value={form.subject} onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))} disabled={isLoading} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Category" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} disabled={isLoading}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </Select>
              <Select label="Priority" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))} disabled={isLoading}>
                {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </Select>
            </div>
            <Textarea label="Description" required rows={7} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} disabled={isLoading} />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-[#c3c6d7] bg-[#f8fafc] p-5 text-center dark:border-slate-700 dark:bg-[#0d0d0d]">
              <FileUp className="mx-auto text-[#2563eb]" size={26} />
              <p className="mt-3 text-sm font-semibold text-[#191b23] dark:text-white">Attachment UI</p>
              <p className="mt-1 text-xs text-[#737686]">Drop diagnostics, screenshots, or policy PDFs here.</p>
              <Input className="mt-4" type="file" label="" onChange={(event) => setForm((prev) => ({ ...prev, attachmentName: event.target.files?.[0]?.name || '' }))} disabled={isLoading} />
              {form.attachmentName ? <Badge className="mt-3" variant="info">{form.attachmentName}</Badge> : null}
            </div>
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#737686]">Automated SLA Assessment</p>
              <p className="mt-2 text-sm font-semibold text-[#191b23] dark:text-white">{form.priority === 'Critical' ? '4 hour response' : form.priority === 'High' ? '1 business day' : '3 business days'}</p>
              <p className="mt-1 text-xs text-[#737686]">SLA preview follows the selected category and priority.</p>
            </Card>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<Plus size={15} />} isLoading={isLoading} onClick={submit}>Create Ticket</Button>
      </ModalFooter>
    </Modal>
  );
};

const AssignTicketModal = ({ isOpen, onClose, ticket, employees, onSubmit, isLoading }) => {
  const [assignedToId, setAssignedToId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setAssignedToId(getId(ticket?.assignedToId) || '');
  }, [isOpen, ticket]);

  const submit = () => {
    if (!ticket) return setError('Select a ticket to assign.');
    if (!assignedToId) return setError('Select an assignee.');
    onSubmit({ ticket, assignedToId });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Ticket" subtitle={ticket ? `${ticket.ticketNumber} - ${ticket.subject}` : 'Select a ticket from the directory'} size="lg">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Select label="Support Owner" required value={assignedToId} onChange={(event) => setAssignedToId(event.target.value)} disabled={isLoading}>
          <option value="">Select employee</option>
          {employees.map((employee) => <option key={getId(employee)} value={getId(employee)}>{displayName(employee)}</option>)}
        </Select>
        <div className="grid gap-3 sm:grid-cols-3">
          <Badge variant={categoryVariant(ticket?.category)}>{ticket?.category || 'Category'}</Badge>
          <Badge variant={priorityVariant(ticket?.priority)}>{ticket?.priority || 'Priority'}</Badge>
          <Badge variant={statusVariant(ticket?.ticketStatus)}>{ticket?.ticketStatus || 'Status'}</Badge>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<UserCheck size={15} />} isLoading={isLoading} onClick={submit}>Assign</Button>
      </ModalFooter>
    </Modal>
  );
};

const ResolveTicketModal = ({ isOpen, onClose, ticket, onSubmit, isLoading }) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setResolutionNotes(ticket?.resolutionNotes || '');
  }, [isOpen, ticket]);

  const submit = () => {
    if (!ticket) return setError('Select a ticket first.');
    if (resolutionNotes.trim().length < 5) return setError('Resolution notes must be at least 5 characters.');
    onSubmit({ ticket, payload: { ticketStatus: 'Resolved', resolutionNotes: resolutionNotes.trim() } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolution View" subtitle={ticket ? `Close out ${ticket.ticketNumber}` : 'Select a ticket'} size="lg">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Textarea label="Resolution Notes" required rows={6} value={resolutionNotes} onChange={(event) => setResolutionNotes(event.target.value)} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<CheckCircle2 size={15} />} isLoading={isLoading} onClick={submit}>Resolve Ticket</Button>
      </ModalFooter>
    </Modal>
  );
};

const CommentComposer = ({ ticket, onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const submit = () => {
    if (!text.trim() || !ticket) return;
    onSubmit({ ticket, text: text.trim() });
    setText('');
    setAttachmentName('');
  };

  return (
    <Card>
      <CardHeader title="Comments" subtitle="Customer reply and internal diagnostic conversation thread" />
      <CardBody className="space-y-4">
        <Textarea label="Add Comment" rows={4} value={text} onChange={(event) => setText(event.target.value)} disabled={isLoading || !ticket} />
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-[#c3c6d7] p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-[#737686]">
            <Paperclip size={15} />
            <span>{attachmentName || 'Attachment UI for screenshots and diagnostic files'}</span>
          </div>
          <Input className="max-w-xs" type="file" label="" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || '')} disabled={isLoading || !ticket} />
        </div>
        <Button variant="primary" leftIcon={<Send size={15} />} disabled={!text.trim() || !ticket} isLoading={isLoading} onClick={submit}>Post Comment</Button>
      </CardBody>
    </Card>
  );
};

const TicketTimeline = ({ ticket }) => {
  if (!ticket) return null;
  const events = [
    { label: 'Ticket Created', detail: formatDateTime(ticket.createdAt), done: true },
    { label: 'Assigned', detail: displayName(ticket.assignedToId), done: Boolean(ticket.assignedToId) },
    { label: 'Current Status', detail: ticket.ticketStatus, done: true },
    { label: 'Resolved', detail: formatDateTime(ticket.resolvedAt), done: Boolean(ticket.resolvedAt) },
    { label: 'Closed', detail: formatDateTime(ticket.closedAt), done: Boolean(ticket.closedAt) },
  ];

  return (
    <Card>
      <CardHeader title="Ticket Timeline" subtitle="Chronological status audit log" />
      <CardBody>
        {events.map((event, index) => (
          <div key={event.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={event.done ? 'flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white' : 'flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] text-[#737686]'}>
                {event.done ? <CheckCircle2 size={14} /> : index + 1}
              </span>
              {index < events.length - 1 ? <span className="h-10 w-px bg-[#e2e8f0] dark:bg-slate-800" /> : null}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-[#191b23] dark:text-white">{event.label}</p>
              <p className="text-xs text-[#737686]">{event.detail}</p>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

const TicketDossier = ({ ticket, isLoading, onAssign, onResolve, onComment, commentLoading }) => {
  if (isLoading) return <Skeleton className="h-96" />;
  if (!ticket) {
    return <EmptyState icon={LifeBuoy} title="Select a ticket" description="Open a ticket from the directory to review the 360 degree dossier, comments, timeline, and resolution state." />;
  }

  const comments = ticket.comments || [];
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={ticket.subject}
            subtitle={`${ticket.ticketNumber} - created ${formatDateTime(ticket.createdAt)}`}
            action={<Badge variant={statusVariant(ticket.ticketStatus)}>{ticket.ticketStatus}</Badge>}
          />
          <CardBody className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={categoryVariant(ticket.category)}>{ticket.category}</Badge>
              <Badge variant={priorityVariant(ticket.priority)}>{ticket.priority}</Badge>
              <Badge variant={ticket.resolvedAt ? 'success' : 'warning'}>{ticket.resolvedAt ? 'SLA Completed' : 'SLA Active'}</Badge>
            </div>
            <p className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-sm leading-6 text-[#434655] dark:border-slate-800 dark:bg-[#0d0d0d] dark:text-slate-300">{ticket.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                <p className="text-xs text-[#737686]">Raised By</p>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar name={displayName(ticket.raisedById)} src={ticket.raisedById?.profilePhotoUrl} size="xs" />
                  <span className="text-sm font-semibold">{displayName(ticket.raisedById)}</span>
                </div>
              </div>
              <div className="rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                <p className="text-xs text-[#737686]">Assigned To</p>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar name={displayName(ticket.assignedToId)} src={ticket.assignedToId?.profilePhotoUrl} size="xs" />
                  <span className="text-sm font-semibold">{displayName(ticket.assignedToId)}</span>
                </div>
              </div>
              <div className="rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                <p className="text-xs text-[#737686]">Satisfaction</p>
                <p className="mt-2 flex items-center gap-1 text-sm font-semibold">
                  {ticket.satisfactionRating || 0} <Star size={15} className="text-amber-500" />
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" leftIcon={<UserCheck size={15} />} onClick={() => onAssign(ticket)}>Assign Ticket</Button>
              <Button variant="secondary" leftIcon={<CheckCircle2 size={15} />} disabled={['Resolved', 'Closed'].includes(ticket.ticketStatus)} onClick={() => onResolve(ticket)}>Resolve</Button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Conversation Thread" subtitle={`${comments.length} comments and diagnostic notes`} />
          <CardBody className="space-y-3">
            {comments.length ? comments.map((comment) => (
              <div key={getId(comment) || comment.createdAt} className="rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={displayName(comment.authorId)} src={comment.authorId?.profilePhotoUrl} size="xs" />
                    <span className="text-sm font-semibold text-[#191b23] dark:text-white">{displayName(comment.authorId, 'Support user')}</span>
                  </div>
                  <span className="text-xs text-[#737686]">{formatDateTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm leading-6 text-[#434655] dark:text-slate-300">{comment.text}</p>
              </div>
            )) : <EmptyState icon={MessageSquare} title="No comments" description="Replies and internal notes will appear here." />}
          </CardBody>
        </Card>
        <CommentComposer ticket={ticket} onSubmit={onComment} isLoading={commentLoading} />
      </div>
      <div className="space-y-6">
        <TicketTimeline ticket={ticket} />
        <Card>
          <CardHeader title="Resolution View" subtitle="Closure summary and CSAT" />
          <CardBody className="space-y-3">
            <p className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#434655] dark:bg-[#0d0d0d] dark:text-slate-300">
              {ticket.resolutionNotes || 'Resolution notes have not been recorded yet.'}
            </p>
            <div className="flex gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill={index < (ticket.satisfactionRating || 0) ? 'currentColor' : 'none'} />)}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Attachments" subtitle="Diagnostic file list" />
          <CardBody className="space-y-2">
            {(ticket.attachmentUrls || []).length ? ticket.attachmentUrls.map((file) => (
              <a key={file.url} href={file.url} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm hover:bg-[#f8fafc] dark:border-slate-800 dark:hover:bg-[#161616]">
                <span className="truncate">{file.name || file.url}</span>
                <Paperclip size={15} />
              </a>
            )) : <p className="text-sm text-[#737686]">No diagnostic files attached.</p>}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const DashboardView = ({ tickets, isLoading, onOpen, onCreate }) => {
  const open = tickets.filter((ticket) => ['Open', 'In Progress', 'Reopened'].includes(ticket.ticketStatus)).length;
  const critical = tickets.filter((ticket) => ticket.priority === 'Critical').length;
  const resolved = tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.ticketStatus)).length;
  const assigned = tickets.filter((ticket) => ticket.assignedToId).length;
  const categoryCounts = CATEGORIES.map((category) => ({ category, count: tickets.filter((ticket) => ticket.category === category).length }));

  if (isLoading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Open Tickets" value={open} helper="Active intake and support queue" icon={<LifeBuoy size={20} />} />
        <MetricCard title="Critical" value={critical} helper="Priority escalation lane" icon={<AlertTriangle size={20} />} tone="rose" />
        <MetricCard title="Assigned" value={assigned} helper="Owned by support staff" icon={<UserCheck size={20} />} tone="green" />
        <MetricCard title="Resolved" value={resolved} helper="Completed service requests" icon={<CheckCircle2 size={20} />} tone="green" />
      </div>
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb]">Helpdesk Dashboard</p>
            <h3 className="text-base font-semibold text-[#191b23] dark:text-white">Ticket directory and triage command center</h3>
          </div>
          <Button variant="primary" leftIcon={<Plus size={15} />} onClick={onCreate}>Create Ticket</Button>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader title="Recent Tickets" subtitle="Latest service requests and SLA exposure" />
          <CardBody>
            <TicketTable rows={tickets.slice(0, 5)} isLoading={false} onOpen={onOpen} onAssign={() => {}} onResolve={() => {}} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Category Mix" subtitle="Request volume by service family" />
          <CardBody className="space-y-3">
            {categoryCounts.map((item) => (
              <div key={item.category} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-2 dark:border-slate-800">
                <span className="text-sm text-[#434655] dark:text-slate-400">{item.category}</span>
                <Badge variant={categoryVariant(item.category)}>{item.count}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default function HelpDeskModule() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignTicket, setAssignTicket] = useState(null);
  const [resolveTicket, setResolveTicket] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', priority: '', ticketStatus: '', sort: '-createdAt', page: 1 });

  const params = useMemo(() => ({ ...filters, limit: PAGE_SIZE }), [filters]);
  const ticketsQuery = useQuery({
    queryKey: ['helpdesk-tickets', params],
    queryFn: () => axios.get(`/tickets?${buildQueryString(params)}`),
  });
  const summaryQuery = useQuery({
    queryKey: ['helpdesk-summary'],
    queryFn: () => axios.get('/tickets?limit=100&sort=-createdAt'),
  });
  const detailQuery = useQuery({
    queryKey: ['helpdesk-ticket-detail', getId(selectedTicket)],
    queryFn: () => axios.get(`/tickets/${getId(selectedTicket)}`),
    enabled: Boolean(getId(selectedTicket)),
  });
  const employeesQuery = useQuery({
    queryKey: ['employees-options-helpdesk'],
    queryFn: () => axios.get('/employees?limit=200'),
  });

  const ticketsPage = normalizePaged(ticketsQuery.data);
  const summaryTickets = normalizePaged(summaryQuery.data).items;
  const employees = normalizeList(employeesQuery.data);
  const detailTicket = normalizeRecord(detailQuery.data) || selectedTicket;

  const filteredTickets = ticketsPage.items.filter((ticket) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return [ticket.ticketNumber, ticket.subject, ticket.description].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const invalidateTickets = () => {
    queryClient.invalidateQueries({ queryKey: ['helpdesk-tickets'] });
    queryClient.invalidateQueries({ queryKey: ['helpdesk-summary'] });
    queryClient.invalidateQueries({ queryKey: ['helpdesk-ticket-detail'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => axios.post('/tickets', payload),
    onSuccess: (response) => {
      const created = normalizeRecord(response);
      if (getId(created)) setSelectedTicket(created);
      setCreateOpen(false);
      setActiveTab('details');
      invalidateTickets();
    },
  });
  const assignMutation = useMutation({
    mutationFn: ({ ticket, assignedToId }) => axios.patch(`/tickets/${getId(ticket)}/assign`, { assignedToId }),
    onSuccess: (response) => {
      const updated = normalizeRecord(response);
      if (getId(updated)) setSelectedTicket(updated);
      setAssignTicket(null);
      invalidateTickets();
    },
  });
  const statusMutation = useMutation({
    mutationFn: ({ ticket, payload }) => axios.patch(`/tickets/${getId(ticket)}/status`, payload),
    onSuccess: (response) => {
      const updated = normalizeRecord(response);
      if (getId(updated)) setSelectedTicket(updated);
      setResolveTicket(null);
      setActiveTab('resolution');
      invalidateTickets();
    },
  });
  const commentMutation = useMutation({
    mutationFn: ({ ticket, text }) => axios.post(`/tickets/${getId(ticket)}/comments`, { text }),
    onSuccess: (response) => {
      const updated = normalizeRecord(response);
      if (getId(updated)) setSelectedTicket(updated);
      invalidateTickets();
    },
  });

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setActiveTab('details');
  };

  const ticketTable = (
    <div className="space-y-3">
      <TicketTable rows={filteredTickets} isLoading={ticketsQuery.isLoading} onOpen={openTicket} onAssign={setAssignTicket} onResolve={setResolveTicket} />
      <Pagination currentPage={ticketsPage.page} totalPages={ticketsPage.totalPages} totalItems={ticketsPage.total} itemsPerPage={ticketsPage.limit || PAGE_SIZE} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </div>
  );

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={15} />,
      content: <DashboardView tickets={summaryTickets.length ? summaryTickets : ticketsPage.items} isLoading={summaryQuery.isLoading && ticketsQuery.isLoading} onOpen={openTicket} onCreate={() => setCreateOpen(true)} />,
    },
    {
      id: 'tickets',
      label: 'Tickets List',
      icon: <ListFilter size={15} />,
      badge: ticketsPage.total || undefined,
      content: (
        <div className="space-y-4">
          <TicketFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} />
          {ticketsQuery.isError ? <Card className="p-4 text-sm text-rose-700">{ticketsQuery.error?.response?.data?.message || 'Unable to load tickets.'}</Card> : null}
          {ticketTable}
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Ticket Details',
      icon: <Eye size={15} />,
      content: <TicketDossier ticket={detailTicket} isLoading={detailQuery.isLoading} onAssign={setAssignTicket} onResolve={setResolveTicket} onComment={(payload) => commentMutation.mutate(payload)} commentLoading={commentMutation.isPending} />,
    },
    {
      id: 'create',
      label: 'Create Ticket',
      icon: <Plus size={15} />,
      content: (
        <Card>
          <CardHeader title="Create Ticket" subtitle="Open the Stitch-style split create ticket form." action={<Button variant="primary" leftIcon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>New Ticket</Button>} />
          <CardBody>
            <EmptyState icon={FileUp} title="Submission form opens in a modal" description="The form includes category, priority, attachment UI, description, and SLA preview." />
          </CardBody>
        </Card>
      ),
    },
    {
      id: 'assign',
      label: 'Assign Ticket',
      icon: <UserCheck size={15} />,
      content: (
        <Card>
          <CardHeader title="Assign Ticket" subtitle="Select a queue item and assign ownership." action={<Button variant="primary" disabled={!selectedTicket} onClick={() => setAssignTicket(selectedTicket)}>Assign Selected</Button>} />
          <CardBody>{ticketTable}</CardBody>
        </Card>
      ),
    },
    {
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare size={15} />,
      content: <CommentComposer ticket={detailTicket} onSubmit={(payload) => commentMutation.mutate(payload)} isLoading={commentMutation.isPending} />,
    },
    {
      id: 'resolution',
      label: 'Resolution View',
      icon: <CheckCircle2 size={15} />,
      content: (
        <TicketDossier
          ticket={detailTicket}
          isLoading={detailQuery.isLoading}
          onAssign={setAssignTicket}
          onResolve={setResolveTicket}
          onComment={(payload) => commentMutation.mutate(payload)}
          commentLoading={commentMutation.isPending}
        />
      ),
    },
    {
      id: 'timeline',
      label: 'Ticket Timeline',
      icon: <History size={15} />,
      content: detailTicket ? <TicketTimeline ticket={detailTicket} /> : <EmptyState icon={Clock} title="No ticket selected" description="Open a ticket to view its audit timeline." />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Helpdesk"
        description="Service ticket dashboard, ticket directory, dossier triage, assignment, comments, attachments UI, and resolution workflow."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Helpdesk' }]}
        primaryAction={<Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create Ticket</Button>}
        secondaryAction={<Button variant="secondary" leftIcon={<Wrench size={16} />} onClick={() => setActiveTab('tickets')}>Ticket Directory</Button>}
      />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      <CreateTicketModal isOpen={createOpen} onClose={() => setCreateOpen(false)} isLoading={createMutation.isPending} onSubmit={(payload) => createMutation.mutate(payload)} />
      <AssignTicketModal isOpen={Boolean(assignTicket)} onClose={() => setAssignTicket(null)} ticket={assignTicket} employees={employees} isLoading={assignMutation.isPending} onSubmit={(payload) => assignMutation.mutate(payload)} />
      <ResolveTicketModal isOpen={Boolean(resolveTicket)} onClose={() => setResolveTicket(null)} ticket={resolveTicket} isLoading={statusMutation.isPending} onSubmit={(payload) => statusMutation.mutate(payload)} />
      {createMutation.isError ? <Card className="mt-4 p-4 text-sm text-rose-700">{createMutation.error?.response?.data?.message || 'Unable to create ticket.'}</Card> : null}
      {assignMutation.isError ? <Card className="mt-4 p-4 text-sm text-rose-700">{assignMutation.error?.response?.data?.message || 'Unable to assign ticket.'}</Card> : null}
      {statusMutation.isError ? <Card className="mt-4 p-4 text-sm text-rose-700">{statusMutation.error?.response?.data?.message || 'Unable to update ticket status.'}</Card> : null}
      {commentMutation.isError ? <Card className="mt-4 p-4 text-sm text-rose-700">{commentMutation.error?.response?.data?.message || 'Unable to post comment.'}</Card> : null}
    </div>
  );
}
