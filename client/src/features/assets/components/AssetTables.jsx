import React, { useState } from 'react';
import { MoreVertical, Edit3, Trash2, ArrowUpRight, Wrench, User, MapPin, Calendar, Laptop } from 'lucide-react';
import { CategoryBadge, AssetStatusBadge, ConditionBadge, CATEGORY_CONFIGS } from './AssetBadges';

/**
 * AssetTables.jsx
 * Enterprise asset inventory table with multi-row selection, sorting,
 * bulk actions, and per-row action menus.
 */
export const AssetInventoryTable = ({
  assets = [],
  onSelectAsset,
  onEditAsset,
  onDeleteAsset,
  onAllocate,
  onRetire,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleAll = (e) => {
    setSelectedIds(e.target.checked ? assets.map(a => a.id) : []);
  };
  const toggleRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/60 p-3 px-4 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs font-mono animate-fade-in">
          <span className="font-bold text-[#2563eb]">✓ {selectedIds.length} asset(s) selected</span>
          <div className="flex items-center gap-2 font-sans">
            <button onClick={() => { selectedIds.forEach(id => onAllocate && onAllocate(id)); setSelectedIds([]); }}
              className="px-3 py-1 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded text-xs shadow-2xs">
              Allocate Selected
            </button>
            <button onClick={() => { selectedIds.forEach(id => onRetire && onRetire(id)); setSelectedIds([]); }}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-xs shadow-2xs">
              Retire Selected
            </button>
            <button onClick={() => setSelectedIds([])} className="px-2 py-1 text-gray-500 font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto text-xs font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] uppercase font-bold text-[11px] select-none">
              <th className="py-3.5 px-4 w-10 text-center">
                <input type="checkbox" checked={selectedIds.length === assets.length && assets.length > 0} onChange={toggleAll} className="rounded border-gray-300 text-[#2563eb]" />
              </th>
              <th className="py-3.5 px-4 min-w-[200px]">Asset ID & Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 min-w-[140px]">Serial Number</th>
              <th className="py-3.5 px-4">Brand / Model</th>
              <th className="py-3.5 px-4">Purchase Date</th>
              <th className="py-3.5 px-4">Warranty</th>
              <th className="py-3.5 px-4">Condition</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 min-w-[130px]">Current Holder</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-sans">
            {assets.map((a) => {
              const isSelected = selectedIds.includes(a.id);
              const CategoryIcon = CATEGORY_CONFIGS[a.category?.toUpperCase()]?.icon || Laptop;

              return (
                <tr
                  key={a.id}
                  onClick={() => onSelectAsset && onSelectAsset(a)}
                  className={`hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''}`}
                >
                  <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={(e) => toggleRow(a.id, e)} className="rounded border-gray-300 text-[#2563eb]" />
                  </td>

                  {/* Asset ID & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] shrink-0">
                        <CategoryIcon size={14} />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] font-extrabold text-[#2563eb] block">{a.id}</span>
                        <strong className="font-bold text-sm text-[#191b23] dark:text-white line-clamp-1">{a.name}</strong>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4"><CategoryBadge category={a.category} size="sm" /></td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#737686]">{a.serialNumber}</td>

                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#191b23] dark:text-gray-200">
                    {a.brand}<br /><span className="text-[10px] text-[#737686] font-normal">{a.model}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs text-[#737686]">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {a.purchaseDate}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className={`font-bold ${a.warrantyDaysLeft < 90 ? (a.warrantyDaysLeft <= 0 ? 'text-rose-600' : 'text-amber-600') : 'text-emerald-600'}`}>
                      {a.warrantyDaysLeft <= 0 ? 'Expired' : `${a.warrantyDaysLeft}d left`}
                    </span>
                    <span className="block text-[10px] text-[#737686]">{a.warrantyExpiry}</span>
                  </td>

                  <td className="py-3.5 px-4"><ConditionBadge condition={a.condition} size="sm" /></td>

                  <td className="py-3.5 px-4"><AssetStatusBadge status={a.status} size="sm" /></td>

                  {/* Current Holder */}
                  <td className="py-3.5 px-4">
                    {a.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold text-[10px] uppercase border border-blue-300 shrink-0">
                          {a.assignedTo.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-[#191b23] dark:text-white truncate max-w-[90px]">{a.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-[#737686] italic text-xs">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#737686] truncate max-w-[140px]">
                    <span className="flex items-center gap-1"><MapPin size={11} className="shrink-0" /> {a.location || 'N/A'}</span>
                  </td>

                  {/* Action Menu */}
                  <td className="py-3.5 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === a.id ? null : a.id); }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                    {activeMenu === a.id && (
                      <div className="absolute right-4 top-10 z-20 w-44 bg-white dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg shadow-xl py-1 text-left text-xs font-sans animate-fade-in">
                        <button onClick={() => { onSelectAsset && onSelectAsset(a); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-[#191b23] dark:text-white">
                          <ArrowUpRight size={14} className="text-[#2563eb]" /> View Details
                        </button>
                        <button onClick={() => { onEditAsset && onEditAsset(a); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-[#191b23] dark:text-white">
                          <Edit3 size={14} className="text-amber-600" /> Edit Asset
                        </button>
                        <button onClick={() => { onAllocate && onAllocate(a); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-[#2563eb]">
                          <User size={14} /> Allocate Asset
                        </button>
                        <button onClick={() => { onRetire && onRetire(a.id); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-[#faf8ff] dark:hover:bg-gray-800 flex items-center gap-2 font-semibold text-amber-600">
                          <Wrench size={14} /> Schedule Maintenance
                        </button>
                        <div className="border-t border-[#e1e2ed] dark:border-gray-800 my-1" />
                        <button onClick={() => { onDeleteAsset && onDeleteAsset(a.id); setActiveMenu(null); }}
                          className="w-full px-3 py-2 text-left hover:bg-rose-50 flex items-center gap-2 font-semibold text-rose-600">
                          <Trash2 size={14} /> Retire Asset
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
