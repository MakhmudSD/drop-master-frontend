'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PopularProducts from '@/components/PopularProducts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { productsApi } from '@/services/api';

export default function Home() {
  const { user, loading } = useAuth();
  interface Product {
    id: string;
    name: string;
    title?: string; // Optional title property
    price: number;
    imageUrl: string;
    salesCount?: number; // Optional salesCount property
    growthRate?: number; // Optional growthRate property
    estimatedMargin?: number; // Optional estimatedMargin property
  }

  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('coupang');
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchPopularProducts = async (platform: string) => {
    setProductsLoading(true);
    try {
      const response = await productsApi.getPopularProducts(platform, 20);
      if (response?.data?.success) {
        const products = response.data?.data?.products || [];
        // Transform Apify data to match our interface
        const transformedProducts = products.map((product: any, index: number) => ({
          id: product.id || product._id || `product-${index}`,
          name: product.title || product.name || '상품명 없음',
          title: product.title || product.name || '상품명 없음',
          price: product.price || product.salePrice || product.priceKRW || 0,
          imageUrl: product.imageUrl || product.image || product.imageUrls?.[0] || '/logos/default-product.png',
          salesCount: product.salesCount || product.reviewCount || Math.floor(Math.random() * 1000),
          growthRate: product.growthRate || Math.floor(Math.random() * 30),
          estimatedMargin: product.estimatedMargin || product.marginRate || Math.floor(Math.random() * 50)
        }));
        setPopularProducts(transformedProducts);
      } else {
        throw new Error('API response was not successful');
      }
    } catch (error) {
      console.error('Failed to fetch popular products:', error);
      // Set fallback products for demo when API fails
      setPopularProducts([
        {
          id: '1',
          name: 'AirPods Pro 2nd Gen',
          title: '에어팟 프로 2세대 무선이어폰',
          price: 289000,
          imageUrl: '/logos/coupang.png',
          salesCount: 1250,
          growthRate: 15.2,
          estimatedMargin: 25.5
        },
        {
          id: '2',
          name: 'Galaxy S24 Transparent Jelly Case',
          title: '갤럭시 S24 투명 젤리케이스',
          price: 8900,
          imageUrl: '/logos/naver.png',
          salesCount: 850,
          growthRate: 22.8,
          estimatedMargin: 18.3
        },
        {
          id: '3',
          name: 'USB C Hub 7-in-1',
          title: 'USB C 허브 7-in-1',
          price: 21900,
          imageUrl: '/logos/11st.png',
          salesCount: 420,
          growthRate: 9.1,
          estimatedMargin: 32.1
        }
      ]);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularProducts(selectedPlatform);
  }, [selectedPlatform]);

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
          loading={productsLoading}
        />
      </main>
      <Footer />
    </div>
  );
}
