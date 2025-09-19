import { Product, ProductApiResponse } from '@/types/product.types';

// Platform configuration interface
export interface PlatformConfig {
  id: string;
  name: string;
  logo: string;
  hasCredentials: boolean;
  enabled: boolean;
}

// Available platforms with their configurations
export const PLATFORMS: Record<string, PlatformConfig> = {
  naver: {
    id: 'naver',
    name: '네이버 플러스스토어',
    logo: '/logos/naver.png',
    hasCredentials: true, // Will be checked by backend
    enabled: true,
  },
  coupang: {
    id: 'coupang',
    name: '쿠팡',
    logo: '/logos/coupang.png',
    hasCredentials: false, // Will be updated when API keys are added
    enabled: true,
  },
  '11st': {
    id: '11st',
    name: '11번가',
    logo: '/logos/11st.png',
    hasCredentials: false,
    enabled: true,
  },
  aliexpress: {
    id: 'aliexpress',
    name: '알리익스프레스',
    logo: '/logos/aliexpress.png',
    hasCredentials: false,
    enabled: true,
  },
  '1688': {
    id: '1688',
    name: '1688',
    logo: '/logos/alibaba.png',
    hasCredentials: false,
    enabled: true,
  },
};

// Enhanced result interface
export interface ProductFetchResult {
  products: Product[];
  hasData: boolean;
  hasCredentials: boolean;
  error?: string;
  platform?: string;
}

/**
 * Fetch products from a specific platform
 */
export async function fetchProductsByPlatform(
  platform: string,
  query: string = '인기상품',
  limit: number = 20,
  sortBy: string = 'sim'
): Promise<ProductFetchResult> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      query: encodeURIComponent(query),
      platform,
      limit: limit.toString(),
    });

    console.log('🌐 [productSources] Fetching products:', { platform, query, limit, baseUrl });

    // Try to get auth token but don't require it
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🌐 [productSources] Using auth token:', token.substring(0, 10) + '...');
    } else {
      console.log('🌐 [productSources] No auth token found');
    }

    const apiUrl = `${baseUrl}/api/products?${params}`;
    console.log('🌐 [productSources] Calling API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });

    console.log('🌐 [productSources] API response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error(`🌐 [productSources] API error for ${platform}: ${response.status} ${response.statusText}`);
      
      // Try to get error details from response
      try {
        const errorData = await response.text();
        console.error('🌐 [productSources] Error response body:', errorData);
      } catch (e) {
        console.error('🌐 [productSources] Could not read error response');
      }
      
      return {
        products: [],
        hasData: false,
        hasCredentials: PLATFORMS[platform]?.hasCredentials || false,
        error: `No data available from ${platform}`,
        platform,
      };
    }

    const data: ProductApiResponse = await response.json();
    console.log('🌐 [productSources] API response data:', data);
    
    const result = {
      products: data.products || [],
      hasData: (data.products || []).length > 0,
      hasCredentials: true, // Backend will handle credential checking
      error: data.message && data.products?.length === 0 ? data.message : undefined,
      platform,
    };
    
    console.log('🌐 [productSources] Final result:', result);
    return result;

  } catch (error) {
    console.error(`Error fetching products from ${platform}:`, error);
    
    return {
      products: [],
      hasData: false,
      hasCredentials: PLATFORMS[platform]?.hasCredentials || false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      platform,
    };
  }
}

/**
 * Fetch products from all platforms
 */
export async function fetchProductsFromAllPlatforms(
  query: string = '인기상품',
  limit: number = 20
): Promise<ProductFetchResult> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      query: encodeURIComponent(query),
      limit: limit.toString(),
    });

    const response = await fetch(`${baseUrl}/api/products?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ProductApiResponse = await response.json();
    
    return {
      products: data.products || [],
      hasData: (data.products || []).length > 0,
      hasCredentials: true,
      error: data.message && data.products?.length === 0 ? data.message : undefined,
      platform: 'all',
    };

  } catch (error) {
    console.error('Error fetching products from all platforms:', error);
    
    return {
      products: [],
      hasData: false,
      hasCredentials: true,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      platform: 'all',
    };
  }
}

/**
 * Search products across platforms
 */
export async function searchProducts(
  query: string,
  platform: string = 'all',
  limit: number = 20
): Promise<ProductFetchResult> {
  try {
    if (!query.trim()) {
      return {
        products: [],
        hasData: false,
        hasCredentials: true,
        error: 'Search query is required',
        platform,
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      q: encodeURIComponent(query),
      limit: limit.toString(),
    });

    if (platform !== 'all') {
      params.set('platform', platform);
    }

    const response = await fetch(`${baseUrl}/api/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ProductApiResponse = await response.json();
    
    return {
      products: data.products || [],
      hasData: (data.products || []).length > 0,
      hasCredentials: true,
      error: data.message && data.products?.length === 0 ? data.message : undefined,
      platform,
    };

  } catch (error) {
    console.error('Error searching products:', error);
    
    return {
      products: [],
      hasData: false,
      hasCredentials: true,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      platform,
    };
  }
}

/**
 * Get platform configuration
 */
export async function getPlatformConfigs(): Promise<PlatformConfig[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'get-platforms' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.platforms) {
      // Merge with local platform configs
      return data.platforms.map((platform: any) => ({
        ...PLATFORMS[platform.id],
        hasCredentials: platform.hasApiKey,
        enabled: platform.enabled,
      }));
    }

    return Object.values(PLATFORMS);

  } catch (error) {
    console.error('Error fetching platform configs:', error);
    return Object.values(PLATFORMS);
  }
}

/**
 * Check if a platform has valid credentials (legacy compatibility)
 */
export const hasValidCredentials = (platform: string): boolean => {
  return PLATFORMS[platform]?.hasCredentials || false;
};

/**
 * Get available platforms (legacy compatibility)
 */
export const getAvailablePlatforms = (): string[] => {
  return Object.keys(PLATFORMS).filter(platform => 
    PLATFORMS[platform].enabled
  );
};

/**
 * Get platform display name
 */
export const getPlatformName = (platform: string): string => {
  return PLATFORMS[platform]?.name || platform;
};

/**
 * Get platform logo
 */
export const getPlatformLogo = (platform: string): string => {
  return PLATFORMS[platform]?.logo || '/logos/default.png';
};

const productSourcesApi = {
  fetchProductsByPlatform,
  fetchProductsFromAllPlatforms,
  searchProducts,
  getPlatformConfigs,
  hasValidCredentials,
  getAvailablePlatforms,
  getPlatformName,
  getPlatformLogo,
  PLATFORMS,
};

export default productSourcesApi;