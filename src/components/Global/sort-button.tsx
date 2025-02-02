import { ArrowDownUp } from 'lucide-react'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

function SortButton({
  setSortBy,
  sortData,
  sortBy,
}: {
  setSortBy: (sort: string) => void
  sortData: { title: string; value: string }[]
  sortBy: string
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon">
            <ArrowDownUp />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sortData.map(sort => (
            <>
              <DropdownMenuItem>
                <button
                  className={`w-full text-left ${
                    sortBy === sort.value ? 'font-bold' : ''
                  }`}
                  onClick={() => setSortBy(sort.value)}
                >
                  {sort.title}
                </button>
              </DropdownMenuItem>
              <div className="w-full border-b border-gray-200"></div>
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SortButton
