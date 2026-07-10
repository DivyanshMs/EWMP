import React, { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet, Printer, Mail, Check, X } from 'lucide-react';

/**
 * ExportDialogs.jsx
 * Enterprise export and distribution modal dialog supporting PDF, Excel, CSV, Print, and Email delivery.
 * Allows custom scope selection, security classification stamping, and scheduled delivery.
 */

export const ExportDialog = ({
  reportTitle = 'Workforce Summary BI Report',
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const [format, setFormat] = useState('PDF'); // 'PDF' | 'EXCEL' | 'CSV' | 'PRINT' | 'EMAIL'
  const [emailRecipient, setEmailRecipient] = useState('alex.turner@ewmp.enterprise');
  const [scheduleDelivery, setScheduleDelivery] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('WEEKLY_MONDAY');
  const [includeRawData, setIncludeRawData] = useState(true);

  const formats = [
    { id: 'PDF', label: 'PDF Document (.pdf)', desc: 'Formatted executive briefing with charts & tables', icon: FileText, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950' },
    { id: 'EXCEL', label: 'Excel Workbook (.xlsx)', desc: 'Multi-tab spreadsheet with raw audit formulas', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
    { id: 'CSV', label: 'Raw Data (.csv)', desc: 'Plain comma-separated values for database import', icon: Table, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950' },
    { id: 'PRINT', label: 'Print Layout', desc: 'Optimized high-contrast stylesheet for paper printing', icon: Printer, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
    { id: 'EMAIL', label: 'Email Distribution', desc: 'Direct secure dispatch with encrypted download link', icon: Mail, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm && onConfirm({
      format,
      emailRecipient: format === 'EMAIL' ? emailRecipient : null,
      scheduleDelivery,
      scheduleFrequency: scheduleDelivery ? scheduleFrequency : null,
      includeRawData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563eb]">
              <Download size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
                Export &amp; Distribute Report
              </h3>
              <p className="text-xs text-[#737686] font-mono truncate max-w-xs">
                {reportTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
          {/* Format Selection Grid */}
          <div className="space-y-2">
            <label className="block font-bold text-[#191b23] dark:text-white uppercase font-mono text-[11px]">
              1. Select Delivery Format *
            </label>
            <div className="grid grid-cols-1 gap-2">
              {formats.map((item) => {
                const Icon = item.icon;
                const isSelected = format === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setFormat(item.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#2563eb] ring-1 ring-[#2563eb]/30 shadow-2xs'
                        : 'bg-[#faf8ff] dark:bg-[#161616] border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <strong className="font-extrabold text-xs text-[#191b23] dark:text-white block">{item.label}</strong>
                        <span className="text-[11px] text-[#737686] block">{item.desc}</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-[#2563eb] border-[#2563eb] text-white' : 'border-gray-300 dark:border-gray-700'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Placeholder Configuration */}
          {format === 'EMAIL' && (
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <Mail size={15} />
                <span>Email Distribution Recipient</span>
              </div>
              <input
                type="email"
                required
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                placeholder="Enter executive or auditor email..."
                className="w-full p-2.5 bg-white dark:bg-[#161616] border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-mono"
              />
            </div>
          )}

          {/* Export Options & Scheduling */}
          <div className="space-y-2.5 pt-1 border-t border-[#e1e2ed] dark:border-gray-800 font-mono text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRawData}
                onChange={(e) => setIncludeRawData(e.target.checked)}
                className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <span className="text-[#191b23] dark:text-gray-200 font-sans font-semibold">Include raw audit line-item entries and department formula breakdowns</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scheduleDelivery}
                onChange={(e) => setScheduleDelivery(e.target.checked)}
                className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <span className="text-[#191b23] dark:text-gray-200 font-sans font-semibold">Schedule recurring automated delivery (Power BI / Looker sync)</span>
            </label>

            {scheduleDelivery && (
              <div className="pl-6 pt-1 animate-fade-in">
                <select
                  value={scheduleFrequency}
                  onChange={(e) => setScheduleFrequency(e.target.value)}
                  className="p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl font-mono text-xs font-bold text-[#2563eb]"
                >
                  <option value="DAILY_8AM">Daily at 08:00 AM UTC</option>
                  <option value="WEEKLY_MONDAY">Weekly on Mondays (Executive Brief)</option>
                  <option value="MONTHLY_1ST">Monthly on 1st of each month</option>
                  <option value="QUARTERLY">Quarterly Fiscal Close</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Download size={15} /> Confirm &amp; Dispatch Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
