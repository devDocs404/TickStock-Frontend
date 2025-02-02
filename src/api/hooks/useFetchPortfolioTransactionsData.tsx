import { keepPreviousData } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { ApiResponse } from '@/Queries/queries-utils/types'
import { useResponseHandler } from '@/hooks/UseResponseHandler'

export type PortfolioTransactionsResponse = {
  id: string
  tradeType: string
  quantity: number
  price: number
  totalAmount: number
  currency: string
  game: string
  portfolioId: string
  portfolioBasketId: string
  portfolioBasketStocksId: string
  userId: string
  brokerId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export function useFetchPortfolioTransactionsData(payload: {
  portfolioId: string
  page: string
  size: string
}) {
  const { handleResponse } = useResponseHandler()
  const { page, size, portfolioId } = payload

  return useQuery<ApiResponse<PortfolioTransactionsResponse>, Error>({
    queryKey: ['portfolio-transactions', { portfolioId, page, size }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          portfolioId: string
          page: string
          size: string
        },
      ]
      const { page, size, portfolioId } = params

      const url = `protected/get-portfolio-transactions`
      const response = await handleResponse<
        ApiResponse<PortfolioTransactionsResponse>
      >({
        url,
        type: 'get',
        payload: { params: { portfolioId, page, size } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    enabled: !!portfolioId,
  })
}
