/**
 * shared/Avatar.jsx
 * Precision Enterprise Design System — Shared Avatar Component
 * 
 * Centralized tokens: Full rounded pill shape, Slate neutral scale fallbacks, semantic status indicator rings.
 * WCAG 2.1 AA compliant with proper alt text, role="img", and React.memo optimization.
 * 
 * Sizes: xs (24px) | sm (32px) | md (40px, default) | lg (48px) | xl (64px)
 * Status: online | offline | busy | away
 */
import React, { memo, useState } from 'react';

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeMap = {
  xs: 'w-1.5 h-1.5 right-0 bottom-0',
  sm: 'w-2 h-2 right-0 bottom-0',
  md: 'w-2.5 h-2.5 right-0.5 bottom-0.5',
  lg: 'w-3 h-3 right-0.5 bottom-0.5',
  xl: 'w-3.5 h-3.5 right-1 bottom-1',
};

const statusColorMap = {
  online:  'bg-emerald-500 border-white dark:border-[#111111]',
  busy:    'bg-rose-500 border-white dark:border-[#111111]',
  away:    'bg-amber-500 border-white dark:border-[#111111]',
  offline: 'bg-slate-400 border-white dark:border-[#111111]',
};

export const Avatar = memo(function Avatar({
  src,
  alt,
  name,
  initials,
  size = 'md',
  status,
  className = '',
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (str) => {
    if (!str) return '?';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const displayInitials = initials || getInitials(name || alt);
  const showImage = src && !imgError;

  return (
    <div className={['relative inline-flex shrink-0 select-none', className].join(' ')} {...props}>
      <div
        role="img"
        aria-label={alt || name || 'User avatar'}
        className={[
          'rounded-full overflow-hidden flex items-center justify-center font-bold',
          'bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-300 border border-blue-200 dark:border-blue-800',
          sizeMap[size] || sizeMap.md,
        ].join(' ')}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{displayInitials}</span>
        )}
      </div>

      {status && statusColorMap[status] && (
        <span
          className={[
            'absolute rounded-full border-2',
            statusSizeMap[size] || statusSizeMap.md,
            statusColorMap[status],
          ].join(' ')}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

export default Avatar;
