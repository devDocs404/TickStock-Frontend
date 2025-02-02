import { zodResolver } from '@hookform/resolvers/zod'
import {
  BadgeIndianRupee,
  Handshake,
  NotepadText,
  TicketCheck,
  TrendingUp,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useCreateStockPost,
  useFetchBrokersData,
  useFetchTickersData,
} from '@/Queries/portfolio-queries'
import { usePortfolioStore } from '@/Store/PortfolioStore'
// UI Components
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FormInput from '@/components/ui/forms/form-input-field'
import { FormReactSelect } from '@/components/ui/forms/form-react-select'
import { Textarea } from '@/components/ui/textarea'
// import { Select } from '@/components/ui/react-select';
import { useDebounce } from '@/hooks/useDebounce'
import { useStockStore } from '@/hooks/useStockStore'
// Data and Types
import { createStockSchema } from '@/schema'

import { CreateStockPayload, StocksType } from '../portfolio-utils/types'

type OptionType = {
  label: string
  value: string
}

type FormValues = z.infer<typeof createStockSchema>

type StocksFormProps = {
  editPayload?: StocksType
  isStocksDialogOpen: boolean
  setIsStocksDialogOpen: (value: boolean) => void
}

const DEFAULT_QUERY_PARAMS = {
  page: '1',
  size: '10',
} as const

