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

  const fetchPopularProducts = async (platform: string, sortBy: string = 'daily') => {
    setProductsLoading(true);
    try {
      console.log(`🛒 Fetching ${platform} products from backend with sortBy: ${sortBy}...`);
      
      // Call the real backend API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(
        `http://localhost:3001/api/products/popular?platform=${platform}&limit=8&sortBy=${sortBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
          name: `${platform} Sample Product 1`,
          title: `${platform} 샘플 상품 1`,
          price: 10000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Fallback+Product',
          salesCount: 100,
          growthRate: 5.0,
          estimatedMargin: 20.0,
          link: '#',
          platform: platform,
          description: `${platform} 샘플 상품입니다`,
          brand: 'Unknown',
          category: 'General',
          availability: 'In Stock',
          rating: 4.0,
        },
        {
          id: `${platform}-fallback-2`,
          name: `${platform} Sample Product 2`,
          title: `${platform} 샘플 상품 2`,
          price: 25000,
          imageUrl: 'https://via.placeholder.com/300x300?text=Fallback+Product',
          salesCount: 50,
          growthRate: 8.0,
          estimatedMargin: 30.0,
          link: '#',
          platform: platform,
          description: `${platform} 샘플 상품입니다`,
          brand: 'Unknown',
          category: 'General',
          availability: 'In Stock',
          rating: 4.2,
        }
      ];
      
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
      <main>
        <Hero />
        <Features />
        <PopularProducts
          products={popularProducts}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedSortBy={selectedSortBy}
          onSortByChange={setSelectedSortBy}
          loading={productsLoading}
        />
      </main>
      <Footer />
    </div>
  );
}
