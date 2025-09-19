'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import PopularProducts from '@/components/PopularProducts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const { user } = useUser();

  const [selectedPlatform, setSelectedPlatform] = useState('naver');
  const [selectedSortBy, setSelectedSortBy] = useState('daily');

  console.log('🏠 [HomePage] Render with:', { selectedPlatform, selectedSortBy });

  // Use products hook - it automatically refetches when dependencies change
  const { 
    products: popularProducts, 
    loading: productsLoading, 
    error
  } = useProducts({
    platform: selectedPlatform,
    limit: 20,
    query: '인기상품',
    timeFilter: selectedSortBy
  });

  console.log('🏠 [HomePage] Hook result:', { 
    productsCount: popularProducts.length, 
    loading: productsLoading, 
    error: error?.message 
  });

  // No need for auth loading check since reactive user state updates immediately

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        <Features />
        <PopularProducts
          products={popularProducts}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedSortBy={selectedSortBy}
          onSortByChange={setSelectedSortBy}
          loading={productsLoading}
          hasData={popularProducts.length > 0}
          hasCredentials={true}
          error={error}
        />
      </main>
      <Footer />
    </div>
  );
}
