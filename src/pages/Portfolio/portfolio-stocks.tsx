import { motion } from 'framer-motion'
import { Eye, FilePenLine, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'

import {
  useFetchBasketsData,
  useFetchStockBasketsData,
} from '@/Queries/portfolio-queries'
import { usePortfolioStore } from '@/Store/PortfolioStore'
import TableLoading from '@/components/Global/Table-Loading'
import CustomTooltip from '@/components/Global/custom-tooltip'
import { DataTable } from '@/components/Global/data-table'
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
import { formatCurrency, formatDate } from '@/lib/utils'

import BasketForm from './Components/basket-form'
import StocksForm from './Components/stocks-form'
import {
  CustomColumnDef,
  StockBasketDetailsType,
} from './portfolio-utils/types'

const PortfolioStocks = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStocksTerm, setSearchStocksTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('1')
  const [isBasketDialogOpen, setIsBasketDialogOpen] = useState(false)
  const [isStocksDialogOpen, setIsStocksDialogOpen] = useState(false)
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

  const { data: stocksBasketData } = useFetchStockBasketsData(
    '',
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
            {basketsData && Number(basketsData.pagination.totalItems) > 0 && (
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
      {isFetching && !isPlaceholderData ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center h-[80%] flex-col gap-5"
        >
          <TableLoading />
        </motion.div>
      ) : stocksBasketData?.data?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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

          <DataTable
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

      <BasketForm
        isBasketDialogOpen={isBasketDialogOpen}
        setIsBasketDialogOpen={setIsBasketDialogOpen}
      />
      <StocksForm
        // editPayload={editPayload}
        isStocksDialogOpen={isStocksDialogOpen}
        setIsStocksDialogOpen={setIsStocksDialogOpen}
      />
    </div>
  )
}

export default PortfolioStocks
