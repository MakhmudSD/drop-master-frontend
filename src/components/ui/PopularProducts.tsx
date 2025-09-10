'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Star, TrendingUp, DollarSign } from 'lucide-react';

interface PopularProductsProps {
  products: {
    imageUrl?: string;
    title?: string;
    price?: number;
    salesCount?: number;
    growthRate?: number;
    estimatedMargin?: number;
  }[];
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  loading: boolean;
}

const platformLogos = {
  coupang: '/logos/coupang.png',
  naver: '/logos/naver.png',
  '11st': '/logos/11st.png',
  aliexpress: '/logos/aliexpress.png',
  alibaba: '/logos/alibaba.png',
};

const platformNames = {
  coupang: '쿠팡',
  naver: '네이버',
  '11st': '11번가',
  aliexpress: '알리익스프레스',
  alibaba: '알리바바',
};

export default function PopularProducts({
  products,
  selectedPlatform,
  onPlatformChange,
  loading,
}: PopularProductsProps) {
  const platforms = ['coupang', 'naver', '11st', 'aliexpress', 'alibaba'];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            인기 상품
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실시간 데이터로 분석된 인기 상품들을 확인하고 수익 기회를 발견하세요
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => onPlatformChange(platform)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedPlatform === platform
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="w-6 h-6 relative">
                <Image
                  src={platformLogos[platform as keyof typeof platformLogos]}
                  alt={platformNames[platform as keyof typeof platformNames]}
                  fill
                  className="object-contain"
                />
              </div>
              <span>{platformNames[platform as keyof typeof platformNames]}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-square relative bg-gray-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title || '상품 이미지'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ExternalLink className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <div className="w-6 h-6 relative">
                      <Image
                        src={platformLogos[selectedPlatform as keyof typeof platformLogos]}
                        alt={platformNames[selectedPlatform as keyof typeof platformNames]}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title || '상품명 없음'}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">가격</span>
                      <span className="font-semibold text-gray-900">
                        {product.price ? `₩${product.price.toLocaleString()}` : '가격 정보 없음'}
                      </span>
                    </div>
                    
                    {product.salesCount && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">판매량</span>
                        <span className="text-sm text-gray-700">
                          {product.salesCount.toLocaleString()}개
                        </span>
                      </div>
                    )}
                    
                    {product.growthRate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">성장률</span>
                        <span className="text-sm text-green-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {product.growthRate}%
                        </span>
                      </div>
                    )}
                    
                    {product.estimatedMargin && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">예상 마진</span>
                        <span className="text-sm text-blue-600 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {product.estimatedMargin}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      상세보기
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              상품을 불러오는 중입니다
            </h3>
            <p className="text-gray-600">
              {platformNames[selectedPlatform as keyof typeof platformNames]}에서 인기 상품을 가져오고 있습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}




