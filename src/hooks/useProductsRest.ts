import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product.types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error?: any;
  refetch: (variables?: { platform?: string; limit?: number; sortBy?: string }) => Promise<any>;
}

export const useProducts = (platform: string, limit?: number, sortBy?: string): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchProducts = async (fetchPlatform: string, fetchLimit?: number, fetchSortBy?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/products/popular?platform=${fetchPlatform}&limit=${fetchLimit || 8}&sortBy=${fetchSortBy || 'daily'}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.products && Array.isArray(data.products)) {
        // Transform backend data to frontend format
        const transformedProducts: Product[] = data.products.map((product: any, index: number) => ({
          id: `${fetchPlatform}-${index}-${Date.now()}`,
          title: product.title || product.name || '상품명 없음',
          name: product.title || product.name || '상품명 없음',
          price: parseInt(product.price) || 0,
          image: product.image || product.imageUrl || 'https://via.placeholder.com/300x300?text=Product+Image',
          imageUrl: product.image || product.imageUrl || 'https://via.placeholder.com/300x300?text=Product+Image',
          salesCount: product.salesCount || 0,
          growthRate: product.growthRate || Math.random() * 20 + 5,
          estimatedMargin: product.estimatedMargin || 0,
          link: product.link || product.url || '#',
          platform: product.platform || fetchPlatform,
          description: product.description || '',
          brand: product.brand || 'Unknown',
          category: product.category || 'General',
          availability: product.availability || 'In Stock',
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          shippingInfo: product.shippingInfo || '무료배송',
          tags: product.tags || [],
          originalPrice: product.originalPrice || '',
          discount: product.discount || 0,
          stock: product.stock || 0,
          seller: product.seller || 'Unknown',
          location: product.location || '서울',
          specifications: product.specifications || {},
          competitionLevel: product.competitionLevel || (Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'),
          alibabaPrice: product.alibabaPrice || Math.random() * 50 + 5,
        }));
        
        setProducts(transformedProducts);
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error) {
      console.error(`Failed to fetch ${fetchPlatform} products:`, error);
      
      // Set fallback products for demo when API fails
      const fallbackProducts: Product[] = [
        {
          id: `${fetchPlatform}-fallback-1`,
          title: `에어팟 프로 2세대 무선 이어폰`,
          name: `에어팟 프로 2세대 무선 이어폰`,
          price: 289000,
          image: 'https://via.placeholder.com/300x300?text=AirPods+Pro+2',
          imageUrl: 'https://via.placeholder.com/300x300?text=AirPods+Pro+2',
          salesCount: 2360,
          growthRate: 15.2,
          estimatedMargin: 87,
          link: '#',
          platform: fetchPlatform,
          description: `에어팟 프로 2세대 무선 이어폰`,
          brand: 'Apple',
          category: '이어폰/헤드폰',
          availability: 'In Stock',
          rating: 4.5,
          competitionLevel: 'high' as const,
          alibabaPrice: 12.50,
        },
        {
          id: `${fetchPlatform}-fallback-2`,
          title: `갤럭시 버즈 프로 무선 이어폰`,
          name: `갤럭시 버즈 프로 무선 이어폰`,
          price: 199000,
          image: 'https://via.placeholder.com/300x300?text=Galaxy+Buds+Pro',
          imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+Buds+Pro',
          salesCount: 1850,
          growthRate: 8.5,
          estimatedMargin: 75,
          link: '#',
          platform: fetchPlatform,
          description: `갤럭시 버즈 프로 무선 이어폰`,
          brand: 'Samsung',
          category: '이어폰/헤드폰',
          availability: 'In Stock',
          rating: 4.3,
          competitionLevel: 'medium' as const,
          alibabaPrice: 8.90,
        },
        {
          id: `${fetchPlatform}-fallback-3`,
          title: `소니 WH-1000XM5 무선 헤드폰`,
          name: `소니 WH-1000XM5 무선 헤드폰`,
          price: 450000,
          image: 'https://via.placeholder.com/300x300?text=Sony+WH1000XM5',
          imageUrl: 'https://via.placeholder.com/300x300?text=Sony+WH1000XM5',
          salesCount: 890,
          growthRate: 12.3,
          estimatedMargin: 82,
          link: '#',
          platform: fetchPlatform,
          description: `소니 WH-1000XM5 무선 헤드폰`,
          brand: 'Sony',
          category: '이어폰/헤드폰',
          availability: 'In Stock',
          rating: 4.7,
          competitionLevel: 'low' as const,
          alibabaPrice: 25.30,
        }
      ];
      
      setProducts(fallbackProducts);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(platform, limit, sortBy);
  }, [platform, limit, sortBy]);

  const refetch = useCallback(async (variables?: { platform?: string; limit?: number; sortBy?: string }) => {
    await fetchProducts(
      variables?.platform || platform,
      variables?.limit || limit,
      variables?.sortBy || sortBy
    );
  }, [platform, limit, sortBy]);

  return {
    products,
    loading,
    error,
    refetch
  };
};
