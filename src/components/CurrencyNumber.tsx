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
  
  // Extract specific color value from className
  const getColorFromClassName = (className: string) => {
    if (className.includes('text-red-600')) return '#dc2626'
    if (className.includes('text-green-600')) return '#16a34a'
    if (className.includes('text-blue-600')) return '#2563eb'
    return null
  }
  
  const specificColor = getColorFromClassName(className)
  const colorStyle = specificColor ? { color: specificColor } : { color: 'inherit' }
  
  if (currencyAfter) {
    return (
      <span 
        className={`${fontClass} ${className}`}
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          ...colorStyle
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
          style={colorStyle}
        />
        <span style={colorStyle}> {currency}</span>
      </span>
    )
  } else {
    return (
      <span 
        className={`${fontClass} ${className}`}
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          ...colorStyle
        }}
      >
        <span style={colorStyle}>{currency} </span>
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
          style={colorStyle}
        />
      </span>
    )
  }
} 