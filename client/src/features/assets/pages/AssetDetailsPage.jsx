import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, UserPlus, Wrench, RotateCcw, Calendar, MapPin, FileText, Activity, Download, Cpu, Hash, Package, DollarSign } from 'lucide-react';
import { CategoryBadge, AssetStatusBadge, ConditionBadge } from '../components/AssetBadges';
import { AssetProgressBar } from '../components/AssetCards';
import { SkeletonTimeline } from '../components/AssetLoadingStates';

/**
 * AssetDetailsPage.jsx
 * Complete asset dossier with specs, purchase details, warranty, allocation history,
 * maintenance history, and activity timeline.
 */
export const AssetDetailsPage = ({ asset, onBack, onEdit, onAllocate, onReturn, onScheduleMaintenance, onRetire }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const a = asset || {
    id: 'AST-0042',
    name: 'Dell XPS 15 9530 Laptop',
    category: 'LAPTOP',
    brand: 'Dell',
    model: 'XPS 15 9530',
    serialNumber: 'DXPS15-9530-2024-042',
    status: 'ASSIGNED',
    condition: 'EXCELLENT',
    assignedTo: 'Alex Turner',
    department: 'Engineering',
    location: 'HQ Floor 3 — Engineering Bay, Desk 14',
    purchaseDate: 'Mar 15, 2024',
    purchasePrice: '$2,499.00',
    vendor: 'Dell Technologies Direct',
    invoiceNumber: 'INV-DELL-2024-0891',
    warrantyExpiry: 'Mar 15, 2027',
    warrantyDaysLeft: 617,
    warrantyType: 'ProSupport Plus 3-Year',
    notes: 'Primary development machine for senior engineering staff. Configured with Ubuntu 22.04 LTS dual-boot.',
    specs: {
      processor: 'Intel Core i9-13900H (24 cores)',
      ram: '32 GB DDR5-4800',
      storage: '1 TB PCIe Gen 4 NVMe SSD',
      display: '15.6" OLED 3.5K UWQHD+ Touch',
      gpu: 'NVIDIA GeForce RTX 4070 8GB',
      os: 'Windows 11 Pro + Ubuntu 22.04',
      connectivity: 'Wi-Fi 6E, Bluetooth 5.3, Thunderbolt 4',
    },
    allocationHistory: [
      { holder: 'Alex Turner', dept: 'Engineering', from: 'Mar 20, 2024', to: 'Present', returnCondition: null },
      { holder: 'David Chen',  dept: 'Sales',       from: 'Jan 10, 2024', to: 'Mar 19, 2024', returnCondition: 'GOOD' },
    ],
    maintenanceHistory: [
      { id: 'MNT-0008', type: 'OS Image Refresh', date: 'Dec 12, 2023', technician: 'IT Admin', cost: '$0',   status: 'COMPLETED' },
      { id: 'MNT-0021', type: 'Battery Replacement', date: 'Jun 02, 2024', technician: 'Dell ProSupport', cost: '$89', status: 'COMPLETED' },
    ],
    activityLog: [
      { action: 'Allocated',              user: 'Michael Vance IT Admin', timestamp: 'Mar 20, 2024 at 9:10 AM' },
      { action: 'Condition updated to Excellent', user: 'Michael Vance IT Admin', timestamp: 'Mar 20, 2024 at 9:12 AM' },
      { action: 'Returned by David Chen', user: 'Michael Vance IT Admin', timestamp: 'Mar 19, 2024 at 5:00 PM' },
      { action: 'Registered in CMDB',     user: 'IT Admin System',        timestamp: 'Jan 08, 2024 at 11:30 AM' },
    ],
  };

  const tabs = [
    { id: 'overview',     label: 'Overview & Specs',      icon: Cpu },
    { id: 'allocation',   label: 'Allocation History',    icon: UserPlus },
    { id: 'maintenance',  label: 'Maintenance Records',   icon: Wrench },
    { id: 'timeline',     label: 'Activity Timeline',     icon: Activity },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white rounded-xl border border-[#e1e2ed] dark:border-gray-700 transition-colors shadow-2xs">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-[#2563eb] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">{a.id}</span>
              <CategoryBadge category={a.category} size="sm" />
              <AssetStatusBadge status={a.status} size="sm" />
            </div>
            <h2 className="text-xl font-extrabold text-[#191b23] dark:text-white mt-1">{a.name}</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button onClick={() => onEdit && onEdit(a)} className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <Edit3 size={14} /> Edit
          </button>
          <button onClick={() => onAllocate && onAllocate(a)} className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5">
            <UserPlus size={14} /> Allocate
          </button>
          <button onClick={() => onReturn && onReturn(a)} className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-200 flex items-center gap-1.5">
            <RotateCcw size={14} /> Return
          </button>
          <button onClick={() => onScheduleMaintenance && onScheduleMaintenance(a)} className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <Wrench size={14} /> Maintenance
          </button>
          <button onClick={() => onRetire && onRetire(a.id)} className="p-2 text-gray-400 hover:text-rose-600 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors" title="Retire Asset">
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Main Layout: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tabs & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Bar */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-2 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {tabs.map(t => {
              const I = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${activeTab===t.id ? 'bg-[#2563eb] text-white shadow-2xs' : 'text-[#737686] hover:bg-[#faf8ff] dark:hover:bg-gray-900'}`}>
                  <I size={14} />{t.label}
                </button>
              );
            })}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Technical Specifications */}
              <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Cpu size={16} className="text-[#2563eb]" /> Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {Object.entries(a.specs).map(([key, val]) => (
                    <div key={key} className="p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-xl border border-[#e1e2ed]/80 flex items-start gap-3">
                      <Cpu size={14} className="text-[#2563eb] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase text-[#737686] font-bold block">{key.replace(/([A-Z])/g,' $1').trim()}</span>
                        <strong className="font-sans font-semibold text-[#191b23] dark:text-white text-xs">{val}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Details & Invoice */}
              <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <DollarSign size={16} className="text-purple-600" /> Purchase & Invoice Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  {[
                    { label: 'Purchase Date',   value: a.purchaseDate,   icon: Calendar },
                    { label: 'Purchase Price',  value: a.purchasePrice,  icon: DollarSign },
                    { label: 'Vendor',          value: a.vendor,         icon: Package },
                    { label: 'Invoice Number',  value: a.invoiceNumber,  icon: Hash },
                    { label: 'Serial Number',   value: a.serialNumber,   icon: FileText },
                  ].map(item => (
                    <div key={item.label} className="space-y-0.5">
                      <span className="text-[10px] uppercase text-[#737686] font-bold flex items-center gap-1"><item.icon size={11} /> {item.label}</span>
                      <strong className="font-sans font-semibold text-[#191b23] dark:text-white text-xs block">{item.value}</strong>
                    </div>
                  ))}
                </div>
                {/* Invoice Placeholder */}
                <div className="mt-2 p-3 bg-[#faf8ff] dark:bg-gray-900/40 rounded-xl border border-[#e1e2ed] border-dashed flex items-center justify-between text-xs font-mono">
                  <span className="text-[#737686] flex items-center gap-2"><FileText size={14} className="text-[#2563eb]" /> Invoice & Purchase Documents</span>
                  <button className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1"><Download size={12} /> Download Invoice PDF</button>
                </div>
              </div>

              {/* Notes */}
              {a.notes && (
                <div className="bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 text-xs font-sans text-[#737686] leading-relaxed">
                  <span className="font-bold text-[#191b23] dark:text-white uppercase text-[10px] font-mono block mb-1.5">📝 IT Admin Notes</span>
                  {a.notes}
                </div>
              )}
            </div>
          )}

          {/* Allocation History Tab */}
          {activeTab === 'allocation' && (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <UserPlus size={16} className="text-[#2563eb]" /> Full Allocation Ledger ({a.allocationHistory.length} records)
              </h4>
              <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
                {a.allocationHistory.map((h, i) => (
                  <div key={i} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm uppercase shadow-2xs shrink-0">
                        {h.holder.charAt(0)}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-[#191b23] dark:text-white block">{h.holder}</strong>
                        <span className="text-xs text-[#737686] font-mono">{h.dept}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono">
                      <span className="block text-[#191b23] dark:text-white font-bold">{h.from} → {h.to}</span>
                      {h.returnCondition ? (
                        <ConditionBadge condition={h.returnCondition} size="sm" />
                      ) : (
                        <span className="text-emerald-600 font-bold">● Active Holder</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance History Tab */}
          {activeTab === 'maintenance' && (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Wrench size={16} className="text-amber-500" /> Maintenance & Repair History ({a.maintenanceHistory.length} records)
              </h4>
              <div className="divide-y divide-[#e1e2ed] dark:divide-gray-800">
                {a.maintenanceHistory.map((m, i) => (
                  <div key={i} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-mono font-extrabold text-amber-600">{m.id}</span>
                      <p className="font-bold text-sm text-[#191b23] dark:text-white">{m.type}</p>
                      <span className="text-xs text-[#737686] font-mono">By {m.technician}</span>
                    </div>
                    <div className="text-right text-xs font-mono">
                      <span className="block font-bold text-[#191b23] dark:text-white">{m.date}</span>
                      <span className="block text-emerald-600 font-bold">{m.cost}</span>
                      <span className="block text-emerald-600 text-[10px] mt-0.5">✓ {m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-5">
              <h4 className="font-bold text-sm text-[#191b23] dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Activity size={16} className="text-[#2563eb]" /> Full Asset Activity Audit Trail
              </h4>
              <div className="space-y-4 relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#e1e2ed] dark:bg-gray-800" />
                {a.activityLog.map((log, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="absolute -left-4.5 w-4 h-4 rounded-full bg-[#2563eb] border-2 border-white dark:border-[#111111] shrink-0 mt-0.5" />
                    <div className="bg-[#faf8ff] dark:bg-gray-900/40 border border-[#e1e2ed]/80 rounded-xl p-3 flex-1 text-xs font-sans">
                      <p className="font-bold text-[#191b23] dark:text-white">{log.action}</p>
                      <span className="text-[#737686] font-mono block mt-0.5">By {log.user} · {log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Asset Metadata */}
        <div className="space-y-5">
          {/* Status & Location */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">Asset Metadata</h4>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#737686]">Status:</span>
                <AssetStatusBadge status={a.status} size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#737686]">Condition:</span>
                <ConditionBadge condition={a.condition} size="sm" />
              </div>
              <div className="flex justify-between items-start gap-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
                <span className="text-[#737686] flex items-center gap-1"><MapPin size={12} /> Location:</span>
                <span className="font-semibold text-[#191b23] dark:text-white text-right max-w-[140px]">{a.location}</span>
              </div>
            </div>
          </div>

          {/* Current Holder */}
          {a.assignedTo && (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">Current Holder</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">{a.assignedTo.charAt(0)}</div>
                <div>
                  <strong className="font-bold text-sm text-[#191b23] dark:text-white block">{a.assignedTo}</strong>
                  <span className="text-xs font-mono text-[#737686]">{a.department}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warranty Box */}
          <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-[#737686] uppercase tracking-wider font-mono pb-2 border-b border-[#e1e2ed] dark:border-gray-800">Warranty & SLA</h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><span className="text-[#737686]">Type:</span><strong className="text-[#191b23] dark:text-white font-sans">{a.warrantyType}</strong></div>
              <div className="flex justify-between"><span className="text-[#737686]">Expires:</span><strong className="text-[#191b23] dark:text-white">{a.warrantyExpiry}</strong></div>
              <div className="flex justify-between"><span className="text-[#737686]">Days Left:</span><strong className="text-emerald-600">{a.warrantyDaysLeft}d</strong></div>
            </div>
            <AssetProgressBar value={a.warrantyDaysLeft} max={1095} color="bg-emerald-500" label="Coverage Remaining" size="md" />
          </div>
        </div>
      </div>
    </div>
  );
};
