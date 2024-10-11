import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useResponseHandler } from "../Context/UseResponseHandler";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/Store/AuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Payload {
  params: Record<string, unknown>;
}

interface TransactionData {
  id: string;
  amount: number;
}

export function useFetchPropertyTransactions(
  payload: Payload
): UseQueryResult<TransactionData[], Error> {
  const { handleResponse } = useResponseHandler();

  return useQuery({
    queryKey: ["propertyWithIDLetin", payload],
    queryFn: async () => {
      const response = await handleResponse({
        url: "transaction/ptransaction_debit/v1/",
        type: "get",
        payload: { params: payload.params },
      });
      return response as TransactionData[];
    },
    placeholderData: keepPreviousData,
  });
}

export function useLoginPost() {
  const { handleResponse } = useResponseHandler();
  const { setField } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const uploadPayload = {
        data: payload,
      };
      return handleResponse({
        url: "auth/login",
        type: "post",
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>, // Ensure data is correctly typed
        },
      });
    },
    onSuccess: (response) => {
      toast.success(`Login successful.`);
      setField("user", response?.data?.user);
      setField("refreshToken", response?.auth?.refreshToken);
      setField("accessToken", response?.auth?.accessToken);
      navigate("/");
    },
    onError: (error: {
      status?: number;
      response?: { data?: { errors?: string[] } };
    }) => {
      if (error?.status === 401) {
        toast.error(error.response?.data?.errors?.[0]);
      } else {
        toast.error("Error occurred with login.");
      }
    },
    // onSettled: async (_, error) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     await queryClient.invalidateQueries({
    //       queryKey: ["properties"],
    //     });
    //   }
    // },
  });
}

// export function useAddCookie() {
//   const { handleResponse } = useResponseHandler();

//   return useMutation({
//     mutationFn: async () => {
//       return await ;
//     },
//   });
// }
