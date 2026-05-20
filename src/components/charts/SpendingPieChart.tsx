import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils/format';

interface SpendingItem {
  name: string;
  value: number;
  color: string;
}

interface SpendingPieChartProps {
  data: SpendingItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg shadow-card-hover p-3">
      <p className="text-xs text-muted-foreground">{payload[0].name}</p>
      <p className="text-sm font-semibold text-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex gap-6 items-center">
      <div className="w-36 h-36 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={64}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.map(item => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
              <span className="text-xs font-medium text-foreground tabular-nums">
                {formatCurrency(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
