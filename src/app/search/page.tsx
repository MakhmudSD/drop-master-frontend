'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSearch from '@/components/ProductSearch';
import { useUser } from '@/hooks/useUser';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product.types';
import { ProductFetchResult } from '@/lib/api/productSources';
import { ExternalLink, ShoppingCart, Star, Package } from 'lucide-react';
import Image from 'next/image';

export default function SearchPage() {
  const { user, isAuthenticated } = useUser();
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchResults, setSearchResults] = useState<ProductFetchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Handle initial search from URL params
  const initialQuery = searchParams.get('q') || '';

  const handleSearchResults = (results: ProductFetchResult) => {
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearchStart = () => {
    setIsSearching(true);
    setSearchResults(null);
  };

  const handleAddToCart = async (product: Product) => {
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('jwtToken');
    
    if (!user || !hasToken) {
      router.push('/login?redirect=/search');
      return;
    }

    setAddingToCart(product.id);
    try {
      const specifications = {
        title: product.title,
        price: product.price || 0,
        imageUrl: product.imageUrl,
        platform: product.platform,
        category: product.category || '',
        brand: product.brand || '',
        url: product.url,
        originalData: product
      };

      const cartItem = await addToCart(product.id, 1, specifications);
      
      if (cartItem) {
        alert('Product successfully added to cart');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('장바구니 추가에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleProductClick = (product: Product) => {
    if (product.url) {
      window.open(product.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    const colors: Record<string, string> = {
      naver: 'bg-green-100 text-green-800',
      coupang: 'bg-blue-100 text-blue-800',
      '11st': 'bg-red-100 text-red-800',
      aliexpress: 'bg-orange-100 text-orange-800',
      '1688': 'bg-yellow-100 text-yellow-800',
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">상품 검색</h1>
          <p className="text-gray-600">
            네이버, 쿠팡, 11번가, 알리익스프레스 등 여러 플랫폼에서 상품을 검색하세요
          </p>
        </div>

        {/* Search Component */}
        <ProductSearch 
          onResults={handleSearchResults}
          onSearchStart={handleSearchStart}
          className="mb-8"
        />

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">검색 중...</p>
          </div>
        )}

        {searchResults && !isSearching && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Search Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                검색 결과 ({searchResults.products.length}개)
              </h2>
              {searchResults.platform && searchResults.platform !== 'all' && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformBadgeColor(searchResults.platform)}`}>
                  {searchResults.platform}
                </span>
              )}
            </div>

            {/* No Results */}
            {!searchResults.hasData && (
              <div className="text-center py-12">
                <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600 mb-4">
                  {searchResults.error || '다른 검색어로 다시 시도해 보세요'}
                </p>
              </div>
            )}

            {/* Products Grid */}
            {searchResults.hasData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Platform Badge */}
                    <div className="mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformBadgeColor(product.platform)}`}>
                        {product.platform}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {product.price ? `${product.price.toLocaleString()}원` : '가격 문의'}
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {product.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {product.reviewCount && (
                        <span>리뷰 {product.reviewCount.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={addingToCart === product.id}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                    >
                      {addingToCart === product.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>추가 중...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>장바구니 담기</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
