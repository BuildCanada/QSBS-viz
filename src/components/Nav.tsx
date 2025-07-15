import React, { useState, useEffect } from 'react'
import { AnimatedLogo } from './AnimatedLogo'
import { WaveCard } from './WaveCard'

export const Nav: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Add event listener to the entire page
    document.addEventListener('mousemove', handleMouseMove)

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <WaveCard 
      className="font-soehne"
      style={{ 
        backgroundColor: 'rgba(245, 244, 252, 0.6)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <nav 
        role="navigation" 
        className="flex items-stretch"
      >
        <div className="flex items-stretch w-full">
          {/* Brand/Logo */}
          <a 
            href="/" 
            aria-current="page" 
            className="flex items-center transition-opacity hover:opacity-80 p-4"
            style={{
              outline: 'none',
              border: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <AnimatedLogo mousePosition={mousePosition} />
          </a>
        </div>
      </nav>
    </WaveCard>
  )
} 

