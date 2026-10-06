import React from 'react';

/**
 * Reusable loading skeleton placeholders.
 * Use while data is being fetched so the UI does not pop in abruptly.
 */
export function Skeleton({ className = '', width, height, rounded = 'rounded-md' }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  return (
    <div
      role="status"
      aria-label="Đang tải dữ liệu"
      className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  // Generate believable paragraph widths so it does not look like a uniform bar
  const widths = ['w-11/12', 'w-10/12', 'w-9/12', 'w-8/12', 'w-7/12'];
  return (
    <div className={`space-y-2 ${className}`} role="status" aria-label="Đang tải dữ liệu">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.7rem"
          width=""
          className={`h-2.5 ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2" role="status" aria-label="Đang tải bảng dữ liệu">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton
              key={c}
              height="1.75rem"
              className="flex-1"
              width=""
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
