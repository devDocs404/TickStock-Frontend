import { keepPreviousData } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { ApiResponse } from '@/Queries/queries-utils/types'
import { useResponseHandler } from '@/hooks/UseResponseHandler'

export type PortfolioType = {
  id: string
  name: string
  description: string
  type: string
  strategy: string
  riskLevel: number
  totalInvested: number
}

export function useFetchPortfolioData(payload: {
  search: string
  page: string
  size: string
  // brokerId?: string
}) {
  const { handleResponse } = useResponseHandler()
  const { search, page, size } = payload

  return useQuery<ApiResponse<PortfolioType>, Error>({
    queryKey: ['portfolio', { search, page, size }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          search: string
          page: string
          size: string
        },
      ]
      const { search, page, size } = params

      const url = `protected/portfolio`
      const response = await handleResponse<ApiResponse<PortfolioType>>({
        url,
        type: 'get',
        payload: { params: { search, page, size } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
  })
}
