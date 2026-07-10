import React from 'react';
import { TrendingUp, TrendingDown, Laptop, Calendar, MapPin, User, ShieldCheck, BarChart2, PieChart } from 'lucide-react';
import { CategoryBadge, AssetStatusBadge, ConditionBadge, CATEGORY_CONFIGS } from './AssetBadges';

/**
 * AssetCards.jsx
 * Reusable KPI analytics cards, asset summary cards, maintenance cards,
 * allocation cards, warranty cards, and chart placeholders.
 */

// ─── Analytics KPI Card ──────────────────────────────────────────────────────
export const AssetAnalyticsCard = ({
  title, value, subtitle, icon: Icon, change, trend = 'neutral',
  color = 'text-[#2563eb]', bg = 'bg-blue-50 dark:bg-blue-950/60'
}) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs hover:border-gray-400 dark:hover:border-gray-600 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#737686] dark:text-gray-400 uppercase tracking-wider font-sans">{title}</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#191b23] dark:text-white mt-1.5 font-mono tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${bg} ${color} border border-[#e1e2ed]/60 shrink-0`}>
            <Icon size={22} />
          </div>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800 flex items-center justify-between text-xs">
        {subtitle && <span className="text-[#737686] font-sans truncate">{subtitle}</span>}
        {change && (
          <span className={`inline-flex items-center gap-1 font-mono font-bold ${
            isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-[#737686]'
          }`}>
            {isUp ? <TrendingUp size={13} /> : isDown ? <TrendingDown size={13} /> : null}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Asset Summary Card ──────────────────────────────────────────────────────
export const AssetCard = ({ asset, onSelect }) => {
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
    location: 'HQ Floor 3 — Engineering Bay',
    purchaseDate: 'Mar 15, 2024',
    warrantyExpiry: 'Mar 15, 2027',
  };

  const CategoryIcon = CATEGORY_CONFIGS[a.category?.toUpperCase()]?.icon || Laptop;

  return (
    <div
      onClick={() => onSelect && onSelect(a)}
      className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#2563eb]/60 transition-all cursor-pointer space-y-4 group"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-200">
            <CategoryIcon size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-extrabold text-[#2563eb] bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded border border-blue-200 block">
              {a.id}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <AssetStatusBadge status={a.status} size="sm" />
        </div>
      </div>

      {/* Name & Model */}
      <div>
        <h4 className="font-bold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors line-clamp-1">
          {a.name}
        </h4>
        <p className="text-xs text-[#737686] font-mono mt-0.5">{a.brand} {a.model}</p>
      </div>

      {/* Category & Condition */}
      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={a.category} size="sm" />
        <ConditionBadge condition={a.condition} size="sm" />
      </div>

      {/* Metadata */}
      <div className="space-y-1.5 pt-3 border-t border-[#e1e2ed]/60 dark:border-gray-800 text-xs font-mono">
        {a.assignedTo && (
          <div className="flex items-center gap-2 text-[#737686]">
            <User size={12} className="shrink-0 text-[#2563eb]" />
            <span className="truncate">{a.assignedTo}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-[#737686]">
          <MapPin size={12} className="shrink-0 text-purple-500" />
          <span className="truncate">{a.location}</span>
        </div>
        <div className="flex items-center gap-2 text-[#737686]">
          <ShieldCheck size={12} className="shrink-0 text-emerald-500" />
          <span>Warranty: {a.warrantyExpiry}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Maintenance Card ────────────────────────────────────────────────────────
export const MaintenanceCard = ({ record, onSelect }) => {
  const r = record || {
    id: 'MNT-0021',
    assetId: 'AST-0042',
    assetName: 'Dell XPS 15 9530',
    type: 'Preventive Maintenance',
    vendor: 'Dell Technologies Support',
    scheduledDate: 'Jul 15, 2026',
    status: 'SCHEDULED',
    estimatedCost: '$120',
    technician: 'Marcus Chen'
  };

  return (
    <div
      onClick={() => onSelect && onSelect(r)}
      className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-[#2563eb]/60 transition-all cursor-pointer group space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-extrabold text-[#2563eb]">{r.id}</span>
        <MaintenanceBadge status={r.status} />
      </div>
      <div>
        <h5 className="font-bold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors">{r.assetName}</h5>
        <p className="text-xs text-[#737686] mt-0.5 font-mono">{r.type}</p>
      </div>
      <div className="pt-3 border-t border-[#e1e2ed]/60 flex items-center justify-between text-xs font-mono text-[#737686]">
        <span className="flex items-center gap-1"><Calendar size={12} /> {r.scheduledDate}</span>
        <span className="font-bold text-[#191b23] dark:text-white">{r.estimatedCost}</span>
      </div>
    </div>
  );
};

// ─── Warranty Card ───────────────────────────────────────────────────────────
export const WarrantyCard = ({ asset }) => {
  const a = asset || { id: 'AST-0042', name: 'Dell XPS 15 9530', warrantyExpiry: 'Mar 15, 2027', daysLeft: 242 };
  const isExpiringSoon = a.daysLeft < 90;
  const isExpired = a.daysLeft <= 0;

  return (
    <div className={`bg-white dark:bg-[#111111] border rounded-xl p-4 shadow-xs text-xs font-mono space-y-2 ${
      isExpired ? 'border-rose-300 bg-rose-50/30' : isExpiringSoon ? 'border-amber-300 bg-amber-50/30' : 'border-[#e1e2ed]'
    }`}>
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-[#2563eb]">{a.id}</span>
        <span className={`font-bold ${isExpired ? 'text-rose-600' : isExpiringSoon ? 'text-amber-600' : 'text-emerald-600'}`}>
          {isExpired ? 'EXPIRED' : `${a.daysLeft}d left`}
        </span>
      </div>
      <p className="font-sans font-semibold text-[#191b23] dark:text-white text-xs truncate">{a.name}</p>
      <div className="flex items-center gap-1.5 text-[#737686]">
        <ShieldCheck size={12} className={isExpired ? 'text-rose-500' : isExpiringSoon ? 'text-amber-500' : 'text-emerald-500'} />
        <span>Expires: {a.warrantyExpiry}</span>
      </div>
    </div>
  );
};

// ─── Chart Placeholder ───────────────────────────────────────────────────────
export const ChartPlaceholder = ({ title, type = 'BAR', height = 'h-72' }) => {
  const isPie = type === 'PIE' || type === 'DONUT';
  return (
    <div className={`bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col ${height}`}>
      <div className="flex justify-between items-center pb-4 border-b border-[#e1e2ed] dark:border-gray-800">
        <div>
          <h4 className="font-bold text-sm text-[#191b23] dark:text-white flex items-center gap-2">
            {isPie ? <PieChart size={16} className="text-[#2563eb]" /> : <BarChart2 size={16} className="text-[#2563eb]" />}
            {title}
          </h4>
          <p className="text-xs text-[#737686] mt-0.5 font-mono">Real-time enterprise asset telemetry</p>
        </div>
        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] text-[10px] font-mono font-bold rounded border border-blue-200">
          LIVE DATA
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center py-6">
        {isPie ? (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-36 h-36 rounded-full border-[18px] border-[#2563eb] border-r-purple-500 border-b-emerald-500 border-l-amber-500 relative flex items-center justify-center shadow-inner animate-pulse">
              <span className="text-xs font-mono font-extrabold text-[#191b23] dark:text-white">ASSETS</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#2563eb]" />Assigned (52%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" />Available (30%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500" />Maintenance (12%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-500" />Other (6%)</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-end justify-between gap-2 px-2 pt-4 border-b border-l border-[#e1e2ed] dark:border-gray-800">
            {[65, 80, 45, 92, 58, 74, 88].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-[#737686] opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                <div
                  className="w-full bg-[#2563eb] hover:bg-[#004ac6] rounded-t transition-all duration-500"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] font-mono text-[#737686]">Cat {idx + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pt-3 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-[11px] text-[#737686] font-mono">
        <span>Audited against EWMP Inventory Gateway</span>
        <span className="text-emerald-600 font-bold">● Synchronized</span>
      </div>
    </div>
  );
};

// ─── Asset Progress Bar ──────────────────────────────────────────────────────
export const AssetProgressBar = ({ value = 0, max = 100, color = 'bg-[#2563eb]', size = 'md', label }) => {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const h = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }[size] || 'h-2';
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-mono mb-1">
          <span className="text-[#737686]">{label}</span>
          <span className="font-bold text-[#191b23] dark:text-white">{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-[#ededf9] dark:bg-gray-800 rounded-full overflow-hidden ${h}`}>
        <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
