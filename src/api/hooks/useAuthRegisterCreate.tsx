import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { useResponseHandler } from '@/hooks/UseResponseHandler'

interface RegisterPayload {
  data: {
    email: string
    password: string
    firstName: string
    lastName: string
    mobileNumber: string
    role: string
  }
}

export function useAuthRegisterCreate(
  options?: UseMutationOptions<void, Error, RegisterPayload>,
) {
  const { handleResponse } = useResponseHandler()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await handleResponse({
        url: 'signup',
        type: 'post',
        payload: payload,
      })
    },
    ...options,
  })
}
