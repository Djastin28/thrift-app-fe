import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700',
  ghost: 'hover:bg-slate-100 text-slate-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export const Button = forwardRef(
  ({ className, variant = 'default', size = 'default', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
