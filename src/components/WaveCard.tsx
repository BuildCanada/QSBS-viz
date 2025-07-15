import { motion } from 'framer-motion'
import { useState } from 'react'

interface WaveCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const WaveCard = ({ children, className = '', style = {} }: WaveCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
    >
      {/* Wave effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          )`,
          transform: 'translateX(-100%)',
        }}
        animate={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
} 