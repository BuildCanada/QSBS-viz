import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactNode
  className?: string
  position?: 'right' | 'bottom' | 'left'
}

export function Tooltip({ content, children, className = '', position = 'right' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      
      let top = 0
      let left = 0
      
      if (position === 'bottom') {
        top = rect.bottom + scrollTop + 8 // 8px spacing
        left = rect.left + scrollLeft + rect.width / 2 - 160 // 160px is half of tooltip width (320px)
      } else if (position === 'left') {
        top = rect.top + scrollTop + rect.height / 2 // Center vertically first
        left = rect.left + scrollLeft - 320 - 8 // 320px tooltip width + 8px spacing
      } else {
        // Default right position
        top = rect.top + scrollTop + rect.height / 2 // Center vertically first
        left = rect.right + scrollLeft + 8 // 8px spacing
      }
      
      setTooltipPosition({ top, left })
    }
  }, [isVisible, position])

  // Second effect to adjust positioning after tooltip is rendered and we can measure it
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      
      let top = 0
      let left = 0
      
      if (position === 'bottom') {
        top = triggerRect.bottom + scrollTop + 8 // 8px spacing
        left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
      } else if (position === 'left') {
        top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2 // Properly center using actual height
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8 // Use actual width + 8px spacing
      } else {
        // Default right position
        top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2 // Properly center using actual height
        left = triggerRect.right + scrollLeft + 8 // 8px spacing
      }
      
      setTooltipPosition({ top, left })
    }
  }, [isVisible, position, content]) // Re-run when content changes too

  const getArrowStyles = () => {
    if (position === 'bottom') {
      return {
        position: 'absolute' as const,
        top: '-6px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: '6px solid #111827'
      }
    }
    
    if (position === 'left') {
      return {
        position: 'absolute' as const,
        top: '50%',
        right: '-6px',
        transform: 'translateY(-50%)',
        width: 0,
        height: 0,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: '6px solid #111827'
      }
    }
    
    // Default right position
    return {
      position: 'absolute' as const,
      top: '50%',
      left: '-6px',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid #111827'
    }
  }

  const tooltipContent = isVisible && (
    <div 
      ref={tooltipRef}
      style={{
        position: 'absolute',
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    >
      <div className="px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg w-80 whitespace-normal">
        {content}
      </div>
      {/* Arrow */}
      <div style={getArrowStyles()} />
    </div>
  )

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={className}
      >
        {children}
      </div>
      
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </div>
  )
} 