import { DocumentNode } from '@apollo/client';

// Generic hook types
export interface UseQueryResult<TData = any, TVariables = any> {
  data?: TData;
  loading: boolean;
  error?: any;
  refetch: (variables?: Partial<TVariables>) => Promise<any>;
  networkStatus?: number;
}

export interface UseMutationResult<TData = any, TVariables = any> {
  data?: TData;
  loading: boolean;
  error?: any;
  called: boolean;
  reset: () => void;
  mutate: (options?: { variables?: TVariables; context?: any }) => Promise<any>;
}

// Specific hook types for our app
export interface UseAuthResult {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  kakaoLogin: () => void;
  naverLogin: () => void;
}

export interface UseProductsResult {
  products: any[];
  loading: boolean;
  error?: any;
  refetch: (variables?: { platform?: string; limit?: number; sortBy?: string }) => Promise<any>;
}

export interface UseCartResult {
  cartItems: any[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  error?: any;
  addToCart: (productId: string, quantity: number, specifications?: any) => Promise<any>;
  updateCartItem: (id: string, quantity: number) => Promise<any>;
  removeFromCart: (id: string) => Promise<any>;
  clearCart: () => Promise<any>;
}

export interface UseOrdersResult {
  orders: any[];
  loading: boolean;
  error?: any;
  createOrder: (orderData: any) => Promise<any>;
  updateOrderStatus: (id: string, status: string, trackingNumber?: string) => Promise<any>;
}

export interface UseAutomationResult {
  automation: any | null;
  loading: boolean;
  error?: any;
  updateAutomation: (settings: any, isActive?: boolean) => Promise<any>;
}

// GraphQL operation types
export interface GraphQLOperation {
  query: DocumentNode;
  variables?: any;
  context?: any;
}

export interface GraphQLMutationOptions {
  variables?: any;
  context?: any;
  optimisticResponse?: any;
  update?: (cache: any, result: any) => void;
  refetchQueries?: Array<{ query: DocumentNode; variables?: any }>;
  awaitRefetchQueries?: boolean;
  errorPolicy?: 'none' | 'ignore' | 'all';
  notifyOnNetworkStatusChange?: boolean;
}

export interface GraphQLQueryOptions {
  variables?: any;
  context?: any;
  errorPolicy?: 'none' | 'ignore' | 'all';
  notifyOnNetworkStatusChange?: boolean;
  pollInterval?: number;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache';
  nextFetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache';
  skip?: boolean;
}
