import { cn } from '../../lib/utils';

export function LoadingSpinner({ className }) {
  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600', className)}
      style={{ width: '1.5rem', height: '1.5rem' }}
    />
  );
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200', className)}
    />
  );
}
