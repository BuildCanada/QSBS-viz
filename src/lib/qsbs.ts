// Types for QSBS calculations
export interface QSBSCalculationInputs {
  ownershipPercentage: number
  exitValue: number
  costBasis: number
  currency: 'USD' | 'CAD'
}

export interface QSBSCalculationResult {
  personalExitValue: number
  capitalGains: number
  exemptGains: number
  taxableGains: number
  federalTax: number
  stateTax: number
  totalTax: number
  afterTaxProceeds: number
  exemptionAmount: number
  effectiveRate: number
  currency: 'USD' | 'CAD'
}

export interface TaxBracket {
  min: number;
  max: number | null; // null for highest bracket
  rate: number;
}

export interface StateData {
  name: string;
  brackets: TaxBracket[];
  hasHighIncomeAddOn?: boolean; // For CA's 1% additional tax over $1M
}

// Exchange rate USD to CAD
const USD_TO_CAD_RATE = 1.37;

// Currency conversion functions
function usdToCad(amount: number): number {
  return amount * USD_TO_CAD_RATE;
}

function cadToUsd(amount: number): number {
  return amount / USD_TO_CAD_RATE;
}

// 2025 US Federal Capital Gains Tax Brackets (Long-term, in USD)
const US_FEDERAL_CAPITAL_GAINS_BRACKETS_USD: TaxBracket[] = [
  { min: 0, max: 43000, rate: 0.0 },
  { min: 43000, max: 376200, rate: 0.15 },
  { min: 376200, max: null, rate: 0.20 }
];

// US State Tax Brackets (in USD)
export const US_STATES: Record<string, StateData> = {
  CA: {
    name: 'California',
    brackets: [
      { min: 0, max: 8932, rate: 0.01 },
      { min: 8932, max: 21175, rate: 0.02 },
      { min: 21175, max: 33421, rate: 0.04 },
      { min: 33421, max: 46394, rate: 0.06 },
      { min: 46394, max: 58634, rate: 0.08 },
      { min: 58634, max: 299508, rate: 0.093 },
      { min: 299508, max: 359407, rate: 0.103 },
      { min: 359407, max: 599012, rate: 0.113 },
      { min: 599012, max: null, rate: 0.123 }
    ],
    hasHighIncomeAddOn: true // 1% additional for income over $1M USD
  }
};

function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.min;
    const bracketMax = bracket.max || Infinity;
    const bracketWidth = bracketMax - bracketMin;
    
    // Calculate taxable amount in this bracket
    const taxableInBracket = Math.min(remainingIncome, bracketWidth);
    
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
  }

  return tax;
}

function calculateCaliforniaHighIncomeAddOn(income: number): number {
  const highIncomeThreshold = 1000000; // $1M USD
  if (income > highIncomeThreshold) {
    return (income - highIncomeThreshold) * 0.01; // 1% additional tax
  }
  return 0;
}

/**
 * Calculate QSBS (Qualified Small Business Stock) tax benefits with state taxes
 * 
 * QSBS allows exclusion of up to the greater of:
 * - $15 million USD, or 
 * - 10x the cost basis
 * 
 * Remaining gains are taxed at federal capital gains rates plus state income tax rates.
 * 
 * @param inputs - Calculation inputs including ownership, exit value, cost basis, and currency
 * @param stateCode - US state code for tax calculation (default: 'CA')
 * @returns QSBSCalculationResult object with detailed breakdown
 */
export function calculateQSBS(
  inputs: QSBSCalculationInputs,
  stateCode: string = 'CA'
): QSBSCalculationResult {
  const { ownershipPercentage, exitValue, costBasis, currency } = inputs
  
  const state = US_STATES[stateCode];
  if (!state) {
    throw new Error(`Invalid state code: ${stateCode}`);
  }

  // Convert inputs to USD for calculation (if needed)
  const exitValueUsd = currency === 'CAD' ? cadToUsd(exitValue) : exitValue;
  const costBasisUsd = currency === 'CAD' ? cadToUsd(costBasis) : costBasis;

  const personalExitValueUsd = exitValueUsd * (ownershipPercentage / 100)
  const personalCostBasisUsd = costBasisUsd * (ownershipPercentage / 100)
  const capitalGainsUsd = personalExitValueUsd - personalCostBasisUsd
  
  if (capitalGainsUsd <= 0) {
    const zeroResults = {
      personalExitValue: 0,
      capitalGains: 0,
      exemptGains: 0,
      taxableGains: 0,
      federalTax: 0,
      stateTax: 0,
      totalTax: 0,
      afterTaxProceeds: currency === 'CAD' ? usdToCad(personalExitValueUsd) : personalExitValueUsd,
      exemptionAmount: 0,
      effectiveRate: 0,
      currency
    };
    return zeroResults;
  }

  // QSBS exemption: greater of $15M USD or 10x cost basis
  const exemptionAmountUsd = Math.max(15000000, personalCostBasisUsd * 10)
  const exemptGainsUsd = Math.min(capitalGainsUsd, exemptionAmountUsd)
  const taxableGainsUsd = Math.max(0, capitalGainsUsd - exemptGainsUsd)

  // Calculate federal capital gains tax (in USD)
  const federalTaxUsd = calculateProgressiveTax(taxableGainsUsd, US_FEDERAL_CAPITAL_GAINS_BRACKETS_USD)
  
  // Calculate state income tax (in USD)
  let stateTaxUsd = calculateProgressiveTax(taxableGainsUsd, state.brackets)
  
  // Add California's high income add-on if applicable
  if (stateCode === 'CA' && state.hasHighIncomeAddOn) {
    stateTaxUsd += calculateCaliforniaHighIncomeAddOn(taxableGainsUsd)
  }

  const totalTaxUsd = federalTaxUsd + stateTaxUsd
  const afterTaxProceedsUsd = personalExitValueUsd - totalTaxUsd
  const effectiveRate = capitalGainsUsd > 0 ? totalTaxUsd / capitalGainsUsd : 0

  // Convert results to requested currency
  const convertAmount = (amount: number) => currency === 'CAD' ? usdToCad(amount) : amount;

  return {
    personalExitValue: convertAmount(personalExitValueUsd),
    capitalGains: convertAmount(capitalGainsUsd),
    exemptGains: convertAmount(exemptGainsUsd),
    taxableGains: convertAmount(taxableGainsUsd),
    federalTax: convertAmount(federalTaxUsd),
    stateTax: convertAmount(stateTaxUsd),
    totalTax: convertAmount(totalTaxUsd),
    afterTaxProceeds: convertAmount(afterTaxProceedsUsd),
    exemptionAmount: convertAmount(exemptionAmountUsd),
    effectiveRate,
    currency
  }
} 