// Product types
export * from './product.types';

// User types
export * from './user.types';

// Order types
export * from './order.types';

// Automation types
export * from './automation.types';

// Cart types
export * from './cart.types';

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: PaginationMeta;
}
