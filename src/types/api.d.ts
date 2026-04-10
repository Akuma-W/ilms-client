export interface APIResponse<T> {
  success: boolean;
  message: string;
  statusCode?: number;
  error?: string;
  data: T | null;
}

export type PromiseResponse<T> = Promise<APIResponse<T>>;

export interface QueryResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
