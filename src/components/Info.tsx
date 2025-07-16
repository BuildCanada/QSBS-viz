import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"

export function Info() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-transparent border border-white border-t-0">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white font-soehne">
            Understanding Your Options
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-financier">
            Two powerful tax strategies that can dramatically impact your exit proceeds
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* QSBS Card */}
          <Card className="p-8 border border-white bg-blue-900">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-2 flex items-center font-soehne">
                🇺🇸 QSBS (Qualified Small Business Stock)
              </h3>
              <p className="text-blue-300 font-medium font-financier">United States Tax Strategy</p>
            </div>
            
            <div className="space-y-4 text-gray-200 font-financier">
              <p>
                <strong className="text-white">What it is:</strong> A powerful US tax provision that allows entrepreneurs to exclude up to $15 million USD in capital gains from federal taxes when selling qualifying small business stock.
              </p>
              
              <p>
                <strong className="text-white">Key Requirements:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Must be a C-Corporation incorporated in the US</li>
                <li>Original issuance of stock (not purchased from another shareholder)</li>
                <li>Held for at least 5 years</li>
                <li>Company must meet "active business" requirements</li>
                <li>Gross assets under $50M when stock was issued</li>
              </ul>

              <p>
                <strong className="text-white">Tax Benefit:</strong> Up to $15 million USD (or 10x your cost basis, whichever is greater) of capital gains are completely exempt from federal taxes. Remaining gains taxed at 20% long-term capital gains rate.
              </p>
              <div className="bg-blue-800 p-4 rounded border border-blue-300 mt-4">
                <p className="text-sm font-medium text-blue-200">
                  💡 Best for: Canadian entrepreneurs willing to incorporate in the US and meet the 5-year holding requirement for maximum tax efficiency.
                </p>
              </div>
            </div>
          </Card>

          {/* LCGE Card */}
          <Card className="p-8 border border-white bg-red-900">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-red-200 mb-2 flex items-center font-soehne">
                🇨🇦 LCGE (Lifetime Capital Gains Exemption)
              </h3>
              <p className="text-red-300 font-medium font-financier">Canadian Tax Strategy</p>
            </div>
            
            <div className="space-y-4 text-gray-200 font-financier">
              <p>
                <strong className="text-white">What it is:</strong> A Canadian tax provision that allows individuals to exclude capital gains from the sale of qualifying small business corporation shares from taxable income.
              </p>
              
              <p>
                <strong className="text-white">Key Requirements:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Must be a Canadian-controlled private corporation (CCPC)</li>
                <li>Shares held for at least 24 months before sale</li>
                <li>90% of assets must be used in active business</li>
                <li>50% of company's income from active business</li>
                <li>Company qualifies as a "small business corporation"</li>
              </ul>

              <p>
                <strong className="text-white">Tax Benefit:</strong> Up to $971,190 (2023 limit, indexed annually) of capital gains are exempt from taxes. Remaining gains subject to 50% inclusion rate and taxed at marginal rates (~25% effective rate).
              </p>

              <div className="bg-red-800 p-4 rounded border border-red-300 mt-4">
                <p className="text-sm font-medium text-red-200">
                  💡 Best for: Canadian entrepreneurs who prefer domestic incorporation and have smaller exit values, or want more flexibility with shorter holding periods.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="p-6 border border-white bg-yellow-900 max-w-4xl mx-auto">
            <h4 className="text-xl font-semibold mb-3 text-yellow-200 font-soehne">⚖️ The Bottom Line</h4>
            <p className="text-gray-200 font-financier">
              For high-value exits ($2M+), QSBS often provides superior tax benefits due to its higher exemption limit. 
              However, LCGE offers more flexibility and may be better for smaller exits or when US incorporation isn't feasible. 
              <strong className="text-white"> Always consult with cross-border tax professionals</strong> as individual circumstances vary significantly.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
} 