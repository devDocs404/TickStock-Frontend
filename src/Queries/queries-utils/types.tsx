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
export type ApiResponse<T> = {
  data: T[]
  pagination: PaginationType
}
