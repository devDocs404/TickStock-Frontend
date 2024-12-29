import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query'
import { keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useResponseHandler } from '@/hooks/UseResponseHandler'

export function useResetPasswordPatch() {
  const { handleResponse } = useResponseHandler()

  return useMutation({
    mutationFn: async (payload: {
      data: { password: string }
      params: { id: string }
      successTrigger: () => void
    }) => {
      const uploadPayload = {
        data: payload.data,
      }
      return await handleResponse({
        url: `/edit-user/${payload.params.id}`,
        type: 'patch',
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>,
        },
      })
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: { password: string }
        params: { id: string }
        successTrigger: () => void
      },
    ) => {
      payload.successTrigger()
      toast.success(`Password reset successfully.`)
    },
  })
}

interface VerifyEmailPayload {
  params: {
    id: string
  }
  setAlreadyVerified: (value: boolean) => void
}

interface VerifyEmailResponse {
  message: string
  status: number
}

export function useVerifyEmail(
  payload: VerifyEmailPayload,
): UseQueryResult<VerifyEmailResponse, Error> {
  const { handleResponse } = useResponseHandler()

  return useQuery<VerifyEmailResponse, Error>({
    queryKey: ['verifyEmail', payload.params.id],
    queryFn: async () => {
      const url = `verify-account/${payload.params.id}`
      try {
        const response = await handleResponse<string>({
          url,
          type: 'get',
        })
        console.log(response, 'response')
        return {
          message: response.data,
          status: response.status,
        }
      } catch (error) {
        // Handle the error properly
        if (error instanceof Error) {
          throw new Error(error.message || 'An unexpected error occurred')
        } else {
          throw new Error('An unexpected error occurred')
        }
      }
    },
    placeholderData: keepPreviousData,
    retry: false,
  })
}
