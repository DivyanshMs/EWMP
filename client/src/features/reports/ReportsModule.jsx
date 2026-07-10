import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Activity, Award, BarChart3, Briefcase, Building2, CalendarDays, CheckCircle2, Clock, Download, FileSpreadsheet, Filter, RefreshCw, Search, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import axios from '../../lib/axios';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  ChartCard,
  EmptyState,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Skeleton,
  StatCard,
  Table,
  Tabs,
} from '../../components/shared';

const PAGE_SIZE = 8;
const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
const REPORT_ENDPOINTS = {
  attendance: '/reports/attendance',
  leave: '/reports/leave',
  payroll: '/reports/payroll',
  projects: '/reports/projects',
  tasks: '/reports/tasks',
  helpdesk: '/reports/helpdesk',
  assets: '/reports/assets',
  performance: '/performance/reviews',
  recruitment: '/recruitment/candidates',
  departments: '/departments',
  organization: '/organizations/current',
};

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload;
const getId = (record) => record?._id || record?.id;
const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};
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
  if (value && typeof value === 'object') return { items: [value], total: 1, page: 1, limit: 1, totalPages: 1 };
  return { items: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };
};

const normalizeRecord = (payload) => {
  const value = unwrap(payload);
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  return payload?.data?.message && typeof payload.data.message === 'object' ? payload.data.message : {};
};

const displayName = (record, fallback = '-') => {
  if (!record) return fallback;
  if (typeof record === 'string') return record;
  return record.name || record.title || record.subject || record.code || record.ticketNumber || [record.firstName, record.lastName].filter(Boolean).join(' ') || record.employeeCode || fallback;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
const toDateInput = (date) => new Date(date).toISOString().slice(0, 10);
const defaultStart = () => {
  const date = new Date();
  date.setDate(date.getDate() - 90);
  return toDateInput(date);
};

const statusVariant = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('active') || normalized.includes('present') || normalized.includes('approved') || normalized.includes('completed') || normalized.includes('processed') || normalized.includes('resolved') || normalized.includes('closed')) return 'success';
  if (normalized.includes('pending') || normalized.includes('open') || normalized.includes('progress') || normalized.includes('draft')) return 'warning';
  if (normalized.includes('rejected') || normalized.includes('absent') || normalized.includes('failed') || normalized.includes('critical')) return 'danger';
  return 'pending';
};

const getMetricNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;

const groupCount = (items, getter) => {
  const map = new Map();
  items.forEach((item) => {
    const raw = getter(item) || 'Unclassified';
    const key = typeof raw === 'object' ? displayName(raw, 'Unclassified') : String(raw);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value })).slice(0, 8);
};

const monthTrend = (items, dateKey = 'createdAt') => {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short' });
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return { key: `${date.getFullYear()}-${date.getMonth()}`, name: formatter.format(date), value: 0 };
  });
  const indexByKey = new Map(months.map((item, index) => [item.key, index]));
  items.forEach((item) => {
    const date = new Date(item?.[dateKey] || item?.date || item?.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (indexByKey.has(key)) months[indexByKey.get(key)].value += 1;
  });
  return months;
};

const flattenValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return displayName(value, JSON.stringify(value));
  return String(value);
};

const makeCsv = (rows) => {
  if (!rows.length) return 'No records';
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row).filter((key) => !key.startsWith('_') && typeof row[key] !== 'function')))).slice(0, 16);
  const escape = (value) => `"${String(flattenValue(value)).replace(/"/g, '""')}"`;
  return [keys.join(','), ...rows.map((row) => keys.map((key) => escape(row[key])).join(','))].join('\n');
};

