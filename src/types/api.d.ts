export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode?: number;
  error?: string;
  data: T | null;
}

export type PromiseResponse<T> = Promise<ApiResponse<T>>;

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
