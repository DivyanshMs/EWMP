import React, { useState } from 'react';
import { FileText, Edit3, CheckCircle2, PlusCircle } from 'lucide-react';
import { TaxComponentBadge } from '../components/PayrollBadges';
import { EditStructureModal } from '../components/PayrollDrawers';

/**
 * SalaryStructuresPage.jsx
 * HR & Finance configuration module for organizational CTC Salary & Tax Components.
 * Allows managing Basic Salary %, HRA, Special Allowances, Bonuses, and statutory PF/ESI/PT rules.
 */

export const SalaryStructuresPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStruct, setSelectedStruct] = useState(null);

  const [structures, setStructures] = useState([
    { id: 'STRUCT-ENG', name: 'Engineering & Technology Grade (SDE-I to VP)', basicPct: 50, hraPct: 25, specialPct: 15, bonusPct: 10, pfEnabled: true, esiEnabled: false, ptFixed: 200, staffCount: 185 },
    { id: 'STRUCT-SALES', name: 'Sales & Revenue Executive Grade', basicPct: 40, hraPct: 20, specialPct: 20, bonusPct: 20, pfEnabled: true, esiEnabled: false, ptFixed: 200, staffCount: 95 },
    { id: 'STRUCT-OPS', name: 'Operations & Customer Support Staff Grade', basicPct: 55, hraPct: 25, specialPct: 15, bonusPct: 5, pfEnabled: true, esiEnabled: true, ptFixed: 200, staffCount: 62 },
  ]);

  const handleOpenEdit = (st) => {
    setSelectedStruct(st);
    setIsModalOpen(true);
  };

  const handleSaveStructure = (updatedData) => {
    if (!selectedStruct) return;
    setStructures(structures.map(s => s.id === selectedStruct.id ? { ...s, ...updatedData } : s));
    alert(`Salary Structure rules updated for ${selectedStruct.name}! Applied to future payroll runs.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <EditStructureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStructure}
        structure={selectedStruct || {}}
      />

      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-[#2563eb]" />
            SALARY STRUCTURES & TAX COMPONENT ADMINISTRATION
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Configure CTC percentage breakdown (Basic, HRA, Allowances) and statutory tax withholdings across employee grades.
          </p>
        </div>
        <button
          onClick={() => { setSelectedStruct(structures[0]); setIsModalOpen(true); }}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <PlusCircle size={15} /> Add New Grade Structure
        </button>
      </div>

      {/* Salary Structures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {structures.map((st) => (
          <div key={st.id} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-[#c3c6d7] transition-all">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-[#e1e2ed]/60 dark:border-gray-800/60">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#737686] block">{st.id}</span>
                  <h3 className="text-base font-bold text-[#191b23] dark:text-white">{st.name}</h3>
                </div>
                <span className="px-2.5 py-1 bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] font-mono text-xs font-bold rounded">
                  {st.staffCount} Staff
                </span>
              </div>

              {/* CTC Percentage Breakdown */}
              <div className="space-y-2 text-xs my-4">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#737686] pb-1 border-b border-[#e1e2ed] dark:border-gray-800">
                  Gross Earnings Split (% of CTC)
                </h4>
                <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                  <span className="text-[#737686]">Basic Salary:</span>
                  <span className="font-mono font-bold text-[#191b23] dark:text-white text-sm">{st.basicPct}%</span>
                </div>
                <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                  <span className="text-[#737686]">House Rent Allowance (HRA):</span>
                  <span className="font-mono font-bold text-[#191b23] dark:text-white text-sm">{st.hraPct}%</span>
                </div>
                <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                  <span className="text-[#737686]">Special & Technical Allowances:</span>
                  <span className="font-mono font-bold text-[#191b23] dark:text-white text-sm">{st.specialPct}%</span>
                </div>
                <div className="flex justify-between items-center bg-[#faf8ff] dark:bg-gray-900/40 p-2 rounded">
                  <span className="text-[#737686]">Performance & Variable Bonuses:</span>
                  <span className="font-mono font-bold text-[#2563eb] text-sm">{st.bonusPct}%</span>
                </div>
              </div>

              {/* Tax & Statutory Component Tags */}
              <div className="space-y-2 text-xs pt-2">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-rose-800 dark:text-rose-300 pb-1 border-b border-rose-200 dark:border-rose-900">
                  Statutory Tax & Retirement Withholdings
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {st.pfEnabled && <TaxComponentBadge type="PF" />}
                  {st.esiEnabled && <TaxComponentBadge type="ESI" />}
                  <TaxComponentBadge type="PT" />
                  <TaxComponentBadge type="TDS" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#e1e2ed]/60 dark:border-gray-800/60">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 size={13} /> Active Compliance
              </span>
              <button
                onClick={() => handleOpenEdit(st)}
                className="px-3 py-1.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
              >
                <Edit3 size={12} /> Edit Structure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statutory Law Reference Box */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-[#434655] dark:text-gray-300 flex items-center justify-between gap-4">
        <div>
          <strong className="text-[#191b23] dark:text-white font-bold block mb-0.5">Statutory Labour Law & Tax Exemption Sync</strong>
          <span>All salary structures are automatically aligned with Indian Provident Fund (12% cap), ESI wage ceilings, and Income Tax Act HRA exemption formulas.</span>
        </div>
        <span className="text-xs font-mono font-bold text-[#2563eb] bg-white dark:bg-[#161616] px-3 py-1.5 rounded border border-blue-200 shrink-0">
          FY 2026-27 Compliant
        </span>
      </div>
    </div>
  );
};
