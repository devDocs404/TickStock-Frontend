import { keepPreviousData } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { UseQueryResult } from '@tanstack/react-query'

import { ApiResponse } from '@/Queries/queries-utils/types'
import { useResponseHandler } from '@/hooks/UseResponseHandler'

type TickerDetailsType = {
  symbolId: string
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

export type StockRowDataType = {
  id: string
  portfolioBasketId: string
  buyPrice: number
  totalInvested: number
  quantity: number
  currency: 'INR' | 'USD' | 'EUR' | 'GBP'
  notes: string
  brokerId: string
  exchangeRate: number
  createdAt: string
  updatedAt: string
  tickerDetails: TickerDetailsType
  broker: string
}

export function useFetchStocksData(
  search: string,
  page: string,
  size: string,
  portfolioId: string,
  portfolioBasketId: string,
): UseQueryResult<ApiResponse<StockRowDataType>, Error> {
  const { handleResponse } = useResponseHandler()

  return useQuery<ApiResponse<StockRowDataType>, Error>({
    queryKey: [
      'stocks',
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

      const url = `protected/get-portfolio-stock-from-basket`
      const response = await handleResponse<ApiResponse<StockRowDataType>>({
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
