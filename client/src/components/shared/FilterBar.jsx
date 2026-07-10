/**
 * shared/FilterBar.jsx
 * Precision Enterprise Design System — Shared FilterBar & SearchBar Components
 * 
 * Centralized tokens: Level 1 surface (#white, border #e2e8f0, shadow-sm), responsive flex layout.
 * WCAG 2.1 AA compliant with proper role="search", aria-labels, and React.memo optimization.
 * 
 * Components: FilterBar | SearchBar
 */
import React, { memo } from 'react';
import { SearchInput } from './Input';

export const FilterBar = memo(function FilterBar({
  search, // <SearchInput /> or SearchBar element
  filters, // Array of select filters or custom React nodes
  actions, // Primary / Secondary buttons or dropdowns
  className = '',
  compact = false,
}) {
  return (
    <div
      role="region"
      aria-label="Filter controls"
      className={[
        'flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-[#111111] rounded-lg border border-[#e2e8f0] dark:border-slate-800 shadow-sm select-none transition-all',
        compact ? 'p-3' : 'p-4',
        className,
      ].join(' ')}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
        {search && <div className="w-full sm:w-72 md:w-80 shrink-0">{search}</div>}
        {filters && (
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {Array.isArray(filters) ? (
              filters.map((filterNode, i) => (
                <div key={i} className="min-w-[140px] flex-1 sm:flex-initial">
                  {filterNode}
                </div>
              ))
            ) : (
              <div className="w-full sm:w-auto flex flex-wrap items-center gap-2.5">{filters}</div>
            )}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#e2e8f0]/60 dark:border-slate-800">
          {actions}
        </div>
      )}
    </div>
  );
});

export const SearchBar = memo(function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  category,
  onCategoryChange,
  categories = [],
  className = '',
  ...props
}) {
  const hasCategories = categories.length > 0;

  return (
    <div role="search" className={['flex items-center w-full gap-2', className].join(' ')}>
      {hasCategories && (
        <select
          value={category}
          onChange={onCategoryChange}
          aria-label="Filter by category"
          className="h-9 px-3 text-xs font-semibold bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 rounded-md text-[#191b23] dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value || cat} value={cat.value || cat}>
              {cat.label || cat}
            </option>
          ))}
        </select>
      )}
      <div className="flex-1">
        <SearchInput
          value={value}
          onChange={onChange}
          onClear={onClear}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  );
});

export default FilterBar;
