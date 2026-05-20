import { useMemo } from 'react';
import { DollarSign, TrendingUp, PiggyBank, Target, Shield, Zap } from 'lucide-react';
import { StatCard } from '../components/cards/StatCard';
import { HealthScoreCard } from '../components/cards/HealthScoreCard';
import { NetWorthChart } from '../components/charts/NetWorthChart';
import { CashFlowChart } from '../components/charts/CashFlowChart';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { useFinanceStore } from '../store/useFinanceStore';
import {
  calculateMonthSummary,
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
} from '../lib/finance/cashflow';
import { calculateHealthScore } from '../lib/finance/healthScore';
import { formatCurrency, formatPercent } from '../lib/utils/format';
import {
  sampleNetWorthHistory,
  sampleMonthlyExpenses,
  sampleSpendingBreakdown,
} from '../data/sampleData';

export function Dashboard() {
  const { accounts, transactions, budgets: _budgets } = useFinanceStore();

  const now = new Date();
  const summary = useMemo(
    () => calculateMonthSummary(transactions, now.getFullYear(), now.getMonth() + 1),
    [transactions]
  );

  const netWorth = useMemo(() => calculateNetWorth(accounts), [accounts]);
  const totalAssets = useMemo(() => calculateTotalAssets(accounts), [accounts]);
  const totalLiabilities = useMemo(() => calculateTotalLiabilities(accounts), [accounts]);

  const healthScore = useMemo(
    () =>
      calculateHealthScore({
        savingsRate: summary.savingsRate,
        monthlyExpenses: summary.totalExpenses,
        liquidAssets: accounts
          .filter(a => a.type === 'checking' || a.type === 'savings')
          .reduce((s, a) => s + a.balance, 0),
        totalDebt: totalLiabilities,
        monthlyIncome: summary.totalIncome,
        budgetAdherenceRate: 0.82,
        hasInvestments: accounts.some(
          a => a.type === 'investment' || a.type === 'retirement'
        ),
      }),
    [accounts, summary, totalLiabilities]
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Net Worth"
          value={formatCurrency(netWorth, 'USD', true)}
          change={3.2}
          changeLabel="vs last month"
          icon={DollarSign}
          accent="positive"
        />
        <StatCard
          label="Monthly Income"
          value={formatCurrency(summary.totalIncome)}
          change={2.1}
          changeLabel="vs last month"
          icon={TrendingUp}
          accent="positive"
        />
        <StatCard
          label="Monthly Spend"
          value={formatCurrency(summary.totalExpenses)}
          change={-1.4}
          changeLabel="vs last month"
          icon={Zap}
          accent="neutral"
        />
        <StatCard
          label="Savings Rate"
          value={formatPercent(summary.savingsRate)}
          changeLabel="of income saved"
          icon={PiggyBank}
          accent="positive"
        />
        <StatCard
          label="Total Assets"
          value={formatCurrency(totalAssets, 'USD', true)}
          changeLabel={`${accounts.filter(a => a.balance > 0).length} accounts`}
          icon={Target}
          accent="neutral"
        />
        <StatCard
          label="Total Debt"
          value={formatCurrency(totalLiabilities, 'USD', true)}
          changeLabel={`${accounts.filter(a => a.balance < 0).length} accounts`}
          icon={Shield}
          accent="negative"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Net Worth Chart - 2/3 width */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Net Worth</h2>
              <p className="text-xs text-muted-foreground">12-month trend</p>
            </div>
            <span className="text-2xl font-semibold text-foreground tabular-nums">
              {formatCurrency(netWorth, 'USD', true)}
            </span>
          </div>
          <div className="h-52">
            <NetWorthChart data={sampleNetWorthHistory} />
          </div>
        </div>

        {/* Health Score */}
        <HealthScoreCard score={healthScore} />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash Flow */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg shadow-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Cash Flow</h2>
            <p className="text-xs text-muted-foreground">Income vs expenses, last 6 months</p>
          </div>
          <div className="h-52">
            <CashFlowChart data={sampleMonthlyExpenses} />
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="bg-surface border border-border rounded-lg shadow-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Spending</h2>
            <p className="text-xs text-muted-foreground">This month by category</p>
          </div>
          <SpendingPieChart data={sampleSpendingBreakdown} />
        </div>
      </div>

      {/* Accounts + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Accounts */}
        <div className="bg-surface border border-border rounded-lg shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Accounts</h2>
          <div className="space-y-2">
            {accounts.map(account => (
              <div
                key={account.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{account.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {account.type} · {account.institution}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums ${account.balance < 0 ? 'text-negative' : 'text-foreground'}`}
                >
                  {formatCurrency(Math.abs(account.balance))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-surface border border-border rounded-lg shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions.slice(0, 8).map(txn => (
              <div
                key={txn.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {txn.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums ml-3 flex-shrink-0 ${txn.type === 'income' ? 'text-positive' : 'text-foreground'}`}
                >
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
