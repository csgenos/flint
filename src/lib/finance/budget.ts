import { Budget, Transaction } from '../../types/finance';

export function getBudgetSpending(
  budgets: Budget[],
  transactions: Transaction[],
  year: number,
  month: number
): Array<Budget & { spent: number; remaining: number; percentage: number }> {
  return budgets
    .filter(b => b.year === year && (b.month === undefined || b.month === month))
    .map(budget => {
      const spent = transactions
        .filter(t => {
          const d = new Date(t.date);
          return (
            t.categoryId === budget.categoryId &&
            t.type === 'expense' &&
            d.getFullYear() === year &&
            d.getMonth() + 1 === month
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return { ...budget, spent, remaining, percentage };
    });
}

export function calculateSafeToSpend(
  _monthlyIncome: number,
  _fixedExpenses: number,
  daysRemainingInMonth: number,
  _daysInMonth: number,
  variableExpensesSpentSoFar: number,
  variableBudget: number
): number {
  const remainingVariableBudget = variableBudget - variableExpensesSpentSoFar;
  const dailySafeAmount = daysRemainingInMonth > 0
    ? remainingVariableBudget / daysRemainingInMonth
    : 0;
  return Math.max(0, dailySafeAmount);
}
