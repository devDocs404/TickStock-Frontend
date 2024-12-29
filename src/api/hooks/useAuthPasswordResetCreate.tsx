import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { useResponseHandler } from '@/hooks/UseResponseHandler'

interface PasswordResetPayload {
  data: { email: string }
}

export function useAuthPasswordResetCreate(
  options?: UseMutationOptions<void, Error, PasswordResetPayload>,
) {
  const { handleResponse } = useResponseHandler()

  return useMutation({
    mutationFn: async (payload: PasswordResetPayload) => {
      await handleResponse({
        url: 'forget-password',
        type: 'post',
        payload: payload,
      })
    },
    ...options,
  })
}
