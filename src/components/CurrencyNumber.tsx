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
  let numberPrefix = ''
  
  if (isNegative) {
    numberPrefix = '-$'
  } else if (showPositiveSign) {
    numberPrefix = '+$'
  } else {
    numberPrefix = '$'
  }
  
  const fontClass = fontFamily === 'soehne' ? 'font-soehne' : 'font-mono'
  
  if (currencyAfter) {
    return (
      <span 
        className={`${fontClass} ${className}`}
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          color: 'inherit' 
        }}
      >
        <NumberFlow 
          value={Math.abs(value)} 
          prefix={numberPrefix}
          format={{ 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true 
          }}
          willChange={true}
          transformTiming={{ duration: 300, easing: 'ease-out' }}
          spinTiming={{ duration: 200, easing: 'ease-out' }}
          opacityTiming={{ duration: 150, easing: 'ease-out' }}
          style={{ color: 'inherit' }}
        />
        <span style={{ color: 'inherit' }}> {currency}</span>
      </span>
    )
  } else {
    return (
      <span 
        className={`${fontClass} ${className}`}
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          color: 'inherit' 
        }}
      >
        <span style={{ color: 'inherit' }}>{currency} </span>
        <NumberFlow 
          value={Math.abs(value)} 
          prefix={numberPrefix}
          format={{ 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true 
          }}
          willChange={true}
          transformTiming={{ duration: 300, easing: 'ease-out' }}
          spinTiming={{ duration: 200, easing: 'ease-out' }}
          opacityTiming={{ duration: 150, easing: 'ease-out' }}
          style={{ color: 'inherit' }}
        />
      </span>
    )
  }
} 