import { useEffect, useState } from 'react'

import { usePortfolioStore } from '@/Store/PortfolioStore'
import { PortfolioType, useFetchPortfolioData } from '@/api/hooks/'
import { SearchInput } from '@/components/Global/search-input'
import SortButton from '@/components/Global/sort-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useStockStore } from '@/hooks/useStockStore'

import PortfolioCreatePopup from './portfolio-create-popup'

interface PortfolioProps {
  activeStock: {
    id: string
    name: string
    description: string
  }
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  setActiveStock: React.Dispatch<
    React.SetStateAction<{
      id: string
      name: string
      description: string
    }>
  >
  setSidebarOpen: (open: boolean) => void
}

export default function Portfolio({
  activeStock,
  setActiveStock,
  setSidebarOpen,
  search,
  setSearch,
}: PortfolioProps) {
  const { data } = useFetchPortfolioData({
    search: search,
    page: '1',
    size: '1000',
  })
  const { connect, disconnect } = useStockStore()
  const [cardData, setCardData] = useState<PortfolioType[]>([])
  const [isBasketDialogOpen, setIsBasketDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState('creation')
  const { setField } = usePortfolioStore()
  const sortTitles = [
    { title: 'Creation', value: 'creation' },
    { title: 'Ascending Investment', value: 'investment' },
    { title: 'Descending Investment', value: 'investment-desc' },
  ]

  useEffect(() => {
    connect() // ✅ Call the function
    return () => disconnect() // ✅ Cleanup on unmount
  }, [connect, disconnect])
  useEffect(() => {
    console.log(data?.data, 'portfolio data')
    if (data?.data) {
      setCardData(data.data)
    }
  }, [data])

  useEffect(() => {
    if (data?.data && data.data.length > 0 && search === '') {
      setActiveStock(data.data[0])
      setField('portfolioDetails', data.data[0])
    }
  }, [data, setActiveStock, search, setField])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4">
        <h2 className="text-lg font-semibold">Portfolio</h2>
        <Button
          className="w-full mt-4"
          onClick={() => setIsBasketDialogOpen(true)}
        >
          Add Portfolio
        </Button>
        {/* <Input
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-4"
        /> */}
        <div className="mt-4 flex items-center justify-between gap-0 w-full">
          <SearchInput
            search={search}
            setSearchTerm={setSearch}
            placeholder="Search portfolio"
          />
          {/* <ArrowDownUp /> */}
          <SortButton
            setSortBy={setSortBy}
            sortData={sortTitles}
            sortBy={sortBy}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4 border-l lg:border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:grid-cols-1">
          {cardData.map(stock => (
            <Card
              key={stock.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                activeStock.id === stock.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => {
                setActiveStock(stock)
                setSidebarOpen(false)
                setField('portfolioDetails', stock)
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-lg font-medium line-clamp-1">
                    {stock?.name}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {stock?.description}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div className="text-2xl font-bold">
                  ₹{stock?.totalInvested?.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stock?.riskLevel}%
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {isBasketDialogOpen && (
        <PortfolioCreatePopup
          isPortfolioDialogOpen={isBasketDialogOpen}
          setIsPortfolioDialogOpen={setIsBasketDialogOpen}
        />
      )}
    </div>
  )
}
