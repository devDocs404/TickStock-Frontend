import { memo, useCallback, useMemo } from 'react'

import { PaginationType } from '@/Queries/queries-utils/types'
import { Button } from '@/components/ui/button'
import { CustomColumnDef } from '@/pages/Portfolio/portfolio-utils/types'

interface DataTableProps<TData, TSubData = unknown> {
  columns: CustomColumnDef<TData>[]
  data: TData[]
  onRowSelectionChange?: (selectedRows: TData[]) => void
  pagination?: {
    metadata: PaginationType | undefined
    currentPage: string | '1'
    setCurrentPage: (currentPage: string) => void
  }
  search?: {
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
  }
  visibleColumn?: boolean
  title?: string
  fetching?: boolean
  placeholderData?: boolean
  tableSubDrop?: {
    enabled: boolean
    subColumns: CustomColumnDef<TSubData>[]
    fetchSubData: (parentRow: TData) => Promise<TSubData[]>
  }
}

const TablePagination = ({
  pagination,
}: {
  pagination?: DataTableProps<unknown>['pagination']
}) => {
  const handlePageChange = useCallback(
    (direction: 'prev' | 'next') => {
      if (!pagination?.setCurrentPage) return
      const currentValue = parseInt(pagination.currentPage || '1')
      const newValue =
        direction === 'prev' ? currentValue - 1 : currentValue + 1
      pagination.setCurrentPage(newValue.toString())
    },
    [pagination],
  )
  console.log(pagination?.metadata?.totalPages, 'pagination')

  const paginationButtons = useMemo(
    () => (
      <div className="flex items-center justify-end space-x-2 py-2 flex-none">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange('prev')}
          disabled={!pagination?.metadata?.hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange('next')}
          disabled={!pagination?.metadata?.hasNextPage}
        >
          Next
        </Button>
      </div>
    ),
    [
      handlePageChange,
      pagination?.metadata?.hasNextPage,
      pagination?.metadata?.hasPreviousPage,
    ],
  )

  if (pagination?.metadata?.totalPages && pagination?.metadata?.totalPages > 1)
    return paginationButtons

  return null
}

export default memo(TablePagination)
