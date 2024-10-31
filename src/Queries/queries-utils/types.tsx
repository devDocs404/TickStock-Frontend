export interface PaginationType {
  currentPage: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: string;
  totalItems: string;
  totalPages: string;
  totalCumulativeCount?: string;
}
export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationType;
}
