'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Play, Download, History, Settings } from 'lucide-react';

export default function ScrapingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState('coupang');
  const [keywords, setKeywords] = useState('');
  const [maxResults, setMaxResults] = useState(20);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingHistory, setScrapingHistory] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const platforms = [
    { id: 'coupang', name: '쿠팡', color: 'bg-blue-500' },
    { id: 'naver', name: '네이버', color: 'bg-green-500' },
    { id: '11st', name: '11번가', color: 'bg-orange-500' },
    { id: 'aliexpress', name: '알리익스프레스', color: 'bg-red-500' },
    { id: 'alibaba', name: '알리바바', color: 'bg-yellow-500' },
  ];

  const handleScraping = async () => {
    if (!keywords.trim()) {
      alert('키워드를 입력해주세요.');
      return;
    }

    setIsScraping(true);
    try {
      // This would call the actual scraping API
      // const response = await scrapingApi.scrapeCoupang({
      //   keywords: keywords.split(',').map(k => k.trim()),
      //   maxResults
      // });
      
      // Demo response
      setTimeout(() => {
        setIsScraping(false);
        alert('스크래핑이 완료되었습니다!');
        setScrapingHistory(prev => [{
          id: Date.now(),
          platform: selectedPlatform,
          keywords: keywords,
          results: maxResults,
          status: 'completed',
          createdAt: new Date().toISOString()
        }, ...prev]);
      }, 3000);
    } catch (error) {
      console.error('Scraping failed:', error);
      setIsScraping(false);
      alert('스크래핑 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">상품 스크래핑</h1>
          <p className="mt-2 text-gray-600">다양한 플랫폼에서 인기 상품을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scraping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">스크래핑 설정</h2>
              
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  플랫폼 선택
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${platform.color} mx-auto mb-2`}></div>
                      <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  검색 키워드
                </label>
                <input
                  type="text"
                  placeholder="키워드를 쉼표로 구분하여 입력하세요 (예: 무선이어폰, 블루투스 스피커)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Max Results */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 결과 수
                </label>
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10개</option>
                  <option value={20}>20개</option>
                  <option value={50}>50개</option>
                  <option value={100}>100개</option>
                </select>
              </div>

              {/* Start Scraping Button */}
              <button
                onClick={handleScraping}
                disabled={isScraping || !keywords.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isScraping ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    스크래핑 중...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    스크래핑 시작
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scraping History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">스크래핑 기록</h2>
              
              {scrapingHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>아직 스크래핑 기록이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scrapingHistory.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {platforms.find(p => p.id === item.platform)?.name}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'completed' ? '완료' : '진행중'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.keywords}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{item.results}개 결과</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

