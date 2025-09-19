'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExternalLink, Star, TrendingUp, DollarSign, ChevronDown, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';

import { Product } from '@/types/product.types';

  interface PopularProductsProps {
    products: Product[];
    selectedPlatform: string;
    onPlatformChange: (platform: string) => void;
    selectedSortBy: string;
    onSortByChange: (sortBy: string) => void;
    loading: boolean;
    hasData: boolean;
    hasCredentials: boolean;
    error?: Error | null;
  }

const platformLogos = {
  coupang: '/logos/coupang.png',
  naver: '/logos/naver.png',
  '11st': '/logos/11st.png',
  aliexpress: '/logos/aliexpress.png',
};

const platformNames = {
  coupang: '쿠팡',
  naver: '네이버 플러스스토어',
  '11st': '11번가',
  aliexpress: '알리익스프레스',
};

const getCompetitionBadge = (level?: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high':
      return { text: '고경쟁', color: 'bg-red-100 text-red-800' };
    case 'medium':
      return { text: '중경쟁', color: 'bg-yellow-100 text-yellow-800' };
    case 'low':
      return { text: '저경쟁', color: 'bg-green-100 text-green-800' };
    default:
      return { text: '중경쟁', color: 'bg-yellow-100 text-yellow-800' };
  }
};

export default function PopularProducts({
  products,
  selectedPlatform,
  onPlatformChange,
  selectedSortBy,
  onSortByChange,
  loading,
  hasData,
  hasCredentials,
  error,
}: PopularProductsProps) {
  const platforms = ['naver', 'coupang', '11st', 'aliexpress']; // Put naver first since it's most likely to work
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  // Ensure client-side hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPlatformDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddToCart = async (product: any, index: number) => {
    // Only proceed on client side
    if (!isClient) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAddingToCart(index.toString());
    try {
      // Generate a proper product ID based on platform and product info
      const productId = product.id || `${selectedPlatform}-${product.title?.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
      
      // Convert specifications to object format expected by mutation
      const specifications = {
        title: product.title || '제품명 없음',
        price: product.price || 0,
        imageUrl: product.imageUrl || '',
        platform: selectedPlatform,
        sourcePrice: (product.alibabaPrice || 0) * 1200, // Convert USD to KRW roughly
        marginRate: product.estimatedMargin || 0,
        estimatedProfit: (product.price || 0) - ((product.alibabaPrice || 0) * 1200),
        category: product.category || '',
        brand: product.brand || '',
        originalData: product
      };

      const cartItem = await addToCart(productId, 1, specifications);
      
      if (cartItem) {
        // Show success message first
        alert('Product successfully added');
        
        // Then redirect to cart page
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('장바구니 추가에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">드랍쉬핑 마스터</h1>
              <p className="text-gray-600">실시간 데이터로 분석된 인기 상품들을 확인하고 수익 기회를 발견하세요</p>
            </div>
            
            {/* Desktop Platform Selector */}
            <div className="mt-4 lg:mt-0">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                  className="w-full lg:w-auto lg:min-w-64 flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={platformLogos[selectedPlatform as keyof typeof platformLogos]}
                        alt={platformNames[selectedPlatform as keyof typeof platformNames]}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {platformNames[selectedPlatform as keyof typeof platformNames]}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {isPlatformDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 lg:right-auto mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => {
                          onPlatformChange(platform);
                          setIsPlatformDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 text-left"
                      >
                        <div className="w-8 h-8 relative">
                          <Image
                            src={platformLogos[platform as keyof typeof platformLogos]}
                            alt={platformNames[platform as keyof typeof platformNames]}
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        </div>
                        <span className="text-gray-900">{platformNames[platform as keyof typeof platformNames]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time Period Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            {[
              { key: 'daily', label: '일간' },
              { key: 'weekly', label: '주간' },
              { key: 'monthly', label: '월간' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => onSortByChange(tab.key)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSortBy === tab.key
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedSortBy === 'daily' ? '일간' : selectedSortBy === 'weekly' ? '주간' : '월간'} 인기상품 순위
            </h2>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              총 {products.length}개 상품
            </div>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {products.map((product, index) => {
              const competitionBadge = getCompetitionBadge(product.competitionLevel);
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-purple-200 flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden flex-shrink-0">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title || '상품 이미지'}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-gray-400 image-fallback ${product.imageUrl ? 'hidden' : 'flex'}`}>
                      <ExternalLink className="w-12 h-12" />
                    </div>
                  </div>

                  {/* Category and Competition Badge */}
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <span className="text-sm text-gray-500">{product.category || '이어폰/헤드폰'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${competitionBadge.color}`}>
                      {competitionBadge.text}
                    </span>
                  </div>

                  {/* Content Area - Allow to grow */}
                  <div className="flex-grow">
                    {/* Product Title */}
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                      {product.title || '에어팟 프로 2세대 무선 이어폰'}
                    </h3>

                    {/* Price */}
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      {product.price ? `${product.price.toLocaleString()}원` : '가격 문의'}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">판매량</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {product.salesCount ? product.salesCount.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">평점</div>
                      <div className="text-sm font-semibold text-yellow-600">
                        {product.rating ? `${product.rating.toFixed(1)}★` : 'N/A'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">리뷰 수</div>
                      <div className="text-sm font-semibold text-gray-600">
                        {product.reviewCount ? product.reviewCount.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                    {/* Alibaba Price */}
                    <div className="text-center text-sm text-green-600 mb-4 bg-green-50 py-2 rounded-lg">
                      알리바바 가격: <span className="font-semibold">${product.alibabaPrice || 12.50}</span>
                    </div>
                  </div>

                  {/* Register Button - Always at bottom */}
                  <button 
                    onClick={() => handleAddToCart(product, index)}
                    disabled={addingToCart === index.toString()}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                  >
                    {addingToCart === index.toString() ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        추가 중...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        상품 등록하기
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !hasData && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            
            {error ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  데이터를 불러올 수 없습니다
                </h3>
                <p className="text-gray-600 mb-4">
                  {error.message === 'No data available' ? 
                    `${platformNames[selectedPlatform as keyof typeof platformNames]}에서 데이터를 찾을 수 없습니다.` :
                    (error.message || '알 수 없는 오류가 발생했습니다.')
                  }
                </p>
                {error.message !== 'No data available' && (
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다시 시도
                  </button>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  상품이 없습니다
                </h3>
                <p className="text-gray-600">
                  {platformNames[selectedPlatform as keyof typeof platformNames]}에서 상품을 찾을 수 없습니다.
                </p>
              </>
            )}
          </div>
        )}

      </div>
    </section>
  );
}




