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
      // For now, use mock data since the backend endpoint requires authentication
      // TODO: Fix backend authentication for public endpoints
      const mockProducts = [
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
        },
        {
          id: '4',
          name: 'Wireless Charger Stand',
          title: '무선 충전 스탠드',
          price: 15900,
          imageUrl: '/logos/coupang.png',
          salesCount: 680,
          growthRate: 12.5,
          estimatedMargin: 28.7
        },
        {
          id: '5',
          name: 'Bluetooth Speaker',
          title: '블루투스 스피커',
          price: 45000,
          imageUrl: '/logos/naver.png',
          salesCount: 320,
          growthRate: 8.3,
          estimatedMargin: 35.2
        }
      ];
      
      setPopularProducts(mockProducts);
    } catch (error) {
      console.error('Failed to fetch popular products:', error);
      // Set fallback products for demo when API fails
      setPopularProducts([
        {
          id: 'fallback-1',
          name: 'Sample Product 1',
          title: '샘플 상품 1',
          price: 10000,
          imageUrl: '/logos/default-product.png',
          salesCount: 100,
          growthRate: 5.0,
          estimatedMargin: 20.0
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
