import { Product } from '@/types/product.types';

// Fallback system for when backend APIs aren't working
export const createFallbackResponse = (platform: string): { products: Product[]; hasData: boolean; error: string } => {
  // For now, return empty with appropriate error message
  return {
    products: [],
    hasData: false,
    error: 'No data available'
  };
};

// Helper to determine if we should use fallback
export const shouldUseFallback = (error: any): boolean => {
  // Use fallback for 500 errors, network errors, or undefined user errors
  return (
    error?.message?.includes('500') ||
    error?.message?.includes('API error') ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('userId')
  );
};

// Demo products for development (only shown when specifically requested)
export const getDemoProducts = (platform: string): Product[] => {
  const baseProducts = [
    {
      id: `${platform}-demo-1`,
      title: '인기 상품 1',
      name: '인기 상품 1',
      price: 29900,
      image: 'https://via.placeholder.com/300x200?text=Product+1',
      imageUrl: 'https://via.placeholder.com/300x200?text=Product+1',
      salesCount: 150,
      growthRate: 12.5,
      estimatedMargin: 25,
      link: '#',
      url: '#',
      platform,
      description: '인기 상품 설명',
      brand: '브랜드명',
      category: '전자제품',
      availability: 'in-stock',
      rating: 4.5,
      reviewCount: 89,
      shippingInfo: '무료배송',
      tags: ['인기', '할인'],
      originalPrice: '39900',
      discount: 25,
      stock: 50,
      seller: '판매자',
      location: '서울',
      specifications: {},
      competitionLevel: 'medium' as const,
      alibabaPrice: 2.5,
    },
    {
      id: `${platform}-demo-2`,
      title: '인기 상품 2',
      name: '인기 상품 2',
      price: 49900,
      image: 'https://via.placeholder.com/300x200?text=Product+2',
      imageUrl: 'https://via.placeholder.com/300x200?text=Product+2',
      salesCount: 200,
      growthRate: 18.3,
      estimatedMargin: 30,
      link: '#',
      url: '#',
      platform,
      description: '인기 상품 설명 2',
      brand: '브랜드명',
      category: '전자제품',
      availability: 'in-stock',
      rating: 4.2,
      reviewCount: 156,
      shippingInfo: '무료배송',
      tags: ['베스트', '추천'],
      originalPrice: '69900',
      discount: 29,
      stock: 30,
      seller: '판매자',
      location: '서울',
      specifications: {},
      competitionLevel: 'low' as const,
      alibabaPrice: 4.2,
    }
  ];

  return baseProducts;
};
