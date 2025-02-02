import { keepPreviousData } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { UseQueryResult } from '@tanstack/react-query'

import { ApiResponse } from '@/Queries/queries-utils/types'
import { useResponseHandler } from '@/hooks/UseResponseHandler'

export type TickerDetailsType = {
  id: string
  yahooSymbol: string
  sector: string
  industry: string
  currency: string
  longName: string
  shortName: string
  exchange: string
  type: string
  isActive: number
}

export type PortfolioStocksResponse = {
  id: string
  portfolioId: string
  tickerId: string
  targetAllocation: number
  totalStocks: number
  currentAllocation: number
  notes: string
  createdAt: string
  updatedAt: string
  deletedAt: number
  tickerDetails?: TickerDetailsType
}

export function useFetchPortfolioArchives(
  search: string,
  page: string,
  size: string,
  portfolioId: string,
  portfolioBasketId: string,
): UseQueryResult<ApiResponse<PortfolioStocksResponse>, Error> {
  const { handleResponse } = useResponseHandler()

  return useQuery<ApiResponse<PortfolioStocksResponse>, Error>({
    queryKey: [
      'portfolio-archives',
      { search, page, size, portfolioId, portfolioBasketId },
    ],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          search: string
          page: string
          size: string
          portfolioId: string
          portfolioBasketId: string
        },
      ]
      const { search, page, size, portfolioId, portfolioBasketId } = params

      const url = `protected/get-portfolio-archived-transactions`
      const response = await handleResponse<
        ApiResponse<PortfolioStocksResponse>
      >({
        url,
        type: 'get',
        payload: {
          params: { search, page, size, portfolioId, portfolioBasketId },
        },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: portfolioId.length > 0 && portfolioBasketId.length > 0,
  })
}
