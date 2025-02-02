import { motion } from 'framer-motion'

import { useEffect, useState } from 'react'

import PortfolioCardMetrics from './portfolio-cardmetrics'
import PortfolioHeadingSection from './portfolio-heading-section'
import ArchiveSection from './sub-sections/Archive-section'
import OverviewSection from './sub-sections/overview-section'
import PortfolioSubSection from './sub-sections/portfolio-subsection'
import TransactionsSection from './sub-sections/transactions-section'

interface MainContentProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeStock: {
    id: string
    name: string
    description: string
  }
}

export default function MainContent({
  activeStock,
  sidebarOpen,
  setSidebarOpen,
}: MainContentProps) {
  const [currentTab, setCurrentTab] = useState('Overview')
  useEffect(() => {
    console.log(activeStock, 'active stock')
  }, [activeStock])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col p-4 lg:p-8"
    >
      <PortfolioHeadingSection
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeStock={activeStock}
        currentTab={currentTab}
      />
      <PortfolioCardMetrics currentTab={currentTab} />

      {/* Stock details */}
      <div className="flex-1 min-h-0 mt-8">
        <div className="flex flex-col h-full">
          <PortfolioSubSection
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />

          <div className="flex-1 min-h-0 overflow-auto">
            {currentTab === 'Overview' && (
              <OverviewSection activeStock={activeStock} />
            )}
            {currentTab === 'Trade Book' && (
              <TransactionsSection activeStock={activeStock} />
            )}
            {currentTab === 'Archive' && (
              <ArchiveSection activeStock={activeStock} />
            )}
            {currentTab === 'Chart' && <div>Chart</div>}

            {currentTab === 'News' && <div>News</div>}
            {currentTab === 'Forecasts' && <div>Forecasts</div>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
