import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard - A card component for displaying statistics with icon and trend
 * @param {string} title - The title of the stat
 * @param {string|number} value - The main value to display
 * @param {object} icon - Lucide icon component
 * @param {string} trend - Trend percentage (e.g., "+12.5%")
 * @param {boolean} trendUp - Whether trend is positive
 * @param {string} variant - Color variant: 'primary', 'success', 'warning', 'info'
 * @param {string} subtitle - Optional subtitle/description
 */
export const StatCard = forwardRef(({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp = true,
  variant = 'primary',
  subtitle,
  className,
  isLoading = false,
  ...props 
}, ref) => {
  const variantStyles = {
    primary: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    info: {
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
    accent: {
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
  };

  const styles = variantStyles[variant] || variantStyles.primary;

  if (isLoading) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border bg-card p-6 shadow-sm',
          'animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-3 w-20 bg-muted rounded"></div>
          </div>
          <div className="h-12 w-12 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border bg-card p-6 shadow-sm',
        'transition-all duration-200 ease-out',
        'hover:shadow-md hover:-translate-y-0.5',
        'group cursor-default',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {(trend || subtitle) && (
            <div className="flex items-center gap-1.5 pt-1">
              {trend && (
                <>
                  {trendUp ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={cn(
                    'text-sm font-medium',
                    trendUp ? 'text-success' : 'text-destructive'
                  )}>
                    {trend}
                  </span>
                </>
              )}
              {subtitle && (
                <span className="text-sm text-muted-foreground">
                  {trend ? '· ' : ''}{subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'rounded-xl p-3',
            'transition-transform duration-200',
            'group-hover:scale-110',
            styles.iconBg
          )}>
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
