import { ProjectionAssumptions, MonteCarloResult } from '../../types/finance';

function normalRandom(mean: number, std: number): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

export function runMonteCarlo(
  initialNetWorth: number,
  annualSavings: number,
  assumptions: ProjectionAssumptions,
  simulations = 1000,
  years = 30
): MonteCarloResult {
  const returnMean = assumptions.annualInvestmentReturn;
  const returnStd = 0.15;

  const allPaths: number[][] = [];

  for (let sim = 0; sim < simulations; sim++) {
    const path: number[] = [initialNetWorth];
    let portfolio = initialNetWorth;
    let savings = annualSavings;

    for (let y = 1; y <= years; y++) {
      const annualReturn = normalRandom(returnMean, returnStd);
      portfolio = portfolio * (1 + annualReturn) + savings;
      savings *= 1 + assumptions.annualIncomeGrowth - assumptions.annualExpenseGrowth;
      path.push(Math.max(0, portfolio));
    }
    allPaths.push(path);
  }

  const yearLabels = Array.from({ length: years + 1 }, (_, i) => new Date().getFullYear() + i);

  const getPercentile = (paths: number[][], yearIdx: number, p: number): number => {
    const sorted = paths.map(path => path[yearIdx]).sort((a, b) => a - b);
    const idx = Math.floor((p / 100) * sorted.length);
    return sorted[Math.min(idx, sorted.length - 1)];
  };

  const retirementYear = assumptions.retirementAge - assumptions.currentAge;
  const successCount = allPaths.filter(
    path => path[Math.min(retirementYear, years)] > 0
  ).length;

  return {
    years: yearLabels,
    percentile10: yearLabels.map((_, i) => Math.round(getPercentile(allPaths, i, 10))),
    percentile25: yearLabels.map((_, i) => Math.round(getPercentile(allPaths, i, 25))),
    percentile50: yearLabels.map((_, i) => Math.round(getPercentile(allPaths, i, 50))),
    percentile75: yearLabels.map((_, i) => Math.round(getPercentile(allPaths, i, 75))),
    percentile90: yearLabels.map((_, i) => Math.round(getPercentile(allPaths, i, 90))),
    successProbability: successCount / simulations,
  };
}
