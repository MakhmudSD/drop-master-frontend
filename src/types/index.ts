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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: PaginationMeta;
}

export interface ProductStats {
  totalProducts: number;
  draftProducts: number;
  confirmedProducts: number;
  uploadedProducts: number;
  platformStats: Array<{ _id: string; count: number }>;
  categoryStats: Array<{ _id: string; count: number }>;
}

export interface ScrapingRun {
  _id: string;
  userId: string;
  platform: string;
  runId: string;
  status: string;
  keywords?: string[];
  categories?: string[];
  maxResults: number;
  results?: any[];
  errorMessage?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
