import { useState } from 'react';
import { X, Info, AlertTriangle, CheckCircle, XCircle, Megaphone } from 'lucide-react';
import { cn } from '../../lib/utils';

const variants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
    iconClass: 'text-blue-500',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: CheckCircle,
    iconClass: 'text-emerald-500',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
  promo: {
    container: 'bg-indigo-600 text-white border-indigo-600',
    icon: Megaphone,
    iconClass: 'text-indigo-200',
  },
};

export function Announcement({
  variant = 'info',
  title,
  children,
  dismissible = true,
  onDismiss,
  className,
  action,
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const config = variants[variant];
  const Icon = config.icon;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 border rounded-xl',
        config.container,
        className
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium">{title}</p>}
        <div className={cn('text-sm', title && 'mt-1', variant === 'promo' ? 'text-indigo-100' : 'opacity-90')}>
          {children}
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            'p-1 rounded-lg transition-colors flex-shrink-0',
            variant === 'promo'
              ? 'hover:bg-indigo-500 text-indigo-200 hover:text-white'
              : 'hover:bg-black/5'
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function AnnouncementBanner({
  variant = 'promo',
  children,
  dismissible = true,
  onDismiss,
  className,
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const bgColors = {
    info: 'bg-blue-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    error: 'bg-red-600',
    promo: 'bg-indigo-600',
  };

  return (
    <div
      className={cn(
        'relative py-3 px-4 text-white text-center text-sm font-medium',
        bgColors[variant],
        className
      )}
    >
      {children}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
