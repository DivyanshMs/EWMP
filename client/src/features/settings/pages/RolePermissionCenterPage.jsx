import React, { useState } from 'react';
import { Shield, Key, Plus, Lock, X, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';
import { RoleCard, PermissionMatrix, StatusBadge, SettingsCard } from '../components/AdminComponents';
import { NoRoles } from '../components/AdminEmptyStates';

/**
 * RolePermissionCenterPage.jsx
 * RBAC Role directory, granular module permission matrix, and staff role assignment wizard.
 */

export const RolePermissionCenterPage = () => {
  const [roles, setRoles] = useState([
    { id: 'r-1', code: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Unrestricted global access across all 16 platform modules, system kernel flags, and cryptographic security ledgers.', userCount: 3, isProtected: true },
    { id: 'r-2', code: 'ORG_ADMIN', name: 'Organization Administrator', description: 'Full supervisory access to organization parameters, working schedules, employee directories, and location registries.', userCount: 8, isProtected: true },
    { id: 'r-3', code: 'HR_MANAGER', name: 'Human Resources Manager', description: 'Supervise employee profiles, ATS recruitment pipelines, leave approvals, attendance regularization, and onboarding workflows.', userCount: 14, isProtected: true },
    { id: 'r-4', code: 'FINANCE', name: 'Finance & Payroll Director', description: 'Manage payroll ledgers, tax compliance schedules, employee compensation structures, and executive financial reports.', userCount: 6, isProtected: true },
    { id: 'r-5', code: 'IT_ADMIN', name: 'IT & Infrastructure Admin', description: 'Supervise asset inventories, hardware allocation wizards, document verification vaults, and system security telemetry.', userCount: 9, isProtected: true },
    { id: 'r-6', code: 'MANAGER', name: 'Department / Team Manager', description: 'Approve leave requests, conduct performance evaluations, assign task boards, and monitor team attendance scorecards.', userCount: 42, isProtected: true },
    { id: 'r-7', code: 'TEAM_LEAD', name: 'Project Lead', description: 'Manage Kanban task boards, project sprint allocations, and technical workflow planning.', userCount: 28, isProtected: false },
    { id: 'r-8', code: 'EMPLOYEE', name: 'Standard Employee', description: 'Self-service access to personal profile, attendance check-ins, leave requests, paystubs, and AI assistant workspace.', userCount: 1312, isProtected: true },
    { id: 'r-9', code: 'AUDITOR', name: 'External Security & Compliance Auditor', description: 'Read-only inspection access across financial ledgers, attendance records, audit logs, and system security scorecards.', userCount: 6, isProtected: false }
  ]);

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignUserEmail, setAssignUserEmail] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    description: '',
    baseRole: 'EMPLOYEE'
  });

  const [rolePermissions, setRolePermissions] = useState({
    'SUPER_ADMIN': [],
    'ORG_ADMIN': [],
    'HR_MANAGER': []
  });

  const handleTogglePermission = (modId, permType) => {
    if (selectedRole?.code === 'SUPER_ADMIN') {
      alert('Notice: Super Administrator permissions are system-locked and cannot be degraded.');
      return;
    }
    alert(`Permission Toggle Simulation: Modifying [${permType}] on module [${modId}] for role [${selectedRole.name}].`);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignUserEmail) return;
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setShowAssignModal(false);
      setAssignUserEmail('');
      setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, userCount: r.userCount + 1 } : r));
    }, 1000);
  };

  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleForm.name) return;
    const created = {
      id: `r-${Date.now()}`,
      code: newRoleForm.name.toUpperCase().replace(/\s+/g, '_'),
      name: newRoleForm.name,
      description: newRoleForm.description || 'Custom organization security role.',
      userCount: 0,
      isProtected: false
    };
    setRoles([created, ...roles]);
    setSelectedRole(created);
    setShowCreateModal(false);
    setNewRoleForm({ name: '', description: '', baseRole: 'EMPLOYEE' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">RBAC Role & Permission Governance Center</h3>
            <StatusBadge status="admin" label="9 ACTIVE ROLES" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure role definitions, assign employee scope policies, and inspect module-level read/write/delete matrices.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button 
            onClick={() => setShowAssignModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <UserPlus size={14} /> Assign User Access
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus size={14} /> Create Custom Role
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Enterprise Role Directory</h4>
          <span className="text-xs text-slate-400">Showing {roles.length} roles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div 
              key={role.id} 
              onClick={() => setSelectedRole(role)}
              className={`cursor-pointer transition-all ${selectedRole?.id === role.id ? 'ring-2 ring-blue-600 rounded-lg' : ''}`}
            >
              <RoleCard 
                role={role} 
                onSelectRole={() => setSelectedRole(role)}
                onAssignUser={(r) => { setSelectedRole(r); setShowAssignModal(true); }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix for Selected Role */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Granular Permission Matrix: {selectedRole?.name}</h4>
          </div>
          {selectedRole?.code === 'SUPER_ADMIN' && (
            <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <Lock size={12} /> System Locked Role (Full Access)
            </span>
          )}
        </div>
        <PermissionMatrix 
          roleName={selectedRole?.name || 'SUPER_ADMIN'} 
          onTogglePermission={handleTogglePermission}
          isReadOnly={selectedRole?.code === 'SUPER_ADMIN'}
        />
      </div>

      {/* Modal: Create Custom Role */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-blue-600" /> Create Custom Security Role
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Compliance Inspector"
                  value={newRoleForm.name}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Description</label>
                <textarea 
                  rows="3"
                  placeholder="Describe the scope and responsibilities of this role..."
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clone Base Permissions From</label>
                <select
                  value={newRoleForm.baseRole}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, baseRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="EMPLOYEE">Standard Employee (Read Self Only)</option>
                  <option value="MANAGER">Department Manager</option>
                  <option value="AUDITOR">Compliance Auditor (Read All)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Create & Configure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign User Access */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus size={18} className="text-blue-600" /> Assign Role: {selectedRole?.name}
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            {assignSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Successfully assigned [{selectedRole?.name}] privilege scope to personnel record.</span>
              </div>
            ) : (
              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g., s.jenkins@ewmp-enterprise.com"
                    value={assignUserEmail}
                    onChange={(e) => setAssignUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">The user will receive an automated notification regarding their updated security clearance.</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#1a1a1a] rounded border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Role Privilege Highlights:</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{selectedRole?.description}</div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    Confirm Assignment <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
