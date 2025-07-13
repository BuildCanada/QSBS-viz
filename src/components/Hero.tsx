import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden border-2 border-black">
      {/* Decorative SVG Elements */}
      <div className="absolute top-0 left-0 opacity-20">
        <svg width="90" height="180" viewBox="0 0 90 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-1.86607e-05 1C49.1533 0.999997 89 40.8467 89 90C89 139.153 49.1533 179 -3.09944e-06 179" stroke="#272727" strokeOpacity="0.2"/>
          <path d="M-1.61652e-05 11C44.1828 11 80 46.5934 80 90.5C80 134.407 44.1828 170 -2.26498e-06 170" stroke="#272727" strokeOpacity="0.2"/>
        </svg>
      </div>
      <div className="absolute top-0 right-0 opacity-20">
        <svg width="90" height="180" viewBox="0 0 90 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 179C40.8467 179 1 139.153 1 90C1 40.8467 40.8467 1 90 1" stroke="#272727" strokeOpacity="0.2"/>
          <path d="M90 169C45.8172 169 10 133.407 10 89.5C10 45.5934 45.8172 10 90 10" stroke="#272727" strokeOpacity="0.2"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Building a<br />
            <span className="relative">
              <span className="relative z-10">Better Canada</span>
              <div className="absolute inset-0 border-2 border-gray-600 -m-2"></div>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We believe Canada should be the most prosperous country in the world
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              asChild 
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg"
            >
              <a href="https://buildcanada.substack.com/subscribe" target="_blank">
                Get Updates
              </a>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-black text-black hover:bg-gray-100 px-8 py-3 text-lg"
            >
              <a href="https://5nneq7.share-na3.hsforms.com/2l9iIH2gFSomphjDe-ci5OQ" target="_blank">
                Volunteer
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 