import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useResponseHandler } from '@/hooks/UseResponseHandler'

export type SellPortfolioPayload = {
  portfolioId: string
  portfolioBasketId: string
  portfolioBasketStockId: string
  sellQuantity: number
  sellPrice: number
  brokerId: string
  tickerId: string
}

export function useSellPortfolioStockPut() {
  const { handleResponse } = useResponseHandler()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      data: SellPortfolioPayload
      successTrigger: () => void
    }) => {
      return await handleResponse({
        url: 'protected/sell-stock-to-portfolio-basket',
        type: 'put',
        payload: {
          data: payload.data,
        },
      })
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: SellPortfolioPayload
        successTrigger: () => void
      },
    ) => {
      payload.successTrigger()
      toast.success(`Portfolio stock sold successfully.`)
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['stocks'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['portfolio'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['portfolio-stocks'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['portfolio-stocks-records'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['portfolio-archives'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['portfolio-overview'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['portfolio-transactions'],
        })
      }
    },
  })
}
