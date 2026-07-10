import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  Edit,
  Eye,
  FileText,
  History,
  IdCard,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Users,
} from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
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
  SkeletonForm,
  SkeletonTable,
  Table,
  Tabs,
  Textarea,
} from '../../components/shared';

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  'SUPER_ADMIN',
  'ORG_ADMIN',
  'HR_MANAGER',
  'FINANCE',
  'MANAGER',
  'TEAM_LEAD',
  'EMPLOYEE',
  'IT_ADMIN',
  'AUDITOR',
];

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];
const EMPLOYMENT_STATUSES = ['Probation', 'Permanent', 'Notice Period', 'Resigned', 'Terminated'];
const DOCUMENT_TYPES = [
  'Aadhaar',
  'PAN',
  'Resume',
  'Offer Letter',
  'Experience Letter',
  'Educational Certificate',
  'Photograph',
  'Other',
];

const canManageRoles = new Set(['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']);

const normalizePaged = (payload) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: 1, limit: data.length || PAGE_SIZE, totalPages: 1 };
  }
  if (Array.isArray(data?.items)) {
    return {
      items: data.items,
      total: Number(data.total ?? data.items.length),
      page: Number(data.page ?? 1),
      limit: Number(data.limit ?? PAGE_SIZE),
      totalPages: Number(data.totalPages ?? Math.max(1, Math.ceil((data.total ?? data.items.length) / (data.limit ?? PAGE_SIZE)))),
    };
  }
  return { items: [], total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };
};

const normalizeList = (payload) => normalizePaged(payload).items;

const getRecordId = (record) => record?._id || record?.id;

const getName = (employee) =>
  [employee?.firstName, employee?.lastName].filter(Boolean).join(' ') || employee?.name || 'Unnamed employee';

const getRelationName = (value, fallback = 'Not assigned') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.name || value.title || value.code || getName(value);
};

const formatDate = (value) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
};

const dateForInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const currency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

const getErrorMessage = (error, fallback = 'Request failed. Please try again.') =>
  error?.response?.data?.message ||
  error?.response?.data?.error?.detail ||
  error?.message ||
  fallback;

const getStatusMeta = (employee) => {
  if (employee?.status === 'archived') return { label: 'Archived', variant: 'inactive' };
  if (employee?.status === 'inactive' || ['Resigned', 'Terminated'].includes(employee?.employmentStatus)) {
    return { label: 'Terminated', variant: 'danger' };
  }
  if (employee?.employmentStatus === 'Notice Period') return { label: 'On Leave', variant: 'warning' };
  return { label: 'Active', variant: 'active' };
};

const compactOptions = (items, labelGetter, valueGetter = getRecordId) => {
  const map = new Map();
  items.forEach((item) => {
    const value = valueGetter(item);
    const label = labelGetter(item);
    if (value && label) map.set(value, label);
  });
  return Array.from(map, ([value, label]) => ({ value, label }));
};

const buildEmployeePayload = (form, mode) => {
  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    mobile: form.mobile.trim(),
    departmentId: form.departmentId,
    designationId: form.designationId,
    joiningDate: form.joiningDate,
    employmentType: form.employmentType,
    basicSalary: Number(form.basicSalary || 0),
    gender: form.gender || undefined,
    dateOfBirth: form.dateOfBirth || null,
    bloodGroup: form.bloodGroup || undefined,
    address: {
      street: form.street.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      country: form.country.trim() || undefined,
      pincode: form.pincode.trim() || undefined,
    },
    emergencyContact: {
      name: form.emergencyName.trim() || undefined,
      phone: form.emergencyPhone.trim() || undefined,
      relation: form.emergencyRelation.trim() || undefined,
    },
  };

  if (form.locationId) payload.locationId = form.locationId;
  if (form.shiftId) payload.shiftId = form.shiftId;
  if (form.managerId) payload.managerId = form.managerId;
  if (form.salaryStructureId) payload.salaryStructureId = form.salaryStructureId;
  if (form.aadharNumber.trim()) payload.aadharNumber = form.aadharNumber.trim();
  if (form.panNumber.trim()) payload.panNumber = form.panNumber.trim().toUpperCase();
  if (form.bankAccountNumber.trim()) payload.bankAccountNumber = form.bankAccountNumber.trim();
  if (form.bankIfscCode.trim()) payload.bankIfscCode = form.bankIfscCode.trim().toUpperCase();

  if (mode === 'create') {
    payload.email = form.email.trim().toLowerCase();
    payload.password = form.password;
    payload.role = form.role;
  }

  return payload;
};

