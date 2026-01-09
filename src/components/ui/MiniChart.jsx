import { cn } from '../../lib/utils';

/**
 * MiniChart - A simple SVG sparkline chart
 * @param {number[]} data - Array of values to plot
 * @param {string} color - Stroke color class
 * @param {number} height - Chart height in pixels
 * @param {number} width - Chart width in pixels
 * @param {boolean} showArea - Whether to show filled area below line
 */
export function MiniChart({
    data = [],
    color = 'stroke-primary',
    fillColor = 'fill-primary/20',
    height = 60,
    width = 200,
    showArea = true,
    className,
}) {
    if (!data || data.length < 2) {
        return (
            <div
                className={cn('flex items-center justify-center', className)}
                style={{ width, height }}
            >
                <span className="text-xs text-muted-foreground">No data</span>
            </div>
        );
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Generate path points
    const points = data.map((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - min) / range) * chartHeight;
        return { x, y };
    });

    // Create line path
    const linePath = points
        .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');

    // Create area path (closed shape)
    const areaPath = showArea
        ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`
        : '';

    return (
        <svg
            width={width}
            height={height}
            className={cn('overflow-visible', className)}
        >
            {/* Gradient definition */}
            <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Area fill */}
            {showArea && (
                <path
                    d={areaPath}
                    className={cn('text-primary', fillColor)}
                    fill="url(#chartGradient)"
                />
            )}

            {/* Line */}
            <path
                d={linePath}
                fill="none"
                className={cn(color)}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* End point dot */}
            <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r={4}
                className={cn('fill-current', color.replace('stroke-', 'text-'))}
            />
        </svg>
    );
}

export default MiniChart;
