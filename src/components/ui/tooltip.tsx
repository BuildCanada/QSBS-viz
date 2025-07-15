import React, { useState } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  className?: string
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={className}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-[99999]">
          <div className="px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg w-80 whitespace-normal">
            {content}
          </div>
          {/* Arrow pointing left */}
          <div 
            className="absolute top-1/2 right-full transform -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '6px solid #111827'
            }}
          />
        </div>
      )}
    </div>
  )
} 