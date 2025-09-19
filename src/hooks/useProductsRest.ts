import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product.types';
import { fetchProductsByPlatform, ProductFetchResult } from '@/lib/api/productSources';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  hasData: boolean;
  hasCredentials: boolean;
  refetch: (variables?: { platform?: string; limit?: number; sortBy?: string }) => Promise<void>;
}

interface UseProductsParams {
  platform: string;
  limit?: number;
  sortBy?: string;
}

// Enhanced error classes for better error handling
class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Enhanced useProducts hook that fetches real products from various platforms
 * - Naver: Uses real API when credentials are available
 * - Other platforms: Uses real API when credentials are available, shows "no data" otherwise
 */
export const useProducts = (
  platform: string = 'naver',
  limit: number = 20,
  sortBy: string = 'daily'
): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasData, setHasData] = useState(false);

  const [hasCredentials, setHasCredentials] = useState(false);

  const fetchProducts = useCallback(async (params?: {
    platform?: string;
    limit?: number;
    sortBy?: string;
  }) => {
    const requestPlatform = params?.platform || platform;
    const requestLimit = params?.limit || limit;
    
    console.log('🔍 [useProductsRest] Starting fetch:', { requestPlatform, requestLimit, params });
    
    setLoading(true);
    setError(null);
    setHasData(false);

    try {
      console.log('🔍 [useProductsRest] Calling fetchProductsByPlatform...');
      const result: ProductFetchResult = await fetchProductsByPlatform(requestPlatform, '인기상품', requestLimit);
      
      console.log('🔍 [useProductsRest] Fetch result:', result);
      
      setProducts(result.products);
      setHasData(result.hasData);
      setHasCredentials(result.hasCredentials);
      
      if (result.error && !result.hasData) {
        console.log('🔍 [useProductsRest] Setting error:', result.error);
        setError(new Error(result.error));
      }
    } catch (err) {
      console.error('🔍 [useProductsRest] Error fetching products:', err);
      setError(err instanceof Error ? err : new Error('상품을 불러오는 중 오류가 발생했습니다'));
      setProducts([]);
      setHasData(false);
    } finally {
      console.log('🔍 [useProductsRest] Fetch completed, setting loading to false');
      setLoading(false);
    }
  }, [platform, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback(async (variables?: {
    platform?: string;
    limit?: number;
    sortBy?: string;
  }) => {
    await fetchProducts(variables);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    hasData,
    hasCredentials,
    refetch,
  };
};

/**
 * Hook factory for creating platform-specific product hooks
 * Useful for creating specialized hooks for different platforms
 */
export const createProductsHook = (defaultPlatform: string) => {
  return (options?: Partial<UseProductsParams>) => {
    return useProducts(
      options?.platform || defaultPlatform,
      options?.limit,
      options?.sortBy
    );
  };
};

// Export specialized hooks for each platform
export const useNaverProducts = createProductsHook('naver');
export const useCoupangProducts = createProductsHook('coupang');
export const use11stProducts = createProductsHook('11st');
export const useAliexpressProducts = createProductsHook('aliexpress');

// Legacy compatibility
export default useProducts;