import { motion } from 'framer-motion'
import { Eye, FilePenLine, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'

import {
  useFetchBasketsData,
  useFetchStockBasketsData,
} from '@/Queries/portfolio-queries'
import { usePortfolioStore } from '@/Store/PortfolioStore'
import { useFetchPortFolioStocksFetch } from '@/api/hooks'
import { DataTable } from '@/components/Global/DataTable/DataTable'
import CustomTooltip from '@/components/Global/custom-tooltip'
import TableLoading from '@/components/Global/table-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CustomSelect from '@/components/ui/custom-select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils'

import BasketForm from './Components/basket-form'
import StocksForm from './Components/stocks-form'
import {
  CustomColumnDef,
  StockBasketDetailsType,
} from './portfolio-utils/types'

interface StockTransaction {
  date: string
  quantity: number
  price: number
  type: 'BUY' | 'SELL'
  tickerId: string
}

const subColumns: CustomColumnDef<StockTransaction>[] = [
  {
    id: 'date',
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div>{formatDate(row.original.date)}</div>,
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => <div>{formatQuantity(row.original.quantity)}</div>,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'I/Price',
    cell: ({ row }) => <div>{formatCurrency(row.original.price)}</div>,
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'I/Invested',
    cell: ({ row }) => (
      <div>{formatCurrency(row.original.price * row.original.quantity)}</div>
    ),
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'C/Price',
    cell: ({ row }) => <div>{formatCurrency(row.original.price)}</div>,
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'C/Invested',
    cell: ({ row }) => (
      <div>{formatCurrency(row.original.price * row.original.quantity)}</div>
    ),
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'P/L',
    cell: ({ row }) => (
      <div>{formatCurrency(row.original.price * row.original.quantity)}</div>
    ),
  },
  // {
  //   id: 'type',
  //   accessorKey: 'type',
  //   header: 'Type',
  //   cell: ({ row }) => (
  //     <div
  //       className={
  //         row.original.type === 'BUY' ? 'text-green-500' : 'text-red-500'
  //       }
  //     >
  //       {row.original.type}
  //     </div>
  //   ),
  // },
  {
    id: 'actions',
    header: '',
    meta: { width: '10%' },
    cell: () => (
      <div className="flex gap-4 justify-start items-center">
        <Button variant="ghost">Edit</Button>
        <Button variant="ghost">Sell</Button>
      </div>
    ),
  },
]

const PortfolioStocks = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStocksTerm, setSearchStocksTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('1')
  const [isBasketDialogOpen, setIsBasketDialogOpen] = useState(false)
  const [isStocksDialogOpen, setIsStocksDialogOpen] = useState(false)
  const [subData, setSubData] = useState<Record<string, StockTransaction[]>>({})
  const [currentStockQuery, setCurrentStockQuery] = useState<{
    basketId: string
    stockBasketId: string
  } | null>(null)
  const [selectedOption, setSelectedOption] = useState<
    | {
        label: string | undefined
        value: string | undefined
      }
    | undefined
  >(undefined)

  const {
    data: basketsData,
    isFetching,
    isPlaceholderData,
  } = useFetchBasketsData(searchTerm, currentPage.toString(), '10')

  const { data: stocksBasketData, isFetching: isStocksFetching } =
    useFetchStockBasketsData(
      searchStocksTerm,
      currentPage.toString(),
      '10',
      selectedOption?.value,
    )
  const navigate = useNavigate()

  const columns: CustomColumnDef<StockBasketDetailsType>[] = [
    {
      id: 'Ticker',
      accessorKey: 'tickerId',
      header: 'Ticker',
      meta: { width: '10%' },
      cell: ({ row }) => <div>{row.original?.tickerDetails?.symbolId}</div>,
    },
    {
      id: 'Company',
      accessorKey: 'longName',
      header: 'Company',
      meta: { width: '20%' },
      cell: ({ row }) => <div>{row.original?.tickerDetails?.longName}</div>,
    },
    {
      id: 'targetAllocation',
      accessorKey: 'targetAllocation',
      header: 'Total Allocation',
      meta: { width: '15%' },
      cell: ({ row }) => (
        <div>{formatCurrency(row.original?.targetAllocation)}</div>
      ),
    },
    {
      id: 'notes',
      accessorKey: 'notes',
      header: 'Notes',
      meta: { width: '30%' },
      cell: ({ row }) => (
        <>
          <CustomTooltip
            toolContent={row.original?.notes}
            toolTrigger={<div className="truncate">{row.original?.notes}</div>}
          />
        </>
      ),
    },
    {
      id: 'lastUpdated',
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      meta: { width: '15%' },
      cell: ({ row }) => <div>{formatDate(row.original?.updatedAt)}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { width: '10%' },
      cell: ({ row }) => (
        <div className="flex gap-4 justify-start items-center">
          <CustomTooltip
            toolContent="View"
            toolTrigger={
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() =>
                  navigate(
                    `/portfolio/stocks/${row.original?.tickerDetails?.symbolId}`,
                  )
                }
              >
                <Eye color="#57ac11" strokeWidth={1} />
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsBasketDialogOpen(true)}>
                <FilePenLine color="#fa7900" />
                Edit Basket
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash2 color="#fa0000" /> Delete Basket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const { selectedBasketOption, setField } = usePortfolioStore()
  useEffect(() => {
    if (basketsData) {
      const result = basketsData.data.map(item => ({
        label: item.name,
        value: item.id,
      }))
      console.log(result, basketsData, 'result')
      setOptions(result)
      const checkIfIdExists = result.find(
        item => item?.value === selectedBasketOption?.value,
      )
      if (checkIfIdExists === undefined && selectedBasketOption?.value === '') {
        setField('selectedBasketOption', result[0])
      }
    }
  }, [basketsData, selectedBasketOption, setField])
  useEffect(() => {
    setSelectedOption(selectedBasketOption)
  }, [selectedBasketOption])

  const fetchStockRow = useFetchPortFolioStocksFetch(
    '',
    '1',
    '100000',
    currentStockQuery?.basketId || '',
    currentStockQuery?.stockBasketId || '',
  )

  const handleRowClick = async (row: StockBasketDetailsType) => {
    if (!subData[row.id]) {
      setCurrentStockQuery({
        basketId: row.basketId,
        stockBasketId: row.id,
      })
    }
  }

  useEffect(() => {
    if (currentStockQuery && !subData[currentStockQuery.stockBasketId]) {
      fetchStockRow.refetch().then(response => {
        if (response.data) {
          const data = response.data.data.map(stock => ({
            date: stock.createdAt,
            quantity: stock.quantity,
            price: stock.buyPrice,
            type: 'BUY' as const,
            tickerId: stock.stock_baskets?.tickerId,
          }))
          setSubData(prev => ({
            ...prev,
            [currentStockQuery.stockBasketId]: data,
          }))
        }
      })
    }
  }, [currentStockQuery, fetchStockRow, subData])

  return (
    <div className="mx-auto w-full p-2 h-full overflow-y-auto">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="flex items-center justify-between bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <CardHeader>
            <CardTitle className="text-white text-4xl font-bold">
              Stocks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Button
              variant="secondary"
              className="relative top-[12px]"
              onClick={() => setIsStocksDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Stocks
            </Button>
            {basketsData &&
              Number(basketsData?.pagination?.totalItems) == 0 && (
                <Button
                  variant="secondary"
                  className="relative top-[12px]"
                  onClick={() => setIsStocksDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Stocks
                </Button>
              )}
          </CardContent>
        </Card>
      </motion.div>

      {(isFetching && !isPlaceholderData) || isStocksFetching ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center h-[80%] flex-col gap-5"
        >
          <TableLoading />
        </motion.div>
      ) : options.length == 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 h-[calc(100%-200px)]"
        >
          <div className="flex flex-col gap-2 w-1/4 mt-5">
            <CustomSelect
              options={options}
              value={selectedOption}
              onChange={value => {
                setSelectedOption(value)
                setField(
                  'selectedBasketOption',
                  value as { label: string; value: string },
                )
              }}
              label="Basket"
              placeholder="Select a basket"
              setSearchTerm={setSearchTerm}
            />
          </div>
          <DataTable<StockBasketDetailsType, StockTransaction>
            columns={columns}
            data={stocksBasketData?.data || []}
            pagination={{
              metadata: stocksBasketData?.pagination,
              currentPage: currentPage,
              setCurrentPage: setCurrentPage,
            }}
            search={{
              searchTerm: searchStocksTerm,
              setSearchTerm: setSearchStocksTerm,
            }}
            title="Stock Table"
            tableSubDrop={{
              enabled: true,
              subColumns: subColumns,
              fetchSubData: subData,
            }}
            onRowClick={handleRowClick}
          />
        </motion.div>
      ) : (
        <div className="flex justify-center items-center h-full flex-col gap-5">
          <h1 className="text-2xl font-bold">No baskets available</h1>
          <Button
            variant="secondary"
            onClick={() => setIsBasketDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Create Basket
          </Button>
        </div>
      )}

      {/* {!isStocksFetching &&
        Number(stocksBasketData?.pagination?.cumulativeCount) === 0 && (
          <div className="flex justify-center items-center h-full flex-col gap-5">
            <h1 className="text-2xl font-bold">No baskets available</h1>
            <Button
              variant="secondary"
              onClick={() => setIsBasketDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> Create Basket
            </Button>
          </div>
        )} */}

      {isBasketDialogOpen && (
        <BasketForm
          isBasketDialogOpen={isBasketDialogOpen}
          setIsBasketDialogOpen={setIsBasketDialogOpen}
        />
      )}
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

export default PortfolioStocks