const downloadTextFile = (name, text) => {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const getColumnsForReport = (reportId) => {
  const common = [
    { key: 'primary', header: 'Record', sortable: true, render: (row) => <div><p className="font-semibold text-[#191b23] dark:text-white">{displayName(row)}</p><p className="text-xs text-[#737686]">{getId(row) || row.employeeCode || row.code || row.ticketNumber || '-'}</p></div> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <Badge variant={statusVariant(row.status || row.attendanceStatus || row.leaveStatus || row.payrollStatus || row.projectStatus || row.taskStatus || row.ticketStatus || row.reviewStatus || row.recruitmentStatus || row.assetStatus)}>{row.status || row.attendanceStatus || row.leaveStatus || row.payrollStatus || row.projectStatus || row.taskStatus || row.ticketStatus || row.reviewStatus || row.recruitmentStatus || row.assetStatus || 'Active'}</Badge> },
    { key: 'owner', header: 'Owner', render: (row) => displayName(row.employeeId || row.raisedById || row.assignedToId || row.projectManagerId || row.reviewerId || row.hiringManagerId || row.departmentId) },
    { key: 'createdAt', header: 'Date', sortable: true, render: (row) => formatDate(row.date || row.createdAt || row.updatedAt) },
  ];
  const money = { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.netPay || row.grossSalary || row.totalPay || row.budget || row.purchaseCost) };
  if (reportId === 'payroll') return [common[0], common[2], money, common[1], common[3]];
  if (reportId === 'attendance') return [common[0], common[2], { key: 'shift', header: 'Shift', render: (row) => row.shiftName || row.status || '-' }, common[1], common[3]];
  if (reportId === 'leave') return [common[0], common[2], { key: 'type', header: 'Type', render: (row) => displayName(row.leaveTypeId || row.leaveType) }, common[1], common[3]];
  return common;
};

const ReportFilters = ({ filters, onChange, onReset }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search report rows, employees, departments"
      />
      <Input label="Start Date" type="date" value={filters.startDate} onChange={(event) => onChange({ startDate: event.target.value, page: 1 })} />
      <Input label="End Date" type="date" value={filters.endDate} onChange={(event) => onChange({ endDate: event.target.value, page: 1 })} />
      <Select label="Window" value={filters.window} onChange={(event) => {
        const days = Number(event.target.value);
        const start = new Date();
        start.setDate(start.getDate() - days);
        onChange({ window: event.target.value, startDate: toDateInput(start), endDate: toDateInput(new Date()), page: 1 });
      }}>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="180">Last 180 days</option>
        <option value="365">Last 12 months</option>
      </Select>
      <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
        <option value="-createdAt">Newest first</option>
        <option value="createdAt">Oldest first</option>
        <option value="status">Status A-Z</option>
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={onReset}>Reset</Button>
    </div>
  </Card>
);

const AnalyticsChart = ({ type, data, dataKey = 'value' }) => {
  if (!data?.length) return <EmptyState icon={BarChart3} title="No chart data" description="Analytics render as report data becomes available." />;
  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey="name" innerRadius={50} outerRadius={88} paddingAngle={3}>
            {data.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Scorecard = ({ executive, hr, manager, employee }) => {
  const kpi = executive?.kpi || {};
  const cards = [
    { title: 'Employees', value: kpi.employees?.total ?? hr?.employees ?? 0, icon: <Users size={20} />, trend: '+4.8%', direction: 'up' },
    { title: 'Active Projects', value: kpi.projects?.active ?? manager?.managedProjects ?? 0, icon: <Briefcase size={20} />, trend: 'Live', direction: 'neutral' },
    { title: 'Open Tickets', value: kpi.helpdesk?.open ?? employee?.openTickets ?? 0, icon: <Activity size={20} />, trend: '-6.2%', direction: 'down' },
    { title: 'Allocated Assets', value: kpi.assets?.allocated ?? 0, icon: <Building2 size={20} />, trend: 'Utilized', direction: 'neutral' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} trend={{ value: card.trend, direction: card.direction }} subtitle="Enterprise KPI" />
      ))}
    </div>
  );
};

