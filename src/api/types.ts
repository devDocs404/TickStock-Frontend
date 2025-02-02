import { AxiosError } from 'axios'

export interface ApiErrorResponse {
  message: string
  code?: string
  details?: Record<string, unknown>
}

export type ApiError = AxiosError<ApiErrorResponse>
