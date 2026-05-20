import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account, Transaction, Budget, Category, ProjectionAssumptions } from '../types/finance';
import {
  sampleAccounts,
  sampleTransactions,
  sampleBudgets,
  sampleCategories,
} from '../data/sampleData';

interface FinanceStore {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  assumptions: ProjectionAssumptions;
  setAccounts: (accounts: Account[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateAssumptions: (assumptions: Partial<ProjectionAssumptions>) => void;
}

const defaultAssumptions: ProjectionAssumptions = {
  annualIncomeGrowth: 0.04,
  annualExpenseGrowth: 0.03,
  annualInflation: 0.035,
  annualInvestmentReturn: 0.07,
  targetSavingsRate: 0.20,
  retirementAge: 65,
  currentAge: 32,
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      accounts: sampleAccounts,
      transactions: sampleTransactions,
      budgets: sampleBudgets,
      categories: sampleCategories,
      assumptions: defaultAssumptions,
      setAccounts: (accounts) => set({ accounts }),
      addTransaction: (transaction) =>
        set(state => ({ transactions: [transaction, ...state.transactions] })),
      updateAssumptions: (updates) =>
        set(state => ({ assumptions: { ...state.assumptions, ...updates } })),
    }),
    { name: 'finch-finance' }
  )
);
