export interface Product {
  id: string;
  title: string;
  name: string;
  price: number | null;
  imageUrl: string;
  url: string;
  platform: string;
  category?: string;
  salesCount?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  // Additional optional fields for enhanced functionality
  description?: string;
  brand?: string;
  availability?: string;
  shippingInfo?: string;
  tags?: string[];
  originalPrice?: string;
  discount?: number;
  stock?: number;
  seller?: string;
  location?: string;
  specifications?: Record<string, unknown>;
  competitionLevel?: 'high' | 'medium' | 'low';
  alibabaPrice?: number;
  growthRate?: number;
  estimatedMargin?: number;
}

// Raw product data from API (may have missing fields)
export interface RawProductData {
  id?: string;
  title?: string;
  name?: string;
  price?: string | number;
  image?: string;
  imageUrl?: string;
  salesCount?: string | number;
  growthRate?: string | number;
  estimatedMargin?: string | number;
  link?: string;
  url?: string;
  platform?: string;
  description?: string;
  brand?: string;
  category?: string;
  availability?: string;
  rating?: string | number;
  reviewCount?: string | number;
  shippingInfo?: string;
  tags?: string[];
  originalPrice?: string;
  discount?: string | number;
  stock?: string | number;
  seller?: string;
  location?: string;
  specifications?: Record<string, unknown>;
  competitionLevel?: 'high' | 'medium' | 'low';
  alibabaPrice?: string | number;
}

// Product API response structure
export interface ProductApiResponse {
  success: boolean;
  products?: RawProductData[];
  message?: string;
  error?: string;
}

export interface PopularProductsResponse {
  popularProducts: Product[];
}

// Unified API response format
export interface ProductApiResponse {
  products: Product[];
  message?: string;
  success?: boolean;
  total?: number;
  platform?: string;
}

// Platform configuration interface
export interface PlatformConfig {
  id: string;
  name: string;
  hasApiKey: boolean;
  endpoint: string;
  enabled: boolean;
}

export interface ProductFilters {
  platform?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  competitionLevel?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}
