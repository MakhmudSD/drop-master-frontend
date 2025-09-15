'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, Upload, X } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  nameKo: string;
  logo: string;
  selected: boolean;
}

const platforms: Platform[] = [
  {
    id: 'naver',
    name: 'Naver Plus Store',
    nameKo: '네이버 플러스스토어',
    logo: '/logos/naver.png',
    selected: true,
  },
  {
    id: 'coupang',
    name: 'Coupang',
    nameKo: '쿠팡',
    logo: '/logos/coupang.png',
    selected: false,
  },
  {
    id: '11st',
    name: '11th Street',
    nameKo: '11번가',
    logo: '/logos/11st.png',
    selected: false,
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    nameKo: '알리익스프레스',
    logo: '/logos/aliexpress.png',
    selected: false,
  },
];

const sampleProducts = [
  {
    id: '1',
    name: '에어팟 프로 2세대 무선 이어폰',
    category: '이어폰/헤드폰',
    price: 289000,
    competitionLevel: 'high' as const,
    salesCount: 2360,
    growthRate: 15.2,
    estimatedMargin: 87,
    alibabaPrice: 12.50,
    imageUrl: 'https://via.placeholder.com/300x300?text=AirPods+Pro+2',
  },
  {
    id: '2',
    name: '갤럭시 버즈 프로 무선 이어폰',
    category: '이어폰/헤드폰',
    price: 199000,
    competitionLevel: 'medium' as const,
    salesCount: 1850,
    growthRate: 8.5,
    estimatedMargin: 75,
    alibabaPrice: 8.90,
    imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+Buds+Pro',
  },
];

export default function AutomaticUploadPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(platforms);
  const [selectedProductPlatform, setSelectedProductPlatform] = useState('naver');
  const [isUploading, setIsUploading] = useState(false);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.map(platform =>
        platform.id === platformId
          ? { ...platform, selected: !platform.selected }
          : platform
      )
    );
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
  };

  const getPlatformLogo = (platform: Platform) => {
    if (platform.id === 'naver') {
      return (
        <div className="w-8 h-8 relative">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-8 h-8 relative">
        <Image
          src={platform.logo}
          alt={platform.nameKo}
          fill
          className="object-contain"
        />
      </div>
    );
  };

  const getCompetitionBadge = (level: 'high' | 'medium' | 'low') => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">자동 업로드</h1>
          <p className="text-gray-600">업로드할 플랫폼을 선택하고 상품을 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">업로드 플랫폼 선택</h2>
            
            <div className="space-y-4 mb-6">
              {selectedPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => togglePlatform(platform.id)}
                >
                  <div className="flex items-center space-x-4">
                    {getPlatformLogo(platform)}
                    <span className="text-gray-900 font-medium">{platform.nameKo}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        platform.selected
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {platform.selected && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {/* Handle apply logic */}}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              적용
            </button>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">소싱된 상품</h2>
            
            {/* Platform Filter */}
            <div className="mb-6">
              <div className="relative">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getPlatformLogo(selectedPlatforms.find(p => p.id === selectedProductPlatform) || platforms[0])}
                    <span className="text-gray-900">
                      {selectedPlatforms.find(p => p.id === selectedProductPlatform)?.nameKo || '네이버 플러스스토어'}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              {sampleProducts.map((product) => {
                const competitionBadge = getCompetitionBadge(product.competitionLevel);
                return (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{product.category}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${competitionBadge.color}`}>
                            {competitionBadge.text}
                          </span>
                        </div>

                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
                          {product.name}
                        </h3>

                        <div className="text-lg font-bold text-blue-600 mb-3">
                          {product.price.toLocaleString()}원
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">판매량</div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.salesCount.toLocaleString()}개
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">성장률</div>
                            <div className="text-sm font-medium text-green-600">
                              +{product.growthRate.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">예상 마진</div>
                            <div className="text-sm font-medium text-green-600">
                              {product.estimatedMargin}%
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-green-600 mb-4">
                          알리바바 가격: ${product.alibabaPrice}
                        </div>

                        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                          드랍쉬핑 상품으로 등록하기
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:border-t-0 md:p-0 md:mt-8">
          <div className="flex space-x-4 max-w-6xl mx-auto">
            <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>업로드</span>
            </button>
            <button className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <X className="w-5 h-5" />
              <span>취소</span>
            </button>
            <button className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <span className="text-white text-2xl font-bold">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
