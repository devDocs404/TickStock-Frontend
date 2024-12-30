import {
  UseQueryResult,
  // UseQueryResult,
  // QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useResponseHandler } from '@/hooks/UseResponseHandler'
// import { dummyResponse } from '@/lib/utils'
// import { useAuthStore } from "@/Store/AuthStore";
import {
  BasketType,
  BrokerType,
  CreateStockPayload,
  StockBasketDetailsType,
  StocksType,
  TickerType,
} from '@/pages/Portfolio/portfolio-utils/types'

import { ApiResponse } from './queries-utils/types'

export function useFetchBasketsData(
  search: string,
  page: string,
  size: string,
) {
  const { handleResponse } = useResponseHandler()

  return useQuery<ApiResponse<BasketType>, Error>({
    queryKey: ['baskets', { search, page, size }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { search: string; page: string; size: string },
      ]
      const { search, page, size } = params

      const url = `protected/basket`
      const response = await handleResponse<ApiResponse<BasketType>>({
        url,
        type: 'get',
        payload: { params: { search, page, size } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useFetchTickersData(payload: {
  search: string
  page: string
  size: string
  symbolId?: string
  symbolType?: string
}) {
  const { handleResponse } = useResponseHandler()
  const { search, page, size, symbolId, symbolType } = payload
  return useQuery<ApiResponse<TickerType>, Error>({
    queryKey: ['tickers', { search, page, size, symbolId, symbolType }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          search: string
          page: string
          size: string
          symbolId?: string
          symbolType?: string
        },
      ]
      const { search, page, size, symbolId, symbolType } = params

      const url = `protected/ticker`
      const response = await handleResponse<ApiResponse<TickerType>>({
        url,
        type: 'get',
        payload: { params: { search, page, size, symbolId, symbolType } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useFetchStocksData(
  search: string,
  page: string,
  size: string,
  basketId: string,
  stockBasketId: string,
): UseQueryResult<ApiResponse<StocksType>, Error> {
  const { handleResponse } = useResponseHandler()

  return useQuery<ApiResponse<StocksType>, Error>({
    queryKey: ['stocks', { search, page, size, basketId, stockBasketId }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { search: string; page: string; size: string; basketId: string },
      ]
      const { search, page, size, basketId } = params

      const url = `protected/get-stock-records`
      const response = await handleResponse<ApiResponse<StocksType>>({
        url,
        type: 'get',
        payload: { params: { search, page, size, basketId, stockBasketId } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: !!basketId && stockBasketId !== '',
  })
}
// export function useFetchStockBasketsData(
// 	search: string,
// 	page: string,
// 	size: string,
// 	basketId: string
// ): UseQueryResult<ApiResponse<StockBasketDetailsType>, Error> {
// 	const { handleResponse } = useResponseHandler();

// 	return useQuery<ApiResponse<StockBasketDetailsType>, Error>({
// 		queryKey: ['stocksBaskets', { search, page, size, basketId }],
// 		queryFn: async () => {
// 			const url = `protected/get-stock-basket`;
// 			const response = await handleResponse<
// 				ApiResponse<StockBasketDetailsType>
// 			>({
// 				url,
// 				type: 'get',
// 				payload: { params: { search, page, size, basketId } },
// 			});
// 			return response.data;
// 		},
// 		placeholderData: keepPreviousData,
// 		retry: false,
// 	});
// }

export function useFetchStockBasketsData(
  search: string,
  page: string,
  size: string,
  basketId: string | undefined,
): UseQueryResult<ApiResponse<StockBasketDetailsType>, Error> {
  const { handleResponse } = useResponseHandler()
  return useQuery<ApiResponse<StockBasketDetailsType>, Error>({
    queryKey: ['stocksBaskets', { search, page, size, basketId }],
    queryFn: async () => {
      const url = `protected/get-stock-basket`
      const response = await handleResponse<
        ApiResponse<StockBasketDetailsType>
      >({
        url,
        type: 'get',
        payload: { params: { search, page, size, basketId } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
    enabled: !!basketId,
  })
}

export function useCreateBasketPost() {
  const { handleResponse } = useResponseHandler()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      data: {
        name: string
        description: string | null
        type: string | null
        strategy: string | null
        riskLevel: string | null
      }
      successTrigger: () => void
    }) => {
      const uploadPayload = {
        data: payload.data,
      }
      return await handleResponse({
        url: 'protected/basket/',
        type: 'post',
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>,
        },
      })
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: {
          name: string
          description: string | null
          type: string | null
          strategy: string | null
          riskLevel: string | null
        }
        successTrigger: () => void
      },
    ) => {
      payload.successTrigger()
      toast.success(`Basket created successfully.`)
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['baskets'],
        })
      }
    },
  })
}

export function useUpdateBasketPatch() {
  const { handleResponse } = useResponseHandler()
  const queryClient = useQueryClient()
  console.log('update basket patch')

  return useMutation({
    mutationFn: async (payload: {
      data: {
        name: string
        description: string | null
        type: string | null
        strategy: string | null
        riskLevel: string | null
      }
      params: { id: string }
      successTrigger: () => void
    }) => {
      console.log('upload payload', payload)
      const uploadPayload = {
        data: payload.data,
      }
      return await handleResponse({
        url: `protected/basket`,
        type: 'patch',
        payload: {
          data: uploadPayload.data,
          params: payload.params,
        },
      })
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: {
          name: string
          description: string | null
          type: string | null
          strategy: string | null
          riskLevel: string | null
        }
        successTrigger: () => void
        params: { id: string }
      },
    ) => {
      payload.successTrigger()
      toast.success(`Basket updated successfully.`)
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['baskets'],
        })
      }
    },
  })
}

export function useDeleteBasketPatch() {
  const { handleResponse } = useResponseHandler()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      params: { id: string }
      successTrigger: () => void
    }) => {
      return await handleResponse({
        url: `protected/basket/${payload.params.id}`,
        type: 'delete',
        payload: undefined,
      })
    },
    onSuccess: (
      _: unknown,
      payload: {
        successTrigger: () => void
        params: { id: string }
      },
    ) => {
      payload.successTrigger()
      toast.success(`Basket deleted successfully.`)
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['baskets'],
        })
      }
    },
  })
}

export function useCreateStockPost() {
  const { handleResponse } = useResponseHandler()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      data: CreateStockPayload
      successTrigger: () => void
    }) => {
      console.log('create stock payload', payload)
      return await handleResponse({
        url: 'protected/stock-basket',
        type: 'post',
        payload: {
          data: payload.data,
        },
      })
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: CreateStockPayload
        successTrigger: () => void
      },
    ) => {
      payload.successTrigger()
      toast.success(`Stock added successfully.`)
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['stocksBaskets'],
        })
      }
    },
  })
}

export function useFetchBrokersData(payload: {
  search: string
  page: string
  size: string
  brokerId?: string
}) {
  const { handleResponse } = useResponseHandler()
  const { search, page, size, brokerId } = payload
  return useQuery<ApiResponse<BrokerType>, Error>({
    queryKey: ['brokers', { search, page, size, brokerId }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          search: string
          page: string
          size: string
          brokerId?: string
        },
      ]
      const { search, page, size, brokerId } = params

      const url = `protected/broker`
      const response = await handleResponse<ApiResponse<BrokerType>>({
        url,
        type: 'get',
        payload: { params: { search, page, size, brokerId } },
      })
      return response.data
    },
    placeholderData: keepPreviousData,
  })
}
