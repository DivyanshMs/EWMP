import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Archive,
  CheckCircle2,
  Download,
  Eye,
  History,
  Laptop,
  LayoutDashboard,
  ListFilter,
  MoreHorizontal,
  PackageCheck,
  Plus,
  RefreshCw,
  RotateCcw,
  UserPlus,
  Wrench,
  XCircle,
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
const ASSET_TYPES = ['Laptop', 'Desktop', 'Monitor', 'Mobile Phone', 'Keyboard', 'Mouse', 'Furniture', 'Vehicle', 'Software License', 'Other'];
const ASSET_STATUSES = ['Available', 'Allocated', 'Under Maintenance', 'Retired', 'Lost'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

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
const getCurrentEmployee = (asset) => asset?.currentAllocationId?.employeeId;
const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};
const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
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
const statusVariant = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('available') || normalized.includes('returned') || normalized.includes('excellent')) return 'success';
  if (normalized.includes('allocated') || normalized.includes('active') || normalized.includes('good')) return 'info';
  if (normalized.includes('maintenance') || normalized.includes('fair')) return 'warning';
  if (normalized.includes('retired') || normalized.includes('lost') || normalized.includes('poor')) return 'danger';
  return 'pending';
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
    slate: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700',
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

const AssetFilters = ({ filters, onChange }) => (
  <Card className="p-4">
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
      <SearchInput
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value, page: 1 })}
        onClear={() => onChange({ search: '', page: 1 })}
        placeholder="Search asset, tag, serial"
      />
      <Select label="Asset Type" value={filters.assetType} onChange={(event) => onChange({ assetType: event.target.value, page: 1 })}>
        <option value="">All types</option>
        {ASSET_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
      </Select>
      <Select label="Status" value={filters.assetStatus} onChange={(event) => onChange({ assetStatus: event.target.value, page: 1 })}>
        <option value="">All status</option>
        {ASSET_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
      </Select>
      <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: 1 })}>
        <option value="-createdAt">Newest first</option>
        <option value="assetTag">Asset tag A-Z</option>
        <option value="name">Name A-Z</option>
        <option value="-purchaseCost">Highest cost</option>
      </Select>
      <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => onChange({ search: '', assetType: '', assetStatus: '', sort: '-createdAt', page: 1 })}>Reset</Button>
    </div>
  </Card>
);

