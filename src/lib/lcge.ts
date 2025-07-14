// Types for LCGE calculations
export interface LCGECalculation {
  gain: number;
  exemptAmount: number;
  taxableAmount: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  afterTaxAmount: number;
  effectiveRate: number;
  currency: 'USD' | 'CAD';
}

export interface TaxBracket {
  min: number;
  max: number | null; // null for highest bracket
  rate: number;
}

export interface ProvinceData {
  name: string;
  brackets: TaxBracket[];
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

// 2025 Canadian Federal Tax Brackets (in CAD)
const FEDERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 55867, rate: 0.15 },
  { min: 55867, max: 111733, rate: 0.205 },
  { min: 111733, max: 173205, rate: 0.26 },
  { min: 173205, max: 246752, rate: 0.29 },
  { min: 246752, max: null, rate: 0.33 }
];

// Provincial/Territorial Tax Brackets (2025, in CAD)
export const PROVINCES: Record<string, ProvinceData> = {
  AB: {
    name: 'Alberta',
    brackets: [
      { min: 0, max: 148269, rate: 0.10 },
      { min: 148269, max: 177922, rate: 0.12 },
      { min: 177922, max: 237230, rate: 0.13 },
      { min: 237230, max: 355845, rate: 0.14 },
      { min: 355845, max: null, rate: 0.15 }
    ]
  },
  BC: {
    name: 'British Columbia',
    brackets: [
      { min: 0, max: 47937, rate: 0.0506 },
      { min: 47937, max: 95875, rate: 0.077 },
      { min: 95875, max: 110076, rate: 0.105 },
      { min: 110076, max: 133664, rate: 0.1229 },
      { min: 133664, max: 181232, rate: 0.147 },
      { min: 181232, max: 252752, rate: 0.168 },
      { min: 252752, max: null, rate: 0.205 }
    ]
  },
  MB: {
    name: 'Manitoba',
    brackets: [
      { min: 0, max: 47000, rate: 0.108 },
      { min: 47000, max: 100000, rate: 0.1275 },
      { min: 100000, max: null, rate: 0.174 }
    ]
  },
  NB: {
    name: 'New Brunswick',
    brackets: [
      { min: 0, max: 49958, rate: 0.094 },
      { min: 49958, max: 99916, rate: 0.14 },
      { min: 99916, max: 185064, rate: 0.16 },
      { min: 185064, max: null, rate: 0.195 }
    ]
  },
  NL: {
    name: 'Newfoundland and Labrador',
    brackets: [
      { min: 0, max: 43198, rate: 0.087 },
      { min: 43198, max: 86395, rate: 0.145 },
      { min: 86395, max: 154244, rate: 0.158 },
      { min: 154244, max: 215943, rate: 0.178 },
      { min: 215943, max: 275870, rate: 0.198 },
      { min: 275870, max: 551739, rate: 0.208 },
      { min: 551739, max: 1103478, rate: 0.213 },
      { min: 1103478, max: null, rate: 0.218 }
    ]
  },
  NT: {
    name: 'Northwest Territories',
    brackets: [
      { min: 0, max: 50597, rate: 0.059 },
      { min: 50597, max: 101198, rate: 0.086 },
      { min: 101198, max: 164525, rate: 0.122 },
      { min: 164525, max: null, rate: 0.1405 }
    ]
  },
  NS: {
    name: 'Nova Scotia',
    brackets: [
      { min: 0, max: 29590, rate: 0.0879 },
      { min: 29590, max: 59180, rate: 0.1495 },
      { min: 59180, max: 93000, rate: 0.1667 },
      { min: 93000, max: 150000, rate: 0.175 },
      { min: 150000, max: null, rate: 0.21 }
    ]
  },
  NU: {
    name: 'Nunavut',
    brackets: [
      { min: 0, max: 53268, rate: 0.04 },
      { min: 53268, max: 106537, rate: 0.07 },
      { min: 106537, max: 173205, rate: 0.09 },
      { min: 173205, max: null, rate: 0.115 }
    ]
  },
  ON: {
    name: 'Ontario',
    brackets: [
      { min: 0, max: 51446, rate: 0.0505 },
      { min: 51446, max: 102894, rate: 0.0915 },
      { min: 102894, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: null, rate: 0.1316 }
    ]
  },
  PE: {
    name: 'Prince Edward Island',
    brackets: [
      { min: 0, max: 32656, rate: 0.0965 },
      { min: 32656, max: 64313, rate: 0.1363 },
      { min: 64313, max: 105000, rate: 0.1665 },
      { min: 105000, max: 140000, rate: 0.18 },
      { min: 140000, max: null, rate: 0.1875 }
    ]
  },
  QC: {
    name: 'Quebec',
    brackets: [
      { min: 0, max: 51780, rate: 0.14 },
      { min: 51780, max: 103545, rate: 0.19 },
      { min: 103545, max: 126000, rate: 0.24 },
      { min: 126000, max: null, rate: 0.2575 }
    ]
  },
  SK: {
    name: 'Saskatchewan',
    brackets: [
      { min: 0, max: 52057, rate: 0.105 },
      { min: 52057, max: 148734, rate: 0.125 },
      { min: 148734, max: null, rate: 0.145 }
    ]
  },
  YT: {
    name: 'Yukon',
    brackets: [
      { min: 0, max: 55867, rate: 0.064 },
      { min: 55867, max: 111733, rate: 0.09 },
      { min: 111733, max: 173205, rate: 0.109 },
      { min: 173205, max: 500000, rate: 0.128 },
      { min: 500000, max: null, rate: 0.15 }
    ]
  }
};

