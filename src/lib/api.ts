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
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', { email, password }),
  
  register: (userData: Partial<User>) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', userData),
  
  me: () =>
    api.get<ApiResponse<User>>('/auth/profile'),
  
  googleLogin: () =>
    api.get<ApiResponse<{ user: User; accessToken: string }>>('/auth/google'),
  
  kakaoLogin: () =>
    api.get<ApiResponse<{ user: User; accessToken: string }>>('/auth/kakao'),
  
  naverLogin: () =>
    api.get<ApiResponse<{ user: User; accessToken: string }>>('/auth/naver'),
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
    api.get<ApiResponse<{ products: Product[]; pagination: PaginationInfo }>>('/products', { params }),
  
  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),
  
  createProduct: (productData: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/products', productData),
  
  updateProduct: (id: string, productData: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, productData),
  
  deleteProduct: (id: string) =>
    api.delete<ApiResponse<void>>(`/products/${id}`),
  
  bulkDelete: (ids: string[]) =>
    api.request({ method: 'DELETE', url: '/products/bulk', data: { ids } }),
  
  bulkUpdate: (ids: string[], updates: Partial<Product>) =>
    api.put<ApiResponse<void>>('/products/bulk', { data: { ids, updates } }),
};

// Orders API
export const ordersApi = {
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    api.get<ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>>('/orders', { params }),
  
  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),
  
  createOrder: (orderData: Partial<Order>) =>
    api.post<ApiResponse<Order>>('/orders', orderData),
  
  updateOrder: (id: string, orderData: Partial<Order>) =>
    api.put<ApiResponse<Order>>(`/orders/${id}`, orderData),
  
  deleteOrder: (id: string) =>
    api.delete<ApiResponse<void>>(`/orders/${id}`),
};

// Automation API
export const automationApi = {
  getAutomation: () =>
    api.get<ApiResponse<Automation>>('/automation'),
  
  updateAutomation: (automationData: Partial<Automation>) =>
    api.put<ApiResponse<Automation>>('/automation', automationData),
  
  startAutomation: () =>
    api.post<ApiResponse<void>>('/automation/start'),
  
  stopAutomation: () =>
    api.post<ApiResponse<void>>('/automation/stop'),
};

// Scraping API
export const scrapingApi = {
  getScrapingRuns: (params?: {
    page?: number;
    limit?: number;
    platform?: string;
  }) =>
    api.get<ApiResponse<{ runs: ScrapingRun[]; pagination: PaginationInfo }>>('/scraping/runs', { params }),
  
  startScraping: (data: {
    platform: string;
    keywords?: string[];
    categories?: string[];
    maxResults?: number;
  }) =>
    api.post<ApiResponse<ScrapingRun>>('/scraping/start', data),
  
  getScrapingRun: (id: string) =>
    api.get<ApiResponse<ScrapingRun>>(`/scraping/runs/${id}`),
  
  stopScraping: (id: string) =>
    api.post<ApiResponse<void>>(`/scraping/runs/${id}/stop`),
};

// User API
export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/user/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    api.put<ApiResponse<User>>('/user/profile', userData),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse<void>>('/user/change-password', { currentPassword, newPassword }),
};

// Cart API
export const cartApi = {
  getCart: () =>
    api.get<ApiResponse<{ items: any[]; total: number }>>('/cart'),
  
  addToCart: (productId: string, quantity: number = 1) =>
    api.post<ApiResponse<void>>('/cart/add', { productId, quantity }),
  
  updateCartItem: (itemId: string, quantity: number) =>
    api.put<ApiResponse<void>>(`/cart/items/${itemId}`, { quantity }),
  
  removeFromCart: (itemId: string) =>
    api.delete<ApiResponse<void>>(`/cart/items/${itemId}`),
  
  clearCart: () =>
    api.delete<ApiResponse<void>>('/cart/clear'),
  
  checkout: (checkoutData: any) =>
    api.post<ApiResponse<{ orderId: string }>>('/cart/checkout', checkoutData),
};

export default api;
