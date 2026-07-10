/**
 * shared/Navigation.jsx
 * Precision Enterprise Design System — Shared Tabs, Accordion, Progress & Breadcrumb Components
 * 
 * Centralized tokens: #2563eb primary highlight, Slate-200 borders, Inter typography.
 * WCAG 2.1 AA compliant with role="tablist", role="tab", role="region", role="progressbar", and React.memo optimization.
 * 
 * Components: Tabs | Accordion | Progress | Breadcrumb
 */
import React, { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { default as BreadcrumbLayout } from '../layout/Breadcrumbs';

export const Tabs = memo(function Tabs({
  tabs = [], // Array of { id, label, icon, badge, disabled, content }
  activeTab,
  onChange,
  variant = 'underlined', // 'underlined' | 'pills' | 'cards'
  className = '',
}) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalTab;

  const handleTabChange = (id, disabled) => {
    if (disabled) return;
    if (onChange) onChange(id);
    else setInternalTab(id);
  };

  const getTabClass = (isActive, disabled) => {
    if (disabled) return 'opacity-40 cursor-not-allowed';
    if (variant === 'pills') {
      return isActive
        ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
        : 'text-[#434655] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium';
    }
    if (variant === 'cards') {
      return isActive
        ? 'bg-white dark:bg-[#111111] text-[#2563eb] border border-[#e2e8f0] dark:border-slate-800 border-b-transparent -mb-px font-semibold shadow-sm'
        : 'bg-[#f8fafc] dark:bg-[#161616] text-[#434655] dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 font-medium';
    }
    // Default underlined
    return isActive
      ? 'border-[#2563eb] text-[#2563eb] dark:text-blue-400 font-semibold border-b-2 -mb-px'
      : 'border-transparent text-[#434655] dark:text-slate-400 hover:text-[#191b23] dark:hover:text-slate-200 hover:border-slate-300 font-medium';
  };

  const activeContent = tabs.find((t) => t.id === currentTab)?.content;

  return (
    <div className={['w-full select-none', className].join(' ')}>
      <div
        role="tablist"
        aria-label="Content tabs"
        className={[
          'flex items-center gap-2 overflow-x-auto no-scrollbar',
          variant === 'underlined' ? 'border-b border-[#e2e8f0] dark:border-slate-800' : '',
          variant === 'pills' ? 'p-1 bg-[#f8fafc] dark:bg-[#161616] rounded-lg border border-[#e2e8f0] dark:border-slate-800 w-fit' : '',
          variant === 'cards' ? 'border-b border-[#e2e8f0] dark:border-slate-800 gap-1' : '',
        ].join(' ')}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id, tab.disabled)}
              className={[
                'inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm transition-all duration-150 whitespace-nowrap rounded-t-md focus:outline-none focus:ring-1 focus:ring-[#2563eb]',
                getTabClass(isActive, tab.disabled),
              ].join(' ')}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={['px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none', isActive ? 'bg-white/20 text-current' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'].join(' ')}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeContent && (
        <div
          role="tabpanel"
          id={`tabpanel-${currentTab}`}
          aria-labelledby={`tab-${currentTab}`}
          className="pt-5 focus:outline-none"
          tabIndex={0}
        >
          {activeContent}
        </div>
      )}
    </div>
  );
});

export const Accordion = memo(function Accordion({
  items = [], // Array of { id, title, subtitle, content, defaultOpen }
  allowMultiple = false,
  className = '',
}) {
  const [openIds, setOpenIds] = useState(() =>
    items.filter((i) => i.defaultOpen).map((i) => i.id)
  );

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      const exists = prev.includes(id);
      if (allowMultiple) {
        return exists ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return exists ? [] : [id];
    });
  };

  return (
    <div className={['divide-y divide-[#e2e8f0] dark:divide-slate-800 border border-[#e2e8f0] dark:border-slate-800 rounded-lg bg-white dark:bg-[#111111] select-none', className].join(' ')}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-header-${item.id}`}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#f8fafc] dark:hover:bg-[#161616] transition-colors focus:outline-none focus:bg-[#f8fafc] dark:focus:bg-[#161616]"
            >
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-[#191b23] dark:text-white truncate">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="mt-0.5 text-xs text-[#434655] dark:text-slate-400 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <ChevronDown
                size={18}
                className={['text-slate-400 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180 text-[#2563eb]' : ''].join(' ')}
              />
            </button>

            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
                className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[#434655] dark:text-slate-300 leading-relaxed border-t border-[#e2e8f0]/40 dark:border-slate-800/60 bg-[#faf8ff]/30 dark:bg-black/20 animate-fadeIn"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export const Progress = memo(function Progress({
  value = 0, // 0 to 100
  max = 100,
  label,
  showValue = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorMap = {
    primary: 'bg-[#2563eb]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger:  'bg-rose-500',
  };

  return (
    <div className={['w-full select-none', className].join(' ')}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-semibold">
          {label && <span className="text-[#191b23] dark:text-slate-200 truncate">{label}</span>}
          {showValue && <span className="text-[#434655] dark:text-slate-400">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={['w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', sizeMap[size] || sizeMap.md].join(' ')}
      >
        <div
          className={['h-full rounded-full transition-all duration-300 ease-out', colorMap[variant] || colorMap.primary].join(' ')}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

export const Breadcrumb = memo(function Breadcrumb(props) {
  return <BreadcrumbLayout {...props} />;
});

export default Tabs;
