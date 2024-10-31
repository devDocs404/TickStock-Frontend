import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useResponseHandler } from '../Context/UseResponseHandler';
import { keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/Store/AuthStore';
import { useNavigate } from 'react-router-dom';

interface Authorization {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  authorization: Authorization;
  userInfo: unknown[];
}

export function useLoginPost() {
  const { handleResponse } = useResponseHandler();
  const { setField } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, unknown>({
    mutationFn: async (payload: unknown) => {
      const uploadPayload = {
        data: payload,
      };
      // Ensure handleResponse returns the expected type
      const response = await handleResponse<LoginResponse>({
        url: 'login',
        type: 'post',
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>,
        },
      });
      return response.data;
    },
    onSuccess: response => {
      toast.success(`Login successful.`);
      setField('user', response.userInfo);
      setField('refreshToken', response.authorization.refreshToken);
      setField('accessToken', response.authorization.accessToken);
      navigate('/');
    },
  });
}
export function useForgetPasswordPost() {
  const { handleResponse } = useResponseHandler();

  return useMutation({
    mutationFn: async (payload: {
      data: { email: string };
      successTrigger: () => void;
    }) => {
      const uploadPayload = {
        data: payload.data,
      };
      return await handleResponse({
        url: 'forget-password',
        type: 'post',
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>,
        },
      });
    },
    onSuccess: (
      _: unknown,
      payload: { data: { email: string }; successTrigger: () => void },
    ) => {
      payload.successTrigger();
      toast.success(`Your reset password link has been sent to your email.`);
    },
  });
}

export function useResetPasswordPatch() {
  const { handleResponse } = useResponseHandler();

  return useMutation({
    mutationFn: async (payload: {
      data: { password: string };
      params: { id: string };
      successTrigger: () => void;
    }) => {
      const uploadPayload = {
        data: payload.data,
      };
      return await handleResponse({
        url: `/edit-user/${payload.params.id}`,
        type: 'patch',
        payload: {
          ...uploadPayload,
          data: uploadPayload.data as Record<string, unknown>,
        },
      });
    },
    onSuccess: (
      _: unknown,
      payload: {
        data: { password: string };
        params: { id: string };
        successTrigger: () => void;
      },
    ) => {
      payload.successTrigger();
      toast.success(`Password reset successfully.`);
    },
  });
}

interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}
export function useSignupPost({
  setIsLogin,
}: {
  setIsLogin: (state: boolean) => void;
}) {
  const { handleResponse } = useResponseHandler();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      return await handleResponse({
        url: 'signup',
        type: 'post',
        payload: { data: { ...payload } },
      });
    },
    onSuccess: () => {
      setIsLogin(true);
      toast.success(
        `Mail has been sent to your email. Please verify your email.`,
      );
    },
  });
}

interface VerifyEmailPayload {
  params: {
    id: string;
  };
  setAlreadyVerified: (value: boolean) => void;
}

interface VerifyEmailResponse {
  message: string;
  status: number;
}

export function useVerifyEmail(
  payload: VerifyEmailPayload,
): UseQueryResult<VerifyEmailResponse, Error> {
  const { handleResponse } = useResponseHandler();

  return useQuery<VerifyEmailResponse, Error>({
    queryKey: ['verifyEmail', payload.params.id],
    queryFn: async () => {
      const url = `verify-account/${payload.params.id}`;
      try {
        const response = await handleResponse<string>({
          url,
          type: 'get',
        });
        console.log(response, 'response');
        return {
          message: response.data,
          status: response.status,
        };
      } catch (error) {
        // Handle the error properly
        if (error instanceof Error) {
          throw new Error(error.message || 'An unexpected error occurred');
        } else {
          throw new Error('An unexpected error occurred');
        }
      }
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}
