import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { runMonteCarlo } from '../lib/simulations/monteCarlo';
import { calculateNetWorth, calculateMonthSummary } from '../lib/finance/cashflow';
import { formatCurrency, formatPercent } from '../lib/utils/format';

export function MonteCarlo() {
  const { accounts, transactions, assumptions } = useFinanceStore();
  const now = new Date();

  const netWorth = useMemo(() => calculateNetWorth(accounts), [accounts]);
  const summary = useMemo(
    () => calculateMonthSummary(transactions, now.getFullYear(), now.getMonth() + 1),
    [transactions]
  );

  const result = useMemo(
    () => runMonteCarlo(netWorth, summary.netCashFlow * 12, assumptions, 500, 30),
    [netWorth, summary, assumptions]
  );

  const chartData = result.years.map((year, i) => ({
    year,
    p10: result.percentile10[i],
    p25: result.percentile25[i],
    p50: result.percentile50[i],
    p75: result.percentile75[i],
    p90: result.percentile90[i],
  }));

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg shadow-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Success Probability
          </p>
          <p className="text-3xl font-semibold mt-1 text-positive tabular-nums">
            {formatPercent(result.successProbability)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">of simulations reached retirement</p>
        </div>
        <div className="bg-surface border border-border rounded-lg shadow-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Median Outcome (30yr)
          </p>
          <p className="text-2xl font-semibold mt-1 text-foreground tabular-nums">
            {formatCurrency(result.percentile50[30], 'USD', true)}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-lg shadow-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Best Case (90th pct)
          </p>
          <p className="text-2xl font-semibold mt-1 text-foreground tabular-nums">
            {formatCurrency(result.percentile90[30], 'USD', true)}
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-card p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Outcome Distribution</h2>
          <p className="text-xs text-muted-foreground">
            500 simulations — shaded bands show 10th–90th percentile range
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="p90Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="p75Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="p25Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.10} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => formatCurrency(v, 'USD', true)}
                width={60}
              />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                labelFormatter={l => `Year ${l}`}
              />
              <Area type="monotone" dataKey="p90" stroke="none" fill="url(#p90Grad)" />
              <Area type="monotone" dataKey="p75" stroke="none" fill="url(#p75Grad)" />
              <Area
                type="monotone"
                dataKey="p50"
                stroke="#6366F1"
                strokeWidth={2}
                fill="none"
                dot={false}
              />
              <Area type="monotone" dataKey="p25" stroke="none" fill="url(#p25Grad)" />
              <Area type="monotone" dataKey="p10" stroke="none" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3 justify-center">
          {[
            { label: '10th–90th pct', color: '#6366F1', opacity: '20%' },
            { label: '25th–75th pct', color: '#6366F1', opacity: '35%' },
            { label: 'Median (50th)', color: '#6366F1', opacity: '100%' },
          ].map(({ label, color, opacity }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: color, opacity }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
