import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { FileText, PlusCircle, Edit3, Trash2, CheckCircle2, X } from 'lucide-react';
import { LeaveTypeBadge } from '../components/LeaveBadges';
import { NoLeaveTypes } from '../components/LeaveEmptyStates';

/**
 * LeaveTypesPage.jsx
 * HR & Admin configuration module for organizational Leave Policies and Allocation Rules.
 */

export const LeaveTypesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const [policies, setPolicies] = useState([
    { id: 'LT-01', code: 'ANNUAL', name: 'Annual Leave', allocation: 20, carryForward: true, maxCarryForward: 5, accrual: 'Monthly (1.66 days/mo)', eligibility: 'All confirmed full-time employees after 90 days probation.', isActive: true },
    { id: 'LT-02', code: 'SICK', name: 'Sick Leave', allocation: 10, carryForward: false, maxCarryForward: 0, accrual: 'Annual upfront on Jan 1st', eligibility: 'All employees immediately from day of joining.', isActive: true },
    { id: 'LT-03', code: 'CASUAL', name: 'Casual Leave', allocation: 8, carryForward: false, maxCarryForward: 0, accrual: 'Quarterly allocation', eligibility: 'All full-time and contractual employees.', isActive: true },
    { id: 'LT-04', code: 'COMPENSATORY', name: 'Compensatory Leave', allocation: 10, carryForward: false, maxCarryForward: 0, accrual: 'Earned per overtime/holiday shift worked', eligibility: 'Exempt and non-exempt operational staff.', isActive: true },
    { id: 'LT-05', code: 'MATERNITY', name: 'Maternity Leave', allocation: 180, carryForward: false, maxCarryForward: 0, accrual: 'Event-based statutory grant', eligibility: 'Female employees with at least 80 days service in 12 months.', isActive: true },
    { id: 'LT-06', code: 'BEREAVEMENT', name: 'Bereavement Leave', allocation: 5, carryForward: false, maxCarryForward: 0, accrual: 'Event-based grant', eligibility: 'All full-time employees.', isActive: true },
  ]);

  const [formState, setFormState] = useState({
    code: 'ANNUAL',
    name: '',
    allocation: 15,
    carryForward: false,
    maxCarryForward: 0,
    accrual: 'Monthly (1.25 days/mo)',
    eligibility: 'All confirmed full-time employees.',
    isActive: true
  });

  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setFormState({
      code: 'ANNUAL',
      name: '',
      allocation: 15,
      carryForward: false,
      maxCarryForward: 0,
      accrual: 'Monthly',
      eligibility: 'All confirmed full-time employees.',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (policy) => {
    setEditingPolicy(policy);
    setFormState({ ...policy });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete or disable this leave policy? Employees will no longer be able to submit requests under this category.')) {
      setPolicies(policies.filter(p => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.name.trim()) return alert('Please enter policy name.');

    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? { ...p, ...formState } : p));
    } else {
      const newPolicy = {
        ...formState,
        id: `LT-[Math.floor(Math.random() * 89 + 10)]`,
        code: formState.name.toUpperCase().replace(/\s+/g, '_').substring(0, 12)
      };
      setPolicies([...policies, newPolicy]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Create / Edit Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <form onSubmit={handleSave} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-[#2563eb]" />
                {editingPolicy ? `Edit Leave Policy (${editingPolicy.code})` : 'Configure New Leave Policy'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#737686] hover:text-[#191b23] dark:hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Policy Display Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Annual Vacation Leave"
                  className="w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Annual Allocation (Days) *</label>
                  <input
                    type="number"
                    value={formState.allocation}
                    onChange={(e) => setFormState({ ...formState, allocation: Number(e.target.value) })}
                    className="w-full font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Accrual Frequency</label>
                  <select
                    value={formState.accrual}
                    onChange={(e) => setFormState({ ...formState, accrual: e.target.value })}
                    className="w-full"
                  >
                    <option value="Monthly (1.66 days/mo)">Monthly Accrual</option>
                    <option value="Annual upfront on Jan 1st">Annual Upfront</option>
                    <option value="Quarterly allocation">Quarterly Allocation</option>
                    <option value="Event-based grant">Event-based Grant</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/50 rounded border border-[#e1e2ed] dark:border-gray-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#191b23] dark:text-white">
                  <input
                    type="checkbox"
                    checked={formState.carryForward}
                    onChange={(e) => setFormState({ ...formState, carryForward: e.target.checked })}
                    className="w-4 h-4 text-[#2563eb] rounded"
                  />
                  <span>Enable Year-end Carry Forward to Next Academic Year</span>
                </label>

                {formState.carryForward && (
                  <div>
                    <label className="font-semibold block mb-1 text-[#737686]">Max Carry Forward Limit (Days)</label>
                    <input
                      type="number"
                      value={formState.maxCarryForward}
                      onChange={(e) => setFormState({ ...formState, maxCarryForward: Number(e.target.value) })}
                      className="w-full font-mono max-w-[120px]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Eligibility & Statutory Rules</label>
                <textarea
                  rows="2"
                  value={formState.eligibility}
                  onChange={(e) => setFormState({ ...formState, eligibility: e.target.value })}
                  placeholder="Describe probation criteria, service tenure requirements, etc."
                  className="w-full"
                />
              </div>
            </div>

            <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-2 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded text-xs font-semibold text-[#191b23] dark:text-white">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded text-xs font-semibold shadow-xs transition-all">
                {editingPolicy ? 'Update Policy Rules' : 'Create Leave Policy'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-[#2563eb]" />
            LEAVE TYPES & POLICY CONFIGURATION (ADMIN / HR)
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Configure statutory and organizational time-off policies, annual day allocations, and carry-forward rules.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <PlusCircle size={15} /> Create New Policy
        </button>
      </div>

      {/* Policy List Grid/Table */}
      {policies.length === 0 ? (
        <NoLeaveTypes onCreate={handleOpenCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-[#c3c6d7] transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-[#e1e2ed]/60 dark:border-gray-800/60">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#737686] block">{policy.id}</span>
                    <h3 className="text-base font-bold text-[#191b23] dark:text-white">{policy.name}</h3>
                  </div>
                  <LeaveTypeBadge type={policy.code} />
                </div>

                <div className="space-y-2 text-xs my-3">
                  <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                    <span className="text-[#737686]">Annual Allocation:</span>
                    <span className="font-mono font-bold text-[#191b23] dark:text-white text-sm">{policy.allocation} Days/Year</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                    <span className="text-[#737686]">Carry Forward Rule:</span>
                    <span className="font-semibold text-[#2563eb]">
                      {policy.carryForward ? `Yes (Max ${policy.maxCarryForward}d)` : 'No (Lapses at year end)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                    <span className="text-[#737686]">Accrual Method:</span>
                    <span className="font-medium text-[#434655] dark:text-gray-300 truncate max-w-[150px]" title={policy.accrual}>{policy.accrual}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#737686] dark:text-gray-400 bg-white dark:bg-[#161616] p-2.5 rounded border border-[#e1e2ed]/50 dark:border-gray-800/50 mt-3">
                  <strong className="text-[#434655] dark:text-gray-300 block mb-0.5 font-semibold">Eligibility Rule:</strong>
                  {policy.eligibility}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 size={13} /> Active Policy
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(policy)}
                    className="p-1.5 text-[#434655] hover:text-[#2563eb] dark:text-gray-400 dark:hover:text-blue-400 hover:bg-[#ededf9] dark:hover:bg-gray-800 rounded transition-colors"
                    title="Edit Policy Rules"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
                    className="p-1.5 text-[#434655] hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                    title="Delete or Disable Policy"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
