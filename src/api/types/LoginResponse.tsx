interface Authorization {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  authorization: Authorization
  userInfo: unknown[]
}

export type metaDataType = {
  page: number
  size: number
  totalItems: number
  totalPages: number
}
export type PaginationType = {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  pageSize: number
  totalItems: number
  totalPages: number
  totalCumulativeCount?: number
  cumulativeCount?: number
}
