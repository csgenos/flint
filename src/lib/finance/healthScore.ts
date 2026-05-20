import { FinancialHealthScore } from '../../types/finance';

interface HealthScoreInput {
  savingsRate: number;
  monthlyExpenses: number;
  liquidAssets: number;
  totalDebt: number;
  monthlyIncome: number;
  budgetAdherenceRate: number;
  hasInvestments: boolean;
}

export function calculateHealthScore(input: HealthScoreInput): FinancialHealthScore {
  const savingsRateScore = Math.min(input.savingsRate / 0.20, 1) * 100;

  const emergencyFundMonths = input.monthlyExpenses > 0
    ? input.liquidAssets / input.monthlyExpenses
    : 0;
  const emergencyFundScore = Math.min(emergencyFundMonths / 6, 1) * 100;

  const debtToIncome = input.monthlyIncome > 0
    ? input.totalDebt / (input.monthlyIncome * 12)
    : 1;
  const debtToIncomeScore = Math.max(0, 1 - debtToIncome / 0.36) * 100;

  const investmentScore = input.hasInvestments ? 100 : 40;

  const budgetScore = input.budgetAdherenceRate * 100;

  const overall = Math.round(
    savingsRateScore * 0.30 +
    emergencyFundScore * 0.25 +
    debtToIncomeScore * 0.20 +
    investmentScore * 0.15 +
    budgetScore * 0.10
  );

  let label: FinancialHealthScore['label'];
  if (overall >= 80) label = 'Excellent';
  else if (overall >= 65) label = 'Good';
  else if (overall >= 50) label = 'Fair';
  else label = 'Needs Work';

  return {
    overall,
    savingsRate: Math.round(savingsRateScore),
    emergencyFund: Math.round(emergencyFundScore),
    debtToIncome: Math.round(debtToIncomeScore),
    investmentDiversity: Math.round(investmentScore),
    budgetAdherence: Math.round(budgetScore),
    label,
  };
}
