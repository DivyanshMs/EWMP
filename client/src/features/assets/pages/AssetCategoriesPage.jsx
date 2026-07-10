import React, { useState } from 'react';
import { Laptop, HardDrive, Monitor, Keyboard, Mouse, Smartphone, Printer, Network, FileCode, Package, PlusCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { CategoryBadge, CATEGORY_CONFIGS } from '../components/AssetBadges';
import { AssetProgressBar } from '../components/AssetCards';

/**
 * AssetCategoriesPage.jsx
 * Manage all 10 enterprise asset categories with counts, utilization rates,
 * and quick register/edit/delete actions.
 */
export const AssetCategoriesPage = ({ onRegisterInCategory, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'LAPTOP',      label: 'Laptop',           icon: Laptop,    total: 84,  assigned: 62, maintenance: 4,  available: 18, description: 'Corporate development laptops, ultrabooks, and executive notebooks for engineering, sales, and executive teams.' },
    { id: 'DESKTOP',     label: 'Desktop PC',        icon: HardDrive, total: 32,  assigned: 18, maintenance: 2,  available: 12, description: 'Fixed workstations and all-in-one PCs primarily deployed in data entry, call center, and design studio departments.' },
    { id: 'MONITOR',     label: 'Monitor & Display', icon: Monitor,   total: 61,  assigned: 55, maintenance: 1,  available: 5,  description: 'Corporate monitors including 4K, UltraWide, and dual-display setups for engineering and creative teams.' },
    { id: 'KEYBOARD',    label: 'Keyboard',          icon: Keyboard,  total: 72,  assigned: 68, maintenance: 0,  available: 4,  description: 'Mechanical, ergonomic, and wireless keyboards including spare peripherals for hot-desking environments.' },
    { id: 'MOUSE',       label: 'Mouse & Trackpad',  icon: Mouse,     total: 68,  assigned: 65, maintenance: 0,  available: 3,  description: 'Wireless ergonomic mice, vertical mice, and Bluetooth trackpads assigned to mobile and office workers.' },
    { id: 'PHONE',       label: 'Mobile Phone',      icon: Smartphone,total: 43,  assigned: 27, maintenance: 3,  available: 13, description: 'Corporate-issued smartphones including iPhone and Android devices for remote-capable workforce members.' },
    { id: 'PRINTER',     label: 'Printer & Scanner', icon: Printer,   total: 14,  assigned: 6,  maintenance: 2,  available: 6,  description: 'Network laser printers, inkjet color printers, and multifunction scanner copier units across all floors.' },
    { id: 'NETWORKING',  label: 'Networking',        icon: Network,   total: 28,  assigned: 0,  maintenance: 1,  available: 27, description: 'Switches, routers, access points, and firewall appliances in the data center and all office network closets.' },
    { id: 'SOFTWARE',    label: 'Software License',  icon: FileCode,  total: 19,  assigned: 19, maintenance: 0,  available: 0,  description: 'Perpetual and subscription-based software licenses including Office 365, Adobe CC, Atlassian Jira, and GitHub Enterprise.' },
    { id: 'OTHER',       label: 'Other Equipment',   icon: Package,   total: 12,  assigned: 4,  maintenance: 1,  available: 7,  description: 'Miscellaneous IT equipment including cables, adapters, battery banks, and specialized peripheral devices.' },
  ];

  const selected = selectedCategory ? categories.find(c => c.id === selectedCategory) : null;

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 border border-indigo-200">CMDB TAXONOMY</span>
            <span className="text-xs text-[#737686] font-mono">10 Standard IT Asset Categories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">Asset Category Registry</h2>
          <p className="text-xs text-[#737686] mt-0.5">Manage enterprise asset classification, view utilization rates, and register new assets by category.</p>
        </div>
        <button onClick={() => onRegisterInCategory && onRegisterInCategory()}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0">
          <PlusCircle size={15} /> Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            const cfg = CATEGORY_CONFIGS[cat.id] || CATEGORY_CONFIGS.OTHER;
            const utilPct = cat.total > 0 ? Math.round((cat.assigned / cat.total) * 100) : 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`bg-white dark:bg-[#111111] border-2 rounded-2xl p-5 shadow-xs cursor-pointer transition-all space-y-4 hover:shadow-md ${
                  isSelected ? 'border-[#2563eb] bg-blue-50/20 dark:bg-blue-950/10' : 'border-[#e1e2ed] dark:border-gray-800 hover:border-gray-400'
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${cfg.bg} ${cfg.color} border ${cfg.border} shadow-2xs`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white">{cat.label}</h4>
                      <span className="font-mono text-xs font-bold text-[#737686]">{cat.total} total assets</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`transition-transform ${isSelected ? 'rotate-90 text-[#2563eb]' : 'text-[#737686]'}`} />
                </div>

                {/* Utilization Bar */}
                <AssetProgressBar value={cat.assigned} max={cat.total} label={`${cat.assigned} assigned (${utilPct}%)`} size="md"
                  color={utilPct > 90 ? 'bg-rose-500' : utilPct > 70 ? 'bg-amber-500' : 'bg-[#2563eb]'} />

                {/* Sub-counts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg p-2">
                    <div className="font-extrabold text-emerald-600 text-sm">{cat.available}</div>
                    <div className="text-[#737686] uppercase">Available</div>
                  </div>
                  <div className="bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg p-2">
                    <div className="font-extrabold text-[#2563eb] text-sm">{cat.assigned}</div>
                    <div className="text-[#737686] uppercase">Assigned</div>
                  </div>
                  <div className="bg-[#faf8ff] dark:bg-gray-900/40 rounded-lg p-2">
                    <div className="font-extrabold text-amber-600 text-sm">{cat.maintenance}</div>
                    <div className="text-[#737686] uppercase">Maint.</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Panel */}
        <div className="space-y-5">
          {selected ? (
            <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4 sticky top-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
                <CategoryBadge category={selected.id} size="lg" />
                <button onClick={() => onRegisterInCategory && onRegisterInCategory(selected.id)}
                  className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <PlusCircle size={13} /> Add Asset
                </button>
              </div>
              <p className="text-xs text-[#737686] font-sans leading-relaxed">{selected.description}</p>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: 'Total Assets',    value: selected.total,       color: 'text-[#191b23] dark:text-white' },
                  { label: 'Assigned',        value: selected.assigned,    color: 'text-[#2563eb]' },
                  { label: 'Available',       value: selected.available,   color: 'text-emerald-600' },
                  { label: 'Maintenance',     value: selected.maintenance, color: 'text-amber-600' },
                  { label: 'Utilization Rate',value: `${selected.total > 0 ? Math.round((selected.assigned/selected.total)*100) : 0}%`, color: 'text-purple-600' },
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between py-1.5 border-b border-[#e1e2ed] dark:border-gray-800 last:border-0">
                    <span className="text-[#737686]">{stat.label}:</span>
                    <strong className={`font-bold ${stat.color}`}>{stat.value}</strong>
                  </div>
                ))}
              </div>
              <button onClick={() => onSelectCategory && onSelectCategory(selected.id)}
                className="w-full py-2 text-xs font-bold text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-colors">
                View All {selected.label} Assets <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="bg-[#faf8ff] dark:bg-[#161616] border border-dashed border-[#c3c6d7] dark:border-gray-700 rounded-2xl p-8 text-center text-xs text-[#737686] font-mono space-y-2">
              <Package size={24} className="mx-auto text-[#c3c6d7]" />
              <p>Click any category card to view detailed statistics and quick actions.</p>
            </div>
          )}

          {/* Summary Widget */}
          <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white rounded-2xl p-5 shadow-md space-y-3 font-sans">
            <h4 className="font-extrabold text-sm">Total CMDB Inventory</h4>
            <div className="text-4xl font-black font-mono">{categories.reduce((s, c) => s + c.total, 0)}</div>
            <p className="text-xs text-blue-100">Assets across 10 categories &amp; all departments</p>
            <div className="text-xs font-mono text-blue-200 space-y-1 pt-2 border-t border-blue-500/40">
              <div className="flex justify-between"><span>Assigned:</span><strong>{categories.reduce((s,c)=>s+c.assigned,0)}</strong></div>
              <div className="flex justify-between"><span>Available:</span><strong>{categories.reduce((s,c)=>s+c.available,0)}</strong></div>
              <div className="flex justify-between"><span>Maintenance:</span><strong>{categories.reduce((s,c)=>s+c.maintenance,0)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
