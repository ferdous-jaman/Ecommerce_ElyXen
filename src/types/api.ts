export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  count?: number;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SortParams = {
  column: string;
  ascending?: boolean;
};

export type FilterParams = Record<string, string | number | boolean | null>;

export type QueryParams = PaginationParams & {
  sort?: SortParams;
  filters?: FilterParams;
  search?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error: string | null;
};

export function createApiResponse<T>(
  data: T | null,
  error: string | null = null,
  count?: number
): ApiResponse<T> {
  return { data, error, count };
}

export function createPaginatedResponse<T>(
  data: T[],
  count: number,
  page: number,
  pageSize: number,
  error: string | null = null
): PaginatedResponse<T> {
  return {
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
    error,
  };
}
