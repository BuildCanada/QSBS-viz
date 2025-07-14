import React from 'react'

export const Nav: React.FC = () => {
  return (
    <nav role="navigation" className="flex items-stretch border border-white bg-black font-soehne">
      <div className="flex items-stretch w-full">
        {/* Brand/Logo */}
        <a 
          href="/" 
          aria-current="page" 
          className="flex items-center transition-opacity hover:opacity-80 p-4"
        >
          <img 
            src="https://cdn.prod.website-files.com/679d23fc682f2bf860558c9a/679d23fc682f2bf860558cc6_build_canada-wordmark.svg" 
            loading="lazy" 
            width="119" 
            alt="Build Canada" 
            className="h-8 w-auto block"
          />
        </a>
      </div>
    </nav>
  )
} 