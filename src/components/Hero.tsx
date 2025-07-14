import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { calculateQSBS, US_STATES } from '@/lib/qsbs'
import { calculateLCGE, PROVINCES } from '@/lib/lcge'

export function Hero() {
  const [ownershipPercentage, setOwnershipPercentage] = useState<string>('100')
  const [exitValue, setExitValue] = useState<string>('10000000')
  const [costBasis, setCostBasis] = useState<string>('100000')
  const [selectedProvince, setSelectedProvince] = useState<string>('ON')
  const [selectedState, setSelectedState] = useState<string>('CA')
  const [currency, setCurrency] = useState<'USD' | 'CAD'>('CAD')
  const [previousCurrency, setPreviousCurrency] = useState<'USD' | 'CAD'>('CAD')

  // Exchange rate
  const USD_TO_CAD_RATE = 1.37;

  // Helper function to safely parse numbers
  const parseNumber = (value: string): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  // Input validation for numeric fields
  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        (e.keyCode === 65 && e.ctrlKey) ||
        (e.keyCode === 67 && e.ctrlKey) ||
        (e.keyCode === 86 && e.ctrlKey) ||
        (e.keyCode === 88 && e.ctrlKey) ||
        (e.keyCode === 90 && e.ctrlKey) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  const handleNumericInput = (value: string, setter: (value: string) => void) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      const cleanValue = parts[0] + '.' + parts.slice(1).join('');
      setter(cleanValue);
    } else {
      setter(numericValue);
    }
  }

  const handlePercentageInput = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    let cleanValue = '';
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    } else {
      cleanValue = numericValue;
    }
    
    // Cap at 100%
    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue) && numValue > 100) {
      setOwnershipPercentage('100');
    } else {
      setOwnershipPercentage(cleanValue);
    }
  }

  // Convert values when currency changes
  useEffect(() => {
    if (currency !== previousCurrency) {
      const currentExitValue = parseNumber(exitValue);
      const currentCostBasis = parseNumber(costBasis);
      
      if (currency === 'USD' && previousCurrency === 'CAD') {
        // Converting from CAD to USD
        setExitValue(currentExitValue > 0 ? Math.round(currentExitValue / USD_TO_CAD_RATE).toString() : '0')
        setCostBasis(currentCostBasis > 0 ? Math.round(currentCostBasis / USD_TO_CAD_RATE).toString() : '0')
      } else if (currency === 'CAD' && previousCurrency === 'USD') {
        // Converting from USD to CAD
        setExitValue(currentExitValue > 0 ? Math.round(currentExitValue * USD_TO_CAD_RATE).toString() : '0')
        setCostBasis(currentCostBasis > 0 ? Math.round(currentCostBasis * USD_TO_CAD_RATE).toString() : '0')
      }
      setPreviousCurrency(currency)
    }
  }, [currency, previousCurrency, exitValue, costBasis])

  // Calculate personal exit value and cost basis
  const personalExitValue = parseNumber(exitValue) * (parseNumber(ownershipPercentage) / 100)
  const personalCostBasis = parseNumber(costBasis) * (parseNumber(ownershipPercentage) / 100)

  // Calculate QSBS and LCGE using utility functions
  const qsbsResults = calculateQSBS({ 
    ownershipPercentage: parseNumber(ownershipPercentage), 
    exitValue: parseNumber(exitValue), 
    costBasis: parseNumber(costBasis), 
    currency 
  }, selectedState)
  const lcgeResults = calculateLCGE(personalExitValue, personalCostBasis, selectedProvince, currency)

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
    
    // Add currency code prefix for clarity
    return `${currency} $${formatted}`
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden border border-white border-t-0">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-semibold mb-6 text-white font-soehne"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            QSBS vs LCGE Calculator
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-financier"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Compare tax benefits: US Qualified Small Business Stock vs Canadian Lifetime Capital Gains Exemption
          </motion.p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Input Section */}
          <Card className="p-6 border border-white bg-black">
            <h2 className="text-2xl font-semibold mb-6 text-white font-soehne">Input Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-financier">
                  Currency
                </label>
                <div className="relative flex rounded-lg bg-gray-800 p-1 w-full">
                  <motion.div
                    className="absolute top-1 bottom-1 left-1 bg-white rounded-md shadow-sm"
                    style={{ width: 'calc(50% - 4px)' }}
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
                        ? 'text-gray-900'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      outline: 'none',
                      border: 'none'
                    }}
                  >
                    <span className="text-base">🇨🇦</span>
                    <span className="font-mono">CAD</span>
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`relative z-10 flex items-center justify-center space-x-2 w-1/2 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-0 active:outline-none ${
                      currency === 'USD'
                        ? 'text-gray-900'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      outline: 'none',
                      border: 'none'
                    }}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span className="font-mono">USD</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-financier">
                  Ownership Percentage (%)
                </label>
                <input
                  type="number"
                  value={ownershipPercentage}
                  onChange={(e) => handlePercentageInput(e.target.value)}
                  onKeyDown={handleNumericKeyDown}
                  className="w-full px-3 py-2 border border-white rounded-none bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono selection:bg-blue-500 selection:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-financier">
                  Total Exit Value ({currency})
                </label>
                <input
                  type="number"
                  value={exitValue}
                  onChange={(e) => handleNumericInput(e.target.value, setExitValue)}
                  onKeyDown={handleNumericKeyDown}
                  className="w-full px-3 py-2 border border-white rounded-none bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono selection:bg-blue-500 selection:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="1000000000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-financier">
                  Cost Basis ({currency})
                </label>
                <input
                  type="number"
                  value={costBasis}
                  onChange={(e) => handleNumericInput(e.target.value, setCostBasis)}
                  onKeyDown={handleNumericKeyDown}
                  className="w-full px-3 py-2 border border-white rounded-none bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono selection:bg-blue-500 selection:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="1000000000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-financier">
                  US State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-white rounded-none bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono"
                >
                  {Object.entries(US_STATES).map(([code, state]) => (
                    <option key={code} value={code} className="bg-black">
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-financier">
                  Province/Territory (Canada)
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2 border border-white rounded-none bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono"
                >
                  {Object.entries(PROVINCES).map(([code, province]) => (
                    <option key={code} value={code} className="bg-black">
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {/* QSBS Results */}
            <Card className="p-6 border border-white bg-blue-900">
              <h3 className="text-xl font-semibold mb-4 text-blue-200 font-soehne">🇺🇸 QSBS ({US_STATES[selectedState].name})</h3>
              <div className="space-y-2 text-sm text-white font-financier">
                <div className="flex justify-between">
                  <span>Your Exit Value:</span>
                  <span className="font-bold font-mono">{formatCurrency(qsbsResults.personalExitValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Gains:</span>
                  <span className="font-mono">{formatCurrency(qsbsResults.capitalGains)}</span>
                </div>
                <div className="flex justify-between">
                  <span>QSBS Exempt:</span>
                  <span className="text-green-400 font-mono">{formatCurrency(qsbsResults.exemptGains)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Gains:</span>
                  <span className="font-mono">{formatCurrency(qsbsResults.taxableGains)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Tax:</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(qsbsResults.federalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{US_STATES[selectedState].name} Tax:</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(qsbsResults.stateTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(qsbsResults.totalTax)}</span>
                </div>
                <hr className="border-white" />
                <div className="flex justify-between text-lg font-bold">
                  <span>After-Tax Proceeds:</span>
                  <span className="text-green-400 font-mono">{formatCurrency(qsbsResults.afterTaxProceeds)}</span>
                </div>
              </div>
            </Card>

            {/* LCGE Results */}
            <Card className="p-6 border border-white bg-red-900">
              <h3 className="text-xl font-semibold mb-4 text-red-200 font-soehne">🇨🇦 LCGE ({PROVINCES[selectedProvince].name})</h3>
              <div className="space-y-2 text-sm text-white font-financier">
                <div className="flex justify-between">
                  <span>Your Exit Value:</span>
                  <span className="font-bold font-mono">{formatCurrency(personalExitValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Gains:</span>
                  <span className="font-mono">{formatCurrency(lcgeResults.gain)}</span>
                </div>
                <div className="flex justify-between">
                  <span>LCGE Exempt:</span>
                  <span className="text-green-400 font-mono">{formatCurrency(lcgeResults.exemptAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Income (50%):</span>
                  <span className="font-mono">{formatCurrency(lcgeResults.taxableAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Tax:</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(lcgeResults.federalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{PROVINCES[selectedProvince].name} Tax:</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(lcgeResults.provincialTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span className="text-red-400 font-mono">-{formatCurrency(lcgeResults.totalTax)}</span>
                </div>
                <hr className="border-white" />
                <div className="flex justify-between text-lg font-bold">
                  <span>After-Tax Proceeds:</span>
                  <span className="text-green-400 font-mono">{formatCurrency(lcgeResults.afterTaxAmount)}</span>
                </div>
              </div>
            </Card>

            {/* Comparison */}
            <Card className="p-4 border border-white bg-yellow-900">
              <div className="flex justify-between items-center text-white font-financier">
                <span className="font-bold">Difference:</span>
                <span className={`text-lg font-bold font-mono ${qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? 'text-green-400' : 'text-red-400'}`}>
                  {qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? '+' : ''}{formatCurrency(qsbsResults.afterTaxProceeds - lcgeResults.afterTaxAmount)}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-2 font-financier">
                {qsbsResults.afterTaxProceeds > lcgeResults.afterTaxAmount ? 'QSBS provides better tax benefits' : 'LCGE provides better tax benefits'}
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 