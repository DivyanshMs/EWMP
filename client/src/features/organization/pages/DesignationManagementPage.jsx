import React, { useState, useMemo } from 'react';
import { Award, Plus, Search, FolderTree, Edit, Trash2, Users, DollarSign } from 'lucide-react';
import { OrganizationTableSkeleton } from '../components/OrganizationLoadingStates';
import { OrganizationEmptyState } from '../components/OrganizationEmptyStates';
import { OrganizationEmptySearch } from '../components/OrganizationErrorStates';
import { EntityFormModal } from '../components/OrganizationModals';
import { Table, SearchInput, Card, Button, Badge } from '../../../components/shared';

/**
 * DesignationManagementPage.jsx
 * Enterprise job designation and corporate title hierarchy management.
 * Supports toggleable Table and Tree/Hierarchy view modes, salary grade tracking, and employee counts.
 * Consumes standard shared components.
 */

export const DesignationManagementPage = ({ isLoading = false }) => {
  const [designations, setDesignations] = useState([
    { id: '1', title: 'Global Chief Operating Officer (COO)', level: 'Executive / L6', salaryGrade: 'Grade E1 ($350k - $500k)', employeeCount: 1, parent: 'Chief Executive Officer (CEO)', department: 'Executive' },
    { id: '2', title: 'Vice President of Engineering', level: 'Senior Leadership / L5', salaryGrade: 'Grade L5 ($280k - $360k)', employeeCount: 2, parent: 'Global Chief Operating Officer (COO)', department: 'Platform Engineering' },
    { id: '3', title: 'Principal Systems Architect', level: 'Senior IC / L4', salaryGrade: 'Grade IC4 ($220k - $290k)', employeeCount: 8, parent: 'Vice President of Engineering', department: 'Platform Engineering' },
    { id: '4', title: 'Senior Software Engineer', level: 'Mid-Senior IC / L3', salaryGrade: 'Grade IC3 ($160k - $210k)', employeeCount: 140, parent: 'Principal Systems Architect', department: 'Platform Engineering' },
    { id: '5', title: 'Enterprise Account Executive', level: 'Mid-Senior IC / L3', salaryGrade: 'Grade IC3 ($150k - $220k)', employeeCount: 64, parent: 'VP of Global Sales', department: 'Global Sales' },
    { id: '6', title: 'HR Business Partner (HRBP)', level: 'Mid Level / L2', salaryGrade: 'Grade IC2 ($110k - $150k)', employeeCount: 18, parent: 'HR Director', department: 'Human Resources' },
    { id: '7', title: 'Associate Operations Analyst', level: 'Entry Level / L1', salaryGrade: 'Grade IC1 ($75k - $100k)', employeeCount: 45, parent: 'Operations Manager', department: 'Global Operations' },
  ]);

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'hierarchy'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = useMemo(() => {
    return designations.filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [designations, searchQuery]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete designation "${title}"?`)) {
      setDesignations((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleFormSubmit = (formData) => {
    if (modalMode === 'create') {
      const newItem = {
        id: String(Date.now()),
        title: formData.title,
        level: formData.level || 'Mid Level / L2',
        salaryGrade: formData.salaryGrade || 'Grade IC2 ($110k - $150k)',
        employeeCount: 0,
        parent: formData.parent || 'VP of Engineering',
        department: formData.department || 'Platform Engineering',
      };
      setDesignations((prev) => [newItem, ...prev]);
    } else {
      setDesignations((prev) =>
        prev.map((d) => (d.id === editingItem.id ? { ...d, ...formData } : d))
      );
    }
  };

  const formFields = [
    { name: 'title', label: 'Designation / Job Title', required: true, placeholder: 'e.g. Senior Cloud Architect' },
    {
      name: 'level',
      label: 'Corporate Hierarchy Level',
      type: 'select',
      required: true,
      defaultValue: 'Mid-Senior IC / L3',
      options: [
        { label: 'Executive / L6', value: 'Executive / L6' },
        { label: 'Senior Leadership / L5', value: 'Senior Leadership / L5' },
        { label: 'Senior IC / L4', value: 'Senior IC / L4' },
        { label: 'Mid-Senior IC / L3', value: 'Mid-Senior IC / L3' },
        { label: 'Mid Level / L2', value: 'Mid Level / L2' },
        { label: 'Entry Level / L1', value: 'Entry Level / L1' },
      ],
    },
    { name: 'salaryGrade', label: 'Compensation Salary Grade', required: true, placeholder: 'e.g. Grade IC3 ($160k - $210k)' },
    { name: 'department', label: 'Primary Department', required: true, placeholder: 'e.g. Platform Engineering' },
    { name: 'parent', label: 'Reports To (Parent Designation)', required: false, placeholder: 'e.g. VP of Engineering' },
  ];

  const columns = [
    { key: 'title', header: 'Designation / Title', render: (item) => (
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Award size={16} />
        </div>
        <div>
          <span className="font-bold text-[#191b23] dark:text-white">{item.title}</span>
          <span className="block text-[11px] font-mono text-[#434655] dark:text-slate-400 font-normal">Reports to: {item.parent}</span>
        </div>
      </div>
    )},
    { key: 'level', header: 'Corporate Level', render: (item) => (
      <Badge variant="primary" size="sm" className="font-mono">
        {item.level}
      </Badge>
    )},
    { key: 'salaryGrade', header: 'Salary Grade', render: (item) => (
      <span className="flex items-center gap-1 font-mono text-[#434655] dark:text-slate-300">
        <DollarSign size={14} className="text-emerald-500 shrink-0" />
        {item.salaryGrade}
      </span>
    )},
    { key: 'department', header: 'Department', render: (item) => (
      <span className="font-medium text-[#434655] dark:text-slate-300">{item.department}</span>
    )},
    { key: 'employeeCount', header: 'Workforce', render: (item) => (
      <Badge variant="secondary" size="md" className="font-mono">
        <Users size={13} className="text-indigo-500 mr-1 inline" />
        {item.employeeCount}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', className: 'text-right', cellClassName: 'text-right', render: (item) => (
      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleOpenEdit(item)}
          title="Edit Designation"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => handleDelete(item.id, item.title)}
          title="Delete Designation"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )}
  ];

  if (isLoading) return <OrganizationTableSkeleton rows={7} columns={6} />;
  if (designations.length === 0) {
    return <OrganizationEmptyState type="designation" onAction={handleOpenCreate} />;
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search designations by job title, level, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#f8fafc] dark:bg-[#161616] p-1 rounded-xl border border-[#e2e8f0] dark:border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'hierarchy'
                  ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              <FolderTree size={14} />
              <span>Hierarchy Tree</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
            className="shrink-0"
          >
            Create Designation
          </Button>
        </div>
      </div>

      {/* Content Render Area */}
      {filteredData.length === 0 ? (
        <OrganizationEmptySearch query={searchQuery} onClear={() => setSearchQuery('')} />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW MODE */
        <Table columns={columns} rows={filteredData} />
      ) : (
        /* HIERARCHY TREE VIEW MODE */
        <Card className="space-y-0">
          <Card.Header
            title={
              <span className="flex items-center gap-2">
                <FolderTree size={18} className="text-[#2563eb] dark:text-blue-400" />
                Corporate Reporting Hierarchy Ladder
              </span>
            }
            subtitle="Visual representation of corporate governance reporting lines"
            action={
              <Badge variant="primary" size="sm" className="font-mono">
                {filteredData.length} Mapped Designations
              </Badge>
            }
          />
          <Card.Body className="space-y-4 max-w-4xl mx-auto py-6">
            {filteredData.map((item, idx) => (
              <div
                key={item.id}
                style={{ marginLeft: `${Math.min(idx * 24, 96)}px` }}
                className="p-4 rounded-xl bg-gradient-to-r from-[#f8fafc] to-white dark:from-[#161616] dark:to-[#111111] border border-[#e2e8f0] dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#2563eb]/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 font-bold">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                      {item.title}
                      <Badge variant="neutral" size="sm" className="font-mono">
                        {item.level}
                      </Badge>
                    </h4>
                    <p className="text-xs text-[#434655] dark:text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span>Dept: {item.department}</span> • 
                      <span className="text-emerald-600 dark:text-emerald-400">{item.salaryGrade}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="secondary" size="md" className="font-mono">
                    <Users size={13} className="mr-1 inline text-[#2563eb]" /> {item.employeeCount} Employees
                  </Badge>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Edit size={15} />
                  </button>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Modal */}
      <EntityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Job Designation' : 'Edit Job Designation'}
        icon={Award}
        fields={formFields}
        initialData={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default DesignationManagementPage;

