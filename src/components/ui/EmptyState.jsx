import { cn } from '../../lib/utils';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
