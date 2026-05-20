import { ProjectionAssumptions, ProjectionPoint } from '../../types/finance';

export function generateProjections(
  currentNetWorth: number,
  annualIncome: number,
  annualExpenses: number,
  assumptions: ProjectionAssumptions,
  years = 30
): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  let netWorth = currentNetWorth;
  let income = annualIncome;
  let expenses = annualExpenses;
  let investmentValue = currentNetWorth * 0.6;

  for (let i = 0; i <= years; i++) {
    const age = assumptions.currentAge + i;
    const savings = income - expenses;
    investmentValue = investmentValue * (1 + assumptions.annualInvestmentReturn) + Math.max(0, savings);
    netWorth = netWorth + savings;

    points.push({
      year: new Date().getFullYear() + i,
      age,
      netWorth: Math.round(netWorth),
      annualIncome: Math.round(income),
      annualExpenses: Math.round(expenses),
      annualSavings: Math.round(savings),
      investmentValue: Math.round(investmentValue),
    });

    income *= 1 + assumptions.annualIncomeGrowth;
    expenses *= 1 + assumptions.annualExpenseGrowth;
  }

  return points;
}