export function StocksForm({
  editPayload,
  isStocksDialogOpen,
  setIsStocksDialogOpen,
}: StocksFormProps) {
  // State
  const [pending, setPending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [brokerSearchTerm, setBrokerSearchTerm] = useState('')
  const [options, setOptions] = useState<OptionType[]>([])
  const [brokerOptions, setBrokerOptions] = useState<OptionType[]>([])
  const { portfolioDetails } = usePortfolioStore()

  // Debounce the search terms
  const debouncedSearchTerm = useDebounce(searchTerm)
  const debouncedBrokerSearchTerm = useDebounce(brokerSearchTerm)

  // Store and Queries
  const { mutate: createBasket } = useCreateStockPost()
  const { data: tickersData, isFetching: isTickersFetching } =
    useFetchTickersData({
      search: debouncedSearchTerm,
      ...DEFAULT_QUERY_PARAMS,
      symbolType: 'stock',
    })
  const { data: brokersData, isFetching: isBrokersFetching } =
    useFetchBrokersData({
      search: debouncedBrokerSearchTerm,
      ...DEFAULT_QUERY_PARAMS,
    })

  const selectedBasketId = useMemo(
    () => portfolioDetails.id,
    [portfolioDetails],
  )

  // Form Setup
  const form = useForm<FormValues>({
    resolver: zodResolver(createStockSchema),
    defaultValues: {
      portfolioId: selectedBasketId,
      tickerId: editPayload?.stock_baskets?.tickerId || '',
      brokerId: editPayload?.brokerId || '',
      buyPrice: editPayload?.buyPrice || 0,
      quantity: editPayload?.quantity || 0,
      totalInvested: editPayload?.totalInvested || 0,
      notes: editPayload?.notes || '',
    },
    mode: 'onBlur',
  })

  const { setValue, watch, reset, control, handleSubmit } = form
  const [buyPrice, quantity, tickerId] = watch([
    'buyPrice',
    'quantity',
    'tickerId',
  ])

  // Add this to debug form errors
  console.log('Form errors:', form.formState.errors)

  // Handlers
  const handleClose = useCallback(() => {
    setIsStocksDialogOpen(false)
    reset()
  }, [setIsStocksDialogOpen, reset])

  const handleCreateStock = useCallback(
    (data: FormValues) => {
      if (!portfolioDetails.id) {
        toast.error('Please select a basket')
        return
      }

      const payload: CreateStockPayload = {
        portfolioId: portfolioDetails.id,
        tickerId: data.tickerId,
        buyPrice: data.buyPrice,
        quantity: data.quantity,
        totalInvested: data.totalInvested,
        brokerId: data.brokerId,
        notes: data.notes,
      }
      console.log('payload', payload)
      createBasket({
        data: payload,
        successTrigger: handleClose,
      })
    },
    [portfolioDetails.id, createBasket, handleClose],
  )

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setPending(true)
        if (!editPayload) {
          handleCreateStock(data)
        }
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error('Failed to submit form')
      } finally {
        setPending(false)
      }
    },
    [editPayload, handleCreateStock],
  )

  // Effects
  useEffect(() => {
    if (tickersData) {
      const formattedOptions = tickersData.data.map(item => ({
        label: `${item.shortName} (${item.symbolId})`,
        value: item.symbolId,
      }))
      console.log('formattedOptions', formattedOptions)
      setOptions(formattedOptions)
    }
  }, [tickersData])

  useEffect(() => {
    if (brokersData) {
      const formattedOptions = brokersData.data.map(item => ({
        label: item.brokerName,
        value: item.id,
      }))
      setBrokerOptions(formattedOptions)
    }
  }, [brokersData])

  useEffect(() => {
    if (buyPrice && quantity) {
      const total = Number(buyPrice) * Number(quantity)
      setValue('totalInvested', total)
    }
  }, [buyPrice, quantity, setValue])

  const { stocks } = useStockStore()

  useEffect(() => {
    if (tickerId && stocks?.[tickerId]?.currentPrice) {
      setValue('buyPrice', stocks[tickerId].currentPrice)
    }
  }, [tickerId, setValue, stocks])

  const renderFormFields = () => (
    <>
      <FormReactSelect
        control={control}
        name="tickerId"
        label="Ticker Name"
        options={options}
        placeholder="Select a ticker"
        setSearchTerm={setSearchTerm}
        searchText={searchTerm}
        isFetching={isTickersFetching || searchTerm !== debouncedSearchTerm}
        required
        icon={
          <TicketCheck className="absolute left-2 top-[21%] h-6 w-5 text-muted-foreground" />
        }
      />
      <div className="flex gap-4">
        <FormInput
          name="buyPrice"
          control={control}
          label="Buy Price (₹)"
          placeholder="Enter buy price"
          type="number"
          convertToString
          required
          icon={
            <BadgeIndianRupee className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
          }
        />
        <FormInput
          name="quantity"
          control={control}
          label="Quantity"
          placeholder="Enter quantity"
          type="number"
          convertToString
          required
        />
      </div>
      <FormInput
        name="totalInvested"
        control={control}
        label="Invested Amount"
        placeholder="0.00"
        type="number"
        disabled
        icon={
          <BadgeIndianRupee className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
        }
      />
      <FormReactSelect
        control={control}
        name="brokerId"
        label="Broker Name"
        options={brokerOptions}
        placeholder="Select a broker"
        setSearchTerm={setBrokerSearchTerm}
        searchText={brokerSearchTerm}
        required
        isFetching={isBrokersFetching}
        icon={
          <Handshake className="absolute left-2 top-[21%] h-6 w-5 text-muted-foreground" />
        }
      />

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  placeholder="Add any additional notes"
                  className="h-44 pl-8"
                />
                <NotepadText className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <Dialog open={isStocksDialogOpen} onOpenChange={setIsStocksDialogOpen}>
      <DialogContent className="w-[95vw] ">
        <DialogHeader className="space-y-1 flex flex-row items-start justify-center gap-5 bg-blue-600 p-4 rounded-lg">
          {/* <DialogTitle className="text-2xl font-bold flex items-center gap-2">
						<TrendingUp className="w-5 h-5 text-primary" />
						{editPayload ? 'Edit Stock' : ` Create Stock`}
					</DialogTitle> */}
          <div className="flex items-center justify-center h-full">
            {/* <TrendingUp className="w-5 h-5 text-primary" /> */}
            <div className="flex items-center justify-center h-5/6 w-full bg-slate-300 rounded-full p-4 ">
              <TrendingUp
                size={30}
                strokeWidth={4}
                absoluteStrokeWidth
                className="text-green-600"
              />
            </div>
          </div>
          <div className="flex justify-center flex-col space-x-2">
            <DialogTitle className="text-2xl">Add Stock</DialogTitle>
            <p className="m-0 text-sm text-gray-300">
              {editPayload
                ? 'Edit the stock details'
                : 'Enter the details of the stock you want to add to your portfolio.'}
            </p>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-h-[80vh] overflow-y-auto  w-full p-2"
          >
            {renderFormFields()}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={handleClose}
                className="text-white text-lg transition-colors duration-300 bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="text-white text-lg transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 w-full"
              >
                {editPayload
                  ? pending
                    ? 'Updating...'
                    : 'Update'
                  : pending
                    ? 'Creating...'
                    : 'Create Stock'}
              </Button>
              {/* <Button
								type="button"
								onClick={() => {
									console.log('Form values basketId:', form.getValues());
									console.log('Form errors:', form.formState.errors);
									console.log('Selected basket:', selectedBasketOption);
								}}
							>
								Debug Form
							</Button> */}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default StocksForm
