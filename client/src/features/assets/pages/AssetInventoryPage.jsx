import React, { useState } from 'react';
import { Search, Filter, Download, PlusCircle, RefreshCw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { AssetInventoryTable } from '../components/AssetTables';
import { NoAssets, NoSearchResults } from '../components/AssetEmptyStates';

/**
 * AssetInventoryPage.jsx
 * Full enterprise asset inventory with search, advanced filters, sort, and pagination.
 */
export const AssetInventoryPage = ({
  assets = [],
  onSelectAsset,
  onEditAsset,
  onDeleteAsset,
  onAllocate,
  onRetire,
  onRegister,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [warrantyFilter, setWarrantyFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('ID');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = assets.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      a.id?.toLowerCase().includes(q) ||
      a.name?.toLowerCase().includes(q) ||
      a.serialNumber?.toLowerCase().includes(q) ||
      a.brand?.toLowerCase().includes(q) ||
      a.assignedTo?.toLowerCase().includes(q) ||
      a.department?.toLowerCase().includes(q);
    const matchCat   = categoryFilter   === 'ALL' || a.category   === categoryFilter;
    const matchStat  = statusFilter     === 'ALL' || a.status      === statusFilter;
    const matchCond  = conditionFilter  === 'ALL' || a.condition   === conditionFilter;
    const matchDept  = departmentFilter === 'ALL' || a.department  === departmentFilter;
    const matchLoc   = locationFilter   === 'ALL' || a.location?.includes(locationFilter);
    const matchWar   = warrantyFilter   === 'ALL' || (warrantyFilter === 'EXPIRING' && a.warrantyDaysLeft < 90) || (warrantyFilter === 'EXPIRED' && a.warrantyDaysLeft <= 0);
    return matchSearch && matchCat && matchStat && matchCond && matchDept && matchLoc && matchWar;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'NAME')     return a.name?.localeCompare(b.name);
    if (sortBy === 'CATEGORY') return a.category?.localeCompare(b.category);
    if (sortBy === 'STATUS')   return a.status?.localeCompare(b.status);
    if (sortBy === 'WARRANTY') return (a.warrantyDaysLeft || 0) - (b.warrantyDaysLeft || 0);
    return a.id?.localeCompare(b.id);
  });

  const totalPages   = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated    = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasFilters   = searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || conditionFilter !== 'ALL' || departmentFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery(''); setCategoryFilter('ALL'); setStatusFilter('ALL');
    setConditionFilter('ALL'); setDepartmentFilter('ALL'); setLocationFilter('ALL');
    setWarrantyFilter('ALL'); setCurrentPage(1);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 border border-purple-200">AUDITED INVENTORY</span>
            <span className="text-xs text-[#737686] font-mono">Real-time CMDB Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Enterprise Asset Inventory Registry
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onExport} className="px-4 py-2 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 shadow-2xs">
            <Download size={15} /> Export CMDB
          </button>
          <button onClick={onRegister} className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all">
            <PlusCircle size={15} /> Register Asset
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={16} />
            <input
              type="text" value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Asset ID, Serial Number, Name, Brand, Employee, or Department..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-sans focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-xl text-xs font-semibold font-mono">
              <option value="ID">Sort: Asset ID</option>
              <option value="NAME">Sort: Name (A-Z)</option>
              <option value="CATEGORY">Sort: Category</option>
              <option value="STATUS">Sort: Status</option>
              <option value="WARRANTY">Sort: Warranty (Soonest)</option>
            </select>
            <button onClick={() => setShowFilters(v => !v)}
              className={`p-2.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${showFilters ? 'bg-[#2563eb] text-white border-[#2563eb]' : 'bg-[#faf8ff] dark:bg-[#161616] text-[#191b23] dark:text-white border-[#c3c6d7]'}`}>
              <SlidersHorizontal size={15} /> Filters
              {hasFilters && <span className="ml-1 px-1.5 py-0.5 bg-white text-[#2563eb] rounded text-[10px] font-bold font-mono">{[categoryFilter, statusFilter, conditionFilter, departmentFilter].filter(f => f !== 'ALL').length}</span>}
            </button>
            {hasFilters && (
              <button onClick={resetFilters} className="p-2.5 text-gray-500 hover:text-rose-600 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors">
                <RefreshCw size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3 border-t border-[#e1e2ed] dark:border-gray-800 animate-fade-in">
            {[
              { label: 'Category', value: categoryFilter, onChange: v => setCategoryFilter(v), options: [['ALL','All Categories'],['LAPTOP','Laptop'],['DESKTOP','Desktop'],['MONITOR','Monitor'],['KEYBOARD','Keyboard'],['MOUSE','Mouse'],['PHONE','Phone'],['PRINTER','Printer'],['NETWORKING','Networking'],['SOFTWARE','Software License'],['OTHER','Other']] },
              { label: 'Status',    value: statusFilter,    onChange: v => setStatusFilter(v),    options: [['ALL','All Statuses'],['AVAILABLE','Available'],['ASSIGNED','Assigned'],['MAINTENANCE','Maintenance'],['RETIRED','Retired'],['LOST','Lost/Stolen'],['DAMAGED','Damaged']] },
              { label: 'Condition', value: conditionFilter, onChange: v => setConditionFilter(v), options: [['ALL','All Conditions'],['NEW','New'],['EXCELLENT','Excellent'],['GOOD','Good'],['FAIR','Fair'],['POOR','Poor'],['DAMAGED','Damaged']] },
              { label: 'Department',value: departmentFilter,onChange: v => setDepartmentFilter(v),options: [['ALL','All Depts'],['Engineering','Engineering'],['HR','HR & Ops'],['Finance','Finance'],['Sales','Sales'],['IT','IT & InfoSec'],['Marketing','Marketing']] },
              { label: 'Location',  value: locationFilter,  onChange: v => setLocationFilter(v),  options: [['ALL','All Locations'],['HQ Floor 1','HQ Floor 1'],['HQ Floor 2','HQ Floor 2'],['HQ Floor 3','HQ Floor 3'],['Remote','Remote']] },
              { label: 'Warranty',  value: warrantyFilter,  onChange: v => setWarrantyFilter(v),  options: [['ALL','All Warranty'],['EXPIRING','Expiring < 90d'],['EXPIRED','Expired']] },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[10px] text-[#737686] uppercase mb-1 font-sans font-bold">{f.label}</label>
                <select value={f.value} onChange={e => { f.onChange(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 rounded-lg text-xs font-semibold font-mono">
                  {f.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table or Empty State */}
      {sorted.length === 0 ? (
        assets.length === 0 ? <NoAssets onCreate={onRegister} /> : <NoSearchResults onReset={resetFilters} />
      ) : (
        <div className="space-y-4">
          <AssetInventoryTable
            assets={paginated}
            onSelectAsset={onSelectAsset}
            onEditAsset={onEditAsset}
            onDeleteAsset={onDeleteAsset}
            onAllocate={onAllocate}
            onRetire={onRetire}
          />
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[#737686]">
              Showing <strong className="text-[#191b23] dark:text-white">{(currentPage-1)*itemsPerPage+1}</strong> – <strong className="text-[#191b23] dark:text-white">{Math.min(currentPage*itemsPerPage, sorted.length)}</strong> of <strong className="text-[#2563eb]">{sorted.length}</strong> assets
            </span>
            <div className="flex items-center gap-2 font-sans">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}
                className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i+1)}
                  className={`w-8 h-8 rounded-lg font-bold font-mono transition-colors ${currentPage===i+1 ? 'bg-[#2563eb] text-white shadow-2xs' : 'hover:bg-[#faf8ff] dark:hover:bg-gray-800 text-[#737686]'}`}>
                  {i+1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}
                className="p-2 rounded-lg border border-[#e1e2ed] dark:border-gray-800 disabled:opacity-40 hover:bg-[#faf8ff] dark:hover:bg-gray-800 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
