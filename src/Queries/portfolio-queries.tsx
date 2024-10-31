import {
  // QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  // UseQueryResult,
} from "@tanstack/react-query";
import { useResponseHandler } from "../Context/UseResponseHandler";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
// import { useAuthStore } from "@/Store/AuthStore";
import {
  BasketType,
  StocksType,
  TickerType,
} from "@/pages/Portfolio/portfolio-utils/types";
import { ApiResponse } from "./queries-utils/types";
import { dummyResponse } from "@/lib/utils";

export function useFetchBasketsData(
  search: string,
  page: string,
  size: string
) {
  const { handleResponse } = useResponseHandler();

  return useQuery<ApiResponse<BasketType>, Error>({
    queryKey: ["baskets", { search, page, size }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { search: string; page: string; size: string }
      ];
      const { search, page, size } = params;

      const url = `protected/basket`;
      const response = await handleResponse<ApiResponse<BasketType>>({
        url,
        type: "get",
        payload: { params: { search, page, size } },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useFetchTickersData(
  search: string,
  page: string,
  size: string
) {
  const { handleResponse } = useResponseHandler();

  return useQuery<ApiResponse<TickerType>, Error>({
    queryKey: ["tickers", { search, page, size }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { search: string; page: string; size: string }
      ];
      const { search, page, size } = params;

      const url = `protected/ticker`;
      const response = await handleResponse<ApiResponse<TickerType>>({
        url,
        type: "get",
        payload: { params: { search, page, size } },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useFetchStocksData(
  search: string,
  page: string,
  size: string,
  basketId: string
): UseQueryResult<ApiResponse<StocksType>, Error> {
  const { handleResponse } = useResponseHandler();

  return useQuery<ApiResponse<StocksType>, Error>({
    queryKey: ["stocks", { search, page, size, basketId }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { search: string; page: string; size: string; basketId: string }
      ];
      const { search, page, size, basketId } = params;

      if (basketId === "") {
        return dummyResponse as ApiResponse<StocksType>;
      }

      const url = `protected/stocks`;
      const response = await handleResponse<ApiResponse<StocksType>>({
        url,
        type: "get",
        payload: { params: { search, page, size, basketId } },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useCreateBasketPost() {
  const { handleResponse } = useResponseHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      data: { basketName: string };

      successTrigger: () => void;
    }) => {
      const uploadPayload = {
        data: payload.data,
      };
      return await handleResponse({
        url: "protected/basket/",
        type: "post",
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>,
        },
      });
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: { basketName: string };
        successTrigger: () => void;
      }
    ) => {
      payload.successTrigger();
      toast.success(`Basket created successfully.`);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["baskets"],
        });
      }
    },
  });
}

export function useUpdateBasketPatch() {
  const { handleResponse } = useResponseHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      data: { basketName: string };
      params: { id: string };
      successTrigger: () => void;
    }) => {
      const uploadPayload = {
        data: payload.data,
      };
      return await handleResponse({
        url: `protected/basket/${payload.params.id}`,
        type: "patch",
        payload: {
          ...uploadPayload,
          data: uploadPayload.data,
        },
      });
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: { basketName: string };
        successTrigger: () => void;
        params: { id: string };
      }
    ) => {
      payload.successTrigger();
      toast.success(`Basket updated successfully.`);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["baskets"],
        });
      }
    },
  });
}

export function useDeleteBasketPatch() {
  const { handleResponse } = useResponseHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      params: { id: string };
      successTrigger: () => void;
    }) => {
      return await handleResponse({
        url: `protected/basket/${payload.params.id}`,
        type: "delete",
        payload: undefined,
      });
    },
    onSuccess: (
      _: unknown,
      payload: {
        successTrigger: () => void;
        params: { id: string };
      }
    ) => {
      payload.successTrigger();
      toast.success(`Basket deleted successfully.`);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["baskets"],
        });
      }
    },
  });
}

export function useCreateStockPost() {
  const { handleResponse } = useResponseHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      data: StocksType;
      successTrigger: () => void;
    }) => {
      return await handleResponse({
        url: "protected/stock",
        type: "post",
        payload: {
          data: payload.data,
        },
      });
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: StocksType;
        successTrigger: () => void;
      }
    ) => {
      payload.successTrigger();
      toast.success(`Stock added successfully.`);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["stocks"],
        });
      }
    },
  });
}
