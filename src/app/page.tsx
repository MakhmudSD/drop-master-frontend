'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PopularProducts from '@/components/PopularProducts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProductsRest';
import { Product } from '@/types/product.types';

export default function Home() {
  const { user, loading } = useAuth();

  const [selectedPlatform, setSelectedPlatform] = useState('coupang');
  const [selectedSortBy, setSelectedSortBy] = useState('daily');

  // Use products hook - it automatically refetches when dependencies change
  const { products: popularProducts, loading: productsLoading, error } = useProducts(
    selectedPlatform,
    8,
    selectedSortBy
  );

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
