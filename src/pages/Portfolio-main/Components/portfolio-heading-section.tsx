import { MenuIcon } from 'lucide-react'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import StocksForm from '@/pages/Portfolio/Components/stocks-form'

interface MainContentProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentTab: string
  activeStock: {
    id: string
    name: string
    description: string
  }
}

function PortfolioHeadingSection({
  sidebarOpen,
  setSidebarOpen,
  activeStock,
}: MainContentProps) {
  const [isStocksDialogOpen, setIsStocksDialogOpen] = useState(false)
  return (
    <div className="flex-none">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 lg:mb-0 justify-between w-full">
          <div className="">
            <h1 className="text-2xl font-semibold">{activeStock?.name}</h1>
            <p className="text-sm text-muted-foreground">
              {activeStock?.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="block lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle portfolio sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex  items-center gap-4">
          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600 "
            onClick={() => setIsStocksDialogOpen(true)}
          >
            Add Script
          </Button>
          {/* <div className="flex">
            <Button size="icon" variant="ghost">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Info className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {isStocksDialogOpen && (
        <StocksForm
          // editPayload={editPayload}
          isStocksDialogOpen={isStocksDialogOpen}
          setIsStocksDialogOpen={setIsStocksDialogOpen}
        />
      )}
    </div>
  )
}

export default PortfolioHeadingSection
