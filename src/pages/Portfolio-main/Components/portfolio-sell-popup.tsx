import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeIndianRupee, TrendingUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCallback, useEffect, useState } from 'react'

import { usePortfolioStore } from '@/Store/PortfolioStore'
import { useSellPortfolioStockPut } from '@/api/hooks'
import { type StockRowDataType } from '@/api/hooks'
import { type SellPortfolioPayload } from '@/api/hooks'
// UI Components
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import FormInput from '@/components/ui/forms/form-input-field'
import { Input } from '@/components/ui/input'
import { sellPortfolioSchema } from '@/schema'

declare global {
  interface Window {
    maxQuantity: number
  }
}

type FormValues = z.infer<typeof sellPortfolioSchema>

interface PortfolioFormProps {
  isPortfolioSellPopupOpen: boolean
  setIsPortfolioSellPopupOpen: (value: boolean) => void
  dataFromParent: StockRowDataType | null
}

export function PortfolioSellPopup({
  isPortfolioSellPopupOpen,
  setIsPortfolioSellPopupOpen,
  dataFromParent,
}: PortfolioFormProps) {
  const [pending, setPending] = useState(false)
  const { portfolioDetails } = usePortfolioStore()

  const { mutate: sellPortfolioStock } = useSellPortfolioStockPut()

  // Set max quantity in window object for validation
  useEffect(() => {
    if (typeof window !== 'undefined' && dataFromParent) {
      window.maxQuantity = dataFromParent.quantity
    }
  }, [dataFromParent])

  const form = useForm<FormValues>({
    resolver: zodResolver(sellPortfolioSchema),
    defaultValues: {
      portfolioId: portfolioDetails?.id || '',
      portfolioBasketId: dataFromParent?.portfolioBasketId || '',
      portfolioBasketStockId: dataFromParent?.id || '',
      brokerId: dataFromParent?.brokerId || '',
      tickerId: dataFromParent?.tickerDetails?.symbolId || '',
      sellQuantity: 0,
      sellPrice: 0,
    },
    mode: 'onBlur',
  })

  const { reset, control, handleSubmit } = form

  const handleClose = useCallback(() => {
    setIsPortfolioSellPopupOpen(false)
    reset()
  }, [setIsPortfolioSellPopupOpen, reset])

  const handleSellPortfolio = useCallback(
    (data: FormValues) => {
      const payload: SellPortfolioPayload = {
        portfolioId: data.portfolioId,
        portfolioBasketId: data.portfolioBasketId,
        portfolioBasketStockId: data.portfolioBasketStockId,
        sellQuantity: data.sellQuantity,
        sellPrice: data.sellPrice,
        brokerId: data.brokerId,
        tickerId: data.tickerId,
      }
      sellPortfolioStock({
        data: payload,
        successTrigger: handleClose,
      })
    },
    [sellPortfolioStock, handleClose],
  )

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        handleSellPortfolio(data)
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error('Failed to submit form')
      } finally {
        setPending(false)
      }
    },
    [handleSellPortfolio],
  )

  const renderFormFields = () => (
    <>
      <FormItem>
        <FormLabel>Symbol</FormLabel>
        <FormControl>
          <div className="relative">
            <TrendingUp className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
            <Input
              className="pl-8"
              type="text"
              disabled={true}
              value={dataFromParent?.tickerDetails?.symbolId}
              placeholder="Symbol"
            />
          </div>
        </FormControl>
      </FormItem>

      <FormInput
        name="sellPrice"
        control={control}
        label="Sell Price"
        placeholder="Enter the sell price"
        type="number"
        icon={
          <BadgeIndianRupee className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
        }
      />
      <FormInput
        name="sellQuantity"
        control={control}
        label="Sell Quantity"
        placeholder="Enter the sell quantity"
        type="number"
        icon={
          <TrendingUp className="absolute left-2 top-[25%] h-6 w-5 text-muted-foreground" />
        }
      />
    </>
  )

  return (
    <Dialog
      open={isPortfolioSellPopupOpen}
      onOpenChange={setIsPortfolioSellPopupOpen}
    >
      <DialogContent className="w-[95vw] ">
        <DialogHeader className="space-y-1 flex flex-row items-start justify-center gap-5 bg-blue-600 p-4 rounded-lg">
          <div className="flex items-center justify-center h-full">
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
            <DialogTitle className="text-2xl">Sell Portfolio</DialogTitle>
            <p className="m-0 text-sm text-gray-300">
              Enter the details to sell the portfolio.
            </p>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-h-[80vh] overflow-y-auto w-full p-2"
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
                {pending ? 'Selling...' : 'Sell Quantity'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioSellPopup
