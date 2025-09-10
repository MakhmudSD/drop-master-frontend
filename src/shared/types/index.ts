export interface User {
  _id: string;
  id?: string; // For backward compatibility
  email: string;
  name: string;
  password?: string;
  profileImage?: string;
  provider?: 'google' | 'kakao' | 'naver' | 'local';
  googleId?: string;
  kakaoId?: string;
  naverId?: string;
  preferences?: {
    language: string;
    currency: string;
  };
  role: string;
  isActive: boolean;
  accessToken?: string;
}

export interface Product {
  _id: string;
  userId: string;
  title: string;
  description: string;
  descriptionKorean: string;
  priceKRW: number;
  sourcePrice: number;
  marginRate: number;
  category: string;
  targetPlatform: string;
  sourcePlatform: string;
  sourceUrl: string;
  imageUrls: string[];
  status: string;
  salesCount?: number;
  growthRate?: number;
  competitionLevel?: string;
  lastScrapedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  userId: string;
  productId: string;
  productName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  sourcePlatform: string;
  targetPlatform: string;
  status: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Automation {
  _id: string;
  userId: string;
  autoSourcing: boolean;
  autoUpload: boolean;
  marginRate: number;
  targetPlatforms: string[];
  sourcePlatforms: string[];
  selectedCategories: string[];
  maxProductsPerDay: number;
  minMarginRate: number;
  minSalesCount: number;
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductStats {
  totalProducts: number;
  draftProducts: number;
  confirmedProducts: number;
  uploadedProducts: number;
  platformStats: Array<{ _id: string; count: number }>;
  categoryStats: Array<{ _id: string; count: number }>;
}




