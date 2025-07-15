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

export function Hero() {
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(100)
  const [exitValue, setExitValue] = useState<string>('10000000')

  const [selectedProvince, setSelectedProvince] = useState<string>('ON')
  const [selectedState, setSelectedState] = useState<string>('CA')
  const [currency, setCurrency] = useState<'USD' | 'CAD'>('CAD')
  const [previousCurrency, setPreviousCurrency] = useState<'USD' | 'CAD'>('CAD')

  const stateTextRef = useRef<HTMLSpanElement>(null)
  const provinceTextRef = useRef<HTMLSpanElement>(null)
  const [stateTextWidth, setStateTextWidth] = useState<number>(100) // fallback width
  const [provinceTextWidth, setProvinceTextWidth] = useState<number>(100) // fallback width

  // Exchange rate
  const USD_TO_CAD_RATE = 1.37;

  // Helper function to safely parse numbers
  const parseNumber = (value: string): number => {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
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
                  The conventional wisdom has always been: "If you want to swing big, go to America—you'll be rewarded." This belief has driven Canada's most ambitious entrepreneurs to leave in droves, chasing the American dream. But here's the twist: the economics of a big swing have long favored staying in Canada. Thanks to the way our capital gains taxes are constructed, mathematically speaking, there are many scenarios where Canadian founders walk away with more after a huge exit than their American peers. We built a calculator to show you exactly how. The results might surprise you.
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
                <h2 className="text-2xl font-semibold mb-6 font-soehne" style={{ color: '#28253B' }}>Calculate your take-home</h2>
            
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
                        step="1"
                        value={Math.round(ownershipPercentage)}
                        onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
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
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4 font-soehne" style={{ color: '#28253B' }}>
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
                  <div className="space-y-2 text-sm font-mono" style={{ color: '#28253B' }}>
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
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4 font-soehne" style={{ color: '#28253B' }}>
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
                <div className="space-y-2 text-sm font-mono" style={{ color: '#28253B' }}>
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
                      <Tooltip content="In Canada, only 50% of capital gains are included in taxable income. This is known as the 'inclusion rate' - meaning if you have $100 in capital gains, only $50 is added to your taxable income and subject to your marginal tax rate.">
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
            </div>
          </div>

          {/* Comparison - Full width card */}
          <motion.div 
            className="relative p-6 w-full overflow-hidden"
            style={{ 
              backgroundColor: qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? '#EBF4FF' : '#FEF2F2',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Animated border */}
            <motion.div
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
        </motion.div>
      </div>
    </section>
  )
} 