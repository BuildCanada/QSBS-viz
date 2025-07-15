import NumberFlow from '@number-flow/react'
import { useState } from 'react'

interface SlotMachineNumberProps {
  value: number
  className?: string
  onValueChange?: (value: number) => void
}

export const SlotMachineNumber = ({ value, className = '', onValueChange }: SlotMachineNumberProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const handleClick = () => {
    if (onValueChange) {
      setIsEditing(true)
      setEditValue(Math.round(value).toString())
    }
  }

  const handleSubmit = () => {
    const newValue = parseInt(editValue) || 0
    const clampedValue = Math.min(Math.max(newValue, 0), 100)
    onValueChange?.(clampedValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    handleSubmit()
  }

  if (isEditing) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value.replace(/[^0-9]/g, ''))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="inline-block font-mono bg-transparent border-b border-current focus:outline-none text-center font-normal"
          style={{ 
            width: '3ch', 
            minWidth: '2ch',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 'normal'
          }}
          autoFocus
          maxLength={3}
        />
        <span className="font-mono ml-0.5 font-normal">%</span>
      </div>
    )
  }

  return (
    <div 
      className={`inline-flex items-center cursor-pointer hover:text-blue-600 transition-colors ${className}`} 
      onClick={handleClick}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <NumberFlow 
        value={Math.round(value)} 
        suffix="%" 
        willChange={true}
        transformTiming={{ duration: 200, easing: 'ease-out' }}
        spinTiming={{ duration: 150, easing: 'ease-out' }}
        opacityTiming={{ duration: 100, easing: 'ease-out' }}
      />
    </div>
  )
} 