export function FontGuide() {
  return (
    <div className="mt-16 border-t border-white">
      <div className="py-16">
        {/* Page Title */}
        <h1 className="font-soehne text-6xl font-semibold text-white mb-8">
          Font Guide
        </h1>
        
        <p className="font-financier text-lg text-white/80 mb-16 max-w-2xl">
          A comprehensive showcase of our typography system featuring three carefully selected typefaces for different content types.
        </p>

        {/* Söhne - Headings */}
        <div className="mb-16">
          <h2 className="font-soehne text-4xl font-semibold text-white mb-8">
            Test Söhne — Headings
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Heading 1 - 6xl (60px)</p>
              <h1 className="font-soehne text-6xl font-semibold text-white">
                Build Canada Together
              </h1>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Heading 2 - 4xl (36px)</p>
              <h2 className="font-soehne text-4xl font-semibold text-white">
                QSBS vs LCGE Calculator
              </h2>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Heading 3 - 3xl (30px)</p>
              <h3 className="font-soehne text-3xl font-semibold text-white">
                Tax Strategy Comparison
              </h3>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Heading 4 - 2xl (24px)</p>
              <h4 className="font-soehne text-2xl font-semibold text-white">
                Key Benefits Analysis
              </h4>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Heading 5 - xl (20px)</p>
              <h5 className="font-soehne text-xl font-medium text-white">
                Implementation Guidelines
              </h5>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Heading 6 - lg (18px)</p>
              <h6 className="font-soehne text-lg font-medium text-white">
                Technical Requirements
              </h6>
            </div>
          </div>
        </div>

        {/* Financier - Body Text */}
        <div className="mb-16">
          <h2 className="font-soehne text-4xl font-semibold text-white mb-8">
            Test Financier Text — Body Text
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Large Body - xl (20px)</p>
              <p className="font-financier text-xl text-white">
                The Qualified Small Business Stock (QSBS) exemption allows eligible shareholders to exclude up to $10 million in gains from federal taxes when selling qualifying small business stock.
              </p>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Regular Body - lg (18px)</p>
              <p className="font-financier text-lg text-white">
                Canada's Lifetime Capital Gains Exemption provides similar benefits for Canadian entrepreneurs, allowing up to $971,190 in tax-free capital gains on qualifying small business corporation shares.
              </p>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Medium Body - base (16px)</p>
              <p className="font-financier text-base text-white">
                Both tax provisions are designed to encourage entrepreneurship and small business investment by providing significant tax advantages for qualifying business owners and investors.
              </p>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Small Body - sm (14px)</p>
              <p className="font-financier text-sm text-white">
                Understanding the eligibility requirements and strategic implications of each exemption is crucial for maximizing tax benefits and making informed business decisions.
              </p>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Caption - xs (12px)</p>
              <p className="font-financier text-xs text-white/80">
                Tax strategies should always be evaluated in consultation with qualified tax professionals and legal advisors.
              </p>
            </div>
          </div>
        </div>

        {/* Founders Grotesk Mono - Numbers/Data */}
        <div className="mb-16">
          <h2 className="font-soehne text-4xl font-semibold text-white mb-8">
            Test Founders Grotesk Mono — Numbers & Data
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Large Numbers - 4xl (36px)</p>
              <div className="font-mono text-4xl text-white">
                $10,000,000
              </div>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Medium Numbers - 2xl (24px)</p>
              <div className="font-mono text-2xl text-white">
                $971,190.00
              </div>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Regular Numbers - xl (20px)</p>
              <div className="font-mono text-xl text-white">
                25.00% | 20.00%
              </div>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Code/Data - base (16px)</p>
              <div className="font-mono text-base text-white bg-white/5 p-4 rounded border border-white/20">
                Tax Rate: 0.25<br/>
                Exemption: 971190<br/>
                Calculate: (gain - exemption) * tax_rate
              </div>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Small Data - sm (14px)</p>
              <div className="font-mono text-sm text-white">
                ID: QSBS-2024-001 | Status: ACTIVE
              </div>
            </div>
            
            <div>
              <p className="font-financier text-sm text-white/60 mb-2">Technical Text - xs (12px)</p>
              <div className="font-mono text-xs text-white/80">
                version: 1.0.0 | build: 20241201-1400
              </div>
            </div>
          </div>
        </div>

        {/* Typography Combinations */}
        <div className="mb-16">
          <h2 className="font-soehne text-4xl font-semibold text-white mb-8">
            Typography in Practice
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-white/20 p-6 rounded">
              <h3 className="font-soehne text-2xl font-semibold text-white mb-4">
                QSBS Exemption Details
              </h3>
              <p className="font-financier text-base text-white/80 mb-4">
                The Qualified Small Business Stock exemption provides significant tax advantages for eligible investments.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-financier text-sm text-white/60">Maximum Exemption:</span>
                  <span className="font-mono text-sm text-white">$10,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-financier text-sm text-white/60">Tax Rate on Excess:</span>
                  <span className="font-mono text-sm text-white">20.00%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-financier text-sm text-white/60">Holding Period:</span>
                  <span className="font-mono text-sm text-white">5 years</span>
                </div>
              </div>
            </div>
            
            <div className="border border-white/20 p-6 rounded">
              <h3 className="font-soehne text-2xl font-semibold text-white mb-4">
                LCGE Benefits Overview
              </h3>
              <p className="font-financier text-base text-white/80 mb-4">
                Canada's Lifetime Capital Gains Exemption offers tax-free capital gains for qualifying small business shares.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-financier text-sm text-white/60">Current Limit (2024):</span>
                  <span className="font-mono text-sm text-white">$971,190</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-financier text-sm text-white/60">Effective Tax Rate:</span>
                  <span className="font-mono text-sm text-white">~25.00%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-financier text-sm text-white/60">Annual Indexation:</span>
                  <span className="font-mono text-sm text-white">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 