const ReportCatalog = ({ onOpen }) => {
  const catalog = [
    ['attendance', 'Attendance Reports', 'Shift adherence, present/absent trends, overtime telemetry', Clock],
    ['leave', 'Leave Reports', 'Utilization, approvals, balance and absence patterns', CalendarDays],
    ['payroll', 'Payroll Reports', 'Compensation outflow, processed payroll and cost centers', Wallet],
    ['performance', 'Performance Reports', 'Review cycles, ratings, goals and calibration telemetry', Award],
    ['recruitment', 'Recruitment Reports', 'Candidate funnel, sourcing channels and hiring velocity', Users],
    ['departments', 'Department Reports', 'Department health, employee distribution and workload mix', Building2],
    ['organization', 'Organization Reports', 'Organization profile, settings and governance posture', Briefcase],
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {catalog.map(([id, title, desc, Icon]) => (
        <Card key={id} onClick={() => onOpen(id)} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-[#2563eb] dark:border-blue-900 dark:bg-blue-500/10">
              <Icon size={20} />
            </div>
            <Badge variant="info">Live</Badge>
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#191b23] dark:text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#434655] dark:text-slate-400">{desc}</p>
          <div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0]/70 pt-3 text-xs text-[#737686]">
            <span>ETL-ready report suite</span>
            <Download size={14} />
          </div>
        </Card>
      ))}
    </div>
  );
};

const ExportModal = ({ isOpen, onClose, report, filters, previewRows, onExport, isLoading }) => {
  const [format, setFormat] = useState('CSV');
  const [includeCharts, setIncludeCharts] = useState(true);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Reports" subtitle="Date range, filters, report preview, and export dispatch." size="xl">
      <ModalBody className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Input label="Start Date" type="date" value={filters.startDate} readOnly />
          <Input label="End Date" type="date" value={filters.endDate} readOnly />
          <Select label="Format" value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value="CSV">CSV</option>
            <option value="PDF">PDF preview</option>
            <option value="XLSX">Spreadsheet preview</option>
          </Select>
          <Select label="Charts" value={includeCharts ? 'yes' : 'no'} onChange={(event) => setIncludeCharts(event.target.value === 'yes')}>
            <option value="yes">Include charts</option>
            <option value="no">Tables only</option>
          </Select>
        </div>
        <Card>
          <CardHeader title="Report Preview" subtitle={`${report.label} - first ${Math.min(5, previewRows.length)} rows`} />
          <CardBody>
            <Table columns={getColumnsForReport(report.id)} rows={previewRows.slice(0, 5)} emptyTitle="No preview rows" emptySubtitle="Run the report to populate export preview." getRowKey={(row, index) => getId(row) || index} />
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<Download size={15} />} isLoading={isLoading} onClick={() => onExport({ format, includeCharts })}>Export</Button>
      </ModalFooter>
    </Modal>
  );
};

const DashboardView = ({ executive, hr, manager, employee, reports, onOpen, onExport }) => {
  const totalRows = Object.values(reports).reduce((sum, report) => sum + (Array.isArray(report?.items) ? report.items.length : 0), 0);
  const domainData = Object.entries(reports).map(([key, report]) => ({ name: key, value: report.total || (Array.isArray(report?.items) ? report.items.length : 0) }));
  const trendData = monthTrend(Object.values(reports).flatMap((report) => toArray(report?.items)));
  return (
    <div className="space-y-6">
      <Scorecard executive={executive} hr={hr} manager={manager} employee={employee} />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ChartCard title="Executive Workforce Trend" subtitle="Six-month report volume trend" height="300px" action={<Button size="sm" variant="secondary" leftIcon={<Download size={14} />} onClick={onExport}>Export</Button>}>
          <AnalyticsChart type="area" data={trendData} />
        </ChartCard>
        <ChartCard title="Domain Mix" subtitle={`${totalRows} report rows in scope`} height="300px">
          <AnalyticsChart type="pie" data={domainData.filter((item) => item.value > 0)} />
        </ChartCard>
      </div>
      <Card>
        <CardHeader title="Reports Dashboard" subtitle="Domain report suites and automated BI catalogs" action={<Badge variant="info">{Object.keys(reports).length} suites</Badge>} />
        <CardBody><ReportCatalog onOpen={onOpen} /></CardBody>
      </Card>
    </div>
  );
};

