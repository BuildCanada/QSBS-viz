import { motion } from 'framer-motion'
import { WaveCard } from "@/components/WaveCard"
import { SlotMachineNumber } from "@/components/SlotMachineNumber"
import { CurrencyNumber } from "@/components/CurrencyNumber"
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { calculateQSBS, US_STATES } from '@/lib/qsbs'
import { calculateLCGE, PROVINCES } from '@/lib/lcge'
import { HelpCircle } from 'lucide-react'
import { Tooltip } from "@/components/ui/tooltip"
import { NumericFormat } from 'react-number-format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Helper function to safely get from localStorage
const getFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper function to safely set to localStorage
const setToLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

export function Hero() {
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(() => 
    getFromLocalStorage('qsbs-ownership-percentage', 25)
  )
  const [exitValue, setExitValue] = useState<string>(() => 
    getFromLocalStorage('qsbs-exit-value', '100000000')
  )

  const [selectedProvince, setSelectedProvince] = useState<string>(() => 
    getFromLocalStorage('qsbs-selected-province', 'ON')
  )
  const [selectedState, setSelectedState] = useState<string>(() => 
    getFromLocalStorage('qsbs-selected-state', 'CA')
  )
  const [currency, setCurrency] = useState<'USD' | 'CAD'>(() => 
    getFromLocalStorage('qsbs-currency', 'USD')
  )
  const [previousCurrency, setPreviousCurrency] = useState<'USD' | 'CAD'>(() => 
    getFromLocalStorage('qsbs-currency', 'USD')
  )

  const stateTextRef = useRef<HTMLSpanElement>(null)
  const provinceTextRef = useRef<HTMLSpanElement>(null)
  const [stateTextWidth, setStateTextWidth] = useState<number>(100) // fallback width
  const [provinceTextWidth, setProvinceTextWidth] = useState<number>(100) // fallback width

  // Exchange rate
  const USD_TO_CAD_RATE = 1.37;

  // Save state to localStorage whenever values change
  useEffect(() => {
    setToLocalStorage('qsbs-ownership-percentage', ownershipPercentage);
  }, [ownershipPercentage]);

  useEffect(() => {
    setToLocalStorage('qsbs-exit-value', exitValue);
  }, [exitValue]);

  useEffect(() => {
    setToLocalStorage('qsbs-selected-province', selectedProvince);
  }, [selectedProvince]);

  useEffect(() => {
    setToLocalStorage('qsbs-selected-state', selectedState);
  }, [selectedState]);

  useEffect(() => {
    setToLocalStorage('qsbs-currency', currency);
  }, [currency]);

  // Helper function to safely parse numbers
  const parseNumber = (value: string): number => {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }

  // Example company data
  const exampleCompanies = [
    { name: 'Small Business Acquisition', ownership: 50, exitValue: 4000000 },
    { name: 'Post-Series-A Exit', ownership: 40, exitValue: 100000000 },
    { name: 'LP in fund that scores $300M return', ownership: 2, exitValue: 300000000, tooltip: 'LP (Limited Partner) - An investor in a venture capital fund. A typical moderate VC fund manages ~$75M with around 50 LPs contributing capital.' },
    { name: 'Shopify', ownership: 10.3, exitValue: 2100000000, logo: '/exit-tax-calculator/Shopify_logo_2018.svg.png' },
    { name: 'Airbnb', ownership: 11.4, exitValue: 86500000000, logo: '/exit-tax-calculator/Airbnb_Logo.svg.png' }
  ]

  const handleExampleClick = (company: typeof exampleCompanies[0] & { tooltip?: string; logo?: string }) => {
    setOwnershipPercentage(company.ownership)
    setExitValue(company.exitValue.toString())
    // Set currency to USD since these are USD values
    if (currency !== 'USD') {
      setCurrency('USD')
    }
  }

  const handlePercentageChange = (value: number) => {
    // Cap at 100%
    const cappedValue = Math.min(Math.max(value, 0), 100);
    setOwnershipPercentage(cappedValue);
  }

  // Convert values when currency changes
  useEffect(() => {
    if (currency !== previousCurrency) {
      const currentExitValue = parseNumber(exitValue);
      
      if (currency === 'USD' && previousCurrency === 'CAD') {
        // Converting from CAD to USD
        setExitValue(currentExitValue > 0 ? Math.round(currentExitValue / USD_TO_CAD_RATE).toString() : '0')
      } else if (currency === 'CAD' && previousCurrency === 'USD') {
        // Converting from USD to CAD
        setExitValue(currentExitValue > 0 ? Math.round(currentExitValue * USD_TO_CAD_RATE).toString() : '0')
      }
      setPreviousCurrency(currency)
    }
  }, [currency, previousCurrency, exitValue])

  // Measure text widths for accurate underlines
  useLayoutEffect(() => {
    if (stateTextRef.current) {
      const width = stateTextRef.current.offsetWidth
      setStateTextWidth(width > 0 ? width : US_STATES[selectedState].name.length * 12) // fallback calc
    } else {
      setStateTextWidth(US_STATES[selectedState].name.length * 12) // fallback calc
    }
    
    if (provinceTextRef.current) {
      const width = provinceTextRef.current.offsetWidth
      setProvinceTextWidth(width > 0 ? width : PROVINCES[selectedProvince].name.length * 12) // fallback calc
    } else {
      setProvinceTextWidth(PROVINCES[selectedProvince].name.length * 12) // fallback calc
    }
  }, [selectedState, selectedProvince])

  // Additional effect to re-measure after render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stateTextRef.current) {
        const width = stateTextRef.current.offsetWidth
        if (width > 0) setStateTextWidth(width)
      }
      if (provinceTextRef.current) {
        const width = provinceTextRef.current.offsetWidth
        if (width > 0) setProvinceTextWidth(width)
      }
    }, 0)
    
    return () => clearTimeout(timer)
  }, [selectedState, selectedProvince])

  // Calculate personal exit value
  const personalExitValue = parseNumber(exitValue) * (ownershipPercentage / 100)
  const personalCostBasis = 0

  // Calculate QSBS and LCGE using utility functions
  const qsbsResults = calculateQSBS({ 
    ownershipPercentage: ownershipPercentage, 
    exitValue: parseNumber(exitValue), 
    costBasis: 0, 
    currency 
  }, selectedState)
  const lcgeResults = calculateLCGE(personalExitValue, personalCostBasis, selectedProvince, currency)

  return (
    <section className="relative overflow-hidden">
      <div className="w-full">
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Desktop: Two column grid, Mobile: Single column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Left Column - Input Section */}
            <div className="space-y-3 w-full md:h-full md:flex md:flex-col">
              {/* Title Card */}
              <WaveCard 
                className="p-6 w-full"
                style={{ 
                  backgroundColor: 'rgba(245, 244, 252, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h1 className="text-3xl md:text-4xl font-semibold font-soehne mb-2" style={{ color: '#28253B' }}>
                  The Economics of Ambition
                </h1>
                <p className="text-lg md:text-xl font-soehne text-gray-700 mb-4">
                  How startup exits are taxed in Canada and the USA
                </p>
                <p className="text-base font-financier text-gray-800 leading-tight">
                  The conventional wisdom has always been: "If you want to swing big, go to America—you'll be rewarded." This belief has driven Canada's most ambitious entrepreneurs to leave in droves, chasing the American dream. 
                  <br />
                  <br />
                  But is this true? We built a calculator to show you exactly how different exit scenarios impact founders. The results might surprise you.
                </p>
              </WaveCard>

              {/* Input Card */}
              <WaveCard 
                className="p-6 w-full md:flex md:flex-col md:flex-1 overflow-visible"
                style={{ 
                  backgroundColor: 'rgba(245, 244, 252, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h2 className="text-2xl font-semibold mb-4 font-soehne" style={{ color: '#28253B' }}>Calculate your take-home</h2>
                <hr className="border-gray-300 mb-6" />
            
                <div className="space-y-4 md:flex-1 overflow-visible">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-mono">
                      Currency
                    </label>
                      <div className="relative flex bg-gray-200 p-1 w-full border border-gray-400">
                      <motion.div
                          className="absolute top-1 bottom-1 left-1 shadow-sm"
                          style={{ 
                            width: 'calc(50% - 4px)',
                            backgroundColor: '#28253B'
                          }}
                        initial={false}
                        animate={{
                          x: currency === 'CAD' ? 0 : '100%',
                        }}
                        transition={{
                          type: "tween",
                          ease: "easeInOut",
                          duration: 0.25
                        }}
                      />
                      <button
                        onClick={() => setCurrency('CAD')}
                        className={`relative z-10 flex items-center justify-center space-x-2 w-1/2 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-0 active:outline-none ${
                          currency === 'CAD'
                              ? 'text-white'
                              : 'text-gray-700'
                        }`}
                        style={{ 
                          WebkitTapHighlightColor: 'transparent',
                          outline: 'none',
                            border: 'none',
                            color: currency === 'CAD' ? 'white' : '#28253B'
                        }}
                      >
                        <span className="text-base">🇨🇦</span>
                        <span className="font-mono">CAD</span>
                      </button>
                      <button
                        onClick={() => setCurrency('USD')}
                        className={`relative z-10 flex items-center justify-center space-x-2 w-1/2 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-0 active:outline-none ${
                          currency === 'USD'
                              ? 'text-white'
                              : 'text-gray-700'
                        }`}
                        style={{ 
                          WebkitTapHighlightColor: 'transparent',
                          outline: 'none',
                            border: 'none',
                            color: currency === 'USD' ? 'white' : '#28253B'
                        }}
                      >
                        <span className="text-base">🇺🇸</span>
                        <span className="font-mono">USD</span>
                      </button>
                    </div>
                  </div>

                  <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700 font-mono">
                          Ownership Percentage
                    </label>
                        <SlotMachineNumber 
                          value={ownershipPercentage} 
                          className="text-sm font-semibold text-gray-800"
                          onValueChange={handlePercentageChange}
                        />
                      </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={ownershipPercentage}
                        onChange={(e) => handlePercentageChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #28253B 0%, #28253B ${ownershipPercentage}%, #C8B2DB ${ownershipPercentage}%, #C8B2DB 100%)`,
                          borderRadius: '4px'
                        }}
                    />
                  </div>

                  <div className="overflow-visible">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700 font-mono">
                        Total Exit Value ({currency})
                      </label>
                      <Tooltip content="The total value of your company at exit before any taxes or deductions. This represents the full valuation of your business when it's sold or goes public.">
                        <HelpCircle 
                          className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-help transition-colors" 
                        />
                      </Tooltip>
                    </div>
                    <NumericFormat
                      value={exitValue}
                      onValueChange={(values) => setExitValue(values.value)}
                      thousandSeparator={true}
                      allowNegative={false}
                      decimalScale={2}
                      className="w-full px-3 py-2 font-mono selection:bg-blue-500 selection:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                      style={{ 
                        backgroundColor: 'rgba(245, 244, 252, 0.8)',
                        border: '1px solid #28253B',
                        color: '#28253B'
                      }}
                    />
                  </div>

                  {/* Example exits section */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 font-mono mb-3">
                      Example Exits
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {exampleCompanies.map((company) => {
                        const button = (
                          <button
                            key={company.name}
                            onClick={() => handleExampleClick(company)}
                            className="p-4 bg-white/50 hover:bg-white/80 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm group flex items-center justify-center text-center h-20 md:h-auto md:min-h-[80px]"
                            style={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.6)',
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            {company.logo ? (
                              <img 
                                src={company.logo} 
                                alt={`${company.name} logo`}
                                className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                                {company.name}
                              </span>
                            )}
                          </button>
                        );
                        
                        return company.tooltip ? (
                          <Tooltip 
                            key={company.name} 
                            content={company.tooltip}
                            position={company.name === 'LP in fund that scores $300M return' ? 'bottom' : 'right'}
                          >
                            {button}
                          </Tooltip>
                        ) : button;
                      })}
                    </div>
                  </div>
                </div>
              </WaveCard>
            </div>

            {/* Right Column - Results Section */}
            <div className="space-y-3 w-full md:h-full flex flex-col">
              {/* QSBS Results */}
              <motion.div 
                className="relative p-6 w-full overflow-hidden flex-1"
                style={{ 
                  backgroundColor: '#EBF4FF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 opacity-75"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #3B82F6, #06B6D4, #3B82F6, transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '200% 0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                {/* Border mask */}
                <div 
                  className="absolute inset-[2px]"
                  style={{ 
                    backgroundColor: '#EBF4FF',
                  }}
                />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <h3 className="text-xl font-semibold font-soehne" style={{ color: '#28253B' }}>
                    🇺🇸 Your take-home in{' '}
                    <span className="relative inline-block">
                      <Select value={selectedState} onValueChange={(value) => setSelectedState(value)}>
                        <SelectTrigger 
                          className="h-auto w-auto p-0 border-none bg-transparent font-soehne text-xl font-semibold shadow-none focus:ring-0"
                          style={{ 
                            color: '#28253B',
                            minWidth: 'fit-content'
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          {Object.entries(US_STATES).map(([code, state]) => (
                            <SelectItem key={code} value={code} className="text-gray-800 focus:bg-gray-100 focus:text-gray-900">
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Hidden text for width measurement */}
                      <span 
                        ref={stateTextRef}
                        className="absolute opacity-0 pointer-events-none font-soehne text-xl font-semibold"
                        aria-hidden="true"
                      >
                        {US_STATES[selectedState].name}
                      </span>
                      <span 
                        className="absolute bottom-0 left-0 h-0.5"
                        style={{ width: `${stateTextWidth + 15}px`, backgroundColor: '#3B82F6' }}
                      ></span>
                    </span>
                  </h3>
                  <div className="space-y-2 text-sm font-mono pt-8" style={{ color: '#28253B' }}>
                    <div className="flex justify-between">
                      <span>Your Exit Value:</span>
                      <CurrencyNumber value={qsbsResults.personalExitValue} currency={currency} className="font-bold text-gray-800" />
                    </div>
                    <div className="flex justify-between">
                      <span>Capital Gains:</span>
                      <CurrencyNumber value={qsbsResults.capitalGains} currency={currency} className="text-gray-800" />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span>QSBS Exempt:</span>
                        <Tooltip content="Qualified Small Business Stock (QSBS) exemption allows you to exclude up to $15 million USD or 10x your cost basis from federal taxes when selling qualifying small business stock held for at least 5 years.">
                          <HelpCircle className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-help transition-colors" />
                        </Tooltip>
                      </div>
                      <CurrencyNumber value={qsbsResults.exemptGains} currency={currency} className="text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Gains:</span>
                      <CurrencyNumber value={qsbsResults.taxableGains} currency={currency} className="text-gray-800" />
                    </div>
                    <div className="flex justify-between">
                      <span>Federal Tax:</span>
                      <CurrencyNumber value={qsbsResults.federalTax} currency={currency} className="text-red-600" isNegative={true} />
                    </div>
                    <div className="flex justify-between">
                      <span>{US_STATES[selectedState].name} Tax:</span>
                      <CurrencyNumber value={qsbsResults.stateTax} currency={currency} className="text-red-600" isNegative={true} />
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tax:</span>
                      <CurrencyNumber value={qsbsResults.totalTax} currency={currency} className="text-red-600" isNegative={true} />
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>After-Tax Proceeds:</span>
                      <CurrencyNumber value={qsbsResults.afterTaxProceeds} currency={currency} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* LCGE Results */}
              <motion.div 
                className="relative p-6 w-full overflow-hidden flex-1"
                style={{ 
                  backgroundColor: '#FEF2F2',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 opacity-75"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #DC2626, #EF4444, #DC2626, transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '200% 0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                {/* Border mask */}
                <div 
                  className="absolute inset-[2px]"
                  style={{ 
                    backgroundColor: '#FEF2F2',
                  }}
                />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <h3 className="text-xl font-semibold font-soehne" style={{ color: '#28253B' }}>
                  🇨🇦 Your take-home in{' '}
                  <span className="relative inline-block">
                    <Select value={selectedProvince} onValueChange={(value) => setSelectedProvince(value)}>
                      <SelectTrigger 
                        className="h-auto w-auto p-0 border-none bg-transparent font-soehne text-xl font-semibold shadow-none focus:ring-0"
                        style={{ 
                          color: '#28253B',
                          minWidth: 'fit-content'
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        {Object.entries(PROVINCES).map(([code, province]) => (
                          <SelectItem key={code} value={code} className="text-gray-800 focus:bg-gray-100 focus:text-gray-900">
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Hidden text for width measurement */}
                    <span 
                      ref={provinceTextRef}
                      className="absolute opacity-0 pointer-events-none font-soehne text-xl font-semibold"
                      aria-hidden="true"
                    >
                      {PROVINCES[selectedProvince].name}
                    </span>
                    <span 
                      className="absolute bottom-0 left-0 h-0.5"
                      style={{ width: `${provinceTextWidth + 15}px`, backgroundColor: '#DC2626' }}
                    ></span>
                  </span>
                </h3>
                <div className="space-y-2 text-sm font-mono pt-8" style={{ color: '#28253B' }}>
                  <div className="flex justify-between">
                    <span>Your Exit Value:</span>
                    <CurrencyNumber value={personalExitValue} currency={currency} className="font-bold text-gray-800" />
                  </div>
                  <div className="flex justify-between">
                    <span>Capital Gains:</span>
                    <CurrencyNumber value={lcgeResults.gain} currency={currency} className="text-gray-800" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span>LCGE Exempt:</span>
                      <Tooltip content="Lifetime Capital Gains Exemption (LCGE) allows Canadian residents to exclude up to $1.25 million CAD in capital gains from the sale of qualifying small business corporation shares from taxation over their lifetime.">
                        <HelpCircle className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-help transition-colors" />
                      </Tooltip>
                    </div>
                    <CurrencyNumber value={lcgeResults.exemptAmount} currency={currency} className="text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span>Taxable Gains (50%):</span>
                      <Tooltip 
                        content="In Canada, only 50% of capital gains are included in taxable income. This is known as the 'inclusion rate' - meaning if you have $100 in capital gains, only $50 is added to your taxable income and subject to your marginal tax rate."
                        position="right"
                      >
                        <HelpCircle className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-help transition-colors" />
                      </Tooltip>
                    </div>
                    <CurrencyNumber value={lcgeResults.taxableAmount} currency={currency} className="text-gray-800" />
                  </div>
                  <div className="flex justify-between">
                    <span>Federal Tax:</span>
                    <CurrencyNumber value={lcgeResults.federalTax} currency={currency} className="text-red-600" isNegative={true} />
                  </div>
                  <div className="flex justify-between">
                    <span>{PROVINCES[selectedProvince].name} Tax:</span>
                    <CurrencyNumber value={lcgeResults.provincialTax} currency={currency} className="text-red-600" isNegative={true} />
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tax:</span>
                    <CurrencyNumber value={lcgeResults.totalTax} currency={currency} className="text-red-600" isNegative={true} />
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>After-Tax Proceeds:</span>
                    <CurrencyNumber value={lcgeResults.afterTaxAmount} currency={currency} className="text-green-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Comparison Card */}
            <motion.div 
              className="relative p-6 w-full overflow-hidden"
              style={{ 
                backgroundColor: qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? '#EBF4FF' : '#FEF2F2',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
              }}
              key="comparison-card"
            >
              {/* Animated border */}
              <motion.div
                key="comparison-border"
                className="absolute inset-0 opacity-75"
                style={{
                  background: qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? 
                    'linear-gradient(90deg, transparent, #3B82F6, #06B6D4, #3B82F6, transparent)' :
                    'linear-gradient(90deg, transparent, #DC2626, #EF4444, #DC2626, transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              {/* Border mask */}
              <div 
                className="absolute inset-[2px]"
                style={{ 
                  backgroundColor: qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? '#EBF4FF' : '#FEF2F2',
                }}
              />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold font-soehne" style={{ color: '#28253B' }}>
                  You would take home{' '}
                  <span 
                    className={qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? 'text-blue-600' : 'text-red-600'}
                    style={{ color: qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? '#2563eb' : '#dc2626' }}
                  >
                    <CurrencyNumber 
                      value={Math.abs(qsbsResults.afterTaxProceeds - lcgeResults.afterTaxAmount)} 
                      currency={currency} 
                      className="font-semibold"
                      currencyAfter={true}
                      fontFamily="soehne"
                    />
                  </span>
                  {' '}more in{' '}
                  <span 
                    className={qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? 'text-blue-600' : 'text-red-600'}
                    style={{ color: qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? '#2563eb' : '#dc2626' }}
                  >
                    {qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? 
                      `${US_STATES[selectedState].name}, USA` : 
                      `${PROVINCES[selectedProvince].name}, Canada`
                    }
                  </span>
                </h3>
              </div>
            </motion.div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Analysis Card - 3 columns */}
            <div className="col-span-1 md:col-span-3">
              <WaveCard 
                className="p-6 w-full h-full"
                style={{ 
                  backgroundColor: 'rgba(245, 244, 252, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h2 className="text-3xl md:text-4xl font-semibold font-soehne mb-2" style={{ color: '#28253B' }}>
                  So what does this mean? 
                </h2>
                <p className="text-lg md:text-xl font-soehne text-gray-700 mb-4">
                  Big exit events are taxed favourably in Canada, but unfortunately there are never any big exits to tax.
                </p>
                <p className="text-base font-financier text-gray-800 leading-tight">
                Today, the tax gap between Canada and the United States creates a massive incentive to relocate to the US. For exits less than $75M, the US offers a dramatically better outcome for founders and investors. For exits greater than $75M, the US offers a better outcome for investors. Furthermore, QSBS applies PER business, while LCGE only applies once for an individual, further discouraging entrepreneurs who know how to do it from doing it again, and also discouraging investors from investing in multiple businesses. It's no surprise then that we're seeing US investors ask Canadian startups to reincorporate south of the border — losing talent, capital, and future tax revenues. Founders who are ambitious and want to swing big suddenly find that the investors needed to back them do not exist north of the border.
                <br />
                <br />
                But there's reason for optimism. At the very top end of the market (multi-billion-dollar exits) Canada is already reasonably competitive for founders. This suggests we don't need to start from scratch. If we can extend the same benefits that already exist for large-scale capital gains to earlier-stage companies and participants, we can close the gap quickly. Right now what Canada has done is built the top floors of a skyscraper, but has forgotten to build the 50 floors below.
                <br />
                <br />
                Doing so would reward those who take the earliest and hardest risks, and send a clear signal: Canada is serious about innovation and supporting builders. This would totally transform what it means to start and grow a company. It would create an ecosystem of small and medium businesses, and create the right environment for investments into billion or even trillion dollar companies to emerge.
                <br />
                <br />
                If we want to support the builders who make our country prosperous and grow the next generation of global winners at home, we need an approach that makes it worthwhile to stay in the country.
                </p>
              </WaveCard>
            </div>
            
            {/* Quadrant Card - 1 column */}
            <div className="col-span-1 md:col-span-1 space-y-3">
              {/* Title Card */}
              <WaveCard 
                className="p-3 w-full"
                style={{ 
                  backgroundColor: 'rgba(245, 244, 252, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  borderRadius: '0'
                }}
              >
                <h3 className="text-lg font-semibold font-soehne text-center" style={{ color: '#28253B' }}>
                  Who Has Advantage?
                </h3>
              </WaveCard>
              
              {/* Square Quadrant */}
              <div className="aspect-square w-full">
                <WaveCard 
                  className="p-0 w-full h-full"
                  style={{ 
                    backgroundColor: 'rgba(245, 244, 252, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                    borderRadius: '0'
                  }}
                >
                  <div className="grid grid-cols-2 gap-0 h-full">
                    {/* Top Left - Investors in small exit */}
                    <div 
                      className="p-3 text-center flex flex-col justify-center aspect-square border-r border-b border-gray-300"
                      style={{ backgroundColor: 'rgba(245, 244, 252, 0.8)' }}
                    >
                      <div className="text-xs font-medium font-soehne mb-1" style={{ color: '#28253B' }}>
                        Investors in
                      </div>
                      <div className="text-xs font-medium font-soehne mb-2" style={{ color: '#28253B' }}>
                        Small exit (&lt;$75M)
                      </div>
                      <div className="text-xs text-gray-600">
                        Neutral
                      </div>
                    </div>
                    
                    {/* Top Right - Founders in small exit */}
                    <div 
                      className="p-3 text-center flex flex-col justify-center aspect-square border-b border-gray-300"
                      style={{ backgroundColor: '#EBF4FF' }}
                    >
                      <div className="text-xs font-medium font-soehne mb-1" style={{ color: '#28253B' }}>
                        Founders in
                      </div>
                      <div className="text-xs font-medium font-soehne mb-2" style={{ color: '#28253B' }}>
                        Small exit (&lt;$75M)
                      </div>
                      <div className="text-xs text-blue-600">
                        🇺🇸 favoured
                      </div>
                    </div>
                    
                    {/* Bottom Left - Investors in large exit */}
                    <div 
                      className="p-3 text-center flex flex-col justify-center aspect-square border-r border-gray-300"
                      style={{ backgroundColor: '#EBF4FF' }}
                    >
                      <div className="text-xs font-medium font-soehne mb-1" style={{ color: '#28253B' }}>
                        Investors in
                      </div>
                      <div className="text-xs font-medium font-soehne mb-2" style={{ color: '#28253B' }}>
                        Large exit (&gt;$75M)
                      </div>
                      <div className="text-xs text-blue-600">
                        🇺🇸 favoured
                      </div>
                    </div>
                    
                    {/* Bottom Right - Founders in large exit */}
                    <Tooltip 
                      content="These large exits typically don't happen in Canada, because investors often ask the founders to move to the US first."
                      position="left"
                    >
                      <div 
                        className="p-3 text-center flex flex-col justify-center aspect-square cursor-help"
                        style={{ backgroundColor: '#FEF2F2' }}
                      >
                        <div className="text-xs font-medium font-soehne mb-1" style={{ color: '#28253B' }}>
                          Founders in
                        </div>  
                        <div className="text-xs font-medium font-soehne mb-2" style={{ color: '#28253B' }}>
                          Large exit (&gt;$75M)
                        </div>
                        <div className="text-xs text-red-600">
                          🇨🇦 favoured
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </WaveCard>
              </div>

              {/* Built by Card */}
              <WaveCard 
                className="p-3 w-full"
                style={{ 
                  backgroundColor: 'rgba(245, 244, 252, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  borderRadius: '0'
                }}
              >
                <p className="text-sm font-mono text-left" style={{ color: '#28253B' }}>
                  Built by{' '}
                  <a 
                    href="https://jesselee.ca" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:no-underline transition-all duration-200"
                    style={{ color: '#28253B' }}
                  >
                    Jesse Lee
                  </a>
                </p>
              </WaveCard>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 