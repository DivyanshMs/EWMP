import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FolderKanban,
  LayoutDashboard,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Users,
  WalletCards,
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
const PROJECT_STATUSES = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'];
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
const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};
const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
const toNumber = (value, fallback = undefined) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};
const toDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};
const statusVariant = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('completed') || normalized.includes('active')) return 'success';
  if (normalized.includes('planning')) return 'info';
  if (normalized.includes('hold') || normalized.includes('medium') || normalized.includes('low')) return 'warning';
  if (normalized.includes('cancelled') || normalized.includes('critical')) return 'danger';
  if (normalized.includes('high')) return 'warning';
  return 'pending';
};
const progressVariant = (value) => {
  if (value >= 80) return 'success';
  if (value >= 45) return 'primary';
  if (value >= 20) return 'warning';
  return 'danger';
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

const ProjectFilters = ({ filters, onChange, departments }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search project name or code"
      />
      <Select label="Status" value={filters.projectStatus} onChange={(event) => onChange({ projectStatus: event.target.value, page: 1 })}>
        <option value="">All status</option>
        {PROJECT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
      </Select>
      <Select label="Priority" value={filters.priority} onChange={(event) => onChange({ priority: event.target.value, page: 1 })}>
        <option value="">All priority</option>
        {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
      </Select>
      <Select label="Department" value={filters.departmentId} onChange={(event) => onChange({ departmentId: event.target.value, page: 1 })}>
        <option value="">All departments</option>
        <OptionList items={departments} />
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => onChange({ search: '', projectStatus: '', priority: '', departmentId: '', page: 1 })}>Reset</Button>
    </div>
  </Card>
);

const ProjectModal = ({ isOpen, onClose, record, departments, employees, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ name: '', code: '', description: '', departmentId: '', projectManagerId: '', teamMemberIds: '', startDate: '', endDate: '', priority: 'Medium', budget: '', completionPercent: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({
      name: record?.name || '',
      code: record?.code || '',
      description: record?.description || '',
      departmentId: getId(record?.departmentId) || '',
      projectManagerId: getId(record?.projectManagerId) || '',
      teamMemberIds: (record?.teamMemberIds || []).map((member) => getId(member)).filter(Boolean).join(','),
      startDate: toDateInput(record?.startDate),
      endDate: toDateInput(record?.endDate),
      priority: record?.priority || 'Medium',
      budget: record?.budget ?? '',
      completionPercent: record?.completionPercent ?? 0,
    });
  }, [isOpen, record]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const submit = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return setError('Project name must be at least 2 characters.');
    if (!record && !form.code.trim()) return setError('Project code is required.');
    if (!form.projectManagerId || !form.startDate) return setError('Project manager and start date are required.');
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      departmentId: form.departmentId || undefined,
      projectManagerId: form.projectManagerId,
      teamMemberIds: form.teamMemberIds.split(',').map((id) => id.trim()).filter(Boolean),
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      priority: form.priority,
      budget: toNumber(form.budget, undefined),
    };
    if (record) payload.completionPercent = toNumber(form.completionPercent, 0);
    if (!record) payload.code = form.code.trim().toUpperCase();
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={record ? 'Edit Project' : 'Create Project'} subtitle="Project definition, dates, owner, budget, and team assignments." size="xl">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Project Name" required value={form.name} onChange={(event) => update({ name: event.target.value })} disabled={isLoading} />
          <Input label="Project Code" required value={form.code} onChange={(event) => update({ code: event.target.value.toUpperCase() })} disabled={isLoading || Boolean(record)} />
          <Select label="Department" value={form.departmentId} onChange={(event) => update({ departmentId: event.target.value })} disabled={isLoading}>
            <option value="">Select department</option>
            <OptionList items={departments} />
          </Select>
          <Select label="Project Manager" required value={form.projectManagerId} onChange={(event) => update({ projectManagerId: event.target.value })} disabled={isLoading}>
            <option value="">Select manager</option>
            <OptionList items={employees} />
          </Select>
          <Input label="Start Date" required type="date" value={form.startDate} onChange={(event) => update({ startDate: event.target.value })} disabled={isLoading} />
          <Input label="End Date" type="date" value={form.endDate} onChange={(event) => update({ endDate: event.target.value })} disabled={isLoading} />
          <Select label="Priority" value={form.priority} onChange={(event) => update({ priority: event.target.value })} disabled={isLoading}>
            {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </Select>
          <Input label="Budget" type="number" min="0" value={form.budget} onChange={(event) => update({ budget: event.target.value })} disabled={isLoading} />
          {record ? <Input label="Completion" type="number" min="0" max="100" value={form.completionPercent} onChange={(event) => update({ completionPercent: event.target.value })} disabled={isLoading} /> : null}
          <Input label="Team Member IDs" helper="Comma separated employee IDs from the existing directory" value={form.teamMemberIds} onChange={(event) => update({ teamMemberIds: event.target.value })} disabled={isLoading} />
        </div>
        <Textarea label="Description" rows={4} value={form.description} onChange={(event) => update({ description: event.target.value })} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" isLoading={isLoading} onClick={submit}>{record ? 'Save Project' : 'Create Project'}</Button>
      </ModalFooter>
    </Modal>
  );
};

const ProjectsTable = ({ rows, isLoading, sort, onSort, onView, onEdit, onStatus }) => {
  const columns = [
    {
      key: 'name',
      header: 'Project',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#191b23] dark:text-white">{row.name}</p>
          <p className="text-xs text-[#737686]">{row.code} - {displayName(row.departmentId, 'No department')}</p>
        </div>
      ),
    },
    {
      key: 'projectManagerId',
      header: 'Manager',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={displayName(row.projectManagerId)} size="xs" />
          <span>{displayName(row.projectManagerId)}</span>
        </div>
      ),
    },
    { key: 'priority', header: 'Priority', sortable: true, render: (row) => <Badge variant={statusVariant(row.priority)}>{row.priority}</Badge> },
    {
      key: 'completionPercent',
      header: 'Progress',
      sortable: true,
      render: (row) => <div className="min-w-36"><Progress value={row.completionPercent || 0} variant={progressVariant(row.completionPercent || 0)} size="sm" /></div>,
    },
    { key: 'budget', header: 'Budget', sortable: true, render: (row) => formatCurrency(row.budget) },
    { key: 'projectStatus', header: 'Status', sortable: true, render: (row) => <Badge variant={statusVariant(row.projectStatus)}>{row.projectStatus}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" leftIcon={<Eye size={14} />} onClick={() => onView(row)}>View</Button>
          <Button size="sm" variant="ghost" leftIcon={<Pencil size={14} />} onClick={() => onEdit(row)}>Edit</Button>
          <Select aria-label="Project status" value="" onChange={(event) => event.target.value && onStatus(row, event.target.value)} className="h-8 py-1 text-xs">
            <option value="">Move</option>
            {PROJECT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </Select>
          <Button size="sm" variant="ghost" leftIcon={<MoreHorizontal size={14} />} onClick={() => onView(row)}>Menu</Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} rows={rows} isLoading={isLoading} sortColumn={sort.column} sortDirection={sort.direction} onSort={onSort} emptyTitle="No projects found" emptySubtitle="Projects matching this view will appear here." emptyIcon={FolderKanban} getRowKey={(row, index) => getId(row) || index} />;
};

const ProjectDetails = ({ project, detail, onEdit, onStatus }) => {
  const current = detail || project;
  if (!current) return <EmptyState icon={FolderKanban} title="Select a project" description="Open a project from the list to review budget, team, dates, and progress." />;
  const team = current.teamMemberIds || [];
  const timeline = [
    ['Created', formatDate(current.createdAt), true],
    ['Started', formatDate(current.startDate), true],
    ['In Progress', `${current.completionPercent || 0}% complete`, current.projectStatus === 'Active' || current.completionPercent > 0],
    ['Target End', formatDate(current.endDate), Boolean(current.endDate)],
    ['Completed', formatDate(current.actualEndDate), current.projectStatus === 'Completed'],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader title={current.name} subtitle={`${current.code} - ${displayName(current.departmentId, 'No department')}`} action={<Badge variant={statusVariant(current.projectStatus)}>{current.projectStatus}</Badge>} />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="Budget" value={formatCurrency(current.budget)} helper="Approved project budget" icon={<WalletCards size={20} />} />
            <MetricCard title="Priority" value={current.priority} helper="Delivery priority" icon={<FolderKanban size={20} />} tone="amber" />
            <MetricCard title="Team" value={team.length} helper="Assigned team members" icon={<Users size={20} />} tone="green" />
            <MetricCard title="Progress" value={`${current.completionPercent || 0}%`} helper="Completion percentage" icon={<CheckCircle2 size={20} />} tone="rose" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Project Summary" subtitle="Scope, manager, dates, and status" action={<Button size="sm" variant="secondary" onClick={() => onEdit(current)}>Edit</Button>} />
              <CardBody className="space-y-3 text-sm">
                {[
                  ['Project Manager', displayName(current.projectManagerId)],
                  ['Start Date', formatDate(current.startDate)],
                  ['End Date', formatDate(current.endDate)],
                  ['Actual End', formatDate(current.actualEndDate)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded border border-[#e2e8f0] px-3 py-2 dark:border-slate-800">
                    <span className="text-[#434655] dark:text-slate-400">{label}</span>
                    <span className="font-semibold text-[#191b23] dark:text-white">{value}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Progress value={current.completionPercent || 0} variant={progressVariant(current.completionPercent || 0)} label="Completion" />
                </div>
                {current.description ? <p className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#434655] dark:bg-[#0d0d0d] dark:text-slate-400">{current.description}</p> : null}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Team Members" subtitle="Assigned contributors" />
              <CardBody className="space-y-3">
                {team.map((member) => (
                  <div key={getId(member)} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Avatar name={displayName(member)} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-[#191b23] dark:text-white">{displayName(member)}</p>
                        <p className="text-xs text-[#737686]">{member.employeeCode || 'Team member'}</p>
                      </div>
                    </div>
                    <Badge variant="info">Member</Badge>
                  </div>
                ))}
                {!team.length ? <EmptyState icon={Users} title="No team assigned" description="Add team member IDs when editing the project." /> : null}
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Project Timeline" subtitle="Status progression and key dates" action={<Select aria-label="Move project" value="" onChange={(event) => event.target.value && onStatus(current, event.target.value)} className="h-8 py-1 text-xs"><option value="">Move</option>{PROJECT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</Select>} />
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

export const ProjectsModule = ({ initialView = 'dashboard' }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModal, setProjectModal] = useState(null);
  const [filters, setFilters] = useState({ search: '', projectStatus: '', priority: '', departmentId: '', page: 1 });
  const [sort, setSort] = useState({ column: 'createdAt', direction: 'desc' });

  const params = useMemo(() => ({ ...filters, limit: PAGE_SIZE, sort: sort.direction === 'asc' ? sort.column : `-${sort.column}` }), [filters, sort]);
  const projectsQuery = useQuery({ queryKey: ['projects', params], queryFn: () => axios.get(`/projects?${buildQueryString(params)}`) });
  const detailQuery = useQuery({ queryKey: ['project-detail', getId(selectedProject)], queryFn: () => axios.get(`/projects/${getId(selectedProject)}`), enabled: Boolean(getId(selectedProject)) });
  const employeesQuery = useQuery({ queryKey: ['employees-options'], queryFn: () => axios.get('/employees?limit=200') });
  const departmentsQuery = useQuery({ queryKey: ['departments-options'], queryFn: () => axios.get('/departments?limit=200') });

  const projectsPage = normalizePaged(projectsQuery.data);
  const detailProject = unwrap(detailQuery.data);
  const employees = normalizeList(employeesQuery.data);
  const departments = normalizeList(departmentsQuery.data);

  const filteredProjects = projectsPage.items.filter((project) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return [project.name, project.code, displayName(project.projectManagerId)].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    queryClient.invalidateQueries({ queryKey: ['project-detail'] });
  };

  const projectMutation = useMutation({
    mutationFn: ({ record, payload }) => (record ? axios.put(`/projects/${getId(record)}`, payload) : axios.post('/projects', payload)),
    onSuccess: (response) => {
      const saved = unwrap(response);
      if (saved) setSelectedProject(saved);
      setProjectModal(null);
      invalidateProjects();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ project, status }) => axios.patch(`/projects/${getId(project)}/status`, {
      projectStatus: status,
      actualEndDate: status === 'Completed' ? new Date().toISOString() : undefined,
    }),
    onSuccess: (_, variables) => {
      setSelectedProject((prev) => (getId(prev) === getId(variables.project) ? { ...prev, projectStatus: variables.status } : prev));
      invalidateProjects();
    },
  });

  const handleSort = (column) => setSort((prev) => ({ column, direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const openProject = (project) => {
    setSelectedProject(project);
    setActiveTab('details');
  };

  const stats = {
    total: projectsPage.total,
    active: projectsPage.items.filter((project) => project.projectStatus === 'Active').length,
    completed: projectsPage.items.filter((project) => project.projectStatus === 'Completed').length,
    budget: projectsPage.items.reduce((sum, project) => sum + Number(project.budget || 0), 0),
  };

  const projectTable = (
    <>
      <ProjectsTable
        rows={filteredProjects}
        isLoading={projectsQuery.isLoading}
        sort={sort}
        onSort={handleSort}
        onView={openProject}
        onEdit={(project) => setProjectModal(project)}
        onStatus={(project, status) => statusMutation.mutate({ project, status })}
      />
      <Pagination currentPage={projectsPage.page} totalPages={projectsPage.totalPages} totalItems={projectsPage.total} itemsPerPage={projectsPage.limit || PAGE_SIZE} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
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
            <MetricCard title="Total Projects" value={stats.total} helper="Projects visible to your role" icon={<FolderKanban size={20} />} />
            <MetricCard title="Active" value={stats.active} helper="Currently active delivery work" icon={<CheckCircle2 size={20} />} tone="green" />
            <MetricCard title="Completed" value={stats.completed} helper="Completed project records" icon={<CalendarDays size={20} />} tone="amber" />
            <MetricCard title="Budget" value={formatCurrency(stats.budget)} helper="Budget in current query page" icon={<WalletCards size={20} />} tone="rose" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <Card>
              <CardHeader title="Projects List" subtitle="Responsive project table with progress, budget, status, and actions" action={<Button size="sm" variant="primary" leftIcon={<Plus size={15} />} onClick={() => setProjectModal({})}>Create</Button>} />
              <CardBody>{projectTable}</CardBody>
            </Card>
            <Card>
              <CardHeader title="Portfolio Health" subtitle="Progress distribution across visible projects" />
              <CardBody className="space-y-4">
                {projectsPage.items.slice(0, 6).map((project) => (
                  <button key={getId(project)} type="button" onClick={() => openProject(project)} className="w-full rounded-lg border border-[#e2e8f0] p-3 text-left transition-colors hover:bg-[#f8fafc] dark:border-slate-800 dark:hover:bg-[#161616]">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#191b23] dark:text-white">{project.name}</p>
                        <p className="text-xs text-[#737686]">{project.code}</p>
                      </div>
                      <Badge variant={statusVariant(project.priority)}>{project.priority}</Badge>
                    </div>
                    <Progress value={project.completionPercent || 0} variant={progressVariant(project.completionPercent || 0)} size="sm" />
                  </button>
                ))}
                {!projectsPage.items.length && !projectsQuery.isLoading ? <EmptyState icon={FolderKanban} title="No projects" description="Create a project to populate portfolio health." /> : null}
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'list',
      label: 'Projects List',
      icon: <ListFilter size={15} />,
      content: (
        <div className="space-y-4">
          <ProjectFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} departments={departments} />
          {projectTable}
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Project Details',
      icon: <Eye size={15} />,
      content: <ProjectDetails project={selectedProject} detail={detailProject} onEdit={(project) => setProjectModal(project)} onStatus={(project, status) => statusMutation.mutate({ project, status })} />,
    },
    {
      id: 'create',
      label: 'Create/Edit Project',
      icon: <Plus size={15} />,
      content: (
        <Card>
          <CardHeader title="Create/Edit Project" subtitle="Use the shared modal form to create a project or update the selected project." action={<div className="flex gap-2"><Button variant="primary" leftIcon={<Plus size={15} />} onClick={() => setProjectModal({})}>Create Project</Button><Button variant="secondary" disabled={!selectedProject} leftIcon={<Pencil size={15} />} onClick={() => setProjectModal(selectedProject)}>Edit Selected</Button></div>} />
          <CardBody>
            <ProjectDetails project={selectedProject} detail={detailProject} onEdit={(project) => setProjectModal(project)} onStatus={(project, status) => statusMutation.mutate({ project, status })} />
          </CardBody>
        </Card>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Projects"
        description="Project dashboard, portfolio list, project details, team members, budget status, and create/edit workflow."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Projects' }]}
        primaryAction={<Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setProjectModal({})}>Create Project</Button>}
      />
      {projectsQuery.isError ? (
        <Card className="mb-6 p-4 text-sm text-rose-700 dark:text-rose-400">
          {projectsQuery.error?.response?.data?.message || 'Unable to load project data. Please retry after confirming your session.'}
        </Card>
      ) : null}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      <ProjectModal
        isOpen={Boolean(projectModal)}
        onClose={() => setProjectModal(null)}
        record={getId(projectModal) ? projectModal : null}
        departments={departments}
        employees={employees}
        isLoading={projectMutation.isPending}
        onSubmit={(payload) => projectMutation.mutate({ record: getId(projectModal) ? projectModal : null, payload })}
      />
    </div>
  );
};

export default ProjectsModule;
