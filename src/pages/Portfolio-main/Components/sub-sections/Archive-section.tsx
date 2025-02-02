import { useState } from 'react'

import {
  type PortfolioTransactionsResponse,
  useFetchPortfolioTransactionsData,
} from '@/api/hooks'
import { DataTable } from '@/components/Global/DataTable/DataTable'
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils'
import { CustomColumnDef } from '@/pages/Portfolio/portfolio-utils/types'

function ArchiveSection({
  activeStock,
}: {
  activeStock: {
    id: string
    name: string
    description: string
  }
}) {
  const [currentPage, setCurrentPage] = useState('1')

  const { data } = useFetchPortfolioTransactionsData({
    portfolioId: activeStock.id,
    page: currentPage,
    size: '10',
  })

  const columns: CustomColumnDef<PortfolioTransactionsResponse>[] = [
    {
      id: 'date',
      accessorKey: 'createdAt',
      header: 'Date',
      meta: { width: '10%' },
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      id: 'type',
      accessorKey: 'tradeType',
      header: 'Type',
      meta: { width: '10%' },
      cell: ({ row }) => (
        <div className="">
          <span
            className={`${
              row.original.tradeType === 'buy' ? 'bg-green-500' : 'bg-red-500'
            } text-white px-2 py-1 rounded-sm text-xs uppercase`}
          >
            {row.original.tradeType === 'buy' ? 'Buy' : 'Sell'}
          </span>
        </div>
      ),
    },
    {
      id: 'quantity',
      accessorKey: 'quantity',
      header: 'Quantity',
      meta: { width: '15%' },
      cell: ({ row }) => <div>{formatQuantity(row.original.quantity)}</div>,
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: 'Price Per Unit',
      meta: { width: '15%' },
      cell: ({ row }) => <div>{formatCurrency(row.original.price)}</div>,
    },
    {
      id: 'totalAmount',
      accessorKey: 'totalAmount',
      header: 'Amount',
      meta: { width: '15%' },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`${
              row.original.tradeType === 'buy'
                ? 'text-green-500'
                : 'text-red-500'
            } text-md`}
          >
            {formatCurrency(row.original.totalAmount)}
          </span>
        </div>
      ),
    },
  ]

  return (
    <DataTable<PortfolioTransactionsResponse>
      columns={columns}
      data={data?.data || []}
      pagination={{
        metadata: data?.pagination,
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
      }}
      title="Archive"
    />
  )
}

export default ArchiveSection
