'use client';

import { useState, useCallback } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product.types';
import { searchProducts, ProductFetchResult, PLATFORMS } from '@/lib/api/productSources';

interface ProductSearchProps {
  onResults: (results: ProductFetchResult) => void;
  onSearchStart?: () => void;
  className?: string;
}

export default function ProductSearch({ onResults, onSearchStart, className = '' }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!query.trim()) {
      setError('검색어를 입력해 주세요');
      return;
    }

    setIsSearching(true);
    setError(null);
    onSearchStart?.();

    try {
      const result = await searchProducts(query.trim(), selectedPlatform, 20);
      onResults(result);
      
      if (!result.hasData && !result.error) {
        setError('검색 결과가 없습니다');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다';
      setError(errorMessage);
      onResults({
        products: [],
        hasData: false,
        hasCredentials: true,
        error: errorMessage,
        platform: selectedPlatform,
      });
    } finally {
      setIsSearching(false);
    }
  }, [query, selectedPlatform, onResults, onSearchStart]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="상품명을 입력하세요 (예: 아이폰, 노트북, 신발)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Platform Selector */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[140px]"
          >
            <option value="all">모든 플랫폼</option>
            {Object.values(PLATFORMS).map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>검색 중...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>검색</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Tips */}
        <div className="text-sm text-gray-500">
          <p className="mb-1">💡 <strong>검색 팁:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>구체적인 상품명으로 검색하면 더 정확한 결과를 얻을 수 있습니다</li>
            <li>특정 플랫폼을 선택하면 해당 플랫폼의 상품만 검색됩니다</li>
            <li>네이버는 실시간 API 데이터를 제공합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
