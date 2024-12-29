import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { useResponseHandler } from '@/hooks/UseResponseHandler'

interface PasswordResetPayload {
  data: { data: { password: string } }
  params: { id: string }
}

export function useAuthPasswordResetUpdate(
  options?: UseMutationOptions<void, Error, PasswordResetPayload>,
) {
  const { handleResponse } = useResponseHandler()

  return useMutation({
    mutationFn: async (payload: PasswordResetPayload) => {
      await handleResponse({
        url: `/edit-user/${payload.params.id}`,
        type: 'patch',
        payload: payload.data,
      })
    },
    ...options,
  })
}
