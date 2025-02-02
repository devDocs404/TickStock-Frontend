import { keepPreviousData } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { ApiResponse } from '@/Queries/queries-utils/types'
import { useResponseHandler } from '@/hooks/UseResponseHandler'

import { PortfolioStocksResponse } from './types'

export function useFetchPortfolioStocksData(payload: {
  portfolioId: string
  search: string
  page: string
  size: string
}) {
  const { handleResponse } = useResponseHandler()
  const { search, page, size, portfolioId } = payload

  return useQuery<ApiResponse<PortfolioStocksResponse>, Error>({
    queryKey: ['portfolio-stocks', { portfolioId, search, page, size }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          portfolioId: string
          search: string
          page: string
          size: string
        },
      ]
      const { search, page, size, portfolioId } = params

      const url = `protected/get-portfolio-basket`
      const response = await handleResponse<
        ApiResponse<PortfolioStocksResponse>
      >({
        url,
        type: 'get',
        payload: { params: { portfolioId, search, page, size } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    enabled: !!portfolioId,
  })
}
