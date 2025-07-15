import NumberFlow from '@number-flow/react'

interface CurrencyNumberProps {
  value: number
  currency: 'USD' | 'CAD'
  className?: string
  isNegative?: boolean
  showPositiveSign?: boolean
  currencyAfter?: boolean
  fontFamily?: 'mono' | 'soehne'
}

export const CurrencyNumber = ({ 
  value, 
  currency, 
  className = '', 
  isNegative = false, 
  showPositiveSign = false, 
  currencyAfter = false,
  fontFamily = 'mono'
}: CurrencyNumberProps) => {
  let prefix = ''
  let suffix = ''
  
  if (isNegative) {
    prefix = '-'
  } else if (showPositiveSign) {
    prefix = '+'
  }
  
  if (currencyAfter) {
    prefix = `${prefix}$`
    suffix = ` ${currency}`
  } else {
    prefix = `${prefix}${currency} $`
  }
  
  const fontClass = fontFamily === 'soehne' ? 'font-soehne' : 'font-mono'
  
  return (
    <span 
      className={`${fontClass} ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <NumberFlow 
        value={Math.abs(value)} 
        prefix={prefix}
        suffix={suffix}
        format={{ 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: true 
        }}
        willChange={true}
        transformTiming={{ duration: 300, easing: 'ease-out' }}
        spinTiming={{ duration: 200, easing: 'ease-out' }}
        opacityTiming={{ duration: 150, easing: 'ease-out' }}
      />
    </span>
  )
} 