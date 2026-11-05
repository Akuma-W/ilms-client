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

export type APIResponse<T> = ApiResponse<T>;
export type PromiseResponse<T> = Promise<ApiResponse<T>>;

export interface QueryResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}
