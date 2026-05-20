import { useState, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../lib/utils/format';
import { cn } from '../lib/utils/cn';
import { Search } from 'lucide-react';

export function Transactions() {
  const { transactions, categories } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? '—';

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || t.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  return (
    <div className="p-6 space-y-4 max-w-screen-lg mx-auto">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="flex bg-muted rounded-md p-0.5">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors',
                filter === f
                  ? 'bg-surface text-foreground shadow-subtle'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">
                Description
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(txn => (
              <tr key={txn.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-foreground">{txn.description}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-muted-foreground">
                    {getCategoryName(txn.categoryId)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-muted-foreground">{txn.date}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      txn.type === 'income' ? 'text-positive' : 'text-foreground'
                    )}
                  >
                    {txn.type === 'income' ? '+' : '-'}
                    {formatCurrency(txn.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
