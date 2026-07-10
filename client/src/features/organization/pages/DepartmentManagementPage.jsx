import React, { useState, useMemo } from 'react';
import { Building2, Plus, Search, Eye, Edit, Trash2, Users } from 'lucide-react';
import { OrganizationTableSkeleton } from '../components/OrganizationLoadingStates';
import { OrganizationEmptyState } from '../components/OrganizationEmptyStates';
import { OrganizationEmptySearch } from '../components/OrganizationErrorStates';
import { DepartmentDetailsDrawer, EntityFormModal } from '../components/OrganizationModals';
import { Table, Pagination, SearchInput, Select, Button, Badge } from '../../../components/shared';

/**
 * DepartmentManagementPage.jsx
 * Enterprise Department administration table supporting sorting, filtering, searching,
 * pagination, and slide-over inspector drawer. Consumes standard shared components.
 */

export const DepartmentManagementPage = ({ isLoading = false }) => {
  const [departments, setDepartments] = useState([
    { id: '1', code: 'ENG-01', name: 'Platform Engineering & DevOps', head: 'David Kim', employeeCount: 420, status: 'Active', costCenter: 'CC-ENG-100', location: 'HQ - Silicon Valley' },
    { id: '2', code: 'SALES-02', name: 'Global Enterprise Sales', head: 'Sarah Jenkins', employeeCount: 310, status: 'Active', costCenter: 'CC-SLS-200', location: 'HQ - Silicon Valley' },
    { id: '3', code: 'HR-03', name: 'Human Resources & Talent', head: 'Elena Rostova', employeeCount: 65, status: 'Active', costCenter: 'CC-HR-300', location: 'London Innovation Hub' },
    { id: '4', code: 'FIN-04', name: 'Corporate Finance & Payroll', head: 'Marcus Brody', employeeCount: 85, status: 'Active', costCenter: 'CC-FIN-400', location: 'HQ - Silicon Valley' },
    { id: '5', code: 'OPS-05', name: 'Global Operations & Supply', head: 'David Vance', employeeCount: 180, status: 'Active', costCenter: 'CC-OPS-500', location: 'Singapore Hub' },
    { id: '6', code: 'PROD-06', name: 'Product Design & Architecture', head: 'Alex Chen', employeeCount: 140, status: 'Active', costCenter: 'CC-PRD-600', location: 'HQ - Silicon Valley' },
    { id: '7', code: 'LEG-07', name: 'Legal & Regulatory Compliance', head: 'Jessica Pearson', employeeCount: 30, status: 'Inactive', costCenter: 'CC-LEG-700', location: 'London Innovation Hub' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Drawer & Modal States
  const [selectedDept, setSelectedDept] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingDept, setEditingDept] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredData = useMemo(() => {
    return departments
      .filter((d) => {
        const matchesSearch =
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.head.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [departments, searchQuery, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingDept({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept, e) => {
    e?.stopPropagation();
    setModalMode('edit');
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name, e) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to delete department "${name}"?`)) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleFormSubmit = (formData) => {
    if (modalMode === 'create') {
      const newDept = {
        id: String(Date.now()),
        code: formData.code || `DEPT-${departments.length + 1}`,
        name: formData.name,
        head: formData.head || 'Not Assigned',
        employeeCount: 0,
        status: formData.status || 'Active',
        costCenter: formData.costCenter || 'CC-NEW',
        location: formData.location || 'HQ - Silicon Valley',
      };
      setDepartments((prev) => [newDept, ...prev]);
    } else {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editingDept.id ? { ...d, ...formData } : d))
      );
    }
  };

  const formFields = [
    { name: 'name', label: 'Department Name', required: true, placeholder: 'e.g. Platform Engineering' },
    { name: 'code', label: 'Department Code', required: true, placeholder: 'e.g. ENG-01' },
    { name: 'head', label: 'Department Head / VP', required: false, placeholder: 'e.g. David Kim' },
    { name: 'costCenter', label: 'Cost Center Code', required: true, placeholder: 'e.g. CC-ENG-100' },
    {
      name: 'status',
      label: 'Operational Status',
      type: 'select',
      required: true,
      defaultValue: 'Active',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive / Restructuring', value: 'Inactive' },
      ],
    },
  ];

  const columns = [
    { key: 'code', header: 'Code', sortable: true, render: (dept) => <span className="font-mono font-bold text-[#2563eb] dark:text-blue-400">{dept.code}</span> },
    { key: 'name', header: 'Department Name', sortable: true, render: (dept) => (
      <div>
        <div className="font-bold text-[#191b23] dark:text-white">{dept.name}</div>
        <span className="block text-[11px] font-mono text-[#434655] dark:text-slate-400 font-normal">{dept.costCenter}</span>
      </div>
    )},
    { key: 'head', header: 'Department Head', sortable: true, render: (dept) => <span className="text-[#434655] dark:text-slate-300">{dept.head}</span> },
    { key: 'employeeCount', header: 'Workforce', sortable: true, render: (dept) => (
      <Badge variant="secondary" size="md" className="font-mono">
        <Users size={13} className="text-[#2563eb] mr-1 inline" />
        {dept.employeeCount}
      </Badge>
    )},
    { key: 'status', header: 'Status', render: (dept) => (
      <Badge variant={dept.status === 'Active' ? 'success' : 'danger'} size="sm" dot>
        {dept.status}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', className: 'text-right', cellClassName: 'text-right', render: (dept) => (
      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => { setSelectedDept(dept); setIsDrawerOpen(true); }}
          title="View Details"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#2563eb] transition-colors"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={(e) => handleOpenEdit(dept, e)}
          title="Edit Department"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => handleDelete(dept.id, dept.name, e)}
          title="Delete Department"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )}
  ];

  if (isLoading) return <OrganizationTableSkeleton rows={6} columns={6} />;
  if (departments.length === 0) {
    return (
      <OrganizationEmptyState
        type="department"
        onAction={handleOpenCreate}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search departments by name, code, or leader..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              options={[
                { label: 'All Status', value: 'All' },
                { label: 'Active Only', value: 'Active' },
                { label: 'Inactive Only', value: 'Inactive' },
              ]}
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus size={16} />}
          className="shrink-0"
        >
          Create Department
        </Button>
      </div>

      {/* Table Content */}
      {filteredData.length === 0 ? (
        <OrganizationEmptySearch
          query={searchQuery}
          onClear={() => { setSearchQuery(''); setStatusFilter('All'); }}
        />
      ) : (
        <div className="space-y-4">
          <Table
            columns={columns}
            rows={paginatedData}
            sortColumn={sortField}
            sortDirection={sortOrder}
            onSort={handleSort}
            onRowClick={(dept) => { setSelectedDept(dept); setIsDrawerOpen(true); }}
          />

          <div className="bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-lg p-2 shadow-sm">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Drawer & Modal Components */}
      <DepartmentDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        department={selectedDept}
      />

      <EntityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Department' : 'Edit Department'}
        icon={Building2}
        fields={formFields}
        initialData={editingDept}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default DepartmentManagementPage;

