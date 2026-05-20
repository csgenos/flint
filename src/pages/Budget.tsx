import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { getBudgetSpending } from '../lib/finance/budget';
import { formatCurrency } from '../lib/utils/format';
import { cn } from '../lib/utils/cn';

export function Budget() {
  const { budgets, transactions, categories } = useFinanceStore();
  const now = new Date();

  const budgetData = useMemo(
    () => getBudgetSpending(budgets, transactions, now.getFullYear(), now.getMonth() + 1),
    [budgets, transactions]
  );

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? id;

  const totalBudget = budgetData.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: formatCurrency(totalBudget), color: 'text-foreground' },
          { label: 'Spent', value: formatCurrency(totalSpent), color: 'text-foreground' },
          {
            label: 'Remaining',
            value: formatCurrency(totalRemaining),
            color: totalRemaining >= 0 ? 'text-positive' : 'text-negative',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface border border-border rounded-lg shadow-card p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className={cn('text-2xl font-semibold mt-1 tabular-nums', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-surface border border-border rounded-lg shadow-card p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Overall Budget Usage</span>
          <span className="text-sm font-medium text-foreground tabular-nums">
            {overallPct.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              overallPct > 90 ? 'bg-negative' : overallPct > 75 ? 'bg-warning' : 'bg-positive'
            )}
            style={{ width: `${Math.min(overallPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Category budgets */}
      <div className="bg-surface border border-border rounded-lg shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Category Budgets</h2>
        </div>
        <div className="divide-y divide-border">
          {budgetData.map(budget => (
            <div key={budget.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {getCategoryName(budget.categoryId)}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                  <span className="text-foreground font-medium">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span>/</span>
                  <span>{formatCurrency(budget.amount)}</span>
                  <span
                    className={cn(
                      'font-medium',
                      budget.remaining >= 0 ? 'text-muted-foreground' : 'text-negative'
                    )}
                  >
                    {budget.remaining >= 0
                      ? `${formatCurrency(budget.remaining)} left`
                      : `${formatCurrency(Math.abs(budget.remaining))} over`}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    budget.percentage > 100
                      ? 'bg-negative'
                      : budget.percentage > 80
                        ? 'bg-warning'
                        : 'bg-brand'
                  )}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
          {budgetData.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No budgets configured for this month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