const AssetModal = ({ isOpen, onClose, record, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ assetTag: '', name: '', assetType: 'Laptop', brand: '', model: '', serialNumber: '', purchaseDate: '', purchaseCost: '', warrantyExpiry: '', assetStatus: 'Available', condition: 'Good', imageUrl: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({
      assetTag: record?.assetTag || '',
      name: record?.name || '',
      assetType: record?.assetType || 'Laptop',
      brand: record?.brand || '',
      model: record?.model || '',
      serialNumber: record?.serialNumber || '',
      purchaseDate: toDateInput(record?.purchaseDate),
      purchaseCost: record?.purchaseCost ?? '',
      warrantyExpiry: toDateInput(record?.warrantyExpiry),
      assetStatus: record?.assetStatus || 'Available',
      condition: record?.condition || 'Good',
      imageUrl: record?.imageUrl || '',
      notes: record?.notes || '',
    });
  }, [isOpen, record]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const submit = () => {
    if (!form.assetTag.trim()) return setError('Asset tag is required.');
    if (!form.name.trim() || form.name.trim().length < 2) return setError('Asset name must be at least 2 characters.');
    const payload = {
      assetTag: form.assetTag.trim().toUpperCase(),
      name: form.name.trim(),
      assetType: form.assetType,
      brand: form.brand.trim() || undefined,
      model: form.model.trim() || undefined,
      serialNumber: form.serialNumber.trim() || undefined,
      purchaseDate: form.purchaseDate || undefined,
      purchaseCost: toNumber(form.purchaseCost, undefined),
      warrantyExpiry: form.warrantyExpiry || undefined,
      assetStatus: form.assetStatus,
      condition: form.condition,
      imageUrl: form.imageUrl.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={record ? 'Edit Asset' : 'Register Asset'} subtitle="Asset tag, inventory metadata, warranty, status, and condition." size="xl">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Asset Tag" required value={form.assetTag} onChange={(event) => update({ assetTag: event.target.value.toUpperCase() })} disabled={isLoading} />
          <Input label="Asset Name" required value={form.name} onChange={(event) => update({ name: event.target.value })} disabled={isLoading} />
          <Select label="Asset Type" value={form.assetType} onChange={(event) => update({ assetType: event.target.value })} disabled={isLoading}>
            {ASSET_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
          <Select label="Status" value={form.assetStatus} onChange={(event) => update({ assetStatus: event.target.value })} disabled={isLoading}>
            {ASSET_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </Select>
          <Input label="Brand" value={form.brand} onChange={(event) => update({ brand: event.target.value })} disabled={isLoading} />
          <Input label="Model" value={form.model} onChange={(event) => update({ model: event.target.value })} disabled={isLoading} />
          <Input label="Serial Number" value={form.serialNumber} onChange={(event) => update({ serialNumber: event.target.value })} disabled={isLoading} />
          <Select label="Condition" value={form.condition} onChange={(event) => update({ condition: event.target.value })} disabled={isLoading}>
            {CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
          </Select>
          <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={(event) => update({ purchaseDate: event.target.value })} disabled={isLoading} />
          <Input label="Warranty Expiry" type="date" value={form.warrantyExpiry} onChange={(event) => update({ warrantyExpiry: event.target.value })} disabled={isLoading} />
          <Input label="Purchase Cost" type="number" min="0" value={form.purchaseCost} onChange={(event) => update({ purchaseCost: event.target.value })} disabled={isLoading} />
          <Input label="Image URL" type="url" value={form.imageUrl} onChange={(event) => update({ imageUrl: event.target.value })} disabled={isLoading} />
        </div>
        <Textarea label="Notes" rows={4} value={form.notes} onChange={(event) => update({ notes: event.target.value })} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" isLoading={isLoading} onClick={submit}>{record ? 'Save Asset' : 'Register Asset'}</Button>
      </ModalFooter>
    </Modal>
  );
};

const AllocationModal = ({ isOpen, onClose, asset, employees, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ employeeId: '', allocationDate: toDateInput(new Date()), expectedReturnDate: '', conditionOnIssue: 'Good', allocationNotes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({ employeeId: '', allocationDate: toDateInput(new Date()), expectedReturnDate: '', conditionOnIssue: asset?.condition || 'Good', allocationNotes: '' });
  }, [isOpen, asset]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const submit = () => {
    if (!asset) return setError('Select an available asset first.');
    if (!form.employeeId || !form.allocationDate) return setError('Employee and allocation date are required.');
    onSubmit({
      employeeId: form.employeeId,
      allocationDate: form.allocationDate,
      expectedReturnDate: form.expectedReturnDate || undefined,
      conditionOnIssue: form.conditionOnIssue,
      allocationNotes: form.allocationNotes.trim() || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Asset" subtitle={asset ? `${asset.assetTag} - ${asset.name}` : 'Select an asset from inventory'} size="lg">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Employee" required value={form.employeeId} onChange={(event) => update({ employeeId: event.target.value })} disabled={isLoading}>
            <option value="">Select employee</option>
            <OptionList items={employees} />
          </Select>
          <Input label="Allocation Date" required type="date" value={form.allocationDate} onChange={(event) => update({ allocationDate: event.target.value })} disabled={isLoading} />
          <Input label="Expected Return" type="date" value={form.expectedReturnDate} onChange={(event) => update({ expectedReturnDate: event.target.value })} disabled={isLoading} />
          <Select label="Condition on Issue" value={form.conditionOnIssue} onChange={(event) => update({ conditionOnIssue: event.target.value })} disabled={isLoading}>
            {CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
          </Select>
        </div>
        <Textarea label="Allocation Notes" rows={4} value={form.allocationNotes} onChange={(event) => update({ allocationNotes: event.target.value })} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<UserPlus size={15} />} isLoading={isLoading} onClick={submit}>Assign Asset</Button>
      </ModalFooter>
    </Modal>
  );
};

const ReturnModal = ({ isOpen, onClose, allocation, onSubmit, isLoading }) => {
  const [form, setForm] = useState({ actualReturnDate: toDateInput(new Date()), conditionOnReturn: 'Good', returnNotes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setForm({ actualReturnDate: toDateInput(new Date()), conditionOnReturn: 'Good', returnNotes: '' });
  }, [isOpen]);

  const submit = () => {
    if (!allocation) return setError('Select an active allocation first.');
    if (!form.actualReturnDate) return setError('Return date is required.');
    onSubmit({ actualReturnDate: form.actualReturnDate, conditionOnReturn: form.conditionOnReturn, returnNotes: form.returnNotes.trim() || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Return Asset" subtitle={allocation ? `${displayName(allocation.assetId)} from ${displayName(allocation.employeeId)}` : 'Select active allocation'} size="lg">
      <ModalBody className="space-y-4">
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Actual Return Date" required type="date" value={form.actualReturnDate} onChange={(event) => setForm((prev) => ({ ...prev, actualReturnDate: event.target.value }))} disabled={isLoading} />
          <Select label="Condition on Return" value={form.conditionOnReturn} onChange={(event) => setForm((prev) => ({ ...prev, conditionOnReturn: event.target.value }))} disabled={isLoading}>
            {CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
          </Select>
        </div>
        <Textarea label="Return Notes" rows={4} value={form.returnNotes} onChange={(event) => setForm((prev) => ({ ...prev, returnNotes: event.target.value }))} disabled={isLoading} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="primary" leftIcon={<RotateCcw size={15} />} isLoading={isLoading} onClick={submit}>Process Return</Button>
      </ModalFooter>
    </Modal>
  );
};

const AssetsTable = ({ rows, isLoading, sort, onSort, onView, onEdit, onAllocate }) => {
  const columns = [
    {
      key: 'assetTag',
      header: 'Asset',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#191b23] dark:text-white">{row.name}</p>
          <p className="text-xs text-[#737686]">{row.assetTag} - {row.serialNumber || 'No serial'}</p>
        </div>
      ),
    },
    { key: 'assetType', header: 'Type', sortable: true },
    {
      key: 'currentAllocationId',
      header: 'Assigned To',
      render: (row) => {
        const employee = getCurrentEmployee(row);
        return (
          <div className="flex items-center gap-2">
            <Avatar name={displayName(employee)} size="xs" />
            <span>{displayName(employee)}</span>
          </div>
        );
      },
    },
    { key: 'condition', header: 'Condition', sortable: true, render: (row) => <Badge variant={statusVariant(row.condition)}>{row.condition}</Badge> },
    { key: 'warrantyExpiry', header: 'Warranty', sortable: true, render: (row) => formatDate(row.warrantyExpiry) },
    { key: 'assetStatus', header: 'Status', sortable: true, render: (row) => <Badge variant={statusVariant(row.assetStatus)}>{row.assetStatus}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" leftIcon={<Eye size={14} />} onClick={() => onView(row)}>View</Button>
          <Button size="sm" variant="ghost" leftIcon={<MoreHorizontal size={14} />} onClick={() => onEdit(row)}>Edit</Button>
          <Button size="sm" variant="ghost" disabled={row.assetStatus !== 'Available'} onClick={() => onAllocate(row)}>Assign</Button>
        </div>
      ),
    },
  ];
  return <Table columns={columns} rows={rows} isLoading={isLoading} sortColumn={sort.column} sortDirection={sort.direction} onSort={onSort} emptyTitle="No assets found" emptySubtitle="Inventory records matching this view will appear here." emptyIcon={Laptop} getRowKey={(row, index) => getId(row) || index} />;
};

const AllocationTable = ({ rows, isLoading, onReturn }) => {
  const columns = [
    { key: 'assetId', header: 'Asset', render: (row) => <div><p className="font-semibold text-[#191b23] dark:text-white">{displayName(row.assetId)}</p><p className="text-xs text-[#737686]">{row.assetId?.assetTag || '-'}</p></div> },
    { key: 'employeeId', header: 'Employee', render: (row) => <div className="flex items-center gap-2"><Avatar name={displayName(row.employeeId)} size="xs" /><span>{displayName(row.employeeId)}</span></div> },
    { key: 'allocationDate', header: 'Issued', render: (row) => formatDate(row.allocationDate) },
    { key: 'expectedReturnDate', header: 'Expected Return', render: (row) => formatDate(row.expectedReturnDate) },
    { key: 'allocationStatus', header: 'Status', render: (row) => <Badge variant={statusVariant(row.allocationStatus)}>{row.allocationStatus}</Badge> },
    { key: 'actions', header: 'Actions', render: (row) => <Button size="sm" variant="ghost" disabled={row.allocationStatus !== 'Active'} onClick={() => onReturn(row)}>Return</Button> },
  ];
  return <Table columns={columns} rows={rows} isLoading={isLoading} emptyTitle="No allocation history" emptySubtitle="Asset assignment and return events will appear here." emptyIcon={History} getRowKey={(row, index) => getId(row) || index} />;
};

const AssetDetails = ({ asset, detail, allocations, allocationsLoading, onEdit, onAllocate, onReturn }) => {
  const current = detail || asset;
  if (!current) return <EmptyState icon={Laptop} title="Select an asset" description="Open an asset from inventory to review details, assignment, warranty, and allocation history." />;
  const employee = getCurrentEmployee(current);
  const warrantyDays = current.warrantyExpiry ? Math.ceil((new Date(current.warrantyExpiry) - new Date()) / 86400000) : null;
  const lifecycle = [
    ['Registered', formatDate(current.createdAt), true],
    ['Purchased', formatDate(current.purchaseDate), Boolean(current.purchaseDate)],
    ['Allocated', employee ? displayName(employee) : 'Not allocated', Boolean(employee)],
    ['Warranty', warrantyDays === null ? 'No warranty data' : `${warrantyDays} days remaining`, Boolean(current.warrantyExpiry)],
    ['Current Status', current.assetStatus, true],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader title={current.name} subtitle={`${current.assetTag} - ${current.assetType}`} action={<Badge variant={statusVariant(current.assetStatus)}>{current.assetStatus}</Badge>} />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="Purchase Cost" value={formatCurrency(current.purchaseCost)} helper="Recorded acquisition value" icon={<Download size={20} />} />
            <MetricCard title="Condition" value={current.condition} helper="Latest asset condition" icon={<CheckCircle2 size={20} />} tone="green" />
            <MetricCard title="Warranty" value={warrantyDays === null ? '-' : warrantyDays} helper="Days remaining" icon={<Wrench size={20} />} tone={warrantyDays !== null && warrantyDays < 30 ? 'rose' : 'amber'} />
            <MetricCard title="Custodian" value={employee ? displayName(employee) : 'Available'} helper="Current assignment owner" icon={<UserPlus size={20} />} tone="rose" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Asset Profile" subtitle="Hardware, warranty, and CMDB metadata" action={<Button size="sm" variant="secondary" onClick={() => onEdit(current)}>Edit</Button>} />
              <CardBody className="space-y-3 text-sm">
                {[
                  ['Brand', current.brand || '-'],
                  ['Model', current.model || '-'],
                  ['Serial Number', current.serialNumber || '-'],
                  ['Location', displayName(current.locationId, '-')],
                  ['Purchase Date', formatDate(current.purchaseDate)],
                  ['Warranty Expiry', formatDate(current.warrantyExpiry)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded border border-[#e2e8f0] px-3 py-2 dark:border-slate-800">
                    <span className="text-[#434655] dark:text-slate-400">{label}</span>
                    <span className="font-semibold text-[#191b23] dark:text-white">{value}</span>
                  </div>
                ))}
                {current.notes ? <p className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#434655] dark:bg-[#0d0d0d] dark:text-slate-400">{current.notes}</p> : null}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Allocation History" subtitle="Assignment, return, and custody trail" />
              <CardBody>
                <AllocationTable rows={allocations} isLoading={allocationsLoading} onReturn={onReturn} />
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Asset Timeline" subtitle="Lifecycle and status trail" action={<div className="flex gap-2"><Button size="sm" variant="primary" disabled={current.assetStatus !== 'Available'} onClick={() => onAllocate(current)}>Assign</Button></div>} />
        <CardBody>
          {lifecycle.map(([label, detailText, done], index) => (
            <div key={label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={done ? 'flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white' : 'flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] text-[#737686]'}>
                  {done ? <CheckCircle2 size={15} /> : index + 1}
                </span>
                {index < lifecycle.length - 1 ? <span className="h-9 w-px bg-[#e2e8f0] dark:bg-slate-800" /> : null}
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

export const AssetsModule = ({ initialView = 'dashboard' }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialView);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetModal, setAssetModal] = useState(null);
  const [allocationAsset, setAllocationAsset] = useState(null);
  const [returnAllocation, setReturnAllocation] = useState(null);
  const [filters, setFilters] = useState({ search: '', assetType: '', assetStatus: '', sort: '-createdAt', page: 1 });
  const [sort, setSort] = useState({ column: 'createdAt', direction: 'desc' });

  const params = useMemo(() => ({ ...filters, limit: PAGE_SIZE, sort: sort.direction === 'asc' ? sort.column : `-${sort.column}` }), [filters, sort]);
  const assetsQuery = useQuery({ queryKey: ['assets', params], queryFn: () => axios.get(`/assets?${buildQueryString(params)}`) });
  const allAssetsQuery = useQuery({ queryKey: ['assets-summary'], queryFn: () => axios.get('/assets?limit=100&sort=-createdAt') });
  const detailQuery = useQuery({ queryKey: ['asset-detail', getId(selectedAsset)], queryFn: () => axios.get(`/assets/${getId(selectedAsset)}`), enabled: Boolean(getId(selectedAsset)) });
  const allocationsQuery = useQuery({ queryKey: ['asset-allocations', getId(selectedAsset)], queryFn: () => axios.get(`/asset-allocations?${buildQueryString({ assetId: getId(selectedAsset), limit: 50 })}`), enabled: Boolean(getId(selectedAsset)) });
  const activeAllocationsQuery = useQuery({ queryKey: ['asset-allocations-active'], queryFn: () => axios.get('/asset-allocations?allocationStatus=Active&limit=100') });
  const employeesQuery = useQuery({ queryKey: ['employees-options'], queryFn: () => axios.get('/employees?limit=200') });

  const assetsPage = normalizePaged(assetsQuery.data);
  const summaryAssets = normalizePaged(allAssetsQuery.data).items;
  const detailAsset = unwrap(detailQuery.data);
  const allocations = normalizePaged(allocationsQuery.data).items;
  const activeAllocations = normalizePaged(activeAllocationsQuery.data).items;
  const employees = normalizeList(employeesQuery.data);

  const filteredAssets = assetsPage.items.filter((asset) => {
    if (!filters.search.trim()) return true;
    const query = filters.search.toLowerCase();
    return [asset.name, asset.assetTag, asset.serialNumber, asset.brand, asset.model].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const invalidateAssets = () => {
    queryClient.invalidateQueries({ queryKey: ['assets'] });
    queryClient.invalidateQueries({ queryKey: ['assets-summary'] });
    queryClient.invalidateQueries({ queryKey: ['asset-detail'] });
    queryClient.invalidateQueries({ queryKey: ['asset-allocations'] });
    queryClient.invalidateQueries({ queryKey: ['asset-allocations-active'] });
  };

  const assetMutation = useMutation({
    mutationFn: ({ record, payload }) => (record ? axios.put(`/assets/${getId(record)}`, payload) : axios.post('/assets', payload)),
    onSuccess: (response) => {
      const saved = unwrap(response);
      if (saved) setSelectedAsset(saved);
      setAssetModal(null);
      invalidateAssets();
    },
  });
  const allocateMutation = useMutation({
    mutationFn: ({ asset, payload }) => axios.post(`/assets/${getId(asset)}/allocate`, payload),
    onSuccess: () => {
      setAllocationAsset(null);
      invalidateAssets();
    },
  });
  const returnMutation = useMutation({
    mutationFn: ({ allocation, payload }) => axios.patch(`/asset-allocations/${getId(allocation)}/return`, payload),
    onSuccess: () => {
      setReturnAllocation(null);
      invalidateAssets();
    },
  });

  const handleSort = (column) => setSort((prev) => ({ column, direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc' }));
  const openAsset = (asset) => {
    setSelectedAsset(asset);
    setActiveTab('details');
  };

  const statusCount = (status) => summaryAssets.filter((asset) => asset.assetStatus === status).length;
  const stats = {
    total: allAssetsQuery.isLoading ? assetsPage.total : summaryAssets.length,
    allocated: statusCount('Allocated'),
    available: statusCount('Available'),
    maintenance: statusCount('Under Maintenance'),
    retired: statusCount('Retired'),
    lost: statusCount('Lost'),
  };

  const assetTable = (
    <>
      <AssetsTable
        rows={filteredAssets}
        isLoading={assetsQuery.isLoading}
        sort={sort}
        onSort={handleSort}
        onView={openAsset}
        onEdit={(asset) => setAssetModal(asset)}
        onAllocate={setAllocationAsset}
      />
      <Pagination currentPage={assetsPage.page} totalPages={assetsPage.totalPages} totalItems={assetsPage.total} itemsPerPage={assetsPage.limit || PAGE_SIZE} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </>
  );

  const categoryCounts = ASSET_TYPES.map((type) => ({ type, count: summaryAssets.filter((asset) => asset.assetType === type).length }));

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={15} />,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard title="Total Assets" value={stats.total} helper="CMDB inventory records" icon={<Laptop size={20} />} />
            <MetricCard title="Assigned" value={stats.allocated} helper="Assets in employee custody" icon={<UserPlus size={20} />} tone="green" />
            <MetricCard title="Available" value={stats.available} helper="Unallocated pool" icon={<PackageCheck size={20} />} tone="green" />
            <MetricCard title="Maintenance" value={stats.maintenance} helper="Action required" icon={<Wrench size={20} />} tone="amber" />
            <MetricCard title="Retired" value={stats.retired} helper="Decommissioned assets" icon={<Archive size={20} />} tone="slate" />
            <MetricCard title="Lost" value={stats.lost} helper="Incident records" icon={<XCircle size={20} />} tone="rose" />
          </div>
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#434655] dark:text-slate-400">
              <span className="mr-2">IT Admin Quick Actions:</span>
              <Button size="sm" variant="primary" leftIcon={<Plus size={14} />} onClick={() => setAssetModal({})}>Register Asset</Button>
              <Button size="sm" variant="secondary" leftIcon={<UserPlus size={14} />} disabled={!selectedAsset} onClick={() => setAllocationAsset(selectedAsset)}>Allocate Asset</Button>
              <Button size="sm" variant="secondary" leftIcon={<RotateCcw size={14} />} disabled={!activeAllocations.length} onClick={() => setReturnAllocation(activeAllocations[0])}>Return Asset</Button>
              <Button size="sm" variant="secondary" leftIcon={<Wrench size={14} />} onClick={() => setFilters((prev) => ({ ...prev, assetStatus: 'Under Maintenance', page: 1 }))}>Maintenance</Button>
              <Button size="sm" variant="secondary" leftIcon={<Download size={14} />}>Export CMDB</Button>
            </div>
          </Card>
          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader title="Asset Category Distribution" subtitle="Inventory tiles by asset type" />
              <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {categoryCounts.map((item) => {
                  const pct = Math.round((item.count / Math.max(1, summaryAssets.length)) * 100);
                  return (
                    <div key={item.type} className="rounded-lg border border-[#e2e8f0] p-3 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <Laptop size={17} className="text-[#2563eb]" />
                        <span className="font-mono text-lg font-bold text-[#191b23] dark:text-white">{item.count}</span>
                      </div>
                      <p className="mt-2 truncate text-xs font-semibold text-[#434655] dark:text-slate-400">{item.type}</p>
                      <Progress value={pct} size="sm" showValue={false} className="mt-2" />
                    </div>
                  );
                })}
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Warranty Expiry" subtitle="Assets needing renewal attention" />
              <CardBody className="space-y-3">
                {summaryAssets.filter((asset) => asset.warrantyExpiry).slice(0, 5).map((asset) => {
                  const days = Math.ceil((new Date(asset.warrantyExpiry) - new Date()) / 86400000);
                  return (
                    <button key={getId(asset)} type="button" onClick={() => openAsset(asset)} className="w-full rounded-lg border border-[#e2e8f0] p-3 text-left hover:bg-[#f8fafc] dark:border-slate-800 dark:hover:bg-[#161616]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#191b23] dark:text-white">{asset.name}</p>
                          <p className="text-xs text-[#737686]">{asset.assetTag} - expires {formatDate(asset.warrantyExpiry)}</p>
                        </div>
                        <Badge variant={days < 30 ? 'danger' : 'warning'}>{days}d</Badge>
                      </div>
                    </button>
                  );
                })}
                {!summaryAssets.length && !allAssetsQuery.isLoading ? <EmptyState icon={Laptop} title="No assets" description="Register assets to populate dashboard intelligence." /> : null}
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'inventory',
      label: 'Asset Inventory',
      icon: <ListFilter size={15} />,
      content: (
        <div className="space-y-4">
          <AssetFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} />
          {assetTable}
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Asset Details',
      icon: <Eye size={15} />,
      content: <AssetDetails asset={selectedAsset} detail={detailAsset} allocations={allocations} allocationsLoading={allocationsQuery.isLoading} onEdit={(asset) => setAssetModal(asset)} onAllocate={setAllocationAsset} onReturn={setReturnAllocation} />,
    },
    {
      id: 'allocation',
      label: 'Asset Allocation',
      icon: <UserPlus size={15} />,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Assign Asset" subtitle="Select an available asset and assign it to an employee." action={<Button variant="primary" disabled={!selectedAsset || selectedAsset.assetStatus !== 'Available'} onClick={() => setAllocationAsset(selectedAsset)}>Assign Selected</Button>} />
            <CardBody>{assetTable}</CardBody>
          </Card>
          <Card>
            <CardHeader title="Active Allocations" subtitle="Current employee assignment custody list" />
            <CardBody><AllocationTable rows={activeAllocations} isLoading={activeAllocationsQuery.isLoading} onReturn={setReturnAllocation} /></CardBody>
          </Card>
        </div>
      ),
    },
    {
      id: 'return',
      label: 'Return Asset',
      icon: <RotateCcw size={15} />,
      content: (
        <Card>
          <CardHeader title="Return Asset" subtitle="Process returns from active allocations." action={<Badge variant="info">{activeAllocations.length} active</Badge>} />
          <CardBody><AllocationTable rows={activeAllocations} isLoading={activeAllocationsQuery.isLoading} onReturn={setReturnAllocation} /></CardBody>
        </Card>
      ),
    },
    {
      id: 'history',
      label: 'Asset History',
      icon: <History size={15} />,
      content: (
        <Card>
          <CardHeader title="Asset History" subtitle="Allocation and return audit history" />
          <CardBody><AllocationTable rows={allocations.length ? allocations : activeAllocations} isLoading={allocationsQuery.isLoading || activeAllocationsQuery.isLoading} onReturn={setReturnAllocation} /></CardBody>
        </Card>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Assets"
        description="Enterprise asset inventory, allocation workflows, returns, warranty telemetry, and custody history."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Assets' }]}
        primaryAction={<Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setAssetModal({})}>Register Asset</Button>}
        secondaryAction={<Button variant="secondary" leftIcon={<UserPlus size={16} />} disabled={!selectedAsset || selectedAsset.assetStatus !== 'Available'} onClick={() => setAllocationAsset(selectedAsset)}>Assign Asset</Button>}
      />
      {assetsQuery.isError ? (
        <Card className="mb-6 p-4 text-sm text-rose-700 dark:text-rose-400">
          {assetsQuery.error?.response?.data?.message || 'Unable to load assets. Please retry after confirming your session.'}
        </Card>
      ) : null}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      <AssetModal isOpen={Boolean(assetModal)} onClose={() => setAssetModal(null)} record={getId(assetModal) ? assetModal : null} isLoading={assetMutation.isPending} onSubmit={(payload) => assetMutation.mutate({ record: getId(assetModal) ? assetModal : null, payload })} />
      <AllocationModal isOpen={Boolean(allocationAsset)} onClose={() => setAllocationAsset(null)} asset={allocationAsset} employees={employees} isLoading={allocateMutation.isPending} onSubmit={(payload) => allocateMutation.mutate({ asset: allocationAsset, payload })} />
      <ReturnModal isOpen={Boolean(returnAllocation)} onClose={() => setReturnAllocation(null)} allocation={returnAllocation} isLoading={returnMutation.isPending} onSubmit={(payload) => returnMutation.mutate({ allocation: returnAllocation, payload })} />
    </div>
  );
};

export default AssetsModule;
