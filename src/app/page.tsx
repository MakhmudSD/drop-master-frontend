'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import PopularProducts from '@/components/PopularProducts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProductsRest';

export default function Home() {
  const { user } = useUser();

  const [selectedPlatform, setSelectedPlatform] = useState('naver');
  const [selectedSortBy, setSelectedSortBy] = useState('daily');

  // Use products hook - it automatically refetches when dependencies change
  const { 
    products: popularProducts, 
    loading: productsLoading, 
    error,
    hasData,
    hasCredentials
  } = useProducts(
    selectedPlatform,
    20,
    selectedSortBy
  );

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
          hasData={hasData}
          hasCredentials={hasCredentials}
          error={error}
        />
      </main>
      <Footer />
    </div>
  );
}
