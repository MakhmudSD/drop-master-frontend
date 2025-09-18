import { NextRequest, NextResponse } from 'next/server';
import { ProductApiResponse } from '@/types/product.types';

// Reuse the products API logic for search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const platform = searchParams.get('platform') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      const errorResponse: ProductApiResponse = {
        products: [],
        message: 'Search query is required',
        success: false,
        total: 0,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Forward to products API
    const baseUrl = request.nextUrl.origin;
    const productsUrl = new URL('/api/products', baseUrl);
    productsUrl.searchParams.set('query', query);
    if (platform !== 'all') {
      productsUrl.searchParams.set('platform', platform);
    }
    productsUrl.searchParams.set('limit', limit.toString());

    const response = await fetch(productsUrl.toString());
    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Search API error:', error);
    
    const errorResponse: ProductApiResponse = {
      products: [],
      message: 'Search failed',
      success: false,
      total: 0,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
