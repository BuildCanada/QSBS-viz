import { motion } from 'framer-motion'
import { WaveCard } from "@/components/WaveCard"

export function BlankSection() {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <WaveCard 
        className="p-6 w-full"
        style={{ 
          backgroundColor: 'rgba(245, 244, 252, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
        }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold font-soehne mb-2" style={{ color: '#28253B' }}>
          So... It seems that big $65M+ exits are actually more favourable for the founder in Canada.
        </h2>
        <p className="text-lg md:text-xl font-soehne text-gray-700 mb-4">
          Why do we still see so many founders leaving Canada?
        </p>
        <p className="text-base font-financier text-gray-800 leading-tight">
          The truth is, this is not a story about founders. This is a story about investors. Imagine a $1B company. The founder owns 50% of the company, and a group of 20 investors own the other 50%. For the founder, they have a nice exit that is taxed favourably in Canada, but for the investors, on average they are getting $25M each. While any exit amount larger than $65M CAD is favourable for the founder, the investors are getting the short end of the stick. The United States' tax code, stemming from their QSBS policy, is very favourable for these investor outcomes, which enourages investment into the startups in the first place. It is no wonder why the US has such a vibrant startup ecosystem. Canada's version of QSBS, the LCGE (Lifetime Capital Gains Exemption) does not apply to investors, and even if it did, it does not come close to the $15M USD tax exemption that the US has.
          <br />
          <br />
          We love to talk about founder stories, but without their investors, these companies would not exist. Without investment, Apple never would have gotten off the ground. Microsoft would have never become the behemoth it is today. Google would have been stuck in the garage. The Canadian ecosystem lacks incentives for these investors to pour money into risky startups, so no wonder why every company flees south for funding. There just isn't any money here! The true reason is that the founders are leaving Canada because they are not able to raise the capital they need to build their companies, so they go to where they can!
        </p>
      </WaveCard>
    </motion.div>
  )
} 