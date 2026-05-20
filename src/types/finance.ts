export type TransactionType = 'income' | 'expense' | 'transfer';
export type Frequency = 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
export type AccountType = 'checking' | 'savings' | 'investment' | 'credit' | 'loan' | 'retirement';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution?: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  parentId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  description: string;
  notes?: string;
  recurring?: boolean;
  recurringFrequency?: Frequency;
  tags?: string[];
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  year: number;
  month?: number;
}

export interface MonthSummary {
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number;
  topCategories: { categoryId: string; amount: number }[];
}

export interface NetWorthSnapshot {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export interface ProjectionAssumptions {
  annualIncomeGrowth: number;
  annualExpenseGrowth: number;
  annualInflation: number;
  annualInvestmentReturn: number;
  targetSavingsRate: number;
  retirementAge: number;
  currentAge: number;
}

export interface ProjectionPoint {
  year: number;
  age: number;
  netWorth: number;
  annualIncome: number;
  annualExpenses: number;
  annualSavings: number;
  investmentValue: number;
}

export interface MonteCarloResult {
  percentile10: number[];
  percentile25: number[];
  percentile50: number[];
  percentile75: number[];
  percentile90: number[];
  years: number[];
  successProbability: number;
}

export interface FinancialHealthScore {
  overall: number;
  savingsRate: number;
  emergencyFund: number;
  debtToIncome: number;
  investmentDiversity: number;
  budgetAdherence: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
}
