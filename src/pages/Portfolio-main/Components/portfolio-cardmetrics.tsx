import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'

import { useEffect, useState } from 'react'

import { usePortfolioStore } from '@/Store/PortfolioStore'
import { formatCurrency, formatQuantity } from '@/lib/utils'

function PortfolioCardMetrics({ currentTab }: { currentTab: string }) {
  const { portfolioDetails } = usePortfolioStore()
  console.log(currentTab)
  const [metrics, setMetrics] = useState<
    {
      title: string
      value: string
      icon: React.ElementType
      color: string
    }[]
  >([])
  useEffect(() => {
    if (currentTab === 'Overview') {
      setMetrics([
        {
          title: 'Invested',
          value: formatCurrency(portfolioDetails?.totalInvested),
          icon: BarChart2,
          color: 'bg-blue-500/10',
        },
        {
          title: 'Current Value',
          value: formatCurrency(portfolioDetails?.totalInvested),
          icon: BarChart2,
          color: 'bg-green-500/10',
        },
        {
          title: 'Change',
          value: `${portfolioDetails?.totalInvested ? (((portfolioDetails?.totalInvested - portfolioDetails?.totalInvested) / portfolioDetails?.totalInvested) * 100).toFixed(2) : 0}%`,
          icon: BarChart2,
          color: 'bg-yellow-500/10',
        },
        {
          title: 'P/L',
          value: `${portfolioDetails?.totalInvested ? (((portfolioDetails?.totalInvested - portfolioDetails?.totalInvested) / portfolioDetails?.totalInvested) * 100).toFixed(2) : 0}%`,
          icon: BarChart2,
          color: 'bg-purple-500/10',
        },
      ])
    }
    if (currentTab === 'Trade Book') {
      setMetrics([
        {
          title: 'Invested',
          value: formatCurrency(portfolioDetails?.totalInvested),
          icon: BarChart2,
          color: 'bg-blue-500/10',
        },
        {
          title: 'Current Value',
          value: formatCurrency(portfolioDetails?.totalInvested),
          icon: BarChart2,
          color: 'bg-green-500/10',
        },
        {
          title: 'Total Trades',
          value: formatQuantity(5),
          icon: BarChart2,
          color: 'bg-blue-500/10',
        },
        {
          title: 'P/L',
          value: `${portfolioDetails?.totalInvested ? (((portfolioDetails?.totalInvested - portfolioDetails?.totalInvested) / portfolioDetails?.totalInvested) * 100).toFixed(2) : 0}%`,
          icon: BarChart2,
          color: 'bg-purple-500/10',
        },
      ])
    }
  }, [currentTab, portfolioDetails])
  return (
    <>
      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
              index === 0
                ? 'bg-blue-500/10'
                : index === 1
                  ? 'bg-green-500/10'
                  : index === 2
                    ? 'bg-yellow-500/10'
                    : 'bg-purple-500/10'
            }`}
          >
            <BarChart2
              className={`h-5 w-5 ${
                index === 0
                  ? 'text-blue-500'
                  : index === 1
                    ? 'text-green-500'
                    : index === 2
                      ? 'text-yellow-500'
                      : 'text-purple-500'
              }`}
            />
            <div>
              <div className="text-sm text-gray-500">{metric.title}</div>
              <div className="font-medium">
                {metric.value}
                {/* {index === 1 && formatCurrency(portfolioDetails?.totalInvested)}
                {index === 2 &&
                  `${portfolioDetails?.totalInvested ? (((portfolioDetails?.totalInvested - portfolioDetails?.totalInvested) / portfolioDetails?.totalInvested) * 100).toFixed(2) : 0}%`}
                {index === 3 && (
                  <span
                  // className={`${
                  //   portfolioDetails?.totalInvested
                  //     ? portfolioDetails.totalInvested > 0
                  //       ? 'text-green-500'
                  //       : portfolioDetails.totalInvested === 0
                  //         ? 'text-black'
                  //         : 'text-red-500'
                  //     : 'text-black'
                  // }`}
                  >
                    {portfolioDetails?.totalInvested
                      ? (
                          ((portfolioDetails.totalInvested -
                            portfolioDetails.totalInvested) /
                            portfolioDetails.totalInvested) *
                          100
                        ).toFixed(2)
                      : '0.00'}
                    %
                  </span>
                )} */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default PortfolioCardMetrics