const validateEmployeeForm = (form, mode) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (mode === 'create' && !/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Valid work email is required';
  if (mode === 'create' && form.password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (!/^\d{10}$/.test(form.mobile.trim())) errors.mobile = 'Enter a 10 digit mobile number';
  if (!form.departmentId) errors.departmentId = 'Department is required';
  if (!form.designationId) errors.designationId = 'Designation is required';
  if (!form.joiningDate) errors.joiningDate = 'Joining date is required';
  if (!form.employmentType) errors.employmentType = 'Employment type is required';
  if (Number(form.basicSalary || 0) < 0) errors.basicSalary = 'Salary cannot be negative';
  if (form.aadharNumber.trim() && !/^\d{12}$/.test(form.aadharNumber.trim())) errors.aadharNumber = 'Aadhaar must be 12 digits';
  if (form.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber.trim().toUpperCase())) errors.panNumber = 'Invalid PAN format';
  return errors;
};

const makeInitialForm = (employee, mode) => ({
  firstName: employee?.firstName || '',
  lastName: employee?.lastName || '',
  email: employee?.email || '',
  mobile: employee?.mobile || '',
  password: '',
  role: 'EMPLOYEE',
  departmentId: getRecordId(employee?.departmentId) || '',
  designationId: getRecordId(employee?.designationId) || '',
  locationId: getRecordId(employee?.locationId) || '',
  shiftId: getRecordId(employee?.shiftId) || '',
  managerId: getRecordId(employee?.managerId) || '',
  salaryStructureId: getRecordId(employee?.salaryStructureId) || '',
  joiningDate: dateForInput(employee?.joiningDate),
  employmentType: employee?.employmentType || 'Full-Time',
  basicSalary: employee?.basicSalary ?? 0,
  gender: employee?.gender || '',
  dateOfBirth: dateForInput(employee?.dateOfBirth),
  bloodGroup: employee?.bloodGroup || '',
  street: employee?.address?.street || '',
  city: employee?.address?.city || '',
  state: employee?.address?.state || '',
  country: employee?.address?.country || '',
  pincode: employee?.address?.pincode || '',
  emergencyName: employee?.emergencyContact?.name || '',
  emergencyPhone: employee?.emergencyContact?.phone || '',
  emergencyRelation: employee?.emergencyContact?.relation || '',
  aadharNumber: employee?.aadharNumber || '',
  panNumber: employee?.panNumber || '',
  bankAccountNumber: employee?.bankAccountNumber || '',
  bankIfscCode: employee?.bankIfscCode || '',
  mode,
});

const DetailItem = ({ label, value, icon }) => (
  <div className="rounded-lg border border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-[#161616] px-4 py-3">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#434655] dark:text-slate-400">
      {icon}
      {label}
    </div>
    <div className="mt-1 text-sm font-semibold text-[#191b23] dark:text-white break-words">{value || 'Not set'}</div>
  </div>
);

