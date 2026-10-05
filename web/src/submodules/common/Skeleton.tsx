import React, { useState } from 'react';

/**
 * Skeleton component following Kyle Zantos Motion Principles.
 * Provides shimmering bone placeholder for text, cards, avatars, and tables.
 */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'skeleton inline-block rounded-lg pointer-events-none select-none';

  let variantClasses = '';
  switch (variant) {
    case 'text':
      variantClasses = 'h-4 w-full rounded-md';
      break;
    case 'circular':
      variantClasses = 'rounded-full';
      break;
    case 'card':
      variantClasses = 'h-48 w-full rounded-2xl';
      break;
    case 'table-row':
      variantClasses = 'h-10 w-full rounded-xl';
      break;
    case 'rectangular':
    default:
      variantClasses = 'w-full h-full rounded-xl';
      break;
  }

  const style: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return <div className={`${baseClasses} ${variantClasses} ${className}`} style={style} />;
}

/**
 * Deck Card Skeleton Grid - Pixel-exact match to Dashboard Deck cards
 */
export function DeckSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 animate-fade-in-up">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs flex flex-col overflow-hidden"
        >
          {/* Top Banner Skeleton */}
          <div className="relative h-44 overflow-hidden bg-surface-container">
            <Skeleton className="w-full h-full" />
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <Skeleton className="w-16 h-5 rounded" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
              <Skeleton className="w-14 h-5 rounded" />
              <Skeleton className="w-10 h-5 rounded" />
            </div>
          </div>

          {/* Card Body Skeleton */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 w-3/4">
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-3 w-3/5 rounded-md" />
              </div>
              <Skeleton className="h-5 w-10 rounded-md" />
            </div>

            {/* Progress Bar Skeleton */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3 border-t border-surface-container-high/60 flex items-center justify-between mt-1">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Skeleton Rows
 */
export function TableSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4 animate-fade-in-up">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between gap-4 py-2 border-b border-surface-border/60">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" className={`h-5 ${c === 0 ? 'w-2/5' : 'w-1/6'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Lazy Image with Blur-Up and Motion Skeleton Loading
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string;
}

export function LazyImage({ src, alt, className = '', aspectRatio = 'aspect-auto', ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-surface-low rounded-xl ${aspectRatio}`}>
      {!loaded && !error && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full rounded-xl" />
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container text-xs text-brand-slate font-mono">
          <span>Card Frame</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
