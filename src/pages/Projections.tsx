import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { generateProjections } from '../lib/finance/projections';
import { ProjectionChart } from '../components/charts/ProjectionChart';
import { formatCurrency } from '../lib/utils/format';
import { calculateNetWorth, calculateMonthSummary } from '../lib/finance/cashflow';

export function Projections() {
  const { accounts, transactions, assumptions } = useFinanceStore();
  const now = new Date();

  const netWorth = useMemo(() => calculateNetWorth(accounts), [accounts]);
  const summary = useMemo(
    () => calculateMonthSummary(transactions, now.getFullYear(), now.getMonth() + 1),
    [transactions]
  );

  const projections = useMemo(
    () =>
      generateProjections(
        netWorth,
        summary.totalIncome * 12,
        summary.totalExpenses * 12,
        assumptions,
        30
      ),
    [netWorth, summary, assumptions]
  );

  const retirementYear = assumptions.retirementAge - assumptions.currentAge;
  const retirementPoint = projections[Math.min(retirementYear, projections.length - 1)];

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Projected at Retirement',
            value: formatCurrency(retirementPoint?.netWorth ?? 0, 'USD', true),
          },
          { label: 'Retirement Age', value: `${assumptions.retirementAge}` },
          { label: 'Years to Retirement', value: `${retirementYear}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border rounded-lg shadow-card p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="text-2xl font-semibold mt-1 text-foreground tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-card p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">30-Year Projection</h2>
          <p className="text-xs text-muted-foreground">Net worth and investment value trajectory</p>
        </div>
        <div className="h-72">
          <ProjectionChart data={projections} />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Assumptions</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            {
              label: 'Annual Income Growth',
              value: `${(assumptions.annualIncomeGrowth * 100).toFixed(1)}%`,
            },
            {
              label: 'Annual Expense Growth',
              value: `${(assumptions.annualExpenseGrowth * 100).toFixed(1)}%`,
            },
            {
              label: 'Expected Investment Return',
              value: `${(assumptions.annualInvestmentReturn * 100).toFixed(1)}%`,
            },
            {
              label: 'Annual Inflation',
              value: `${(assumptions.annualInflation * 100).toFixed(1)}%`,
            },
            {
              label: 'Target Savings Rate',
              value: `${(assumptions.targetSavingsRate * 100).toFixed(0)}%`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3.5 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