const EmployeeForm = ({ mode, employee, departments, designations, employees, onCancel, onDone }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => makeInitialForm(employee, mode));
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (mode === 'create') {
        const response = await api.post('/employees', payload);
        return response.data?.data;
      }
      const response = await api.put(`/employees/${getRecordId(employee)}`, payload);
      return response.data?.data;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      if (saved?._id) queryClient.invalidateQueries({ queryKey: ['employee', saved._id] });
      onDone(saved);
    },
    onError: (error) => {
      // If server returned structured field-level validation errors, map them into form errors
      const serverFields = error?.response?.data?.fields || error?.response?.data?.error?.fields;
      if (serverFields && typeof serverFields === 'object') {
        setErrors((prev) => ({ ...prev, ...serverFields }));
        // Optionally scroll to the first error field (best-effort)
        try {
          const firstField = Object.keys(serverFields)[0];
          const el = document.querySelector(`[name="${firstField}"]`) || document.querySelector(`#${firstField}`);
          if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {
          // ignore
        }
      }
    },
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateEmployeeForm(form, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    mutation.mutate(buildEmployeePayload(form, mode));
  };

  const managerOptions = compactOptions(
    employees.filter((item) => getRecordId(item) !== getRecordId(employee)),
    (item) => `${getName(item)} (${item.employeeId || 'No ID'})`
  );

  return (
    <form onSubmit={submit} className="space-y-6">
      {mutation.isError && (
        <Alert variant="error" title={mode === 'create' ? 'Create failed' : 'Update failed'}>
          {getErrorMessage(mutation.error)}
        </Alert>
      )}

      <Card>
        <Card.Header
          title={mode === 'create' ? 'Identity and Account' : 'Identity'}
          subtitle="Core profile fields, work contact, and account role"
        />
        <Card.Body className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Input label="First Name" required value={form.firstName} error={errors.firstName} onChange={(e) => setField('firstName', e.target.value)} disabled={mutation.isPending} />
          <Input label="Last Name" required value={form.lastName} error={errors.lastName} onChange={(e) => setField('lastName', e.target.value)} disabled={mutation.isPending} />
          <Input label="Work Email" required={mode === 'create'} value={form.email} error={errors.email} onChange={(e) => setField('email', e.target.value)} disabled={mutation.isPending || mode === 'edit'} leadingIcon={<Mail size={15} />} />
          <Input label="Mobile" required value={form.mobile} error={errors.mobile} onChange={(e) => setField('mobile', e.target.value)} disabled={mutation.isPending} leadingIcon={<Phone size={15} />} />
          {mode === 'create' && (
            <>
              <Input label="Temporary Password" required type="password" value={form.password} error={errors.password} onChange={(e) => setField('password', e.target.value)} disabled={mutation.isPending} />
              <Select label="Role" required value={form.role} onChange={(e) => setField('role', e.target.value)} disabled={mutation.isPending}>
                {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role.replaceAll('_', ' ')}</option>)}
              </Select>
            </>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header title="Employment" subtitle="Department, designation, reporting, and lifecycle fields" />
        <Card.Body className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Select label="Department" required value={form.departmentId} error={errors.departmentId} onChange={(e) => setField('departmentId', e.target.value)} disabled={mutation.isPending}>
            <option value="">Select department</option>
            {departments.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Select label="Designation" required value={form.designationId} error={errors.designationId} onChange={(e) => setField('designationId', e.target.value)} disabled={mutation.isPending}>
            <option value="">Select designation</option>
            {designations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Select label="Reporting Manager" value={form.managerId} onChange={(e) => setField('managerId', e.target.value)} disabled={mutation.isPending}>
            <option value="">No manager assigned</option>
            {managerOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="Joining Date" required type="date" value={form.joiningDate} error={errors.joiningDate} onChange={(e) => setField('joiningDate', e.target.value)} disabled={mutation.isPending} />
          <Select label="Employment Type" required value={form.employmentType} error={errors.employmentType} onChange={(e) => setField('employmentType', e.target.value)} disabled={mutation.isPending}>
            {EMPLOYMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
          <Input label="Basic Salary" type="number" min="0" value={form.basicSalary} error={errors.basicSalary} onChange={(e) => setField('basicSalary', e.target.value)} disabled={mutation.isPending} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header title="Profile and Compliance" subtitle="Personal, emergency, address, and restricted finance details" />
        <Card.Body className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Select label="Gender" value={form.gender} onChange={(e) => setField('gender', e.target.value)} disabled={mutation.isPending}>
            <option value="">Prefer not set</option>
            {['Male', 'Female', 'Other', 'Prefer Not to Say'].map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} disabled={mutation.isPending} />
          <Select label="Blood Group" value={form.bloodGroup} onChange={(e) => setField('bloodGroup', e.target.value)} disabled={mutation.isPending}>
            <option value="">Not set</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Input label="Aadhaar Number" value={form.aadharNumber} error={errors.aadharNumber} onChange={(e) => setField('aadharNumber', e.target.value)} disabled={mutation.isPending} />
          <Input label="PAN Number" value={form.panNumber} error={errors.panNumber} onChange={(e) => setField('panNumber', e.target.value)} disabled={mutation.isPending} />
          <Input label="Bank Account Number" value={form.bankAccountNumber} onChange={(e) => setField('bankAccountNumber', e.target.value)} disabled={mutation.isPending} />
          <Input label="Bank IFSC Code" value={form.bankIfscCode} onChange={(e) => setField('bankIfscCode', e.target.value)} disabled={mutation.isPending} />
          <Input label="Emergency Contact" value={form.emergencyName} onChange={(e) => setField('emergencyName', e.target.value)} disabled={mutation.isPending} />
          <Input label="Emergency Phone" value={form.emergencyPhone} onChange={(e) => setField('emergencyPhone', e.target.value)} disabled={mutation.isPending} />
          <Input label="Emergency Relation" value={form.emergencyRelation} onChange={(e) => setField('emergencyRelation', e.target.value)} disabled={mutation.isPending} />
          <Input label="Street" value={form.street} onChange={(e) => setField('street', e.target.value)} disabled={mutation.isPending} />
          <Input label="City" value={form.city} onChange={(e) => setField('city', e.target.value)} disabled={mutation.isPending} />
          <Input label="State" value={form.state} onChange={(e) => setField('state', e.target.value)} disabled={mutation.isPending} />
          <Input label="Country" value={form.country} onChange={(e) => setField('country', e.target.value)} disabled={mutation.isPending} />
          <Input label="Pincode" value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} disabled={mutation.isPending} />
        </Card.Body>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={mutation.isPending}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={mutation.isPending} disabled={mutation.isPending}>
          {mode === 'create' ? 'Create Employee' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

const EmployeeDocuments = ({ employee, canManage }) => {
  const queryClient = useQueryClient();
  const employeeId = getRecordId(employee);
  const [documentForm, setDocumentForm] = useState({ documentType: 'Resume', documentName: '', expiryDate: '', notes: '', file: null });
  const [documentError, setDocumentError] = useState('');

  const documentsQuery = useQuery({
    queryKey: ['employee-documents', employeeId],
    queryFn: async () => normalizeList((await api.get(`/employees/${employeeId}/documents`)).data),
    enabled: !!employeeId,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!documentForm.file) throw new Error('Choose a file to upload');
      if (!documentForm.documentName.trim()) throw new Error('Document name is required');
      const body = new FormData();
      body.append('documentType', documentForm.documentType);
      body.append('documentName', documentForm.documentName.trim());
      if (documentForm.expiryDate) body.append('expiryDate', documentForm.expiryDate);
      if (documentForm.notes.trim()) body.append('notes', documentForm.notes.trim());
      body.append('file', documentForm.file);
      const response = await api.post(`/employees/${employeeId}/documents`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data?.data;
    },
    onSuccess: () => {
      setDocumentForm({ documentType: 'Resume', documentName: '', expiryDate: '', notes: '', file: null });
      setDocumentError('');
      queryClient.invalidateQueries({ queryKey: ['employee-documents', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employee-timeline', employeeId] });
    },
    onError: (error) => setDocumentError(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId) => api.delete(`/employees/${employeeId}/documents/${documentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employee-timeline', employeeId] });
    },
  });

  const documents = documentsQuery.data || [];

  return (
    <div className="space-y-5">
      <Card>
        <Card.Header title="Upload Document" subtitle="Attach compliance, identity, or employment files" />
        <Card.Body>
          {documentError && <Alert variant="error" className="mb-4">{documentError}</Alert>}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Select label="Document Type" value={documentForm.documentType} onChange={(e) => setDocumentForm((prev) => ({ ...prev, documentType: e.target.value }))} disabled={uploadMutation.isPending}>
              {DOCUMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </Select>
            <Input label="Document Name" value={documentForm.documentName} onChange={(e) => setDocumentForm((prev) => ({ ...prev, documentName: e.target.value }))} disabled={uploadMutation.isPending} />
            <Input label="Expiry Date" type="date" value={documentForm.expiryDate} onChange={(e) => setDocumentForm((prev) => ({ ...prev, expiryDate: e.target.value }))} disabled={uploadMutation.isPending} />
            <Input label="File" type="file" onChange={(e) => setDocumentForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))} disabled={uploadMutation.isPending} />
          </div>
          <Textarea label="Notes" rows={3} className="mt-4" value={documentForm.notes} onChange={(e) => setDocumentForm((prev) => ({ ...prev, notes: e.target.value }))} disabled={uploadMutation.isPending} />
        </Card.Body>
        <Card.Footer>
          <span className="text-xs text-[#434655] dark:text-slate-400">{documentForm.file?.name || 'No file selected'}</span>
          <Button variant="primary" leftIcon={<Upload size={15} />} isLoading={uploadMutation.isPending} disabled={uploadMutation.isPending} onClick={() => uploadMutation.mutate()}>
            Upload
          </Button>
        </Card.Footer>
      </Card>

      {documentsQuery.isLoading ? (
        <SkeletonTable rows={4} columns={5} />
      ) : documentsQuery.isError ? (
        <EmptyState icon={AlertCircle} title="Documents unavailable" subtitle={getErrorMessage(documentsQuery.error)} compact />
      ) : documents.length === 0 ? (
        <EmptyState icon={FileText} title="No employee documents" subtitle="Uploaded files will appear here with preview, download, verification, and delete actions." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((document) => (
            <Card key={getRecordId(document)}>
              <Card.Body className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 text-[#2563eb] border border-blue-100 p-2 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#191b23] dark:text-white truncate">{document.documentName}</h3>
                      <p className="text-xs text-[#434655] dark:text-slate-400">{document.documentType} / {document.mimeType || 'File'}</p>
                    </div>
                  </div>
                  <Badge variant={document.isVerified ? 'success' : 'warning'} size="sm">
                    {document.isVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#434655] dark:text-slate-400">
                  <span>Uploaded {formatDate(document.createdAt)}</span>
                  <span>Expires {formatDate(document.expiryDate)}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="secondary" size="sm" leftIcon={<Eye size={14} />} onClick={() => window.open(document.documentUrl, '_blank', 'noopener,noreferrer')}>
                    Preview
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<Download size={14} />} onClick={() => window.open(document.documentUrl, '_blank', 'noopener,noreferrer')}>
                    Download
                  </Button>
                  {canManage && (
                    <IconButton
                      title="Delete document"
                      ariaLabel="Delete document"
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      isLoading={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Delete ${document.documentName}?`)) deleteMutation.mutate(getRecordId(document));
                      }}
                    />
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const EmployeeTimeline = ({ employee }) => {
  const employeeId = getRecordId(employee);
  const query = useQuery({
    queryKey: ['employee-timeline', employeeId],
    queryFn: async () => normalizeList((await api.get(`/employees/${employeeId}/timeline`)).data),
    enabled: !!employeeId,
  });

  if (query.isLoading) return <SkeletonTable rows={5} columns={3} />;
  if (query.isError) return <EmptyState icon={AlertCircle} title="Timeline unavailable" subtitle={getErrorMessage(query.error)} compact />;
  if (!query.data?.length) {
    return <EmptyState icon={History} title="No timeline events" subtitle="Employee lifecycle events and audit records will appear here." />;
  }

  return (
    <Card>
      <Card.Header title="Employee Timeline" subtitle="Audit-backed lifecycle activity" />
      <Card.Body className="space-y-0">
        {query.data.map((event, index) => (
          <div key={getRecordId(event) || index} className="relative flex gap-4 pb-6 last:pb-0">
            {index < query.data.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-32px)] w-px bg-[#e2e8f0] dark:bg-slate-800" />}
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-[#2563eb]">
              <History size={15} />
            </span>
            <div className="min-w-0 flex-1 rounded-lg border border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-[#161616] px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#191b23] dark:text-white">{String(event.action || 'Employee activity').replaceAll('_', ' ')}</h3>
                <Badge variant={event.outcome === 'Success' ? 'success' : 'warning'} size="sm">{event.outcome || 'Recorded'}</Badge>
              </div>
              <p className="mt-1 text-xs text-[#434655] dark:text-slate-400">{formatDate(event.createdAt)} / {event.actorRole || 'System'}</p>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

const EmployeeDetails = ({ employee, onBack, onEdit, allEmployees, canManage }) => {
  const employeeId = getRecordId(employee);
  const detailQuery = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => (await api.get(`/employees/${employeeId}`)).data?.data,
    enabled: !!employeeId,
    initialData: employee,
  });

  const activeEmployee = detailQuery.data || employee;
  const status = getStatusMeta(activeEmployee);

  if (detailQuery.isLoading) return <SkeletonForm fields={8} />;
  if (!activeEmployee) return <EmptyState icon={Users} title="Select an employee" subtitle="Open an employee from the directory to view details." />;

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserRound size={15} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DetailItem label="Email" value={activeEmployee.email} icon={<Mail size={13} />} />
          <DetailItem label="Mobile" value={activeEmployee.mobile} icon={<Phone size={13} />} />
          <DetailItem label="Date of Birth" value={formatDate(activeEmployee.dateOfBirth)} icon={<CalendarDays size={13} />} />
          <DetailItem label="Gender" value={activeEmployee.gender} icon={<UserRound size={13} />} />
          <DetailItem label="Blood Group" value={activeEmployee.bloodGroup} icon={<ShieldCheck size={13} />} />
          <DetailItem label="Address" value={[activeEmployee.address?.city, activeEmployee.address?.state, activeEmployee.address?.country].filter(Boolean).join(', ')} icon={<IdCard size={13} />} />
        </div>
      ),
    },
    {
      id: 'employment',
      label: 'Employment',
      icon: <BriefcaseBusiness size={15} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DetailItem label="Employee ID" value={activeEmployee.employeeId} icon={<IdCard size={13} />} />
          <DetailItem label="Department" value={getRelationName(activeEmployee.departmentId)} icon={<Users size={13} />} />
          <DetailItem label="Designation" value={getRelationName(activeEmployee.designationId)} icon={<BriefcaseBusiness size={13} />} />
          <DetailItem label="Manager" value={getRelationName(activeEmployee.managerId)} icon={<UserRound size={13} />} />
          <DetailItem label="Joining Date" value={formatDate(activeEmployee.joiningDate)} icon={<CalendarDays size={13} />} />
          <DetailItem label="Employment Type" value={activeEmployee.employmentType} icon={<BriefcaseBusiness size={13} />} />
          <DetailItem label="Employment Status" value={activeEmployee.employmentStatus} icon={<ShieldCheck size={13} />} />
        </div>
      ),
    },
    {
      id: 'salary',
      label: 'Salary',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem label="Basic Salary" value={currency(activeEmployee.basicSalary)} icon={<BriefcaseBusiness size={13} />} />
          <DetailItem label="Bank Account" value={activeEmployee.bankAccountNumber || 'Restricted'} icon={<ShieldCheck size={13} />} />
          <DetailItem label="IFSC Code" value={activeEmployee.bankIfscCode || 'Restricted'} icon={<ShieldCheck size={13} />} />
        </div>
      ),
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText size={15} />,
      content: <EmployeeDocuments employee={activeEmployee} canManage={canManage} />,
    },
    {
      id: 'attendance',
      label: 'Attendance Summary',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem label="Present Days" value="--" icon={<CalendarDays size={13} />} />
          <DetailItem label="Late Marks" value="--" icon={<CalendarDays size={13} />} />
          <DetailItem label="Corrections" value="--" icon={<CalendarDays size={13} />} />
        </div>
      ),
    },
    {
      id: 'leave',
      label: 'Leave Summary',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailItem label="Available Leave" value="--" icon={<CalendarDays size={13} />} />
          <DetailItem label="Pending Requests" value="--" icon={<CalendarDays size={13} />} />
          <DetailItem label="Approved Leave" value="--" icon={<CalendarDays size={13} />} />
        </div>
      ),
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <History size={15} />,
      content: <EmployeeTimeline employee={activeEmployee} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={getName(activeEmployee)}
        description="Employee details, documents, summaries, and lifecycle activity."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Employees' }, { label: activeEmployee.employeeId || 'Profile' }]}
        secondaryAction={<Button variant="secondary" onClick={onBack}>Back to List</Button>}
        primaryAction={canManage && <Button variant="primary" leftIcon={<Edit size={16} />} onClick={() => onEdit(activeEmployee)}>Edit Employee</Button>}
      />

      <Card>
        <Card.Body className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar size="xl" src={activeEmployee.profilePhotoUrl} name={getName(activeEmployee)} status={status.variant === 'active' ? 'online' : 'offline'} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-[#191b23] dark:text-white truncate">{getName(activeEmployee)}</h2>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="text-sm text-[#434655] dark:text-slate-400">{activeEmployee.employeeId} / {getRelationName(activeEmployee.departmentId)} / {getRelationName(activeEmployee.designationId)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <DetailItem label="Joined" value={formatDate(activeEmployee.joiningDate)} />
            <DetailItem label="Type" value={activeEmployee.employmentType} />
            <DetailItem label="Salary" value={currency(activeEmployee.basicSalary)} />
            <DetailItem label="Reports To" value={getRelationName(activeEmployee.managerId)} />
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Tabs tabs={tabs} variant="underlined" />
        </Card.Body>
      </Card>
    </div>
  );
};

export const EmployeeModule = ({ initialView = 'directory' }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const canManage = canManageRoles.has(user?.role);
  const [activeView, setActiveView] = useState(initialView);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);

  const employeeQuery = useQuery({
    queryKey: ['employees', { page, search, departmentFilter, designationFilter, statusFilter, sortBy, sortOrder }],
    queryFn: async () => {
      const params = {
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder,
      };
      if (search.trim()) params.search = search.trim();
      if (departmentFilter) params.departmentId = departmentFilter;
      if (designationFilter) params.designationId = designationFilter;
      if (statusFilter) params.status = statusFilter;
      return normalizePaged((await api.get('/employees', { params })).data);
    },
    placeholderData: (previous) => previous,
  });

  const departmentsQuery = useQuery({
    queryKey: ['employee-filter-departments'],
    queryFn: async () => normalizeList((await api.get('/departments', { params: { limit: 100, status: 'active' } })).data),
    retry: 1,
  });

  const designationsQuery = useQuery({
    queryKey: ['employee-filter-designations'],
    queryFn: async () => normalizeList((await api.get('/designations', { params: { limit: 100, status: 'active' } })).data),
    retry: 1,
  });

  const archiveMutation = useMutation({
    mutationFn: async (employeeId) => api.delete(`/employees/${employeeId}`),
    onSuccess: () => {
      setArchiveTarget(null);
      setOpenMenuId(null);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const employees = employeeQuery.data?.items || [];
  const totalPages = employeeQuery.data?.totalPages || 1;
  const totalItems = employeeQuery.data?.total || 0;

  const departmentOptions = useMemo(() => {
    const fromApi = compactOptions(departmentsQuery.data || [], (item) => item.name || item.code);
    const fromEmployees = compactOptions(employees.map((item) => item.departmentId).filter(Boolean), (item) => item.name || item.code);
    return fromApi.length ? fromApi : fromEmployees;
  }, [departmentsQuery.data, employees]);

  const designationOptions = useMemo(() => {
    const fromApi = compactOptions(designationsQuery.data || [], (item) => item.title || item.code);
    const fromEmployees = compactOptions(employees.map((item) => item.designationId).filter(Boolean), (item) => item.title || item.code);
    return fromApi.length ? fromApi : fromEmployees;
  }, [designationsQuery.data, employees]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpenMenuId(null);
    setActiveView('details');
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenMenuId(null);
    setActiveView('edit');
  };

  const columns = [
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      width: '280px',
      render: (employee) => {
        const status = getStatusMeta(employee);
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={employee.profilePhotoUrl} name={getName(employee)} size="md" status={status.variant === 'active' ? 'online' : 'offline'} />
            <div className="min-w-0">
              <div className="font-semibold text-[#191b23] dark:text-white truncate">{getName(employee)}</div>
              <div className="text-[11px] text-[#434655] dark:text-slate-400 truncate">{employee.email}</div>
            </div>
          </div>
        );
      },
    },
    { key: 'employeeId', header: 'ID', sortable: true, render: (employee) => <span className="font-mono font-semibold text-[#2563eb]">{employee.employeeId}</span> },
    { key: 'departmentId', header: 'Department', render: (employee) => getRelationName(employee.departmentId) },
    { key: 'designationId', header: 'Role', render: (employee) => getRelationName(employee.designationId) },
    { key: 'employmentType', header: 'Type', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (employee) => {
        const status = getStatusMeta(employee);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cellClassName: 'text-right overflow-visible',
      render: (employee) => {
        const id = getRecordId(employee);
        return (
          <div className="relative flex justify-end" onClick={(event) => event.stopPropagation()}>
            <IconButton
              title="Employee actions"
              ariaLabel="Employee actions"
              icon={<MoreVertical size={16} />}
              variant="ghost"
              size="sm"
              onClick={() => setOpenMenuId((current) => (current === id ? null : id))}
            />
            {openMenuId === id && (
              <div className="absolute right-0 top-9 z-30 w-44 rounded-lg border border-[#e2e8f0] bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-[#111111]">
                <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium hover:bg-[#f8fafc]" onClick={() => openDetails(employee)}>
                  <Eye size={14} /> View Details
                </button>
                {canManage && (
                  <>
                    <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium hover:bg-[#f8fafc]" onClick={() => openEdit(employee)}>
                      <Edit size={14} /> Edit Employee
                    </button>
                    <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50" onClick={() => setArchiveTarget(employee)}>
                      <Trash2 size={14} /> Archive
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  if (activeView === 'create') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Create Employee"
          description="Create the employee profile and account using the existing Employee API."
          breadcrumb={[{ label: 'EWMP' }, { label: 'Employees' }, { label: 'Create Employee' }]}
        />
        <EmployeeForm
          mode="create"
          departments={departmentOptions}
          designations={designationOptions}
          employees={employees}
          onCancel={() => setActiveView('directory')}
          onDone={(employee) => {
            setSelectedEmployee(employee);
            setActiveView('details');
          }}
        />
      </div>
    );
  }

  if (activeView === 'edit') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Edit Employee"
          description="Update identity, employment, compensation, and compliance information."
          breadcrumb={[{ label: 'EWMP' }, { label: 'Employees' }, { label: selectedEmployee?.employeeId || 'Edit' }]}
        />
        <EmployeeForm
          mode="edit"
          employee={selectedEmployee}
          departments={departmentOptions}
          designations={designationOptions}
          employees={employees}
          onCancel={() => setActiveView(selectedEmployee ? 'details' : 'directory')}
          onDone={(employee) => {
            setSelectedEmployee(employee);
            setActiveView('details');
          }}
        />
      </div>
    );
  }

  if (activeView === 'details') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <EmployeeDetails
          employee={selectedEmployee}
          allEmployees={employees}
          canManage={canManage}
          onBack={() => setActiveView('directory')}
          onEdit={openEdit}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Employees"
        description="Search, filter, sort, and maintain the workforce roster."
        breadcrumb={[{ label: 'EWMP' }, { label: 'Employees' }, { label: 'Employee List' }]}
        primaryAction={canManage && <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setActiveView('create')}>Add Employee</Button>}
      />

      <Card className="mb-5">
        <Card.Body className="space-y-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_160px_auto]">
            <SearchInput
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              onClear={() => { setSearch(''); setPage(1); }}
              placeholder="Search employees by name, ID, email, or phone..."
            />
            <Select value={departmentFilter} onChange={(event) => { setDepartmentFilter(event.target.value); setPage(1); }} aria-label="Department filter">
              <option value="">All Departments</option>
              {departmentOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
            <Select value={designationFilter} onChange={(event) => { setDesignationFilter(event.target.value); setPage(1); }} aria-label="Designation filter">
              <option value="">All Designations</option>
              {designationOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
            <Select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Status filter">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </Select>
            <Button variant="secondary" leftIcon={<RefreshCw size={15} />} onClick={() => employeeQuery.refetch()} isLoading={employeeQuery.isFetching}>
              Refresh
            </Button>
          </div>
        </Card.Body>
      </Card>

      {employeeQuery.isLoading ? (
        <SkeletonTable rows={PAGE_SIZE} columns={7} />
      ) : employeeQuery.isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Could not load employees"
          subtitle={getErrorMessage(employeeQuery.error)}
          action={<Button variant="secondary" onClick={() => employeeQuery.refetch()} leftIcon={<RefreshCw size={15} />}>Try Again</Button>}
        />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No employees found"
          subtitle="Adjust the search or filters to find matching workforce records."
          action={<Button variant="secondary" onClick={() => { setSearch(''); setDepartmentFilter(''); setDesignationFilter(''); setStatusFilter(''); }}>Clear Filters</Button>}
        />
      ) : (
        <div className="space-y-4">
          <Table
            columns={columns}
            rows={employees}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            onRowClick={openDetails}
            getRowKey={(employee) => getRecordId(employee)}
          />
          <Card>
            <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} itemsPerPage={PAGE_SIZE} onPageChange={setPage} />
          </Card>
        </div>
      )}

      <Modal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        title="Archive Employee"
        subtitle={archiveTarget ? `${getName(archiveTarget)} (${archiveTarget.employeeId})` : undefined}
      >
        <ModalBody>
          {archiveMutation.isError && <Alert variant="error" className="mb-4">{getErrorMessage(archiveMutation.error)}</Alert>}
          <p className="text-sm text-[#434655] dark:text-slate-400">
            Archiving deactivates the employee account and removes the record from the active workforce list.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setArchiveTarget(null)} disabled={archiveMutation.isPending}>Cancel</Button>
          <Button variant="primary-danger" isLoading={archiveMutation.isPending} disabled={archiveMutation.isPending} onClick={() => archiveMutation.mutate(getRecordId(archiveTarget))}>
            Archive
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EmployeeModule;
