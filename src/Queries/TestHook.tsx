import { useQuery } from "@tanstack/react-query";
import { useResponseHandler } from "../Context/UseResponseHandler";

// Define the type for the payload, you might need to adjust it based on your actual data structure
interface FetchPropertyTransactionsPayload {
  params?: Record<string, unknown>; // Adjust as needed
}

interface FetchPropertyTransactionsOptions<T = unknown> {
  queryKey: string; // Renamed for clarity
  endpoint: string;
  payload?: FetchPropertyTransactionsPayload; // Optional
  type: "get" | "post" | "put" | "delete";
  onSuccess?: (data: T) => void; // Replace 'T' with the actual response type if known
}

const fetchData = async <T,>(
  endpoint: string,
  payload: FetchPropertyTransactionsPayload,
  type: "get" | "post" | "put" | "delete",
  handleResponse: (options: {
    url: string;
    payload: FetchPropertyTransactionsPayload;
    type: "get" | "post" | "put" | "delete";
  }) => Promise<T>
): Promise<T> => {
  const response = await handleResponse({
    url: endpoint,
    payload,
    type,
  });
  return response;
};

const useFetchPropertyTransactions = <T,>({
  queryKey,
  endpoint,
  payload = {}, // Default to empty object if payload is not provided
  type,
  onSuccess,
}: FetchPropertyTransactionsOptions<T>) => {
  const { handleResponse } = useResponseHandler();

  return useQuery<T, Error>({
    queryKey: [queryKey, endpoint, payload],
    queryFn: () => fetchData(endpoint, payload, type, handleResponse),
    ...(onSuccess && { onSuccess }),
    placeholderData: undefined,
  });
};

export { useFetchPropertyTransactions };
