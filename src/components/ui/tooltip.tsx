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
  const [isMobile, setIsMobile] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      // On mobile, position at top of screen
      if (isMobile) {
        setTooltipPosition({ top: 16, left: 16 }) // 16px from top and left
        return
      }

      // Desktop positioning logic (existing)
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
  }, [isVisible, position, isMobile])

  // Second effect to adjust positioning after tooltip is rendered and we can measure it
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current && !isMobile) {
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
  }, [isVisible, position, content, isMobile]) // Re-run when content changes too

  const getArrowStyles = () => {
    // Hide arrows on mobile since tooltip is at top of screen
    if (isMobile) {
      return { display: 'none' }
    }

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
        position: isMobile ? 'fixed' : 'absolute', // Fixed for mobile, absolute for desktop
        top: isMobile ? '16px' : tooltipPosition.top,
        left: isMobile ? '16px' : tooltipPosition.left,
        right: isMobile ? '16px' : 'auto', // Full width on mobile
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    >
      <div className={`px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal ${isMobile ? 'w-full' : 'w-80'}`}>
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
        onTouchStart={() => setIsVisible(true)} // Add touch support for mobile
        onTouchEnd={() => {
          // Hide tooltip after a delay on mobile
          setTimeout(() => setIsVisible(false), 3000)
        }}
        className={className}
      >
        {children}
      </div>
      
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </div>
  )
} 