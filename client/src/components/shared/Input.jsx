/**
 * shared/Input.jsx
 * Precision Enterprise Design System — Shared Form & Input Components
 * 
 * Centralized tokens: 1px border (#e2e8f0), 4px (sm) to 6px (md) radius, focus ring (#2563eb).
 * WCAG 2.1 AA compliant with ARIA labels, focus management, keyboard navigation, and React.memo optimization.
 * 
 * Components: Input | Select | Textarea | PasswordInput | SearchInput | MultiSelect | Checkbox | Radio | Switch
 */
import React, { forwardRef, memo, useState } from 'react';
import { Eye, EyeOff, Search, X, Check } from 'lucide-react';

const baseInputClass = [
  'block w-full rounded-md border text-sm font-medium transition-all duration-150',
  'bg-white dark:bg-[#111111]',
  'text-[#191b23] dark:text-white',
  'placeholder:text-slate-400 dark:placeholder:text-slate-600',
  'focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900',
].join(' ');

const normalBorder = 'border-[#e2e8f0] dark:border-slate-700';
const errorBorder = 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/30 focus:border-rose-500';

const Label = memo(function Label({ htmlFor, required, children, className = '' }) {
  if (!children) return null;
  return (
    <label
      htmlFor={htmlFor}
      className={['block text-xs font-semibold text-[#191b23] dark:text-slate-300 mb-1.5 select-none', className].join(' ')}
    >
      {children}
      {required && <span className="text-rose-600 dark:text-rose-400 ml-0.5" aria-hidden="true">*</span>}
    </label>
  );
});

const HelperText = memo(function HelperText({ error, helper }) {
  if (error) return <p role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>;
  if (helper) return <p className="mt-1 text-xs text-[#434655] dark:text-slate-400">{helper}</p>;
  return null;
});

