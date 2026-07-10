import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, ShieldCheck, Send } from 'lucide-react';
import { PayrollStatusBadge, PaymentMethodBadge } from './PayrollBadges';

/**
 * PayrollDrawers.jsx
 * Precision Enterprise modals and slide-over drawers for EWMP Payroll Management.
 * Includes RunPayrollModal, MarkPaidModal, and EditStructureModal.
 */

export const RunPayrollModal = ({ isOpen, onClose, onConfirm }) => {
  const [month, setMonth] = useState('August');
  const [year, setYear] = useState('2026');
  const [dept, setDept] = useState('ALL');
  const [includeBonus, setIncludeBonus] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm({
        month,
        year,
        dept,
        includeBonus,
        id: `PR-2026-${month === 'August' ? '08' : '09'}`,
        empCount: dept === 'ALL' ? 342 : 120,
        totalCost: dept === 'ALL' ? 4850000 : 1850000,
        status: 'PENDING_APPROVAL',
        generatedBy: 'Sarah HR VP',
        generatedDate: 'Today'
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <DollarSign size={18} className="text-[#2563eb]" />
            Execute Monthly Payroll Calculation Run
          </h3>
          <button onClick={onClose} className="text-[#737686] hover:text-[#191b23] dark:hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Payroll Month *</label>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full font-bold">
                <option value="August">August (Current)</option>
                <option value="September">September (Upcoming)</option>
                <option value="July">July (Revision)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Payroll Year *</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full font-mono font-bold">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Target Department Filter</label>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full font-medium">
              <option value="ALL">All Organization Departments (342 Employees)</option>
              <option value="ENG">Engineering & Product Only (120 Employees)</option>
              <option value="SALES">Sales & Marketing Only (95 Employees)</option>
              <option value="OPS">Operations & CS (85 Employees)</option>
            </select>
          </div>

          <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 space-y-3">
            <h4 className="font-bold text-[#191b23] dark:text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> Automated Statutory & Leave Sync
            </h4>
            <div className="space-y-1.5 text-[#434655] dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span>Unpaid Leave (LOP) Deduction Sync:</span>
                <strong className="text-emerald-600 font-mono">100% Verified</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>PF / ESI Statutory Tax Withholdings:</span>
                <strong className="text-emerald-600 font-mono">Auto-Calculated</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Total Disbursal Cost:</span>
                <strong className="text-[#2563eb] font-mono font-bold">
                  {dept === 'ALL' ? '₹48,50,000' : '₹18,50,000'}
                </strong>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
            <input
              type="checkbox"
              checked={includeBonus}
              onChange={(e) => setIncludeBonus(e.target.checked)}
              className="w-4 h-4 text-[#2563eb] rounded"
            />
            <span className="font-semibold text-[#191b23] dark:text-white">Include quarterly performance bonus incentives in this run</span>
          </label>

          <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-end gap-2 -mx-6 -mb-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-3.5 py-2 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded text-xs font-semibold text-[#191b23] dark:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded text-xs font-semibold shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Send size={14} /> Generate Payroll Run
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MarkPaidModal = ({ isOpen, onClose, onConfirm, payroll = {} }) => {
  const [paymentDate, setPaymentDate] = useState('2026-07-05');
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [refNum, setRefNum] = useState('ICICI-UTRF-908213891');
  const [notes, setNotes] = useState('Batch NACH transfer executed successfully via Corporate Internet Banking.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Mark Payroll Run as Paid & Disbursed
          </h3>
          <button onClick={onClose} className="text-[#737686] hover:text-[#191b23] dark:hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-[#faf8ff] dark:bg-gray-900/50 rounded border border-[#e1e2ed] dark:border-gray-800 flex justify-between">
            <div>
              <span className="text-[#737686] block">Payroll Period:</span>
              <strong className="text-sm font-bold text-[#191b23] dark:text-white">{payroll.month || 'July'} {payroll.year || '2026'}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#737686] block">Disbursal Amount:</span>
              <strong className="text-sm font-mono font-extrabold text-emerald-600">₹{(payroll.totalCost || 4850000).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Actual Payment Settlement Date *</label>
            <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full font-mono font-bold" />
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Payment Method *</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full font-semibold">
              <option value="BANK_TRANSFER">Bank NEFT / RTGS Batch Transfer</option>
              <option value="IMPS">Instant IMPS Bulk Transfer</option>
              <option value="CHEQUE">Corporate Cheque Disbursal</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Reference Number / UTR / Transaction ID *</label>
            <input
              type="text"
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
              placeholder="e.g. UTR-ICICI-88127391"
              className="w-full font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Finance Accounting Notes</label>
            <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full" />
          </div>
        </div>

        <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-2 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded text-xs font-semibold text-[#191b23] dark:text-white">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm({ paymentDate, method, refNum, notes, id: payroll.id }); onClose(); }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} /> Confirm Settlement
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditStructureModal = ({ isOpen, onClose, onSave, structure = {} }) => {
  const [basicPct, setBasicPct] = useState(structure.basicPct || 50);
  const [hraPct, setHraPct] = useState(structure.hraPct || 25);
  const [pfEnabled, setPfEnabled] = useState(structure.pfEnabled !== false);
  const [esiEnabled, setEsiEnabled] = useState(structure.esiEnabled !== false);
  const [ptFixed, setPtFixed] = useState(structure.ptFixed || 200);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <DollarSign size={16} className="text-[#2563eb]" />
            Edit Salary & Tax Component Structure
          </h3>
          <button onClick={onClose} className="text-[#737686] hover:text-[#191b23] dark:hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">Basic Salary (% of CTC)</label>
              <input type="number" value={basicPct} onChange={(e) => setBasicPct(Number(e.target.value))} className="w-full font-mono font-bold" />
            </div>
            <div>
              <label className="font-semibold block mb-1.5 text-[#191b23] dark:text-white">HRA (% of CTC)</label>
              <input type="number" value={hraPct} onChange={(e) => setHraPct(Number(e.target.value))} className="w-full font-mono font-bold" />
            </div>
          </div>

          <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 space-y-3">
            <h4 className="font-bold text-[#191b23] dark:text-white">Statutory Tax & Retirement Withholdings</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={pfEnabled} onChange={(e) => setPfEnabled(e.target.checked)} className="w-4 h-4 text-[#2563eb] rounded" />
              <span>Provident Fund (PF - 12% Employee + 12% Employer)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={esiEnabled} onChange={(e) => setEsiEnabled(e.target.checked)} className="w-4 h-4 text-[#2563eb] rounded" />
              <span>Employee State Insurance (ESI - 0.75% + 3.25%)</span>
            </label>
            <div>
              <label className="font-semibold block mb-1 text-[#737686]">Professional Tax (Monthly Fixed ₹)</label>
              <input type="number" value={ptFixed} onChange={(e) => setPtFixed(Number(e.target.value))} className="w-full font-mono max-w-[120px]" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-2 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded text-xs font-semibold text-[#191b23] dark:text-white">
            Cancel
          </button>
          <button
            onClick={() => { onSave({ basicPct, hraPct, pfEnabled, esiEnabled, ptFixed }); onClose(); }}
            className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white rounded text-xs font-semibold shadow-xs transition-all"
          >
            Save Structure Rules
          </button>
        </div>
      </div>
    </div>
  );
};
