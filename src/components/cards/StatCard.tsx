import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  accent?: 'positive' | 'negative' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  accent = 'neutral',
  size = 'md',
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const isNeutral = change === undefined;

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200',
        size === 'sm' && 'p-4',
        size === 'md' && 'p-5',
        size === 'lg' && 'p-6'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p
            className={cn(
              'font-semibold text-foreground mt-1 tabular-nums',
              size === 'sm' && 'text-xl',
              size === 'md' && 'text-2xl',
              size === 'lg' && 'text-3xl'
            )}
          >
            {value}
          </p>
          {!isNeutral && (
            <div
              className={cn(
                'flex items-center gap-1 mt-1.5',
                isPositive ? 'text-positive' : 'text-negative'
              )}
            >
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span className="text-xs font-medium">
                {isPositive ? '+' : ''}
                {change?.toFixed(1)}%
                {changeLabel && (
                  <span className="text-muted-foreground font-normal ml-1">{changeLabel}</span>
                )}
              </span>
            </div>
          )}
          {isNeutral && changeLabel && (
            <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'p-2 rounded-md',
              accent === 'positive' && 'bg-green-50 text-positive',
              accent === 'negative' && 'bg-red-50 text-negative',
              accent === 'warning' && 'bg-amber-50 text-warning',
              accent === 'neutral' && 'bg-accent text-muted-foreground'
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
