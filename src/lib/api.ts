import axios from 'axios';
import { User, Product, Order, Automation, ScrapingRun, ApiResponse, PaginationInfo } from '@/shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Only redirect to login if this was an authenticated request
      // Check if the request had an Authorization header
      const hasAuthHeader = error.config?.headers?.Authorization;
      
      if (hasAuthHeader) {
        // Token expired or invalid for authenticated request
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      // For public endpoints (no auth header), just let the error pass through
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/api/auth/login', { email, password }),
  
  register: (userData: Partial<User>) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/api/auth/register', userData),
  
  me: () =>
    api.get<ApiResponse<User>>('/api/auth/profile'),
  
  googleLogin: () =>
    api.get<ApiResponse<{ user: User; accessToken: string }>>('/api/auth/google'),
  
  kakaoLogin: () =>
    api.get<ApiResponse<{ user: User; accessToken: string }>>('/api/auth/kakao'),
  
  naverLogin: () =>
    api.get<ApiResponse<{ user: User; accessToken: string }>>('/api/auth/naver'),
};

// Products API
export const productsApi = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
    category?: string;
    search?: string;
  }) =>
    api.get<ApiResponse<{ products: Product[]; pagination: PaginationInfo }>>('/api/products', { params }),
  
  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(`/api/products/${id}`),
  
  getPopularProducts: (platform?: string, limit?: number) =>
    api.get<ApiResponse<{ products: Product[] }>>('/api/products/popular', { 
      params: { platform, limit } 
    }),
  
  createProduct: (productData: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/api/products', productData),
  
  updateProduct: (id: string, productData: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/api/products/${id}`, productData),
  
  deleteProduct: (id: string) =>
    api.delete<ApiResponse<void>>(`/api/products/${id}`),
  
  bulkDelete: (ids: string[]) =>
    api.request({ method: 'DELETE', url: '/api/products/bulk', data: { ids } }),
  
  bulkUpdate: (ids: string[], updates: Partial<Product>) =>
    api.put<ApiResponse<void>>('/api/products/bulk', { data: { ids, updates } }),
};

// Orders API
export const ordersApi = {
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    api.get<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>>('/api/orders', { params }),
  
  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/api/orders/${id}`),
  
  createOrder: (orderData: Partial<Order>) =>
    api.post<ApiResponse<Order>>('/api/orders', orderData),
  
  updateOrder: (id: string, orderData: Partial<Order>) =>
    api.put<ApiResponse<Order>>(`/api/orders/${id}`, orderData),
  
  deleteOrder: (id: string) =>
    api.delete<ApiResponse<void>>(`/api/orders/${id}`),
};

// Automation API
export const automationApi = {
  getAutomation: () =>
    api.get<ApiResponse<Automation>>('/api/automation'),
  
  updateAutomation: (automationData: Partial<Automation>) =>
    api.put<ApiResponse<Automation>>('/api/automation', automationData),
  
  startAutomation: () =>
    api.post<ApiResponse<void>>('/api/automation/start'),
  
  stopAutomation: () =>
    api.post<ApiResponse<void>>('/api/automation/stop'),
};

// Scraping API
export const scrapingApi = {
  getScrapingRuns: (params?: {
    page?: number;
    limit?: number;
    platform?: string;
  }) =>
    api.get<ApiResponse<{ runs: ScrapingRun[]; pagination: PaginationInfo }>>('/api/scraping/runs', { params }),
  
  startScraping: (data: {
    platform: string;
    keywords?: string[];
    categories?: string[];
    maxResults?: number;
  }) =>
    api.post<ApiResponse<ScrapingRun>>('/api/scraping/start', data),
  
  getScrapingRun: (id: string) =>
    api.get<ApiResponse<ScrapingRun>>(`/api/scraping/runs/${id}`),
  
  stopScraping: (id: string) =>
    api.post<ApiResponse<void>>(`/api/scraping/runs/${id}/stop`),
};

// User API
export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/api/user/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    api.put<ApiResponse<User>>('/api/user/profile', userData),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse<void>>('/api/user/change-password', { currentPassword, newPassword }),
};

// Cart API
export const cartApi = {
  getCart: () =>
    api.get<ApiResponse<{ items: any[]; total: number }>>('/api/cart'),
  
  addToCart: (productId: string, quantity: number = 1) =>
    api.post<ApiResponse<void>>('/api/cart/add', { productId, quantity }),
  
  updateCartItem: (itemId: string, quantity: number) =>
    api.put<ApiResponse<void>>(`/api/cart/items/${itemId}`, { quantity }),
  
  removeFromCart: (itemId: string) =>
    api.delete<ApiResponse<void>>(`/api/cart/items/${itemId}`),
  
  clearCart: () =>
    api.delete<ApiResponse<void>>('/api/cart/clear'),
  
  checkout: (checkoutData: any) =>
    api.post<ApiResponse<{ orderId: string }>>('/api/cart/checkout', checkoutData),
};

export default api;
