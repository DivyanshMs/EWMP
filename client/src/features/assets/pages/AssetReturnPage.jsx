import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, Package, Clipboard, Save, AlertTriangle } from 'lucide-react';
import { ConditionBadge } from '../components/AssetBadges';

/**
 * AssetReturnPage.jsx
 * Step-by-step asset return wizard.
 * Steps: Condition Assessment → Accessories Check → Damage Notes → Inspection → Review & Confirm
 */
export const AssetReturnPage = ({ asset, onCancel, onConfirm }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [form, setForm] = useState({
    condition: '',
    damageNotes: '',
    accessoriesReturned: {
      charger: true, bag: false, mouse: true, dockingStation: false
    },
    inspectionChecks: {
      physicalDamage: false,
      screenIntact: false,
      allPortsWorking: false,
      batteryCharge: false,
      dataWiped: false,
    },
    returnDate: '',
    inspectorNotes: '',
    returnedBy: 'Alex Turner',
  });

  const a = asset || { id: 'AST-0042', name: 'Dell XPS 15 9530 Laptop', category: 'LAPTOP' };
  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const updateNested = (parent, key, val) => setForm(f => ({ ...f, [parent]: { ...f[parent], [key]: val } }));

  const inspectionAllDone = Object.values(form.inspectionChecks).every(Boolean);
  const canNext = () => {
    if (step === 1) return !!form.condition;
    if (step === 2) return true;
    if (step === 3) return !!form.returnDate;
    return true;
  };

  const STEPS = [
    { num: 1, label: 'Condition',    icon: ShieldAlert },
    { num: 2, label: 'Accessories',  icon: Package },
    { num: 3, label: 'Inspection',   icon: Clipboard },
    { num: 4, label: 'Confirm',      icon: CheckCircle2 },
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
            <span className="text-xs font-mono font-bold text-purple-700 uppercase block">Return Wizard — Step {step} of {totalSteps}</span>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-0.5">Asset Return Processing</h2>
            <p className="text-xs text-[#737686] font-mono mt-0.5">{a.id} · {a.name}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
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
                    isActive ? 'bg-purple-600 border-purple-600 text-white shadow-lg' :
                               'bg-white dark:bg-gray-900 border-[#e1e2ed] dark:border-gray-700 text-[#737686]'
                  }`}>
                    {isDone ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-[10px] font-mono font-bold text-center hidden sm:block ${isActive ? 'text-purple-600' : isDone ? 'text-emerald-600' : 'text-[#737686]'}`}>{s.label}</span>
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
        {/* Step 1: Condition Assessment */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-purple-600" /> Step 1: Return Condition Assessment
              </h3>
              <p className="text-xs text-[#737686] mt-1">Select the physical condition of the asset being returned.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-3">
              {['NEW','EXCELLENT','GOOD','FAIR','POOR','DAMAGED'].map(cond => (
                <button key={cond} onClick={() => update('condition', cond)}
                  className={`p-3 rounded-xl border-2 transition-all text-center space-y-1.5 ${
                    form.condition === cond ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40' : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                  }`}>
                  <div className="flex justify-center"><ConditionBadge condition={cond} size="sm" /></div>
                  {form.condition === cond && <CheckCircle2 size={14} className="text-purple-600 mx-auto" />}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Damage Notes (if condition is Fair, Poor, or Damaged)</label>
              <textarea rows={3} value={form.damageNotes} onChange={e => update('damageNotes', e.target.value)}
                placeholder="Describe any scratches, dents, broken ports, screen damage, or other observable defects..."
                className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans leading-relaxed" />
            </div>
          </div>
        )}

        {/* Step 2: Accessories Returned */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Package size={18} className="text-amber-500" /> Step 2: Accessories Return Checklist
              </h3>
              <p className="text-xs text-[#737686] mt-1">Check all accessories returned with the asset.</p>
            </div>
            <div className="space-y-2.5">
              {[
                { key: 'charger',         label: 'Power Adapter / Charger' },
                { key: 'bag',             label: 'Laptop Carry Bag / Case' },
                { key: 'mouse',           label: 'Wireless Mouse' },
                { key: 'dockingStation',  label: 'Docking Station / USB Hub' },
              ].map(acc => (
                <label key={acc.key} className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  form.accessoriesReturned[acc.key] ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                }`}>
                  <span className="font-semibold text-sm text-[#191b23] dark:text-white">{acc.label}</span>
                  <input type="checkbox" checked={form.accessoriesReturned[acc.key]}
                    onChange={e => updateNested('accessoriesReturned', acc.key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600" />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Inspection & Return Date */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
                <Clipboard size={18} className="text-[#2563eb]" /> Step 3: IT Inspection Checklist &amp; Return Date
              </h3>
              <p className="text-xs text-[#737686] mt-1">Complete the mandatory IT inspection before accepting the return.</p>
            </div>
            <div className="space-y-2 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] p-4">
              {[
                { key: 'physicalDamage',   label: 'Verified no unreported physical damage' },
                { key: 'screenIntact',     label: 'Screen is intact with no cracks or dead pixels' },
                { key: 'allPortsWorking',  label: 'All USB, HDMI, and power ports functional' },
                { key: 'batteryCharge',    label: 'Battery charges to at least 50% capacity' },
                { key: 'dataWiped',        label: 'User data and accounts cleared from device' },
              ].map(chk => (
                <label key={chk.key} className="flex items-center gap-3 py-2.5 border-b border-[#e1e2ed] dark:border-gray-800 last:border-0 cursor-pointer group">
                  <input type="checkbox" checked={form.inspectionChecks[chk.key]}
                    onChange={e => updateNested('inspectionChecks', chk.key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#2563eb]" />
                  <span className={`text-sm font-semibold transition-colors ${form.inspectionChecks[chk.key] ? 'text-emerald-600 line-through' : 'text-[#191b23] dark:text-white'}`}>
                    {chk.label}
                  </span>
                </label>
              ))}
            </div>
            {!inspectionAllDone && (
              <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-700">
                <AlertTriangle size={14} /> Please complete all inspection checklist items before proceeding.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Return Date <span className="text-rose-600">*</span></label>
                <input type="text" value={form.returnDate} onChange={e => update('returnDate', e.target.value)}
                  placeholder="e.g. Jul 08, 2026"
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b23] dark:text-white mb-1.5">Inspector IT Admin Notes</label>
                <input type="text" value={form.inspectorNotes} onChange={e => update('inspectorNotes', e.target.value)}
                  placeholder="e.g. Minor keyboard scuff, documented"
                  className="w-full p-3 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> Step 4: Confirm Asset Return
            </h3>
            <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 space-y-3 text-xs font-sans">
              {[
                { label: 'Asset ID',        value: a.id },
                { label: 'Asset Name',      value: a.name },
                { label: 'Returned By',     value: form.returnedBy },
                { label: 'Return Date',     value: form.returnDate || 'Jul 08, 2026' },
                { label: 'Condition',       value: form.condition || 'GOOD' },
                { label: 'Damage Notes',    value: form.damageNotes || 'None reported' },
                { label: 'Inspection',      value: inspectionAllDone ? '✓ All checks passed' : '⚠ Incomplete' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-4 py-2 border-b border-[#e1e2ed] dark:border-gray-800 last:border-0">
                  <span className="text-xs font-mono font-bold text-[#737686] uppercase w-28 shrink-0">{row.label}</span>
                  <span className="text-xs font-semibold text-[#191b23] dark:text-white">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-start gap-3 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-emerald-800 dark:text-emerald-200 font-sans leading-relaxed">
                Asset status will be updated to <strong>AVAILABLE</strong> in the CMDB. The allocation ledger will be closed and an automated acknowledgment will be sent.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-[#e1e2ed] dark:border-gray-800">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : onCancel && onCancel()}
            className="px-5 py-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white font-semibold rounded-xl border border-[#e1e2ed] text-xs">
            {step > 1 ? '← Back' : 'Cancel'}
          </button>
          {step < totalSteps ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50">
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={() => onConfirm && onConfirm(form)}
              className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2">
              <Save size={15} /> Confirm Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
