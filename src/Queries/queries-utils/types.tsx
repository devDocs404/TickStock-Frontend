export type metaDataType = {
  page: number
  size: number
  totalItems: number
  totalPages: number
}
export type PaginationType = {
  currentPage: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  pageSize: string
  totalItems: string
  totalPages: string
  totalCumulativeCount?: string
  cumulativeCount?: number
}
export type ApiResponse<T> = {
  data: T[]
  pagination: PaginationType
}
