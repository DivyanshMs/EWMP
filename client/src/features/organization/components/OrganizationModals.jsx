import React from 'react';
import { Check, User, Mail, Phone, MapPin, Users } from 'lucide-react';
import { Modal, Drawer, Button, Input, Select, Badge } from '../../../components/shared';

/**
 * OrganizationModals.jsx
 * Reusable dialog modals and slide-over drawers for creating, editing, and inspecting
 * organizational entities in EWMP. Consumes standard shared components.
 */

export const OrganizationModalWrapper = ({ isOpen, onClose, title, icon: IconComp, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={IconComp ? <IconComp size={20} className="text-[#2563eb]" /> : undefined}
      size="md"
    >
      <Modal.Body className="space-y-4">{children}</Modal.Body>
    </Modal>
  );
};

export const DepartmentDetailsDrawer = ({ isOpen, onClose, department }) => {
  if (!isOpen || !department) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={department.name}
      subtitle={department.code}
      size="md"
      position="right"
    >
      <div className="space-y-6 text-xs sm:text-sm">
        <div className="flex items-center justify-between p-3.5 bg-[#f8fafc] dark:bg-[#161616] rounded-lg border border-[#e2e8f0] dark:border-slate-800">
          <span className="text-[#434655] dark:text-slate-400 font-mono uppercase text-[11px]">Department Status</span>
          <Badge
            variant={department.status === 'Active' ? 'success' : 'danger'}
            size="md"
            dot
          >
            {department.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-[#434655] dark:text-slate-400 font-bold tracking-wider">Leadership & Head</h4>
          <div className="p-4 bg-[#f8fafc] dark:bg-[#161616] rounded-lg border border-[#e2e8f0] dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <div className="font-bold text-[#191b23] dark:text-white">{department.head || 'Not Assigned'}</div>
              <div className="text-xs text-[#434655] dark:text-slate-400">Department Head & Executive Sponsor</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-[#434655] dark:text-slate-400 font-bold tracking-wider">Workforce & Capacity</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div className="p-3.5 bg-[#f8fafc] dark:bg-[#161616] rounded-lg border border-[#e2e8f0] dark:border-slate-800">
              <span className="text-[#434655] dark:text-slate-400 text-[10px] uppercase block">Total Employees</span>
              <span className="text-lg font-bold text-[#191b23] dark:text-white mt-1 flex items-center gap-1.5 font-sans">
                <Users size={16} className="text-[#2563eb]" />
                {department.employeeCount || 0}
              </span>
            </div>
            <div className="p-3.5 bg-[#f8fafc] dark:bg-[#161616] rounded-lg border border-[#e2e8f0] dark:border-slate-800">
              <span className="text-[#434655] dark:text-slate-400 text-[10px] uppercase block">Cost Center Code</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1 block font-sans">
                {department.costCenter || 'CC-100'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-[#434655] dark:text-slate-400 font-bold tracking-wider">Contact & Location</h4>
          <div className="space-y-2 text-[#434655] dark:text-slate-300">
            <div className="flex items-center gap-2.5 p-2.5 bg-[#f8fafc] dark:bg-[#161616] rounded-md border border-[#e2e8f0] dark:border-slate-800">
              <MapPin size={16} className="text-slate-400 shrink-0" />
              <span>Primary Site: {department.location || 'Headquarters'}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-[#f8fafc] dark:bg-[#161616] rounded-md border border-[#e2e8f0] dark:border-slate-800">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span>{department.email || `${department.code?.toLowerCase()}@acme.corp`}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-[#f8fafc] dark:bg-[#161616] rounded-md border border-[#e2e8f0] dark:border-slate-800">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <span>+1 (555) 019-2834 ext. {department.code}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2e8f0] dark:border-slate-800 flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Close Drawer
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              alert(`Navigating to edit settings for Department: ${department.name}`);
              onClose();
            }}
          >
            Edit Department
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export const EntityFormModal = ({ isOpen, onClose, title, icon, fields, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <OrganizationModalWrapper isOpen={isOpen} onClose={onClose} title={title} icon={icon}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {fields.map((f) => (
          <div key={f.name} className="space-y-1.5">
            {f.type === 'select' ? (
              <Select
                label={f.label}
                required={f.required}
                value={formData[f.name] || f.defaultValue || ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                options={[
                  { value: '', label: 'Select option...' },
                  ...(f.options || [])
                ]}
              />
            ) : f.type === 'textarea' ? (
              <div>
                <label className="block text-xs font-semibold text-[#191b23] dark:text-slate-300 mb-1">
                  {f.label} {f.required && <span className="text-rose-500">*</span>}
                </label>
                <textarea
                  value={formData[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  rows={3}
                  className="w-full p-2.5 bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-md text-[#191b23] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            ) : (
              <Input
                label={f.label}
                type={f.type || 'text'}
                required={f.required}
                placeholder={f.placeholder}
                value={formData[f.name] || ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-[#e2e8f0] dark:border-slate-800 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Check size={16} />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </OrganizationModalWrapper>
  );
};

export default {
  OrganizationModalWrapper,
  DepartmentDetailsDrawer,
  EntityFormModal,
};

