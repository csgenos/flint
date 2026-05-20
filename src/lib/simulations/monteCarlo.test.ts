import { describe, expect, it } from 'vitest';
import { runMonteCarlo } from './monteCarlo';

const assumptions = {
  annualIncomeGrowth: 0.03,
  annualExpenseGrowth: 0.02,
  annualInflation: 0.025,
  annualInvestmentReturn: 0.07,
  targetSavingsRate: 0.2,
  retirementAge: 65,
  currentAge: 35,
};

describe('runMonteCarlo', () => {
  it('reports full success when the retirement target is already met and no projection time remains', () => {
    const result = runMonteCarlo(500000, 0, 400000, { ...assumptions, currentAge: 65 }, 50, 10);

    expect(result.successProbability).toBe(1);
  });

  it('reports zero success when the retirement target is impossible to reach by retirement', () => {
    const result = runMonteCarlo(1000, 0, 1000000, { ...assumptions, currentAge: 64 }, 50, 1);

    expect(result.successProbability).toBe(0);
  });
});
