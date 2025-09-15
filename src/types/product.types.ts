export interface Product {
  id: string;
  title: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  salesCount?: number;
  growthRate?: number;
  estimatedMargin?: number;
  link?: string;
  url?: string;
  platform: string;
  description?: string;
  brand?: string;
  category?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  shippingInfo?: string;
  tags?: string[];
  originalPrice?: string;
  discount?: number;
  stock?: number;
  seller?: string;
  location?: string;
  specifications?: Record<string, any>;
  competitionLevel?: 'high' | 'medium' | 'low';
  alibabaPrice?: number;
}

export interface PopularProductsResponse {
  popularProducts: Product[];
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
