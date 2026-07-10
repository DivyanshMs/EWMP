import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, BellRing, CheckCheck, Eye, FileText, Megaphone, Paperclip, RefreshCw, Search, Send, Settings, ShieldAlert, Trash2 } from 'lucide-react';
import axios from '../../lib/axios';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
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
  Switch,
  Table,
  Tabs,
  Textarea,
} from '../../components/shared';

const PAGE_SIZE = 8;
const TYPES = ['Leave', 'Attendance', 'Payroll', 'Task', 'Recruitment', 'Asset', 'Ticket', 'System', 'Announcement'];
const PRIORITIES = ['High', 'Normal', 'Low'];
const ANNOUNCEMENT_TYPES = ['General', 'HR Policy', 'Event', 'Holiday', 'Emergency', 'Training'];
const AUDIENCES = ['All', 'Department', 'Location', 'Role'];

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

const normalizeRecord = (payload) => {
  const value = unwrap(payload);
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  return payload?.data?.message && typeof payload.data.message === 'object' ? payload.data.message : value;
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString(undefined, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const priorityVariant = (priority) => {
  const normalized = String(priority || '').toLowerCase();
  if (normalized === 'high' || normalized === 'emergency') return 'danger';
  if (normalized === 'normal') return 'info';
  if (normalized === 'low') return 'pending';
  return 'warning';
};

const typeVariant = (type) => {
  const normalized = String(type || '').toLowerCase();
  if (normalized.includes('announcement')) return 'admin';
  if (normalized.includes('system')) return 'warning';
  if (normalized.includes('payroll')) return 'success';
  if (normalized.includes('ticket') || normalized.includes('task')) return 'info';
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#434655] dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#191b23] dark:text-white">{value}</p>
        </div>
        <div className={`rounded-lg border p-3 ${toneClass}`}>{icon}</div>
      </div>
      <p className="mt-4 border-t border-[#e2e8f0]/70 pt-3 text-xs text-[#434655] dark:text-slate-400">{helper}</p>
    </Card>
  );
};

const NotificationFilters = ({ filters, onChange }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search alerts, broadcasts, senders"
      />
      <Select label="Read State" value={filters.isRead} onChange={(event) => onChange({ isRead: event.target.value, page: 1 })}>
        <option value="">All states</option>
        <option value="false">Unread</option>
        <option value="true">Read</option>
      </Select>
      <Select label="Category" value={filters.notificationType} onChange={(event) => onChange({ notificationType: event.target.value, page: 1 })}>
        <option value="">All categories</option>
        {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
      </Select>
      <Select label="Priority" value={filters.priority} onChange={(event) => onChange({ priority: event.target.value, page: 1 })}>
        <option value="">All priorities</option>
        {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
      </Select>
      <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
        <option value="-createdAt">Newest first</option>
        <option value="createdAt">Oldest first</option>
        <option value="priority">Priority A-Z</option>
        <option value="notificationType">Category A-Z</option>
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => onChange({ search: '', isRead: '', notificationType: '', priority: '', sort: '-createdAt', page: 1 })}>Reset</Button>
    </div>
  </Card>
);

const NotificationTable = ({ rows, isLoading, selectedIds, onSelect, onOpen, onRead, onDelete }) => {
  const columns = [
    {
      key: 'select',
      header: '',
      width: '48px',
      render: (row) => (
        <Checkbox
          label=""
          checked={selectedIds.includes(getId(row))}
          onChange={() => onSelect(getId(row))}
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    {
      key: 'title',
      header: 'Notification',
      sortable: true,
      render: (row) => (
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${row.isRead ? 'bg-slate-300' : 'bg-[#2563eb] ring-4 ring-blue-100'}`} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#191b23] dark:text-white">{row.title}</p>
            <p className="mt-1 line-clamp-2 max-w-xl text-xs text-[#434655] dark:text-slate-400">{row.message}</p>
          </div>
        </div>
      ),
    },
    { key: 'notificationType', header: 'Category', sortable: true, render: (row) => <Badge variant={typeVariant(row.notificationType)}>{row.notificationType}</Badge> },
    { key: 'priority', header: 'Priority', sortable: true, render: (row) => <Badge variant={priorityVariant(row.priority)}>{row.priority}</Badge> },
    { key: 'createdAt', header: 'Received', sortable: true, render: (row) => formatDateTime(row.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton title="Open notification" icon={<Eye size={15} />} onClick={(event) => { event.stopPropagation(); onOpen(row); }} />
          <IconButton title="Mark as read" disabled={row.isRead} icon={<CheckCheck size={15} />} onClick={(event) => { event.stopPropagation(); onRead(row); }} />
          <IconButton title="Delete notification" variant="danger" icon={<Trash2 size={15} />} onClick={(event) => { event.stopPropagation(); onDelete(row); }} />
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
      emptyIcon={Bell}
      emptyTitle="No notifications found"
      emptySubtitle="Alerts and workflow notices matching this view will appear here."
      getRowKey={(row, index) => getId(row) || index}
    />
  );
};

const NotificationDetails = ({ notification, onRead, onDelete }) => {
  if (!notification) {
    return <EmptyState icon={BellRing} title="Select a notification" description="Open a notification from the center to review details, routing metadata, read state, and action target." />;
  }

  const timeline = [
    ['Created', formatDateTime(notification.createdAt), true],
    ['Delivered', notification.recipientId ? 'Recipient delivery queued' : 'Organization scoped', true],
    ['Read State', notification.isRead ? `Read ${formatDateTime(notification.readAt)}` : 'Unread', notification.isRead],
    ['Action Target', notification.actionUrl || notification.relatedEntityType || 'No deep link', Boolean(notification.actionUrl || notification.relatedEntityType)],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader
          title={notification.title}
          subtitle={`Received ${formatDateTime(notification.createdAt)}`}
          action={<Badge variant={notification.isRead ? 'success' : 'info'}>{notification.isRead ? 'Read' : 'Unread'}</Badge>}
        />
        <CardBody className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant={typeVariant(notification.notificationType)}>{notification.notificationType}</Badge>
            <Badge variant={priorityVariant(notification.priority)}>{notification.priority}</Badge>
            {notification.relatedEntityType ? <Badge variant="outlined">{notification.relatedEntityType}</Badge> : null}
          </div>
          <p className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-sm leading-6 text-[#434655] dark:border-slate-800 dark:bg-[#0d0d0d] dark:text-slate-300">{notification.message}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" leftIcon={<CheckCheck size={15} />} disabled={notification.isRead} onClick={() => onRead(notification)}>Mark as Read</Button>
            <Button variant="danger" leftIcon={<Trash2 size={15} />} onClick={() => onDelete(notification)}>Delete</Button>
            {notification.actionUrl ? <Button variant="secondary" leftIcon={<Send size={15} />} onClick={() => { window.location.href = notification.actionUrl; }}>Open Target</Button> : null}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Notification Timeline" subtitle="Delivery, read, and action lifecycle" />
        <CardBody>
          {timeline.map(([label, detail, done], index) => (
            <div key={label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={done ? 'flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white' : 'flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] text-[#737686]'}>
                  {done ? <CheckCheck size={14} /> : index + 1}
                </span>
                {index < timeline.length - 1 ? <span className="h-10 w-px bg-[#e2e8f0] dark:bg-slate-800" /> : null}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-[#191b23] dark:text-white">{label}</p>
                <p className="text-xs text-[#737686]">{detail}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

const AnnouncementModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ title: '', content: '', announcementType: 'General', audienceScope: 'All', isPinned: false });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({ title: '', content: '', announcementType: 'General', audienceScope: 'All', isPinned: false });
  }, [isOpen]);

  const submit = () => {
    if (form.title.trim().length < 5) return setError('Title must be at least 5 characters.');
    if (form.content.trim().length < 10) return setError('Content must be at least 10 characters.');
    onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      announcementType: form.announcementType,
      audienceScope: form.audienceScope,
      isPinned: form.isPinned,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Announcement" subtitle="Broadcast an HR, policy, event, or emergency notice." size="lg">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Input label="Announcement Title" required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} disabled={isLoading} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Announcement Type" value={form.announcementType} onChange={(event) => setForm((prev) => ({ ...prev, announcementType: event.target.value }))} disabled={isLoading}>
            {ANNOUNCEMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
          <Select label="Audience" value={form.audienceScope} onChange={(event) => setForm((prev) => ({ ...prev, audienceScope: event.target.value }))} disabled={isLoading}>
            {AUDIENCES.map((scope) => <option key={scope} value={scope}>{scope}</option>)}
          </Select>
        </div>
        <Textarea label="Broadcast Content" required rows={6} value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} disabled={isLoading} />
        <Switch label="Pin this broadcast to the top of the feed" checked={form.isPinned} onChange={(event) => setForm((prev) => ({ ...prev, isPinned: event.target.checked }))} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<Megaphone size={15} />} isLoading={isLoading} onClick={submit}>Publish</Button>
      </ModalFooter>
    </Modal>
  );
};

const AnnouncementsView = ({ page, isLoading, onPageChange, onCreate }) => {
  const pinned = page.items.filter((item) => item.isPinned);
  const regular = page.items.filter((item) => !item.isPinned);
  const renderCard = (item) => (
    <Card key={getId(item)} className={item.isPinned ? 'border-[#2563eb]/40 bg-blue-50/40 dark:bg-blue-500/10' : ''}>
      <CardBody className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {item.isPinned ? <Badge variant="info">Pinned</Badge> : null}
              <Badge variant={typeVariant(item.announcementType)}>{item.announcementType || 'General'}</Badge>
              <Badge variant="pending">{item.audienceScope || 'All'}</Badge>
            </div>
            <h3 className="text-base font-semibold text-[#191b23] dark:text-white">{item.title}</h3>
            <p className="mt-1 text-xs text-[#737686]">Published {formatDateTime(item.publishedAt || item.createdAt)}</p>
          </div>
          <Button size="sm" variant="secondary" leftIcon={<FileText size={14} />}>Preview</Button>
        </div>
        <p className="text-sm leading-6 text-[#434655] dark:text-slate-300">{item.content}</p>
        <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-[#c3c6d7] bg-white/70 p-3 text-xs text-[#434655] dark:border-slate-700 dark:bg-[#111111] dark:text-slate-400">
          <Paperclip size={15} />
          <span>Q3_Corporate_Policy.pdf</span>
          <span>Workplace_Safety_Manual.docx</span>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563eb]">Broadcast Hub</p>
            <h3 className="text-base font-semibold text-[#191b23] dark:text-white">Pinned Corporate Announcements</h3>
          </div>
          <Button variant="primary" leftIcon={<Megaphone size={15} />} onClick={onCreate}>New Broadcast</Button>
        </div>
      </Card>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
        </div>
      ) : page.items.length ? (
        <>
          <div className="space-y-4">{[...pinned, ...regular].map(renderCard)}</div>
          <Pagination currentPage={page.page} totalPages={page.totalPages} totalItems={page.total} itemsPerPage={page.limit || PAGE_SIZE} onPageChange={onPageChange} />
        </>
      ) : (
        <EmptyState icon={Megaphone} title="No announcements" description="Pinned broadcasts, emergency notices, and policy updates will appear here." />
      )}
    </div>
  );
};

const PreferencesView = ({ preferences, isLoading }) => {
  const [local, setLocal] = useState({ emailNotifications: true, inAppNotifications: true, doNotDisturb: false, payroll: true, attendance: true, tasks: true, emergency: true });

  useEffect(() => {
    if (!preferences) return;
    setLocal((prev) => ({ ...prev, ...preferences }));
  }, [preferences]);

  const update = (key) => (event) => setLocal((prev) => ({ ...prev, [key]: event.target.checked }));

  if (isLoading) return <Skeleton className="h-72" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader title="Notification Preferences" subtitle="Read-only delivery settings from the notification preferences endpoint." />
        <CardBody className="space-y-4">
          <Switch label="Email notifications" checked={local.emailNotifications} onChange={update('emailNotifications')} />
          <Switch label="In-app notifications" checked={local.inAppNotifications} onChange={update('inAppNotifications')} />
          <Switch label="Do not disturb" checked={local.doNotDisturb} onChange={update('doNotDisturb')} />
          <div className="grid gap-3 border-t border-[#e2e8f0] pt-4 sm:grid-cols-2 dark:border-slate-800">
            <Checkbox label="Payroll and compensation" checked={local.payroll} onChange={update('payroll')} />
            <Checkbox label="Attendance and shifts" checked={local.attendance} onChange={update('attendance')} />
            <Checkbox label="Task assignment" checked={local.tasks} onChange={update('tasks')} />
            <Checkbox label="Emergency alerts" checked={local.emergency} onChange={update('emergency')} />
          </div>
          <Button variant="secondary" disabled>Save handled by settings policy</Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Delivery Summary" subtitle="Current channel posture" />
        <CardBody className="space-y-3">
          {[
            ['Email', local.emailNotifications ? 'Enabled' : 'Disabled'],
            ['In-app', local.inAppNotifications ? 'Enabled' : 'Disabled'],
            ['Quiet Hours', local.doNotDisturb ? 'Enabled' : 'Disabled'],
            ['Critical Alerts', local.emergency ? 'Always On' : 'Standard'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-2 dark:border-slate-800">
              <span className="text-sm text-[#434655] dark:text-slate-400">{label}</span>
              <Badge variant={value === 'Disabled' ? 'pending' : 'success'}>{value}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default function NotificationsModule() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('center');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', isRead: '', notificationType: '', priority: '', sort: '-createdAt', page: 1 });
  const [announcementPage, setAnnouncementPage] = useState(1);

  const params = useMemo(() => ({ ...filters, limit: PAGE_SIZE }), [filters]);
  const notificationsQuery = useQuery({
    queryKey: ['notifications', params],
    queryFn: () => axios.get(`/notifications?${buildQueryString(params)}`),
  });
  const summaryQuery = useQuery({
    queryKey: ['notifications-summary'],
    queryFn: () => axios.get('/notifications?limit=100&sort=-createdAt'),
  });
  const announcementsQuery = useQuery({
    queryKey: ['announcements', announcementPage],
    queryFn: () => axios.get(`/notifications/announcements?${buildQueryString({ page: announcementPage, limit: PAGE_SIZE, sort: '-publishedAt' })}`),
  });
  const preferencesQuery = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => axios.get('/notifications/preferences'),
  });

  const notificationPage = normalizePaged(notificationsQuery.data);
  const notifications = notificationPage.items.filter((item) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return [item.title, item.message, item.notificationType, item.priority].some((value) => String(value || '').toLowerCase().includes(query));
  });
  const summaryItems = normalizePaged(summaryQuery.data).items;
  const announcementsPage = normalizePaged(announcementsQuery.data);
  const preferences = normalizeRecord(preferencesQuery.data);

  const markReadMutation = useMutation({
    mutationFn: (record) => axios.patch(`/notifications/${getId(record)}/read`),
    onSuccess: (response) => {
      const updated = normalizeRecord(response);
      if (getId(updated)) setSelectedNotification(updated);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-summary'] });
    },
  });
  const markAllReadMutation = useMutation({
    mutationFn: () => axios.post('/notifications/read-all'),
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-summary'] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (record) => axios.delete(`/notifications/${getId(record)}`),
    onSuccess: (_, record) => {
      if (getId(selectedNotification) === getId(record)) setSelectedNotification(null);
      setSelectedIds((prev) => prev.filter((id) => id !== getId(record)));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-summary'] });
    },
  });
  const bulkDeleteMutation = useMutation({
    mutationFn: (notificationIds) => axios.post('/notifications/bulk-delete', { notificationIds }),
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-summary'] });
    },
  });
  const broadcastMutation = useMutation({
    mutationFn: (payload) => axios.post('/notifications/broadcast', payload),
    onSuccess: () => {
      setAnnouncementModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const stats = {
    total: summaryItems.length || notificationPage.total,
    unread: summaryItems.filter((item) => !item.isRead).length,
    high: summaryItems.filter((item) => item.priority === 'High').length,
    announcements: announcementsPage.total,
  };

  const toggleSelected = (id) => {
    if (!id) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const centerContent = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Notices" value={stats.total} helper="Active notification queue" icon={<Bell size={20} />} />
        <MetricCard title="Unread" value={stats.unread} helper="Require user attention" icon={<BellRing size={20} />} tone="amber" />
        <MetricCard title="High Priority" value={stats.high} helper="Executive or urgent alerts" icon={<ShieldAlert size={20} />} tone="rose" />
        <MetricCard title="Broadcasts" value={stats.announcements} helper="Published announcement feed" icon={<Megaphone size={20} />} tone="green" />
      </div>
      <Card className="border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-500/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 text-amber-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-[#191b23] dark:text-white">Executive Alerts Header</p>
              <p className="text-xs text-[#434655] dark:text-slate-400">High-priority payroll, security, attendance, and AI recommendations remain highlighted until read.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="primary" leftIcon={<CheckCheck size={14} />} isLoading={markAllReadMutation.isPending} onClick={() => markAllReadMutation.mutate()}>Mark All Read</Button>
            <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />} disabled={!selectedIds.length} isLoading={bulkDeleteMutation.isPending} onClick={() => bulkDeleteMutation.mutate(selectedIds)}>Delete Selected</Button>
          </div>
        </div>
      </Card>
      <NotificationFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} />
      {notificationsQuery.isError ? <Card className="p-4 text-sm text-rose-700">{notificationsQuery.error?.response?.data?.message || 'Unable to load notifications.'}</Card> : null}
      <NotificationTable
        rows={notifications}
        isLoading={notificationsQuery.isLoading}
        selectedIds={selectedIds}
        onSelect={toggleSelected}
        onOpen={(record) => { setSelectedNotification(record); setActiveTab('details'); }}
        onRead={(record) => markReadMutation.mutate(record)}
        onDelete={(record) => deleteMutation.mutate(record)}
      />
      <Pagination currentPage={notificationPage.page} totalPages={notificationPage.totalPages} totalItems={notificationPage.total} itemsPerPage={notificationPage.limit || PAGE_SIZE} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </div>
  );

  const tabs = [
    { id: 'center', label: 'Notification Center', icon: <Bell size={15} />, badge: stats.unread || undefined, content: centerContent },
    { id: 'details', label: 'Notification Details', icon: <Eye size={15} />, content: <NotificationDetails notification={selectedNotification} onRead={(record) => markReadMutation.mutate(record)} onDelete={(record) => deleteMutation.mutate(record)} /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone size={15} />, badge: announcementsPage.total || undefined, content: <AnnouncementsView page={announcementsPage} isLoading={announcementsQuery.isLoading} onPageChange={setAnnouncementPage} onCreate={() => setAnnouncementModalOpen(true)} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={15} />, content: <PreferencesView preferences={preferences} isLoading={preferencesQuery.isLoading} /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Notifications"
        description="Enterprise notification center, broadcast announcements, read-state triage, and delivery preferences."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Notifications' }]}
        primaryAction={<Button variant="primary" leftIcon={<Megaphone size={16} />} onClick={() => setAnnouncementModalOpen(true)}>New Broadcast</Button>}
        secondaryAction={<Button variant="secondary" leftIcon={<Search size={16} />} onClick={() => setActiveTab('center')}>Open Center</Button>}
      />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      <AnnouncementModal isOpen={announcementModalOpen} onClose={() => setAnnouncementModalOpen(false)} isLoading={broadcastMutation.isPending} onSubmit={(payload) => broadcastMutation.mutate(payload)} />
      {broadcastMutation.isError ? <Card className="mt-4 p-4 text-sm text-rose-700">{broadcastMutation.error?.response?.data?.message || 'Unable to publish announcement.'}</Card> : null}
    </div>
  );
}