// Current LCGE exemption limit (2025, in CAD)
const LCGE_EXEMPTION = 1250000; // $1.25M CAD
const INCLUSION_RATE = 0.50; // 50%

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

/**
 * Calculate Lifetime Capital Gains Exemption (LCGE) tax implications
 * 
 * LCGE provides an exemption of up to $1.25M CAD in capital gains.
 * Remaining gains are subject to 50% inclusion rate and progressive tax rates.
 * 
 * @param exitValue - Total exit value received
 * @param costBasis - Original cost basis of the investment
 * @param provinceCode - Provincial/territorial code for tax calculation
 * @param currency - Currency for inputs and outputs ('USD' or 'CAD')
 * @returns LCGECalculation object with detailed breakdown
 */
export function calculateLCGE(
  exitValue: number,
  costBasis: number,
  provinceCode: string = 'ON',
  currency: 'USD' | 'CAD' = 'CAD'
): LCGECalculation {
  const province = PROVINCES[provinceCode];
  if (!province) {
    throw new Error(`Invalid province code: ${provinceCode}`);
  }

  // Convert inputs to CAD for calculation (if needed)
  const exitValueCad = currency === 'USD' ? usdToCad(exitValue) : exitValue;
  const costBasisCad = currency === 'USD' ? usdToCad(costBasis) : costBasis;

  const gain = exitValueCad - costBasisCad;
  
  if (gain <= 0) {
    const convertAmount = (amount: number) => currency === 'USD' ? cadToUsd(amount) : amount;
    return {
      gain: 0,
      exemptAmount: 0,
      taxableAmount: 0,
      federalTax: 0,
      provincialTax: 0,
      totalTax: 0,
      afterTaxAmount: convertAmount(exitValueCad),
      effectiveRate: 0,
      currency
    };
  }

  // Apply LCGE exemption (first $1.25M CAD is completely exempt)
  const exemptAmount = Math.min(gain, LCGE_EXEMPTION);
  const remainingGain = gain - exemptAmount;
  
  // Apply inclusion rate to remaining gain (50% is taxable income)
  const taxableAmount = remainingGain * INCLUSION_RATE;
  
  // Calculate federal and provincial taxes on taxable amount (in CAD)
  const federalTax = calculateProgressiveTax(taxableAmount, FEDERAL_TAX_BRACKETS);
  const provincialTax = calculateProgressiveTax(taxableAmount, province.brackets);
  
  const totalTax = federalTax + provincialTax;
  const afterTaxAmount = exitValueCad - totalTax;
  const effectiveRate = gain > 0 ? totalTax / gain : 0;

  // Convert results to requested currency
  const convertAmount = (amount: number) => currency === 'USD' ? cadToUsd(amount) : amount;

  return {
    gain: convertAmount(gain),
    exemptAmount: convertAmount(exemptAmount),
    taxableAmount: convertAmount(taxableAmount),
    federalTax: convertAmount(federalTax),
    provincialTax: convertAmount(provincialTax),
    totalTax: convertAmount(totalTax),
    afterTaxAmount: convertAmount(afterTaxAmount),
    effectiveRate,
    currency
  };
} 