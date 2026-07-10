/**
 * shared/Table.jsx
 * Precision Enterprise Design System — Shared Table, DataTable & Pagination Components
 * 
 * Centralized tokens: Sticky headers (#ededf9 / #161616), row hover (#f3f3fe / #181818), 1px horizontal border separator.
 * WCAG 2.1 AA compliant with proper table semantics, screen reader labels, keyboard sorting, and React.memo optimization.
 * 
 * Components: Table | DataTable | Pagination
 */
import React, { memo, useState, useMemo } from 'react';
import { Users, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { SearchInput } from './Input';
import { Button } from './Button';

export const Table = memo(function Table({
  columns = [],
  rows = [],
  isLoading = false,
  emptyTitle = 'No records found',
  emptySubtitle = '',
  emptyIcon: EmptyIcon = Users,
  className = '',
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  getRowKey = (row, i) => row.id ?? i,
}) {
  return (
    <div className={['w-full overflow-x-auto rounded-lg border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#111111]', className].join(' ')}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSortable = !!col.sortable && !!onSort;
              const isSorted = sortColumn === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                  onClick={isSortable ? () => onSort(col.key) : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  onKeyDown={isSortable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSort(col.key); } } : undefined}
                  className={[
                    'sticky top-0 z-10 px-4 py-3.5 transition-colors',
                    'text-[11px] font-bold uppercase tracking-wider',
                    'text-[#434655] dark:text-slate-400',
                    'bg-[#ededf9] dark:bg-[#161616]',
                    'border-b border-[#e2e8f0] dark:border-[#262626]',
                    'select-none whitespace-nowrap',
                    isSortable && 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563eb]',
                    col.className ?? '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>{col.header}</span>
                    {isSortable && (
                      <span className="inline-flex flex-col text-slate-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="text-[#2563eb]" /> : <ChevronDown size={14} className="text-[#2563eb]" />
                        ) : (
                          <div className="opacity-40 flex flex-col -space-y-1">
                            <ChevronUp size={10} />
                            <ChevronDown size={10} />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e2e8f0]/60 dark:divide-[#262626]">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="animate-pulse bg-white dark:bg-[#111111]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5">
                    <div className={['h-3.5 rounded bg-slate-100 dark:bg-slate-800', col.skeletonWidth ?? 'w-3/4'].join(' ')} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4 bg-white dark:bg-[#111111]">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <EmptyIcon size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#191b23] dark:text-slate-200">
                      {emptyTitle}
                    </p>
                    {emptySubtitle && (
                      <p className="text-xs text-[#434655] dark:text-slate-400 mt-1 max-w-xs mx-auto">
                        {emptySubtitle}
                      </p>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={getRowKey(row, i)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row); } } : undefined}
                className={[
                  'transition-colors duration-100 bg-white dark:bg-[#111111]',
                  'hover:bg-[#f3f3fe] dark:hover:bg-[#181818]',
                  onRowClick && 'cursor-pointer focus:outline-none focus:bg-[#f3f3fe] dark:focus:bg-[#181818]',
                ].filter(Boolean).join(' ')}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      'px-4 py-3.5',
                      'text-[13px] font-medium text-[#191b23] dark:text-slate-200',
                      'whitespace-nowrap',
                      col.cellClassName ?? '',
                    ].filter(Boolean).join(' ')}
                  >
                    {col.render ? col.render(row, i) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

export const Pagination = memo(function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  return (
    <div className={['flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 text-xs text-[#434655] dark:text-slate-400 select-none', className].join(' ')}>
      <div>
        {totalItems ? (
          <span>
            Showing <strong className="font-semibold text-[#191b23] dark:text-white">{startItem}</strong> to <strong className="font-semibold text-[#191b23] dark:text-white">{endItem}</strong> of <strong className="font-semibold text-[#191b23] dark:text-white">{totalItems}</strong> entries
          </span>
        ) : (
          <span>Page <strong className="font-semibold text-[#191b23] dark:text-white">{currentPage}</strong> of <strong className="font-semibold text-[#191b23] dark:text-white">{totalPages}</strong></span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(1)}
          aria-label="First page"
          className="p-1.5 rounded-md border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="p-1.5 rounded-md border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="px-3 py-1 font-semibold text-[#191b23] dark:text-white">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="p-1.5 rounded-md border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange && onPageChange(totalPages)}
          aria-label="Last page"
          className="p-1.5 rounded-md border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
});

export const DataTable = memo(function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  itemsPerPage = 10,
  emptyTitle,
  emptySubtitle,
  onRowClick,
  className = '',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key) => {
    if (sortCol === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    const keys = searchKeys.length > 0 ? searchKeys : columns.map((c) => c.key);
    return data.filter((item) =>
      keys.some((k) => {
        const val = item[k];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, searchQuery, searchKeys, columns]);

  const sortedData = useMemo(() => {
    if (!sortCol) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  return (
    <div className={['space-y-3', className].join(' ')}>
      {searchable && (
        <div className="flex justify-end">
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
            />
          </div>
        </div>
      )}

      <Table
        columns={columns}
        rows={paginatedData}
        isLoading={isLoading}
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
        onRowClick={onRowClick}
        sortColumn={sortCol}
        sortDirection={sortDir}
        onSort={handleSort}
      />

      {sortedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
});

export default Table;
