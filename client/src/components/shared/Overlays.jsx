/**
 * shared/Overlays.jsx
 * Precision Enterprise Design System — Shared Tooltip, Popover, Dropdown & ContextMenu Components
 * 
 * Centralized tokens: Level 2 elevation (shadow-lg, border #e2e8f0), dark tooltip surface (#191b23).
 * WCAG 2.1 AA compliant with role="tooltip", role="menu", role="menuitem", keyboard navigation, and React.memo optimization.
 * 
 * Components: Tooltip | Popover | Dropdown | ContextMenu
 */
import React, { memo, useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { MoreVertical } from 'lucide-react';

export const Tooltip = memo(function Tooltip({
  content,
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  delay = 200,
  children,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`).current;

  const showTooltip = () => {
    timerRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  if (!content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={[
            'absolute z-50 px-2.5 py-1 text-xs font-medium rounded shadow-md whitespace-nowrap select-none pointer-events-none animate-fadeIn',
            'bg-[#191b23] dark:bg-white text-white dark:text-[#191b23]',
            positionClasses[position] || positionClasses.top,
            className,
          ].join(' ')}
        >
          {content}
        </div>
      )}
    </div>
  );
});

export const Popover = memo(function Popover({
  trigger,
  content,
  position = 'bottom-start', // 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const positionClasses = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen((prev) => !prev); } }}
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className={[
            'absolute z-50 w-64 bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-lg shadow-lg p-4 animate-fadeIn',
            positionClasses[position] || positionClasses['bottom-start'],
            className,
          ].join(' ')}
        >
          {typeof content === 'function' ? content(() => setIsOpen(false)) : content}
        </div>
      )}
    </div>
  );
});

export const Dropdown = memo(function Dropdown({
  trigger,
  items = [], // Array of { label, icon, onClick, danger, disabled, divider }
  align = 'right', // 'right' | 'left'
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  return (
    <div className="relative inline-block text-left select-none" ref={containerRef} onKeyDown={handleKeyDown}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen((prev) => !prev); } }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={[
            'absolute z-50 mt-1.5 w-48 rounded-lg bg-white dark:bg-[#111111] shadow-lg border border-[#e2e8f0] dark:border-slate-800 py-1 focus:outline-none animate-fadeIn',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            className,
          ].join(' ')}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return <div key={i} className="my-1 border-t border-[#e2e8f0]/60 dark:border-slate-800" role="separator" />;
            }
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled && item.onClick) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                className={[
                  'w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors',
                  item.danger ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30' : 'text-[#191b23] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80',
                  item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

export const ContextMenu = memo(function ContextMenu({
  items = [],
  align = 'right',
  ariaLabel = 'More options',
  className = '',
}) {
  return (
    <Dropdown
      align={align}
      items={items}
      className={className}
      trigger={
        <button
          type="button"
          aria-label={ariaLabel}
          className="p-1 text-slate-400 hover:text-[#191b23] dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <MoreVertical size={16} />
        </button>
      }
    />
  );
});

export default Tooltip;
