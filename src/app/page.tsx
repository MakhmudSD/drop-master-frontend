'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PopularProducts from '@/components/PopularProducts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { productsApi } from '@/lib/api';

export default function Home() {
  const { user, loading } = useAuth();
    interface Product {
      id: string;
      name: string;
      title?: string;
      price: number;
      imageUrl: string;
      salesCount?: number;
      growthRate?: number;
      estimatedMargin?: number;
      link?: string;
      platform?: string;
      description?: string;
      brand?: string;
      category?: string;
      availability?: string;
      rating?: number;
      reviewCount?: number;
      shippingInfo?: string;
      tags?: string[];
      originalPrice?: string;
      discount?: number;
      stock?: number;
      seller?: string;
      location?: string;
      specifications?: Record<string, any>;
    }

  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('coupang');
  const [selectedSortBy, setSelectedSortBy] = useState('daily');
  const [productsLoading, setProductsLoading] = useState(false);

  // Cache for products to improve loading speed
  const [productsCache, setProductsCache] = useState<Record<string, Product[]>>({});

  const fetchPopularProducts = async (platform: string, sortBy: string = 'daily') => {
    const cacheKey = `${platform}-${sortBy}`;
    
    // Check cache first
    if (productsCache[cacheKey]) {
      console.log(`🚀 Using cached products for ${platform}`);
      setPopularProducts(productsCache[cacheKey]);
      return;
    }

    setProductsLoading(true);
    try {
      console.log(`🛒 Fetching ${platform} products from backend with sortBy: ${sortBy}...`);
      
      // Call the real backend API with shorter timeout for faster UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for faster fallback
      
      const response = await fetch(
        `http://localhost:3001/api/products/popular?platform=${platform}&limit=8&sortBy=${sortBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=300', // 5 minutes cache
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Backend response for ${platform}:`, data);
      
      if (data.success && data.products && Array.isArray(data.products)) {
        // Transform backend data to frontend format
        const transformedProducts = data.products.map((product: any, index: number) => ({
          id: `${platform}-${index}-${Date.now()}`,
          name: product.title || product.name || '상품명 없음',
          title: product.title || product.name || '상품명 없음',
          price: parseInt(product.price) || 0,
          imageUrl: product.image || product.imageUrl || 'https://via.placeholder.com/300x300?text=Product+Image',
          salesCount: product.salesCount || 0,
          growthRate: product.growthRate || Math.random() * 20 + 5,
          estimatedMargin: product.estimatedMargin || 0,
          link: product.link || product.url || '#',
          platform: product.platform || platform,
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
        
        // Cache the results
        setProductsCache(prev => ({
          ...prev,
          [cacheKey]: transformedProducts
        }));
        
        console.log(`✅ Transformed ${transformedProducts.length} products for ${platform} (cached: ${data.cached || false})`);
        setPopularProducts(transformedProducts);
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${platform} products:`, error);
      
      // Set fallback products for demo when API fails
      const fallbackProducts = [
        {
          id: `${platform}-fallback-1`,
          name: `에어팟 프로 2세대 무선 이어폰`,
          title: `에어팟 프로 2세대 무선 이어폰`,
          price: 289000,
          imageUrl: 'https://via.placeholder.com/300x300?text=AirPods+Pro+2',
          salesCount: 2360,
          growthRate: 15.2,
          estimatedMargin: 87,
          link: '#',
          platform: platform,
          description: `에어팟 프로 2세대 무선 이어폰`,
          brand: 'Apple',
          category: '이어폰/헤드폰',
          availability: 'In Stock',
          rating: 4.5,
          competitionLevel: 'high' as const,
          alibabaPrice: 12.50,
        },
        {
          id: `${platform}-fallback-2`,
          name: `갤럭시 버즈 프로 무선 이어폰`,
          title: `갤럭시 버즈 프로 무선 이어폰`,
          price: 199000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+Buds+Pro',
          salesCount: 1850,
          growthRate: 8.5,
          estimatedMargin: 75,
          link: '#',
          platform: platform,
          description: `갤럭시 버즈 프로 무선 이어폰`,
          brand: 'Samsung',
          category: '이어폰/헤드폰',
          availability: 'In Stock',
          rating: 4.3,
          competitionLevel: 'medium' as const,
          alibabaPrice: 8.90,
        },
        {
          id: `${platform}-fallback-3`,
          name: `소니 WH-1000XM5 무선 헤드폰`,
          title: `소니 WH-1000XM5 무선 헤드폰`,
          price: 450000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Sony+WH1000XM5',
          salesCount: 890,
          growthRate: 12.3,
          estimatedMargin: 82,
          link: '#',
          platform: platform,
          description: `소니 WH-1000XM5 무선 헤드폰`,
          brand: 'Sony',
          category: '이어폰/헤드폰',
          availability: 'In Stock',
          rating: 4.7,
          competitionLevel: 'low' as const,
          alibabaPrice: 25.30,
        }
      ];
      
      // Cache fallback products too
      setProductsCache(prev => ({
        ...prev,
        [cacheKey]: fallbackProducts
      }));
      
      setPopularProducts(fallbackProducts);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularProducts(selectedPlatform, selectedSortBy);
  }, [selectedPlatform, selectedSortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PopularProducts
          products={popularProducts}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedSortBy={selectedSortBy}
          onSortByChange={setSelectedSortBy}
          loading={productsLoading}
        />
      </main>
    </div>
  );
}
