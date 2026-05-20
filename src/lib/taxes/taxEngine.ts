import { TaxInput, TaxResult, TaxBreakdownItem } from '../../types/tax';
import federalData from '../../data/taxes/us/federal.json';

interface Bracket { min: number; max: number | null; rate: number; }

function calculateBracketTax(taxableIncome: number, brackets: Bracket[]): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const upper = bracket.max ?? Infinity;
    const taxableInBracket = Math.min(taxableIncome, upper) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }
  return tax;
}

function getMarginalRate(taxableIncome: number, brackets: Bracket[]): number {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome >= brackets[i].min) return brackets[i].rate;
  }
  return brackets[0].rate;
}

export function calculateFederalTax(input: TaxInput): TaxResult {
  const yearData = federalData;
  const statusKey = input.filingStatus as keyof typeof yearData.brackets;
  const statusData = yearData.brackets[statusKey] ?? yearData.brackets.single;

  const adjustments = (input.retirementContributions ?? 0) + (input.hsaContributions ?? 0);
  const agi = input.grossIncome - adjustments;
  const deductions = input.deductions ?? statusData.standardDeduction;
  const taxableIncome = Math.max(0, agi - deductions);

  const federalTax = calculateBracketTax(taxableIncome, statusData.brackets as Bracket[]);
  const marginalRate = getMarginalRate(taxableIncome, statusData.brackets as Bracket[]);

  const { socialSecurity, medicare } = yearData.ficaRates;
  const ssTax = Math.min(input.grossIncome, socialSecurity.wageBase) * socialSecurity.rate;
  const medicareTax =
    input.grossIncome * medicare.rate +
    Math.max(0, input.grossIncome - medicare.additionalThreshold) * medicare.additionalRate;
  const ficaTax = ssTax + medicareTax;

  const stateTax = 0;
  const totalTax = federalTax + stateTax + ficaTax;
  const effectiveRate = input.grossIncome > 0 ? totalTax / input.grossIncome : 0;
  const afterTaxIncome = input.grossIncome - totalTax;

  const breakdown: TaxBreakdownItem[] = [
    { label: 'Federal Income Tax', amount: federalTax, rate: marginalRate },
    { label: 'Social Security', amount: ssTax, rate: socialSecurity.rate },
    { label: 'Medicare', amount: medicareTax, rate: medicare.rate },
    { label: 'State Income Tax', amount: stateTax },
  ];

  return {
    grossIncome: input.grossIncome,
    adjustedGrossIncome: agi,
    taxableIncome,
    federalTax,
    stateTax,
    ficaTax,
    totalTax,
    effectiveRate,
    marginalRate,
    afterTaxIncome,
    breakdown,
  };
}
