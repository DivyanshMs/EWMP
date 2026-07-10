import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Laptop, User, Calendar, ShieldAlert, Save } from 'lucide-react';
import { CategoryBadge } from '../components/AssetBadges';

/**
 * AssetAllocationPage.jsx
 * Step-by-step asset allocation wizard.
 * Steps: Select Employee → Select Asset → Set Dates & Notes → Review → Confirmation
 */
export const AssetAllocationPage = ({ onCancel, onConfirm }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [form, setForm] = useState({
    employee: '',
    employeeName: '',
    department: '',
    project: '',
    assetId: '',
    assetName: '',
    assetCategory: '',
    allocationDate: '',
    expectedReturnDate: '',
    notes: '',
    purpose: '',
  });

  const employees = [
    { id: 'EMP-001', name: 'Alex Turner',    dept: 'Engineering',  role: 'Lead Backend Engineer' },
    { id: 'EMP-002', name: 'Samantha Wu',    dept: 'Engineering',  role: 'Senior Developer' },
    { id: 'EMP-003', name: 'Elena Rostova',  dept: 'InfoSec',      role: 'Security Architect' },
    { id: 'EMP-004', name: 'David Chen',     dept: 'Sales',        role: 'Strategic Sales Lead' },
    { id: 'EMP-005', name: 'Michael Vance',  dept: 'IT',           role: 'DevOps Manager' },
  ];

  const availableAssets = [
    { id: 'AST-0031', name: 'Dell XPS 13 Plus',   category: 'LAPTOP',    condition: 'EXCELLENT' },
    { id: 'AST-0047', name: 'iPhone 15 Pro 256GB', category: 'PHONE',     condition: 'NEW' },
    { id: 'AST-0059', name: 'LG UltraFine 27"',    category: 'MONITOR',   condition: 'GOOD' },
    { id: 'AST-0072', name: 'Cisco IP Phone 8841', category: 'NETWORKING',condition: 'EXCELLENT' },
    { id: 'AST-0083', name: 'Logitech MX Keys',    category: 'KEYBOARD',  condition: 'NEW' },
  ];

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const canNext = () => {
    if (step === 1) return !!form.employee;
    if (step === 2) return !!form.assetId;
    if (step === 3) return !!form.allocationDate;
    return true;
  };

  const STEPS = [
    { num: 1, label: 'Select Employee', icon: User },
    { num: 2, label: 'Select Asset',    icon: Laptop },
    { num: 3, label: 'Dates & Notes',   icon: Calendar },
    { num: 4, label: 'Review & Confirm',icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white rounded-xl border border-[#e1e2ed] dark:border-gray-700 transition-colors shadow-2xs">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-xs font-mono font-bold text-[#2563eb] uppercase block">Allocation Wizard — Step {step} of {totalSteps}</span>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-0.5">Allocate Enterprise Asset</h2>
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone   = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all font-bold ${
                    isDone   ? 'bg-emerald-500 border-emerald-500 text-white' :
                    isActive ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-lg' :
                               'bg-white dark:bg-gray-900 border-[#e1e2ed] dark:border-gray-700 text-[#737686]'
                  }`}>
                    {isDone ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-[10px] font-mono font-bold text-center hidden sm:block ${isActive ? 'text-[#2563eb]' : isDone ? 'text-emerald-600' : 'text-[#737686]'}`}>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 transition-all mx-1 ${step > idx + 1 ? 'bg-emerald-500' : 'bg-[#e1e2ed] dark:bg-gray-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Step 1: Select Employee */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <User size={18} className="text-[#2563eb]" /> Step 1: Select Employee to Allocate Asset
              </h3>
              <p className="text-xs text-[#737686] mt-1">Choose the workforce member who will receive this enterprise asset.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employees.map(emp => (
                <button key={emp.id} onClick={() => update('employee', emp.id) || update('employeeName', emp.name) || update('department', emp.dept)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    form.employee === emp.id ? 'border-[#2563eb] bg-blue-50 dark:bg-blue-950/40' : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                  }`}>
                  <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm uppercase shrink-0">{emp.name.charAt(0)}</div>
                  <div>
                    <strong className="font-bold text-sm text-[#191b23] dark:text-white block">{emp.name}</strong>
                    <span className="text-xs text-[#737686] font-mono">{emp.role} · {emp.dept}</span>
                  </div>
                  {form.employee === emp.id && <CheckCircle2 size={18} className="text-[#2563eb] ml-auto shrink-0" />}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Project / Initiative Link (optional)</label>
              <select value={form.project} onChange={e => update('project', e.target.value)}
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans">
                <option value="">-- No Project Link --</option>
                <option value="PRJ-101">PRJ-101 (EWMP Core Engine)</option>
                <option value="PRJ-102">PRJ-102 (Auth Gateway)</option>
                <option value="PRJ-103">PRJ-103 (Mobile App)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Select Asset */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Laptop size={18} className="text-[#2563eb]" /> Step 2: Select Asset to Allocate
              </h3>
              <p className="text-xs text-[#737686] mt-1">Only AVAILABLE assets are shown. All 'ASSIGNED' and 'MAINTENANCE' assets are filtered out.</p>
            </div>
            <div className="space-y-2.5">
              {availableAssets.map(ast => (
                <button key={ast.id} onClick={() => update('assetId', ast.id) || update('assetName', ast.name) || update('assetCategory', ast.category)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
                    form.assetId === ast.id ? 'border-[#2563eb] bg-blue-50 dark:bg-blue-950/40' : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-extrabold text-[#2563eb]">{ast.id}</span>
                    <div>
                      <strong className="font-bold text-sm text-[#191b23] dark:text-white">{ast.name}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <CategoryBadge category={ast.category} size="sm" />
                    {form.assetId === ast.id && <CheckCircle2 size={16} className="text-[#2563eb]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Dates & Notes */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" /> Step 3: Set Allocation Dates &amp; Purpose
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Allocation Date <span className="text-rose-600">*</span></label>
                <input type="text" value={form.allocationDate} onChange={e => update('allocationDate', e.target.value)}
                  placeholder="e.g. Jul 08, 2026"
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Expected Return Date</label>
                <input type="text" value={form.expectedReturnDate} onChange={e => update('expectedReturnDate', e.target.value)}
                  placeholder="e.g. Dec 31, 2026 (or leave blank)"
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Purpose / Business Justification</label>
              <select value={form.purpose} onChange={e => update('purpose', e.target.value)}
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs">
                <option value="">-- Select Allocation Purpose --</option>
                <option value="ONBOARDING">New Hire Onboarding</option>
                <option value="PROJECT">Project Assignment</option>
                <option value="REPLACEMENT">Device Replacement</option>
                <option value="TEMPORARY">Temporary Loan</option>
                <option value="REMOTE">Remote Work Enablement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">IT Admin Notes &amp; Handover Instructions</label>
              <textarea rows={4} value={form.notes} onChange={e => update('notes', e.target.value)}
                placeholder="Document handover details, configuration notes, accessories included, accessories excluded, etc."
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans leading-relaxed" />
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> Step 4: Review Allocation Summary
            </h3>
            <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 space-y-4 text-sm font-sans">
              {[
                { label: 'Employee',       value: form.employeeName || 'Alex Turner' },
                { label: 'Department',     value: form.department   || 'Engineering' },
                { label: 'Asset',          value: form.assetName    || 'Dell XPS 13 Plus' },
                { label: 'Asset ID',       value: form.assetId      || 'AST-0031' },
                { label: 'Allocation Date',value: form.allocationDate || 'Jul 08, 2026' },
                { label: 'Expected Return',value: form.expectedReturnDate || 'Not specified (Permanent)' },
                { label: 'Purpose',        value: form.purpose      || 'New Hire Onboarding' },
                { label: 'Notes',          value: form.notes        || 'No additional notes.' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-4 py-2 border-b border-[#e1e2ed] dark:border-gray-800 last:border-0">
                  <span className="text-xs font-mono font-bold text-[#737686] uppercase w-32 shrink-0">{row.label}</span>
                  <span className="text-xs font-semibold text-[#191b23] dark:text-white">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-3 text-xs">
              <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-200 font-sans leading-relaxed">
                By confirming, you authorize asset allocation to <strong>{form.employeeName || 'Alex Turner'}</strong>. The employee will receive a digital acknowledgment request. Asset status will be updated to <strong>ASSIGNED</strong> in the CMDB immediately.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-[#e1e2ed] dark:border-gray-800">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : onCancel && onCancel()}
            className="px-5 py-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white font-semibold rounded-xl border border-[#e1e2ed] text-xs transition-colors">
            {step > 1 ? '← Back' : 'Cancel'}
          </button>
          <div className="flex items-center gap-3">
            {step < totalSteps ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="px-8 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50">
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={() => onConfirm && onConfirm(form)}
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all">
                <Save size={15} /> Confirm Allocation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
