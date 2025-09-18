import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductApiResponse } from '@/types/product.types';

// Platform configurations
const PLATFORM_CONFIGS = {
  naver: {
    id: 'naver',
    name: 'Naver Shopping',
    hasApiKey: !!(process.env.NAVER_SHOPPING_API_KEY && process.env.NAVER_SHOPPING_SECRET_KEY),
    endpoint: 'https://openapi.naver.com/v1/search/shop.json',
    enabled: true,
  },
  coupang: {
    id: 'coupang',
    name: 'Coupang',
    hasApiKey: !!(process.env.COUPANG_API_KEY && process.env.COUPANG_SECRET_KEY),
    endpoint: '', // Coupang API endpoint would go here
    enabled: false, // Enable when API keys are available
  },
  '11st': {
    id: '11st',
    name: '11번가',
    hasApiKey: !!(process.env.ELEVENST_API_KEY && process.env.ELEVENST_SECRET_KEY),
    endpoint: '', // 11st API endpoint would go here
    enabled: false,
  },
  aliexpress: {
    id: 'aliexpress',
    name: 'AliExpress',
    hasApiKey: !!(process.env.ALIEXPRESS_API_KEY && process.env.ALIEXPRESS_SECRET_KEY),
    endpoint: '', // AliExpress API endpoint would go here
    enabled: false,
  },
  '1688': {
    id: '1688',
    name: '1688',
    hasApiKey: !!(process.env.ALIBABA_1688_API_KEY && process.env.ALIBABA_1688_SECRET_KEY),
    endpoint: '', // 1688 API endpoint would go here
    enabled: false,
  },
};

// Fetch products from Naver Shopping API
async function fetchNaverProducts(query: string, limit: number = 20): Promise<Product[]> {
  try {
    const clientId = process.env.NAVER_SHOPPING_API_KEY;
    const clientSecret = process.env.NAVER_SHOPPING_SECRET_KEY;
    
    if (!clientId || !clientSecret) {
      console.log('Naver API keys not configured');
      return [];
    }

    const searchQuery = encodeURIComponent(query);
    const url = `https://openapi.naver.com/v1/search/shop.json?query=${searchQuery}&display=${limit}&sort=sim`;

    console.log('Fetching from Naver API:', url);

    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Naver API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log('Naver API response:', data);
    
    if (!data.items || !Array.isArray(data.items)) {
      console.log('No items found in Naver response');
      return [];
    }

    return data.items.map((item: any, index: number): Product => ({
      id: `naver-${item.productId || index}`,
      title: item.title?.replace(/<[^>]*>/g, '') || 'Unknown Product',
      name: item.title?.replace(/<[^>]*>/g, '') || 'Unknown Product',
      price: item.lprice ? parseInt(item.lprice) : null,
      imageUrl: item.image || '',
      url: item.link || '',
      platform: 'naver',
      category: item.category1 || undefined,
      brand: item.brand || undefined,
      seller: item.mallName || undefined,
    }));

  } catch (error) {
    console.error('Error fetching Naver products:', error);
    return [];
  }
}

// Fetch products from Coupang (placeholder - implement when API keys available)
async function fetchCoupangProducts(query: string, limit: number = 20): Promise<Product[]> {
  const config = PLATFORM_CONFIGS.coupang;
  
  if (!config.hasApiKey || !config.enabled) {
    console.log('Coupang API not configured or disabled');
    return [];
  }

  // TODO: Implement Coupang API integration when keys are available
  // Example structure:
  try {
    // const response = await fetch(coupangEndpoint, { ... });
    // return mapped products
    return [];
  } catch (error) {
    console.error('Error fetching Coupang products:', error);
    return [];
  }
}

// Fetch products from 11st (placeholder)
async function fetch11stProducts(query: string, limit: number = 20): Promise<Product[]> {
  const config = PLATFORM_CONFIGS['11st'];
  
  if (!config.hasApiKey || !config.enabled) {
    console.log('11st API not configured or disabled');
    return [];
  }

  // TODO: Implement 11st API integration when keys are available
  return [];
}

// Fetch products from AliExpress (placeholder)
async function fetchAliExpressProducts(query: string, limit: number = 20): Promise<Product[]> {
  const config = PLATFORM_CONFIGS.aliexpress;
  
  if (!config.hasApiKey || !config.enabled) {
    console.log('AliExpress API not configured or disabled');
    return [];
  }

  // TODO: Implement AliExpress API integration when keys are available
  return [];
}

// Fetch products from 1688 (placeholder)
async function fetch1688Products(query: string, limit: number = 20): Promise<Product[]> {
  const config = PLATFORM_CONFIGS['1688'];
  
  if (!config.hasApiKey || !config.enabled) {
    console.log('1688 API not configured or disabled');
    return [];
  }

  // TODO: Implement 1688 API integration when keys are available
  return [];
}

// Platform fetcher mapping
const PLATFORM_FETCHERS = {
  naver: fetchNaverProducts,
  coupang: fetchCoupangProducts,
  '11st': fetch11stProducts,
  aliexpress: fetchAliExpressProducts,
  '1688': fetch1688Products,
};

// Main API handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '인기상품';
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '20');

    let results: Product[] = [];
    let message = '';

    if (platform && platform in PLATFORM_FETCHERS) {
      // Fetch from specific platform
      const fetcher = PLATFORM_FETCHERS[platform as keyof typeof PLATFORM_FETCHERS];
      results = await fetcher(query, limit);
      
      if (results.length === 0) {
        message = `No data found for ${PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS]?.name || platform}`;
      }
    } else {
      // Fetch from all enabled platforms
      const fetchPromises = Object.entries(PLATFORM_FETCHERS).map(async ([platformName, fetcher]) => {
        const config = PLATFORM_CONFIGS[platformName as keyof typeof PLATFORM_CONFIGS];
        if (config.enabled && config.hasApiKey) {
          try {
            return await fetcher(query, Math.ceil(limit / Object.keys(PLATFORM_FETCHERS).length));
          } catch (error) {
            console.error(`Error fetching from ${platformName}:`, error);
            return [];
          }
        }
        return [];
      });

      const allResults = await Promise.all(fetchPromises);
      results = allResults.flat();

      if (results.length === 0) {
        message = 'No data found from any platform';
      }
    }

    const response: ProductApiResponse = {
      products: results,
      message: message || undefined,
      success: true,
      total: results.length,
      platform: platform || 'all',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('API error:', error);
    
    const errorResponse: ProductApiResponse = {
      products: [],
      message: 'No data found',
      success: false,
      total: 0,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Get platform configurations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'get-platforms') {
      return NextResponse.json({
        platforms: Object.values(PLATFORM_CONFIGS).map(config => ({
          id: config.id,
          name: config.name,
          hasApiKey: config.hasApiKey,
          enabled: config.enabled,
        })),
        success: true,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST API error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