export const Input = memo(forwardRef(function Input(
  { label, error, helper, required, leadingIcon, trailingIcon, className = '', id, type = 'text', ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasLeading = !!leadingIcon;
  const hasTrailing = !!trailingIcon;

  return (
    <div className="w-full">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div className="relative flex items-center">
        {hasLeading && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leadingIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-required={required}
          className={[
            baseInputClass,
            error ? errorBorder : normalBorder,
            hasLeading ? 'pl-9' : 'pl-3',
            hasTrailing ? 'pr-9' : 'pr-3',
            'py-2.5 h-10',
            className,
          ].join(' ')}
          {...props}
        />
        {hasTrailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {trailingIcon}
          </div>
        )}
      </div>
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const PasswordInput = memo(forwardRef(function PasswordInput(
  { label = 'Password', error, helper, required, className = '', id, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={!!error}
          aria-required={required}
          className={[
            baseInputClass,
            error ? errorBorder : normalBorder,
            'pl-3 pr-10 py-2.5 h-10',
            className,
          ].join(' ')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none focus:text-[#2563eb] rounded transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const SearchInput = memo(forwardRef(function SearchInput(
  { value, onChange, onClear, placeholder = 'Search...', className = '', id, ...props },
  ref
) {
  const inputId = id || 'search-input';
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={['relative flex items-center w-full', className].join(' ')}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
        <Search size={16} />
      </div>
      <input
        ref={ref}
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={[
          baseInputClass,
          normalBorder,
          'pl-9 pr-9 py-2 h-9 text-sm rounded-md bg-[#f8fafc] dark:bg-[#161616] focus:bg-white dark:focus:bg-[#111111]',
        ].join(' ')}
        {...props}
      />
      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}));

export const Select = memo(forwardRef(function Select(
  { label, error, helper, required, className = '', id, children, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <select
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-required={required}
        className={[
          baseInputClass,
          error ? errorBorder : normalBorder,
          'px-3 py-2.5 pr-8 h-10',
          'appearance-none bg-no-repeat',
          'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")]',
          'bg-[length:1.25rem] bg-[right_0.5rem_center]',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const MultiSelect = memo(forwardRef(function MultiSelect(
  { label, error, helper, required, options = [], value = [], onChange, placeholder = 'Select items...', className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optValue) => {
    if (!onChange) return;
    const exists = value.includes(optValue);
    const next = exists ? value.filter((v) => v !== optValue) : [...value, optValue];
    onChange(next);
  };

  return (
    <div className="w-full relative" ref={ref}>
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen((prev) => !prev); } }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          baseInputClass,
          error ? errorBorder : normalBorder,
          'min-h-[40px] px-3 py-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer select-none',
          className,
        ].join(' ')}
      >
        {value.length === 0 ? (
          <span className="text-slate-400 dark:text-slate-600 text-sm py-1">{placeholder}</span>
        ) : (
          value.map((val) => {
            const opt = options.find((o) => o.value === val) || { label: val };
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800"
              >
                <span>{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(val);
                  }}
                  aria-label={`Remove ${opt.label}`}
                  className="hover:text-rose-600 focus:outline-none"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })
        )}
      </div>
      {isOpen && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-lg shadow-lg py-1"
        >
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => toggleOption(opt.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOption(opt.value); } }}
                className={[
                  'px-3 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors',
                  isSelected ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-400 font-semibold' : 'text-[#191b23] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80',
                ].join(' ')}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={16} />}
              </div>
            );
          })}
        </div>
      )}
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const Textarea = memo(forwardRef(function Textarea(
  { label, error, helper, required, className = '', id, rows = 4, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={!!error}
        aria-required={required}
        className={[
          baseInputClass,
          error ? errorBorder : normalBorder,
          'px-3 py-2.5 resize-none leading-relaxed',
          className,
        ].join(' ')}
        {...props}
      />
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const Checkbox = memo(forwardRef(function Checkbox(
  { label, error, helper, required, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={['flex flex-col', className].join(' ')}>
      <label htmlFor={inputId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={!!error}
          aria-required={required}
          className="w-4 h-4 rounded border-[#e2e8f0] dark:border-slate-700 text-[#2563eb] focus:ring-[#2563eb] focus:ring-offset-0 bg-white dark:bg-[#111111] transition-colors cursor-pointer disabled:opacity-50"
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-[#191b23] dark:text-slate-200">
            {label}
            {required && <span className="text-rose-600 dark:text-rose-400 ml-0.5" aria-hidden="true">*</span>}
          </span>
        )}
      </label>
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const Radio = memo(forwardRef(function Radio(
  { label, error, helper, required, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={['flex flex-col', className].join(' ')}>
      <label htmlFor={inputId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          aria-invalid={!!error}
          aria-required={required}
          className="w-4 h-4 rounded-full border-[#e2e8f0] dark:border-slate-700 text-[#2563eb] focus:ring-[#2563eb] focus:ring-offset-0 bg-white dark:bg-[#111111] transition-colors cursor-pointer disabled:opacity-50"
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-[#191b23] dark:text-slate-200">
            {label}
            {required && <span className="text-rose-600 dark:text-rose-400 ml-0.5" aria-hidden="true">*</span>}
          </span>
        )}
      </label>
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export const Switch = memo(forwardRef(function Switch(
  { label, checked, onChange, disabled = false, error, helper, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const handleToggle = (e) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { checked: !checked, name: props.name, type: 'checkbox' } });
    }
  };

  return (
    <div className={['flex flex-col', className].join(' ')}>
      <label
        htmlFor={inputId}
        role="switch"
        aria-checked={!!checked}
        tabIndex={disabled ? undefined : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(e); } }}
        className={['inline-flex items-center gap-3 select-none', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'].join(' ')}
      >
        <div
          onClick={handleToggle}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2',
            checked ? 'bg-[#2563eb]' : 'bg-slate-200 dark:bg-slate-700',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
            aria-hidden="true"
          />
        </div>
        {label && <span className="text-sm font-medium text-[#191b23] dark:text-slate-200">{label}</span>}
      </label>
      <HelperText error={error} helper={helper} />
    </div>
  );
}));

export default Input;
