'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown } from 'lucide-react';

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
  {
    id: 'alibaba',
    name: 'Alibaba',
    nameKo: '알리바바',
    logo: '/logos/alibaba.png',
    selected: false,
  },
  {
    id: '1688',
    name: '1688',
    nameKo: '1688',
    logo: '/logos/1688.png',
    selected: false,
  },
];

export default function AutomaticSourcingPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(platforms);
  const [isApplying, setIsApplying] = useState(false);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.map(platform =>
        platform.id === platformId
          ? { ...platform, selected: !platform.selected }
          : platform
      )
    );
  };

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsApplying(false);
    // Handle apply logic here
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">자동 상품 소싱</h1>
          <p className="text-gray-600">소싱할 플랫폼을 선택하세요</p>
        </div>

        {/* Platform Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">플랫폼 선택</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
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
        </div>

        {/* Apply Button */}
        <div className="flex justify-end">
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplying ? '적용 중...' : '적용'}
          </button>
        </div>

        {/* Selected Platforms Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">선택된 플랫폼</h3>
          <div className="flex flex-wrap gap-3">
            {selectedPlatforms
              .filter(platform => platform.selected)
              .map(platform => (
                <div
                  key={platform.id}
                  className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg"
                >
                  {getPlatformLogo(platform)}
                  <span className="text-sm font-medium">{platform.nameKo}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
