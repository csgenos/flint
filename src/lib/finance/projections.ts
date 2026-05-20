import { ProjectionAssumptions, ProjectionPoint } from '../../types/finance';

export function generateProjections(
  currentNetWorth: number,
  annualIncome: number,
  annualExpenses: number,
  assumptions: ProjectionAssumptions,
  years = 30
): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];

  const startYear = new Date().getFullYear();
  // 60% of net worth assumed invested; the rest is liquid/non-compounding.
  let investmentValue = Math.max(0, currentNetWorth * 0.6);
  let netWorth = currentNetWorth;
  let income = annualIncome;
  let expenses = annualExpenses;

  for (let i = 0; i <= years; i++) {
    const savings = income - expenses;

    // Apply investment return, then add savings contributions (or subtract deficit).
    const investmentReturn = investmentValue * assumptions.annualInvestmentReturn;
    investmentValue = Math.max(0, investmentValue + investmentReturn + savings);
    netWorth += savings + investmentReturn;

    points.push({
      year: startYear + i,
      age: assumptions.currentAge + i,
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
