import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Clock,
  Eye,
  Kanban,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Timer,
  UserCheck,
} from 'lucide-react';
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
  Progress,
  SearchInput,
  Select,
  Table,
  Tabs,
  Textarea,
} from '../../components/shared';

const PAGE_SIZE = 8;
const TASK_STATUSES = ['To Do', 'In Progress', 'Review', 'Completed', 'Blocked'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

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
const projectName = (project) => project?.name ? `${project.name}${project.code ? ` (${project.code})` : ''}` : 'No project';
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
  return date.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};
const toDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};
const toNumber = (value, fallback = undefined) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};
const statusVariant = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('completed')) return 'success';
  if (normalized.includes('progress') || normalized.includes('review')) return 'info';
  if (normalized.includes('blocked') || normalized.includes('critical')) return 'danger';
  if (normalized.includes('high') || normalized.includes('medium')) return 'warning';
  return 'pending';
};
const priorityProgress = (task) => {
  if (task.taskStatus === 'Completed') return 100;
  const logged = Number(task.loggedHours || 0);
  const estimated = Number(task.estimatedHours || 0);
  if (!estimated) return task.taskStatus === 'To Do' ? 5 : 35;
  return Math.min(100, Math.round((logged / estimated) * 100));
};
const isOverdue = (task) => {
  if (!task?.dueDate || task.taskStatus === 'Completed') return false;
  const due = new Date(task.dueDate);
  return !Number.isNaN(due.getTime()) && due < new Date();
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

const TaskFilters = ({ filters, onChange, projects }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search tasks or tags"
      />
      <Select label="Project" value={filters.projectId} onChange={(event) => onChange({ projectId: event.target.value, page: 1 })}>
        <option value="">All projects</option>
        <OptionList items={projects} labelFor={projectName} />
      </Select>
      <Select label="Status" value={filters.taskStatus} onChange={(event) => onChange({ taskStatus: event.target.value, page: 1 })}>
        <option value="">All status</option>
        {TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
      </Select>
      <Select label="Priority" value={filters.priority} onChange={(event) => onChange({ priority: event.target.value, page: 1 })}>
        <option value="">All priority</option>
        {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => onChange({ search: '', projectId: '', taskStatus: '', priority: '', page: 1 })}>Reset</Button>
    </div>
  </Card>
);

const TaskModal = ({ isOpen, onClose, record, projects, employees, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ projectId: '', title: '', description: '', assignedToId: '', reportedById: '', taskStatus: 'To Do', priority: 'Medium', dueDate: '', estimatedHours: '', loggedHours: '', blockedReason: '', tags: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({
      projectId: getId(record?.projectId) || '',
      title: record?.title || '',
      description: record?.description || '',
      assignedToId: getId(record?.assignedToId) || '',
      reportedById: getId(record?.reportedById) || '',
      taskStatus: record?.taskStatus || 'To Do',
      priority: record?.priority || 'Medium',
      dueDate: toDateInput(record?.dueDate),
      estimatedHours: record?.estimatedHours ?? '',
      loggedHours: record?.loggedHours ?? '',
      blockedReason: record?.blockedReason || '',
      tags: Array.isArray(record?.tags) ? record.tags.join(', ') : '',
    });
  }, [isOpen, record]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const submit = () => {
    if (!form.projectId) return setError('Project is required.');
    if (!form.title.trim() || form.title.trim().length < 2) return setError('Task title must be at least 2 characters.');
    if (!record && !form.reportedById) return setError('Reported by is required for new tasks.');
    if (!form.dueDate) return setError('Due date is required.');
    const payload = {
      projectId: form.projectId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      assignedToId: form.assignedToId || undefined,
      taskStatus: form.taskStatus,
      priority: form.priority,
      dueDate: form.dueDate,
      estimatedHours: toNumber(form.estimatedHours, undefined),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    if (record) {
      payload.loggedHours = toNumber(form.loggedHours, 0);
      payload.blockedReason = form.blockedReason || undefined;
    } else {
      payload.reportedById = form.reportedById;
    }
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={record ? 'Edit Task' : 'Create Task'} subtitle="Task scope, assignee, priority, due date, and status." size="xl">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Project" required value={form.projectId} onChange={(event) => update({ projectId: event.target.value })} disabled={isLoading || Boolean(record)}>
            <option value="">Select project</option>
            <OptionList items={projects} labelFor={projectName} />
          </Select>
          <Input label="Task Title" required value={form.title} onChange={(event) => update({ title: event.target.value })} disabled={isLoading} />
          <Select label="Assignee" value={form.assignedToId} onChange={(event) => update({ assignedToId: event.target.value })} disabled={isLoading}>
            <option value="">Unassigned</option>
            <OptionList items={employees} />
          </Select>
          <Select label="Reported By" required value={form.reportedById} onChange={(event) => update({ reportedById: event.target.value })} disabled={isLoading || Boolean(record)}>
            <option value="">Select reporter</option>
            <OptionList items={employees} />
          </Select>
          <Select label="Status" value={form.taskStatus} onChange={(event) => update({ taskStatus: event.target.value })} disabled={isLoading}>
            {TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </Select>
          <Select label="Priority" value={form.priority} onChange={(event) => update({ priority: event.target.value })} disabled={isLoading}>
            {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </Select>
          <Input label="Due Date" required type="date" value={form.dueDate} onChange={(event) => update({ dueDate: event.target.value })} disabled={isLoading} />
          <Input label="Estimated Hours" type="number" min="0" value={form.estimatedHours} onChange={(event) => update({ estimatedHours: event.target.value })} disabled={isLoading} />
          {record ? <Input label="Logged Hours" type="number" min="0" value={form.loggedHours} onChange={(event) => update({ loggedHours: event.target.value })} disabled={isLoading} /> : null}
          <Input label="Tags" helper="Comma separated tags" value={form.tags} onChange={(event) => update({ tags: event.target.value })} disabled={isLoading} />
        </div>
        {form.taskStatus === 'Blocked' ? <Input label="Blocked Reason" value={form.blockedReason} onChange={(event) => update({ blockedReason: event.target.value })} disabled={isLoading} /> : null}
        <Textarea label="Description" rows={4} value={form.description} onChange={(event) => update({ description: event.target.value })} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" isLoading={isLoading} onClick={submit}>{record ? 'Save Task' : 'Create Task'}</Button>
      </ModalFooter>
    </Modal>
  );
};

const CommentModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    if (isOpen) setText('');
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Comment" subtitle="Post an activity update to the selected task.">
      <ModalBody>
        <Textarea label="Comment" required rows={5} value={text} onChange={(event) => setText(event.target.value)} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" isLoading={isLoading} disabled={!text.trim()} onClick={() => onSubmit(text.trim())}>Add Comment</Button>
      </ModalFooter>
    </Modal>
  );
};

const TasksTable = ({ rows, isLoading, sort, onSort, onView, onEdit, onStatus }) => {
  const columns = [
    {
      key: 'title',
      header: 'Task',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#191b23] dark:text-white">{row.title}</p>
          <p className="text-xs text-[#737686]">{projectName(row.projectId)}</p>
        </div>
      ),
    },
    {
      key: 'assignedToId',
      header: 'Assignee',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={displayName(row.assignedToId)} size="xs" />
          <span>{displayName(row.assignedToId)}</span>
        </div>
      ),
    },
    { key: 'priority', header: 'Priority', sortable: true, render: (row) => <Badge variant={statusVariant(row.priority)}>{row.priority}</Badge> },
    { key: 'dueDate', header: 'Due Date', sortable: true, render: (row) => <span className={isOverdue(row) ? 'font-semibold text-rose-600' : ''}>{formatDate(row.dueDate)}</span> },
    {
      key: 'progress',
      header: 'Progress',
      render: (row) => <div className="min-w-36"><Progress value={priorityProgress(row)} size="sm" variant={row.taskStatus === 'Blocked' ? 'danger' : row.taskStatus === 'Completed' ? 'success' : 'primary'} /></div>,
    },
    { key: 'taskStatus', header: 'Status', sortable: true, render: (row) => <Badge variant={statusVariant(row.taskStatus)}>{row.taskStatus}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" leftIcon={<Eye size={14} />} onClick={() => onView(row)}>View</Button>
          <Button size="sm" variant="ghost" leftIcon={<Pencil size={14} />} onClick={() => onEdit(row)}>Edit</Button>
          <Select aria-label="Task status" value="" onChange={(event) => event.target.value && onStatus(row, event.target.value)} className="h-8 py-1 text-xs">
            <option value="">Move</option>
            {TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </Select>
          <Button size="sm" variant="ghost" leftIcon={<MoreHorizontal size={14} />} onClick={() => onView(row)}>Menu</Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} rows={rows} isLoading={isLoading} sortColumn={sort.column} sortDirection={sort.direction} onSort={onSort} emptyTitle="No tasks found" emptySubtitle="Tasks matching this view will appear here." emptyIcon={CheckSquare} getRowKey={(row, index) => getId(row) || index} />;
};

const TaskDetails = ({ task, detail, onEdit, onStatus, onComment }) => {
  const current = detail || task;
  if (!current) return <EmptyState icon={CheckSquare} title="Select a task" description="Open a task from the list or kanban board to review assignment, comments, and timeline." />;
  const comments = current.comments || [];
  const tags = current.tags || [];
  const timeline = [
    ['Created', formatDateTime(current.createdAt), true],
    ['Assigned', displayName(current.assignedToId), Boolean(current.assignedToId)],
    ['Work Started', current.taskStatus !== 'To Do' ? current.taskStatus : 'Pending', current.taskStatus !== 'To Do'],
    ['Due Date', formatDate(current.dueDate), true],
    ['Completed', formatDateTime(current.completedAt), current.taskStatus === 'Completed'],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader title={current.title} subtitle={projectName(current.projectId)} action={<Badge variant={statusVariant(current.taskStatus)}>{current.taskStatus}</Badge>} />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="Priority" value={current.priority} helper="Delivery priority" icon={<CheckSquare size={20} />} />
            <MetricCard title="Due Date" value={formatDate(current.dueDate)} helper={isOverdue(current) ? 'Task is overdue' : 'Target completion date'} icon={<CalendarDays size={20} />} tone={isOverdue(current) ? 'rose' : 'green'} />
            <MetricCard title="Estimated" value={`${current.estimatedHours ?? 0}h`} helper="Estimated effort" icon={<Timer size={20} />} tone="amber" />
            <MetricCard title="Logged" value={`${current.loggedHours ?? 0}h`} helper="Logged effort" icon={<Clock size={20} />} tone="rose" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Task Summary" subtitle="Assignee, reporter, progress, and tags" action={<Button size="sm" variant="secondary" onClick={() => onEdit(current)}>Edit</Button>} />
              <CardBody className="space-y-3 text-sm">
                {[
                  ['Assignee', displayName(current.assignedToId)],
                  ['Reported By', displayName(current.reportedById)],
                  ['Status', current.taskStatus],
                  ['Blocked Reason', current.blockedReason || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded border border-[#e2e8f0] px-3 py-2 dark:border-slate-800">
                    <span className="text-[#434655] dark:text-slate-400">{label}</span>
                    <span className="font-semibold text-[#191b23] dark:text-white">{value}</span>
                  </div>
                ))}
                <Progress value={priorityProgress(current)} label="Effort Progress" variant={current.taskStatus === 'Blocked' ? 'danger' : 'primary'} />
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => <Badge key={tag} variant="outlined" dot={false}>{tag}</Badge>)}
                </div>
                {current.description ? <p className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#434655] dark:bg-[#0d0d0d] dark:text-slate-400">{current.description}</p> : null}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Activity" subtitle="Comments and task updates" action={<Button size="sm" variant="primary" onClick={onComment}>Comment</Button>} />
              <CardBody className="space-y-3">
                {comments.map((comment) => (
                  <div key={getId(comment)} className="rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Avatar name={displayName(comment.authorId)} size="xs" />
                      <p className="text-sm font-semibold text-[#191b23] dark:text-white">{displayName(comment.authorId)}</p>
                      <span className="text-xs text-[#737686]">{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#434655] dark:text-slate-400">{comment.text}</p>
                  </div>
                ))}
                {!comments.length ? <EmptyState icon={MessageSquare} title="No comments" description="Add a comment to create activity history." /> : null}
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Task Timeline" subtitle="Lifecycle milestones" action={<Select aria-label="Move task" value="" onChange={(event) => event.target.value && onStatus(current, event.target.value)} className="h-8 py-1 text-xs"><option value="">Move</option>{TASK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</Select>} />
        <CardBody>
          {timeline.map(([label, detailText, done], index) => (
            <div key={label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={done ? 'flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white' : 'flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] text-[#737686]'}>
                  {done ? <CheckCircle2 size={15} /> : index + 1}
                </span>
                {index < timeline.length - 1 ? <span className="h-9 w-px bg-[#e2e8f0] dark:bg-slate-800" /> : null}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-[#191b23] dark:text-white">{label}</p>
                <p className="text-xs text-[#737686]">{detailText}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

const KanbanBoard = ({ tasks, onView, onEdit, onStatus }) => (
  <div className="grid gap-4 xl:grid-cols-5">
    {TASK_STATUSES.map((status) => {
      const rows = tasks.filter((task) => task.taskStatus === status);
      return (
        <Card key={status} className="min-h-80">
          <CardHeader title={status} subtitle={`${rows.length} task${rows.length === 1 ? '' : 's'}`} action={<Badge variant={statusVariant(status)}>{rows.length}</Badge>} />
          <CardBody className="space-y-3">
            {rows.map((task) => (
              <div key={getId(task)} className="rounded-lg border border-[#e2e8f0] bg-white p-3 dark:border-slate-800 dark:bg-[#111111]">
                <button type="button" onClick={() => onView(task)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-sm font-semibold text-[#191b23] dark:text-white">{task.title}</p>
                    <Badge variant={statusVariant(task.priority)}>{task.priority}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#737686]">{projectName(task.projectId)}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={displayName(task.assignedToId)} size="xs" />
                      <span className="text-xs text-[#434655] dark:text-slate-400">{displayName(task.assignedToId)}</span>
                    </div>
                    <span className={isOverdue(task) ? 'text-xs font-semibold text-rose-600' : 'text-xs text-[#737686]'}>{formatDate(task.dueDate)}</span>
                  </div>
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>Edit</Button>
                  <Select aria-label="Move task" value="" onChange={(event) => event.target.value && onStatus(task, event.target.value)} className="h-8 py-1 text-xs">
                    <option value="">Move</option>
                    {TASK_STATUSES.map((next) => <option key={next} value={next}>{next}</option>)}
                  </Select>
                </div>
              </div>
            ))}
            {!rows.length ? <div className="rounded-lg border border-dashed border-[#e2e8f0] p-5 text-center text-xs text-[#737686] dark:border-slate-800">No tasks</div> : null}
          </CardBody>
        </Card>
      );
    })}
  </div>
);

const TaskTimeline = ({ tasks, onView }) => {
  const ordered = [...tasks].sort((a, b) => new Date(a.dueDate || a.createdAt) - new Date(b.dueDate || b.createdAt));
  return (
    <Card>
      <CardHeader title="Task Timeline" subtitle="Due-date ordered activity timeline from the current task query" />
      <CardBody>
        {ordered.map((task, index) => (
          <button key={getId(task)} type="button" onClick={() => onView(task)} className="flex w-full gap-3 text-left">
            <div className="flex flex-col items-center">
              <span className={task.taskStatus === 'Completed' ? 'flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-white' : 'flex h-8 w-8 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#737686] dark:border-slate-800 dark:bg-[#111111]'}>
                {task.taskStatus === 'Completed' ? <CheckCircle2 size={16} /> : index + 1}
              </span>
              {index < ordered.length - 1 ? <span className="h-14 w-px bg-[#e2e8f0] dark:bg-slate-800" /> : null}
            </div>
            <div className="mb-4 flex-1 rounded-lg border border-[#e2e8f0] p-3 transition-colors hover:bg-[#f8fafc] dark:border-slate-800 dark:hover:bg-[#161616]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-[#191b23] dark:text-white">{task.title}</p>
                  <p className="text-xs text-[#737686]">{projectName(task.projectId)} - Due {formatDate(task.dueDate)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusVariant(task.priority)}>{task.priority}</Badge>
                  <Badge variant={statusVariant(task.taskStatus)}>{task.taskStatus}</Badge>
                </div>
              </div>
            </div>
          </button>
        ))}
        {!ordered.length ? <EmptyState icon={CalendarDays} title="No timeline entries" description="Tasks matching this query will create the timeline." /> : null}
      </CardBody>
    </Card>
  );
};

export const TasksModule = ({ initialView = 'dashboard' }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModal, setTaskModal] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', projectId: '', taskStatus: '', priority: '', page: 1 });
  const [sort, setSort] = useState({ column: 'createdAt', direction: 'desc' });

  const params = useMemo(() => ({ ...filters, limit: PAGE_SIZE, sort: sort.direction === 'asc' ? sort.column : `-${sort.column}` }), [filters, sort]);
  const tasksQuery = useQuery({ queryKey: ['tasks', params], queryFn: () => axios.get(`/tasks?${buildQueryString(params)}`) });
  const kanbanQuery = useQuery({ queryKey: ['tasks-kanban'], queryFn: () => axios.get('/tasks?limit=100&sort=-createdAt') });
  const detailQuery = useQuery({ queryKey: ['task-detail', getId(selectedTask)], queryFn: () => axios.get(`/tasks/${getId(selectedTask)}`), enabled: Boolean(getId(selectedTask)) });
  const projectsQuery = useQuery({ queryKey: ['projects-options'], queryFn: () => axios.get('/projects?limit=200') });
  const employeesQuery = useQuery({ queryKey: ['employees-options'], queryFn: () => axios.get('/employees?limit=200') });

  const tasksPage = normalizePaged(tasksQuery.data);
  const kanbanTasks = normalizePaged(kanbanQuery.data).items;
  const detailTask = unwrap(detailQuery.data);
  const projects = normalizeList(projectsQuery.data);
  const employees = normalizeList(employeesQuery.data);

  const filteredTasks = tasksPage.items.filter((task) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return [task.title, task.description, ...(task.tags || [])].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['tasks-kanban'] });
    queryClient.invalidateQueries({ queryKey: ['task-detail'] });
  };

  const taskMutation = useMutation({
    mutationFn: ({ record, payload }) => (record ? axios.put(`/tasks/${getId(record)}`, payload) : axios.post('/tasks', payload)),
    onSuccess: (response) => {
      const saved = unwrap(response);
      if (saved) setSelectedTask(saved);
      setTaskModal(null);
      invalidateTasks();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ task, status }) => axios.patch(`/tasks/${getId(task)}/status`, {
      taskStatus: status,
      blockedReason: status === 'Blocked' ? task.blockedReason || 'Blocked from UI workflow' : undefined,
    }),
    onSuccess: (_, variables) => {
      setSelectedTask((prev) => (getId(prev) === getId(variables.task) ? { ...prev, taskStatus: variables.status } : prev));
      invalidateTasks();
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ task, text }) => axios.post(`/tasks/${getId(task)}/comments`, { text }),
    onSuccess: () => {
      setCommentOpen(false);
      invalidateTasks();
    },
  });

  const handleSort = (column) => setSort((prev) => ({ column, direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const openTask = (task) => {
    setSelectedTask(task);
    setActiveTab('details');
  };
  const moveTask = (task, status) => statusMutation.mutate({ task, status });

  const stats = {
    total: tasksPage.total,
    inProgress: kanbanTasks.filter((task) => task.taskStatus === 'In Progress').length,
    completed: kanbanTasks.filter((task) => task.taskStatus === 'Completed').length,
    overdue: kanbanTasks.filter(isOverdue).length,
  };

  const taskTable = (
    <>
      <TasksTable
        rows={filteredTasks}
        isLoading={tasksQuery.isLoading}
        sort={sort}
        onSort={handleSort}
        onView={openTask}
        onEdit={(task) => setTaskModal(task)}
        onStatus={moveTask}
      />
      <Pagination currentPage={tasksPage.page} totalPages={tasksPage.totalPages} totalItems={tasksPage.total} itemsPerPage={tasksPage.limit || PAGE_SIZE} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </>
  );

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={15} />,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Total Tasks" value={stats.total} helper="Tasks visible to your role" icon={<CheckSquare size={20} />} />
            <MetricCard title="In Progress" value={stats.inProgress} helper="Tasks actively being worked" icon={<Timer size={20} />} tone="green" />
            <MetricCard title="Completed" value={stats.completed} helper="Finished work items" icon={<CheckCircle2 size={20} />} tone="amber" />
            <MetricCard title="Overdue" value={stats.overdue} helper="Past due and not completed" icon={<CalendarDays size={20} />} tone="rose" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <Card>
              <CardHeader title="Task List" subtitle="Search, filters, sorting, status badges, and actions" action={<Button size="sm" variant="primary" leftIcon={<Plus size={15} />} onClick={() => setTaskModal({})}>Create</Button>} />
              <CardBody>{taskTable}</CardBody>
            </Card>
            <Card>
              <CardHeader title="Priority Mix" subtitle="Visible tasks by priority" />
              <CardBody className="space-y-4">
                {PRIORITIES.map((priority) => {
                  const count = kanbanTasks.filter((task) => task.priority === priority).length;
                  const percentage = Math.round((count / Math.max(1, kanbanTasks.length)) * 100);
                  return (
                    <div key={priority}>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-[#434655] dark:text-slate-400">
                        <span>{priority}</span>
                        <span>{count}</span>
                      </div>
                      <Progress value={percentage} size="sm" variant={priority === 'Critical' ? 'danger' : priority === 'High' ? 'warning' : 'primary'} />
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'list',
      label: 'Task List',
      icon: <ListChecks size={15} />,
      content: (
        <div className="space-y-4">
          <TaskFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} projects={projects} />
          {taskTable}
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Task Details',
      icon: <Eye size={15} />,
      content: <TaskDetails task={selectedTask} detail={detailTask} onEdit={(task) => setTaskModal(task)} onStatus={moveTask} onComment={() => setCommentOpen(true)} />,
    },
    {
      id: 'kanban',
      label: 'Kanban Board',
      icon: <Kanban size={15} />,
      content: <KanbanBoard tasks={kanbanTasks} onView={openTask} onEdit={(task) => setTaskModal(task)} onStatus={moveTask} />,
    },
    {
      id: 'timeline',
      label: 'Task Timeline',
      icon: <CalendarDays size={15} />,
      content: <TaskTimeline tasks={kanbanTasks} onView={openTask} />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Tasks"
        description="Task dashboard, responsive list, details, kanban workflow, assignees, due dates, and timeline."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Tasks' }]}
        primaryAction={<Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setTaskModal({})}>Create Task</Button>}
        secondaryAction={<Button variant="secondary" leftIcon={<UserCheck size={16} />} disabled={!selectedTask} onClick={() => setTaskModal(selectedTask)}>Edit Selected</Button>}
      />
      {tasksQuery.isError ? (
        <Card className="mb-6 p-4 text-sm text-rose-700 dark:text-rose-400">
          {tasksQuery.error?.response?.data?.message || 'Unable to load task data. Please retry after confirming your session.'}
        </Card>
      ) : null}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      <TaskModal
        isOpen={Boolean(taskModal)}
        onClose={() => setTaskModal(null)}
        record={getId(taskModal) ? taskModal : null}
        projects={projects}
        employees={employees}
        isLoading={taskMutation.isPending}
        onSubmit={(payload) => taskMutation.mutate({ record: getId(taskModal) ? taskModal : null, payload })}
      />
      <CommentModal
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
        isLoading={commentMutation.isPending}
        onSubmit={(text) => selectedTask && commentMutation.mutate({ task: selectedTask, text })}
      />
    </div>
  );
};

export default TasksModule;
