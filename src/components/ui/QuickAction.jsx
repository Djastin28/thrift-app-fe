import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * QuickAction - A button-like card for quick navigation
 * @param {string} to - Route to navigate to
 * @param {object} icon - Lucide icon component
 * @param {string} title - Action title
 * @param {string} description - Short description
 * @param {string} variant - Color variant
 */
export function QuickAction({
    to,
    icon: Icon,
    title,
    description,
    variant = 'primary',
    className,
}) {
    const variantStyles = {
        primary: 'hover:border-primary hover:bg-primary/5',
        success: 'hover:border-success hover:bg-success/5',
        warning: 'hover:border-warning hover:bg-warning/5',
        info: 'hover:border-info hover:bg-info/5',
    };

    const iconColors = {
        primary: 'text-primary',
        success: 'text-success',
        warning: 'text-warning',
        info: 'text-info',
    };

    return (
        <Link
            to={to}
            className={cn(
                'flex items-center gap-4 rounded-xl border bg-card p-4',
                'transition-all duration-200',
                'hover:shadow-md hover:-translate-y-0.5',
                'group',
                variantStyles[variant],
                className
            )}
        >
            <div className={cn(
                'rounded-lg bg-muted p-2.5',
                'transition-colors duration-200',
                `group-hover:bg-${variant}/10`
            )}>
                <Icon className={cn('h-5 w-5 text-muted-foreground transition-colors', `group-hover:${iconColors[variant]}`)} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{title}</p>
                <p className="text-sm text-muted-foreground truncate">{description}</p>
            </div>
        </Link>
    );
}

/**
 * QuickActionsGrid - Container for quick action items
 */
export function QuickActionsGrid({ children, className }) {
    return (
        <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
            {children}
        </div>
    );
}

export default QuickAction;