const ReportView = ({ report, page, rows, isLoading, filters, onFiltersChange, onReset, onPageChange, onExport }) => {
  const byStatus = groupCount(rows, (row) => row.status || row.attendanceStatus || row.leaveStatus || row.payrollStatus || row.projectStatus || row.taskStatus || row.ticketStatus || row.reviewStatus || row.recruitmentStatus || row.assetStatus);
  const byOwner = groupCount(rows, (row) => row.departmentId || row.employeeId || row.raisedById || row.assignedToId || row.projectManagerId || row.reviewerId || row.hiringManagerId);
  const trendData = monthTrend(rows);
  const columns = getColumnsForReport(report.id);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Records" value={page.total || rows.length} icon={report.icon} trend={{ value: 'Live API', direction: 'neutral' }} subtitle="Report scope" />
        <StatCard title="Completed" value={rows.filter((row) => statusVariant(row.status || row.ticketStatus || row.reviewStatus || row.recruitmentStatus || row.payrollStatus) === 'success').length} icon={<CheckCircle2 size={20} />} trend={{ value: '+2.1%', direction: 'up' }} subtitle="Healthy rows" />
        <StatCard title="Pending" value={rows.filter((row) => statusVariant(row.status || row.ticketStatus || row.reviewStatus || row.recruitmentStatus || row.payrollStatus) === 'warning').length} icon={<Clock size={20} />} trend={{ value: 'Watch', direction: 'neutral' }} subtitle="Open work" />
        <StatCard title="Export Ready" value={rows.length} icon={<FileSpreadsheet size={20} />} trend={{ value: 'CSV', direction: 'neutral' }} subtitle="Preview rows" />
      </div>
      <ReportFilters filters={filters} onChange={onFiltersChange} onReset={onReset} />
      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard title={`${report.label} Trend`} subtitle="Report volume over time" height="260px" className="xl:col-span-2">
          <AnalyticsChart type="line" data={trendData} />
        </ChartCard>
        <ChartCard title="Status Distribution" subtitle="Current state mix" height="260px">
          <AnalyticsChart type="pie" data={byStatus} />
        </ChartCard>
      </div>
      <ChartCard title="Department / Owner Analytics" subtitle="Top organizational segments by record volume" height="280px">
        <AnalyticsChart type="bar" data={byOwner} />
      </ChartCard>
      <Card>
        <CardHeader title={report.label} subtitle="Searchable, sortable report table with filters and export action" action={<Button variant="primary" size="sm" leftIcon={<Download size={14} />} onClick={onExport}>Export</Button>} />
        <CardBody className="space-y-3">
          {isLoading ? <Skeleton className="h-72" /> : <Table columns={columns} rows={rows} emptyTitle={`No ${report.label.toLowerCase()} rows`} emptySubtitle="Rows matching the selected date range and filters will appear here." getRowKey={(row, index) => getId(row) || index} />}
          <Pagination currentPage={page.page} totalPages={page.totalPages} totalItems={page.total} itemsPerPage={page.limit || PAGE_SIZE} onPageChange={onPageChange} />
        </CardBody>
      </Card>
    </div>
  );
};

const OrganizationReportView = ({ organization, departments, employees, filters, onFiltersChange, onReset, onExport }) => {
  const deptRows = toArray(departments?.items).filter((department) => {
    if (!filters.search.trim()) return true;
    return [department.name, department.code, department.description].some((value) => String(value || '').toLowerCase().includes(filters.search.toLowerCase()));
  });
  const deptData = groupCount(toArray(employees?.items), (employee) => employee.departmentId || 'No department');
  const columns = [
    { key: 'name', header: 'Department', sortable: true, render: (row) => <div><p className="font-semibold">{row.name}</p><p className="text-xs text-[#737686]">{row.code || getId(row)}</p></div> },
    { key: 'description', header: 'Description', render: (row) => row.description || '-' },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusVariant(row.status)}>{row.status || 'active'}</Badge> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Organization" value={organization.name || 'Current Org'} icon={<Building2 size={20} />} subtitle={organization.industry || 'Enterprise'} />
        <StatCard title="Departments" value={departments.total || departments.items.length} icon={<Briefcase size={20} />} subtitle="Org units" />
        <StatCard title="Employees" value={employees.total || employees.items.length} icon={<Users size={20} />} subtitle="Visible records" />
        <StatCard title="Governance" value={organization.status || 'Active'} icon={<Activity size={20} />} subtitle="System posture" />
      </div>
      <ReportFilters filters={filters} onChange={onFiltersChange} onReset={onReset} />
      <ChartCard title="Department Analytics" subtitle="Employee distribution by department" height="300px">
        <AnalyticsChart type="bar" data={deptData} />
      </ChartCard>
      <Card>
        <CardHeader title="Organization Reports" subtitle="Department directory and organization analytics" action={<Button variant="primary" size="sm" leftIcon={<Download size={14} />} onClick={onExport}>Export</Button>} />
        <CardBody><Table columns={columns} rows={deptRows} emptyTitle="No departments found" getRowKey={(row, index) => getId(row) || index} /></CardBody>
      </Card>
    </div>
  );
};

