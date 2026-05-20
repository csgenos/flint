import { describe, expect, it } from 'vitest';
import { calculateMonthSummary } from './cashflow';
import type { Transaction } from '../../types/finance';

describe('calculateMonthSummary', () => {
  it('treats yyyy-mm-dd transaction dates as local calendar days', () => {
    const transactions: Transaction[] = [
      {
        id: 'txn-1',
        date: '2026-05-01',
        amount: 100,
        type: 'expense',
        categoryId: 'cat-1',
        accountId: 'acc-1',
        description: 'Rent',
      },
    ];

    const maySummary = calculateMonthSummary(transactions, 2026, 5);
    const aprilSummary = calculateMonthSummary(transactions, 2026, 4);

    expect(maySummary.totalExpenses).toBe(100);
    expect(aprilSummary.totalExpenses).toBe(0);
  });
});
