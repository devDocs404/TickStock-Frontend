import { useEffect, useState } from 'react'

import { PortfolioStocksResponse } from '@/api/hooks/types'
import {
  StockRowDataType,
  useFetchStocksData,
} from '@/api/hooks/useFetchStocksData'
import { useFetchPortfolioStocksData } from '@/api/hooks/usePortFolioStocksFetch'
import { DataTable } from '@/components/Global/DataTable/DataTable'
import { Button } from '@/components/ui/button'
import { useStockStore } from '@/hooks/useStockStore'
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils'
import { CustomColumnDef } from '@/pages/Portfolio/portfolio-utils/types'

import { PortfolioSellPopup } from '../portfolio-sell-popup'

function OverviewSection({
  activeStock,
}: {
  activeStock: {
    id: string
    name: string
    description: string
  }
}) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState('1')
  const [subData, setSubData] = useState<Record<string, StockRowDataType[]>>({})
  const { stocks } = useStockStore()

  const [currentStockQuery, setCurrentStockQuery] = useState<{
    portfolioId: string
    portFolioStockId: string
  } | null>(null)
  const [isSellPopupOpen, setIsSellPopupOpen] = useState(false)
  const [selectedStockRecord, setSelectedStockRecord] =
    useState<StockRowDataType | null>(null)

  const { data: portfolioStocksData } = useFetchPortfolioStocksData({
    portfolioId: activeStock.id,
    search: search,
    page: '1',
    size: '10',
  })

  const fetchStockRow = useFetchStocksData(
    '',
    '1',
    '100000',
    currentStockQuery?.portfolioId || '',
    currentStockQuery?.portFolioStockId || '',
  )

  const handleRowClick = (row: PortfolioStocksResponse) => {
    if (!subData[row.id]) {
      setCurrentStockQuery({
        portfolioId: row.portfolioId,
        portFolioStockId: row.id,
      })
    }
  }

  useEffect(() => {
    // console.log(currentStockQuery, 'currentStockQuery')
    setSubData({})
  }, [fetchStockRow.data])

  useEffect(() => {
    console.log(stocks, 'lakjsljdfllaslfalsd')
    // {stocks.[row.original?.tickerDetails?.symbolId].currentPrice
  }, [stocks])

  useEffect(() => {
    if (currentStockQuery && !subData[currentStockQuery.portFolioStockId]) {
      fetchStockRow.refetch().then(response => {
        if (response.data) {
          setSubData(prev => ({
            ...prev,
            [currentStockQuery.portFolioStockId]: response.data.data,
          }))
        }
      })
    }
  }, [currentStockQuery, fetchStockRow, subData])

  const columns: CustomColumnDef<PortfolioStocksResponse>[] = [
    {
      id: 'date',
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      meta: { width: '10%' },
      cell: ({ row }) => <div>{formatDate(row.original?.updatedAt)}</div>,
    },
    {
      id: 'ticker',
      accessorKey: 'tickerDetails',
      header: 'Ticker',
      meta: { width: '20%' },
      cell: ({ row }) => <div>{row.original?.tickerDetails?.symbolId}</div>,
    },
    {
      id: 'Company Name',
      accessorKey: 'tickerDetails',
      header: 'Company Name',
      meta: { width: '20%' },
      cell: ({ row }) => <div>{row.original?.tickerDetails?.longName}</div>,
    },
    {
      id: 'price',
      accessorKey: 'currentAllocation',
      header: 'C/Allocated',
      meta: { width: '15%' },
      cell: ({ row }) => (
        <div>{formatCurrency(row.original?.targetAllocation)}</div>
      ),
    },
    // {
    //   id: 'c/value',
    //   accessorKey: 'currentAllocation',
    //   header: 'C/Value',
    //   meta: { width: '15%' },
    //   cell: ({ row }) => (
    //     <div>
    //       {formatCurrency(
    //         stocks?.[row.original?.tickerDetails?.symbolId]?.currentPrice *
    //           row.original?.totalStocks,
    //       )}
    //     </div>
    //   ),
    // },
    {
      id: 'stocks',
      accessorKey: 'totalStocks',
      header: 'Total Stocks',
      meta: { width: '15%' },
      cell: ({ row }) => <div>{formatQuantity(row.original?.totalStocks)}</div>,
    },
  ]

  const subColumns: CustomColumnDef<StockRowDataType>[] = [
    {
      id: 'date',
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      id: 'quantity',
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => {
        console.log(row.original, 'row.original')
        return <div>{formatQuantity(row.original.quantity)}</div>
      },
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: 'I/Price',
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.buyPrice)}</div>
      },
    },
    {
      id: 'iTotal',
      accessorKey: 'total',
      header: 'I/Invested',
      cell: ({ row }) => (
        <div>{formatCurrency(row.original.totalInvested)}</div>
      ),
    },
    {
      id: 'cPrice',
      accessorKey: 'price',
      header: 'C/Price',
      cell: ({ row }) => {
        console.log(row.original.tickerDetails.symbolId, 'lakjslfjemmee')
        return (
          <div>
            {formatCurrency(
              stocks[row.original.tickerDetails.symbolId].currentPrice,
            )}
          </div>
        )
      },
    },
    {
      id: 'cTotal',
      accessorKey: 'total',
      header: 'C/Invested',
      cell: ({ row }) => {
        const currentPrice =
          stocks[row.original.tickerDetails.symbolId].currentPrice *
          row.original.quantity
        return (
          <span
            className={`${
              currentPrice > row.original.totalInvested
                ? 'text-green-500'
                : 'text-red-500'
            } text-md`}
          >
            {formatCurrency(currentPrice)}
          </span>
        )
      },
    },
    {
      id: 'pTotal',
      accessorKey: 'total',
      header: 'P/L',
      cell: ({ row }) => {
        const currentPrice =
          stocks[row.original.tickerDetails.symbolId].currentPrice
        return (
          <span
            className={`${
              currentPrice > row.original.buyPrice
                ? 'text-green-500'
                : 'text-red-500'
            } text-md`}
          >
            {formatCurrency(
              (currentPrice - row.original.buyPrice) * row.original.quantity,
            )}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      meta: { width: '10%' },
      cell: ({ row }) => (
        <div className="flex gap-4 justify-start items-center">
          <Button variant="ghost">Edit</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedStockRecord(row.original)
              setIsSellPopupOpen(true)
            }}
          >
            Sell
          </Button>
        </div>
      ),
    },
  ]
  return (
    <>
      <DataTable<PortfolioStocksResponse, StockRowDataType>
        columns={columns}
        data={portfolioStocksData?.data || []}
        pagination={{
          metadata: portfolioStocksData?.pagination,
          currentPage: currentPage,
          setCurrentPage: setCurrentPage,
        }}
        title="Holdings Table"
        search={{ searchTerm: search, setSearchTerm: setSearch }}
        tableSubDrop={{
          enabled: true,
          subColumns: subColumns,
          fetchSubData: subData,
        }}
        onRowClick={handleRowClick}
      />
      {isSellPopupOpen && (
        <PortfolioSellPopup
          isPortfolioSellPopupOpen={isSellPopupOpen}
          setIsPortfolioSellPopupOpen={setIsSellPopupOpen}
          // selectedStockRecord={selectedStockRecord}
          dataFromParent={selectedStockRecord}
        />
      )}
    </>
  )
}

export default OverviewSection
