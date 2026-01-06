import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const alertVariants = {
  default: 'bg-slate-50 text-slate-900 border-slate-200',
  error: 'bg-red-50 text-red-900 border-red-200',
  success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  warning: 'bg-amber-50 text-amber-900 border-amber-200',
  info: 'bg-blue-50 text-blue-900 border-blue-200',
};

const alertIcons = {
  default: Info,
  error: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

export const Alert = forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const Icon = alertIcons[variant];
  
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4',
        alertVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
});
Alert.displayName = 'Alert';
