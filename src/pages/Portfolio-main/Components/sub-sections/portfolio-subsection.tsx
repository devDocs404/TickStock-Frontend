import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'

function PortfolioSubSection({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string
  setCurrentTab: (tab: string) => void
}) {
  const tabs = [
    'Overview',
    'Trade Book',
    'Archive',
    'Chart',
    'News',
    'Forecasts',
  ]

  return (
    <div className="flex-none border-b overflow-x-auto mb-6">
      <div className="flex space-x-6 whitespace-nowrap">
        {tabs.map(tab => (
          <Button
            key={tab}
            variant="ghost"
            className={`relative px-0 font-normal hover:bg-transparent ${
              currentTab === tab ? 'text-blue-500' : ''
            }`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
            {currentTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default PortfolioSubSection
