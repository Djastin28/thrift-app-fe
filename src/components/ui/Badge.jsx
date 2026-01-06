import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Badge = forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';
