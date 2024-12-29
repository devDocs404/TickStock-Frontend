import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { useResponseHandler } from '@/hooks/UseResponseHandler'

interface LoginPayload {
  data: { email: string; password: string }
}

interface Authorization {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  authorization: Authorization
  userInfo: unknown[]
}

export function useAuthLoginCreate(
  options?: UseMutationOptions<LoginResponse, Error, LoginPayload>,
) {
  const { handleResponse } = useResponseHandler()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await handleResponse({
        url: 'login',
        type: 'post',
        payload: payload,
      })
      return response.data as LoginResponse
    },
    ...options,
  })
}