export const ReportsModule = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exportOpen, setExportOpen] = useState(false);
  const [exportReport, setExportReport] = useState(null);
  const [filters, setFilters] = useState({ search: '', startDate: defaultStart(), endDate: toDateInput(new Date()), window: '90', sort: '-createdAt', page: 1 });
  const reportConfig = useMemo(() => ({
    attendance: { id: 'attendance', label: 'Attendance Reports', endpoint: REPORT_ENDPOINTS.attendance, icon: <Clock size={20} /> },
    leave: { id: 'leave', label: 'Leave Reports', endpoint: REPORT_ENDPOINTS.leave, icon: <CalendarDays size={20} /> },
    payroll: { id: 'payroll', label: 'Payroll Reports', endpoint: REPORT_ENDPOINTS.payroll, icon: <Wallet size={20} /> },
    performance: { id: 'performance', label: 'Performance Reports', endpoint: REPORT_ENDPOINTS.performance, icon: <Award size={20} /> },
    recruitment: { id: 'recruitment', label: 'Recruitment Reports', endpoint: REPORT_ENDPOINTS.recruitment, icon: <Users size={20} /> },
    departments: { id: 'departments', label: 'Department Reports', endpoint: REPORT_ENDPOINTS.departments, icon: <Building2 size={20} /> },
    organization: { id: 'organization', label: 'Organization Reports', endpoint: REPORT_ENDPOINTS.organization, icon: <Briefcase size={20} /> },
  }), []);

  const reportQueryParams = useMemo(() => ({
    page: filters.page,
    limit: PAGE_SIZE,
    startDate: filters.startDate,
    endDate: filters.endDate,
    search: filters.search,
    sort: filters.sort,
  }), [filters]);

  const executiveQuery = useQuery({ queryKey: ['reports-dashboard-executive'], queryFn: () => axios.get('/reports/dashboard/executive') });
  const hrQuery = useQuery({ queryKey: ['reports-dashboard-hr'], queryFn: () => axios.get('/reports/dashboard/hr') });
  const managerQuery = useQuery({ queryKey: ['reports-dashboard-manager'], queryFn: () => axios.get('/reports/dashboard/manager') });
  const employeeQuery = useQuery({ queryKey: ['reports-dashboard-employee'], queryFn: () => axios.get('/reports/dashboard/employee') });

  const allReportsQueries = {
    attendance: useQuery({ queryKey: ['report-preview', 'attendance', reportQueryParams], queryFn: () => axios.get(`${REPORT_ENDPOINTS.attendance}?${buildQueryString(reportQueryParams)}`) }),
    leave: useQuery({ queryKey: ['report-preview', 'leave', reportQueryParams], queryFn: () => axios.get(`${REPORT_ENDPOINTS.leave}?${buildQueryString(reportQueryParams)}`) }),
    payroll: useQuery({ queryKey: ['report-preview', 'payroll', reportQueryParams], queryFn: () => axios.get(`${REPORT_ENDPOINTS.payroll}?${buildQueryString(reportQueryParams)}`) }),
    performance: useQuery({ queryKey: ['report-preview', 'performance', reportQueryParams], queryFn: () => axios.get(`${REPORT_ENDPOINTS.performance}?${buildQueryString({ page: filters.page, limit: PAGE_SIZE, sort: filters.sort })}`) }),
    recruitment: useQuery({ queryKey: ['report-preview', 'recruitment', reportQueryParams], queryFn: () => axios.get(`${REPORT_ENDPOINTS.recruitment}?${buildQueryString({ page: filters.page, limit: PAGE_SIZE, search: filters.search, sort: filters.sort })}`) }),
    departments: useQuery({ queryKey: ['report-preview', 'departments', filters.search], queryFn: () => axios.get(`${REPORT_ENDPOINTS.departments}?${buildQueryString({ page: filters.page, limit: PAGE_SIZE, search: filters.search })}`) }),
    organization: useQuery({ queryKey: ['report-preview', 'organization'], queryFn: () => axios.get(REPORT_ENDPOINTS.organization) }),
  };
  const employeesQuery = useQuery({ queryKey: ['reports-employees-summary'], queryFn: () => axios.get('/employees?limit=200') });

  const reports = Object.fromEntries(Object.entries(allReportsQueries).map(([key, query]) => [key, normalizePaged(query.data)]));
  const currentReport = reportConfig[activeTab] || reportConfig.attendance;
  const currentPage = reports[activeTab] || { items: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };
  const currentRows = toArray(currentPage?.items).filter((row) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return Object.values(row).some((value) => flattenValue(value).toLowerCase().includes(query));
  });
  const activeQuery = allReportsQueries[activeTab];

  const resetFilters = () => setFilters({ search: '', startDate: defaultStart(), endDate: toDateInput(new Date()), window: '90', sort: '-createdAt', page: 1 });
  const openExport = (report = currentReport) => {
    setExportReport(report);
    setExportOpen(true);
  };

  const exportMutation = useMutation({
    mutationFn: async () => {
      const report = exportReport || currentReport;
      const params = report.id === 'performance' || report.id === 'recruitment' || report.id === 'departments' || report.id === 'organization'
        ? { limit: 10000, search: filters.search, sort: filters.sort }
        : { ...reportQueryParams, export: 'true', limit: 10000 };
      const response = await axios.get(`${report.endpoint}?${buildQueryString(params)}`);
      return { report, rows: normalizePaged(response).items };
    },
    onSuccess: ({ report, rows }) => {
      downloadTextFile(`${report.id}-report-${filters.startDate}-to-${filters.endDate}.csv`, makeCsv(rows));
      setExportOpen(false);
    },
  });

  const dashboardContent = (
    <DashboardView
      executive={normalizeRecord(executiveQuery.data)}
      hr={normalizeRecord(hrQuery.data)}
      manager={normalizeRecord(managerQuery.data)}
      employee={normalizeRecord(employeeQuery.data)}
      reports={reports}
      onOpen={setActiveTab}
      onExport={() => openExport(reportConfig.attendance)}
    />
  );

  const reportContent = activeTab === 'organization' || activeTab === 'departments' ? (
    <OrganizationReportView
      organization={normalizeRecord(allReportsQueries.organization.data)}
      departments={reports.departments}
      employees={normalizePaged(employeesQuery.data)}
      filters={filters}
      onFiltersChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      onReset={resetFilters}
      onExport={() => openExport(activeTab === 'organization' ? reportConfig.organization : reportConfig.departments)}
    />
  ) : (
    <ReportView
      report={currentReport}
      page={currentPage}
      rows={currentRows}
      isLoading={activeQuery?.isLoading}
      filters={filters}
      onFiltersChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      onReset={resetFilters}
      onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      onExport={() => openExport(currentReport)}
    />
  );

  const tabs = [
    { id: 'dashboard', label: 'Reports Dashboard', icon: <BarChart3 size={15} />, content: dashboardContent },
    { id: 'attendance', label: 'Attendance', icon: <Clock size={15} />, content: reportContent },
    { id: 'leave', label: 'Leave', icon: <CalendarDays size={15} />, content: reportContent },
    { id: 'payroll', label: 'Payroll', icon: <Wallet size={15} />, content: reportContent },
    { id: 'performance', label: 'Performance', icon: <Award size={15} />, content: reportContent },
    { id: 'recruitment', label: 'Recruitment', icon: <Users size={15} />, content: reportContent },
    { id: 'departments', label: 'Department', icon: <Building2 size={15} />, content: reportContent },
    { id: 'organization', label: 'Organization', icon: <Briefcase size={15} />, content: reportContent },
  ];

  const hasError = Object.values(allReportsQueries).some((query) => query.isError) || executiveQuery.isError;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Reports & Analytics"
        description="Executive dashboards, report catalogs, KPI widgets, trend charts, filters, date ranges, previews, and export actions."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Reports' }]}
        primaryAction={<Button variant="primary" leftIcon={<Download size={16} />} onClick={() => openExport(currentReport)}>Export Reports</Button>}
        secondaryAction={<Button variant="secondary" leftIcon={<Filter size={16} />} onClick={() => setActiveTab('dashboard')}>BI Center</Button>}
      />
      {hasError ? (
        <Card className="mb-6 p-4 text-sm text-rose-700 dark:text-rose-400">
          Some report endpoints are unavailable for the current role/session. Available data will continue to render.
        </Card>
      ) : null}
      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#434655] dark:text-slate-400">
          <LineChartIcon size={15} className="text-[#2563eb]" />
          <span>Line, bar, pie, trend, and summary analytics</span>
          <PieChartIcon size={15} className="text-[#2563eb]" />
          <span>Date window: {filters.startDate} to {filters.endDate}</span>
          <Search size={15} className="text-[#2563eb]" />
          <span>{filters.search || 'No search filter'}</span>
          <TrendingUp size={15} className="text-[#2563eb]" />
          <span>Precision Enterprise BI layout</span>
        </div>
      </Card>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(tab) => { setActiveTab(tab); setFilters((prev) => ({ ...prev, page: 1 })); }} variant="pills" />
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        report={exportReport || currentReport}
        filters={filters}
        previewRows={currentRows}
        onExport={() => exportMutation.mutate()}
        isLoading={exportMutation.isPending}
      />
      {exportMutation.isError ? (
        <Card className="mt-4 p-4 text-sm text-rose-700">
          {exportMutation.error?.response?.data?.message || 'Unable to export this report for the current session.'}
        </Card>
      ) : null}
    </div>
  );
};

export default ReportsModule;
