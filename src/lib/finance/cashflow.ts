import { Transaction, MonthSummary } from '../../types/finance';

export function calculateMonthSummary(
  transactions: Transaction[],
  year: number,
  month: number
): MonthSummary {
  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const totalIncome = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? netCashFlow / totalIncome : 0;

  const categoryTotals = filtered
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {});

  const topCategories = Object.entries(categoryTotals)
    .map(([categoryId, amount]) => ({ categoryId, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return { year, month, totalIncome, totalExpenses, netCashFlow, savingsRate, topCategories };
}

export function calculateNetWorth(accounts: { balance: number }[]): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

export function calculateTotalAssets(accounts: { balance: number; type: string }[]): number {
  return accounts
    .filter(a => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);
}

export function calculateTotalLiabilities(accounts: { balance: number }[]): number {
  return accounts
    .filter(a => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
}
