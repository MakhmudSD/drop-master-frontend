import axios from 'axios';
import { User, Product, ScrapingRun, ApiResponse, PaginationInfo, ProductStats } from '@/shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; name: string; password: string; profileImage?: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  
  oAuthLogin: (data: { providerId: string; email: string; name: string; profileImage?: string; provider: 'google' | 'kakao' | 'naver' }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/oauth-login', data),
  
  unifiedOAuthLogin: (provider: 'google' | 'kakao' | 'naver', userData: any) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/unified-oauth-login', { provider, userData }),
  
  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/profile'),
  
  updateProfile: (data: Partial<User>) =>
    api.post<ApiResponse<{ user: User }>>('/auth/profile', data),
};

// Products API
export const productsApi = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
    category?: string;
  }) =>
    api.get<ApiResponse<{ products: Product[]; pagination: PaginationInfo }>>('/products', { params }),
  
  getPopularProducts: (platform: string = 'coupang', limit: number = 20) =>
    api.get<ApiResponse<{ products: Product[]; platform: string; count: number }>>('/products/popular', {
      params: { platform, limit },
    }),
  
  getProduct: (id: string) =>
    api.get<ApiResponse<{ product: Product }>>(`/products/${id}`),
  
  createProduct: (data: Partial<Product>) =>
    api.post<ApiResponse<{ product: Product }>>('/products', data),
  
  updateProduct: (id: string, data: Partial<Product>) =>
    api.patch<ApiResponse<{ product: Product }>>(`/products/${id}`, data),
  
  deleteProduct: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/products/${id}`),
  
  bulkOperations: (data: { action: string; productIds: string[]; data: Record<string, unknown> }) =>
    api.post<ApiResponse<{ message: string }>>('/products/bulk', data),
  
  getStatsOverview: () =>
    api.get<ApiResponse<{ stats: ProductStats }>>('/products/stats/overview'),
};

// Cart API
export const cartApi = {
  getCartItems: () =>
    api.get<ApiResponse<{ items: any[] }>>('/cart'),
  
  addToCart: (data: { productId: string; quantity: number }) =>
    api.post<ApiResponse<{ item: any }>>('/cart/add', data),
  
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.patch<ApiResponse<{ item: any }>>(`/cart/${itemId}`, data),
  
  removeFromCart: (itemId: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/cart/${itemId}`),
  
  clearCart: () =>
    api.delete<ApiResponse<{ message: string }>>('/cart/clear'),
  
  checkout: (data: { items: any[] }) =>
    api.post<ApiResponse<{ orderId: string }>>('/cart/checkout', data),
};

// Scraping API
export const scrapingApi = {
  scrapeCoupang: (data: { keywords?: string[]; maxResults?: number }) =>
    api.post<ApiResponse<{ runId: string; products: any[]; count: number }>>('/scrape/coupang', data),
  
  scrapeNaver: (data: { keywords?: string[]; maxResults?: number }) =>
    api.post<ApiResponse<{ runId: string; products: any[]; count: number }>>('/scrape/naver', data),
  
  scrape11st: (data: { keywords?: string[]; maxResults?: number }) =>
    api.post<ApiResponse<{ runId: string; products: any[]; count: number }>>('/scrape/11st', data),
  
  scrapeAliExpress: (data: { keywords?: string[]; maxResults?: number }) =>
    api.post<ApiResponse<{ runId: string; products: any[]; count: number }>>('/scrape/aliexpress', data),
  
  scrapeAlibaba: (data: { keywords?: string[]; maxResults?: number }) =>
    api.post<ApiResponse<{ runId: string; products: any[]; count: number }>>('/scrape/alibaba', data),
  
  getScrapingStatus: (runId: string) =>
    api.get<ApiResponse<{ status: string; runId: string; platform: string; completedAt?: Date }>>(`/scrape/status/${runId}`),
  
  getScrapingResults: (runId: string) =>
    api.get<ApiResponse<{ results: any[]; count: number }>>(`/scrape/results/${runId}`),
  
  processScrapingResults: (runId: string, data: { platform: string }) =>
    api.post<ApiResponse<{ processedProducts: any[]; count: number }>>(`/scrape/process/${runId}`, data),
  
  getScrapingHistory: () =>
    api.get<ApiResponse<{ runs: ScrapingRun[]; count: number }>>('/scrape/history'),
  
  stopScraping: (runId: string) =>
    api.post<ApiResponse<{ message: string }>>(`/scrape/stop/${runId}`),
};

export default api;


