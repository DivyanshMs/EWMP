import React from 'react';
import { Folder, Download, Trash2, ArrowUpRight, ArrowDownRight, HardDrive, BarChart2, PieChart, Activity, TrendingUp } from 'lucide-react';
import { DocumentStatusBadge, DocumentCategoryBadge, FileTypeBadge } from './DocumentBadges';

/**
 * DocumentCards.jsx
 * Enterprise card components: DocumentCard (Grid view), FolderCard, AnalyticsCard, StorageBar, and ChartsPlaceholder.
 */

export const DocumentCard = ({ doc, onSelect, onDownload, onVerify, onDelete }) => {
  const isPending = doc.status === 'PENDING';
  const isVerified = doc.status === 'VERIFIED';

  return (
    <div
      onClick={() => onSelect && onSelect(doc)}
      className="group bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb] rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
    >
      {/* Top Row: File Badge & Action Menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileTypeBadge fileType={doc.fileType || 'PDF'} size="sm" />
          <span className="text-[11px] font-mono font-extrabold text-[#737686] truncate max-w-[120px]">{doc.id || 'DOC-001'}</span>
        </div>
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDownload && onDownload(doc); }}
            className="p-1.5 text-gray-500 hover:text-[#2563eb] hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Download Document"
          >
            <Download size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(doc.id); }}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Archive Document"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Middle Row: Document Title & Category */}
      <div className="space-y-1.5 min-w-0">
        <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white truncate group-hover:text-[#2563eb] transition-colors">
          {doc.name || 'Untitled Document.pdf'}
        </h4>
        <div className="flex flex-wrap items-center gap-1.5">
          <DocumentCategoryBadge category={doc.category} size="sm" />
          <DocumentStatusBadge status={doc.status} size="sm" />
        </div>
      </div>

      {/* Bottom Row: Metadata & Owner */}
      <div className="pt-2.5 border-t border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between text-xs font-sans text-[#737686]">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
            {(doc.owner || 'U').charAt(0)}
          </div>
          <span className="truncate max-w-[110px] text-xs font-semibold text-[#191b23] dark:text-gray-300">
            {doc.owner || 'Alex Turner'}
          </span>
        </div>
        <span className="font-mono text-[11px] shrink-0">{doc.size || '2.4 MB'}</span>
      </div>
    </div>
  );
};

export const FolderCard = ({ folder, onSelect }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(folder)}
      className="group bg-[#faf8ff] dark:bg-[#161616] border border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb] rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] rounded-xl border border-blue-200 dark:border-blue-800 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
          <Folder size={22} className="fill-[#2563eb]/20" />
        </div>
        <div className="min-w-0">
          <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white truncate group-hover:text-[#2563eb] transition-colors">
            {folder.name || 'HR Policies & SLAs'}
          </h4>
          <span className="text-xs text-[#737686] font-mono block mt-0.5">
            {folder.itemCount || 14} files · {folder.size || '48.2 MB'}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-[10px] font-mono font-bold text-[#737686] uppercase block">Modified</span>
        <span className="text-xs font-semibold text-[#191b23] dark:text-gray-300">{folder.modifiedDate || 'Jul 04, 2026'}</span>
      </div>
    </div>
  );
};

export const DocumentAnalyticsCard = ({ title, value, subtitle, icon: Icon, change, trend = 'up', color = 'text-[#2563eb]', bg = 'bg-blue-50' }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-[#737686] uppercase tracking-wider font-mono block">{title}</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#191b23] dark:text-white font-mono mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${bg} dark:bg-opacity-20 ${color} shrink-0 border border-[#e1e2ed]/60 shadow-2xs`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e1e2ed] dark:border-gray-800 text-xs font-sans">
        <span className="text-[#737686] font-semibold truncate">{subtitle}</span>
        {change && (
          <span className={`inline-flex items-center gap-0.5 font-mono font-bold text-[11px] ${
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-500'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={13} /> : trend === 'down' ? <ArrowDownRight size={13} /> : null}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export const StorageProgressBar = ({ usedGB = 342, totalGB = 500, label = 'Enterprise Storage Quota' }) => {
  const pct = Math.min(100, Math.round((usedGB / totalGB) * 100));
  const isHigh = pct > 85;

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3 font-sans">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#191b23] dark:text-white flex items-center gap-2">
          <HardDrive size={16} className="text-[#2563eb]" /> {label}
        </span>
        <span className="font-mono font-extrabold text-[#191b23] dark:text-white">
          {usedGB} GB <span className="text-[#737686] font-normal">/ {totalGB} GB ({pct}%)</span>
        </span>
      </div>
      <div className="w-full bg-[#ededf9] dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${isHigh ? 'bg-rose-600' : 'bg-[#2563eb]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono text-[#737686]">
        <span>● Active Employee Files: {Math.round(usedGB * 0.65)} GB</span>
        <span>● Org Policies & Media: {Math.round(usedGB * 0.35)} GB</span>
      </div>
    </div>
  );
};

export const ChartPlaceholder = ({ title, type = 'BAR', height = 'h-64' }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
        <h4 className="font-extrabold text-sm text-[#191b23] dark:text-white flex items-center gap-2 font-sans">
          {type === 'BAR' ? <BarChart2 size={16} className="text-[#2563eb]" /> : type === 'DONUT' ? <PieChart size={16} className="text-purple-600" /> : <Activity size={16} className="text-emerald-600" />}
          {title}
        </h4>
        <span className="text-[11px] font-mono text-emerald-600 font-bold">● LIVE CMDB SYNC</span>
      </div>
      <div className={`${height} bg-[#faf8ff] dark:bg-[#161616] border border-dashed border-[#c3c6d7] dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3`}>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xs text-[#2563eb]">
          {type === 'BAR' ? <BarChart2 size={32} /> : type === 'DONUT' ? <PieChart size={32} /> : <TrendingUp size={32} />}
        </div>
        <div className="space-y-1">
          <p className="font-bold text-xs text-[#191b23] dark:text-white uppercase font-mono">
            {type} Telemetry Visualization
          </p>
          <p className="text-xs text-[#737686] max-w-xs mx-auto">
            Real-time metadata stream from AWS S3 & EWMP Document Gateway.
          </p>
        </div>
      </div>
    </div>
  );
};
