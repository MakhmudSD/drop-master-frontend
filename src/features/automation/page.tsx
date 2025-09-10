'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Settings, Play, Pause, Save, AlertCircle } from 'lucide-react';

export default function AutomationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [automationSettings, setAutomationSettings] = useState({
    autoSourcing: false,
    autoUpload: false,
    marginRate: 60,
    targetPlatforms: ['coupang'],
    sourcePlatforms: ['aliexpress'],
    selectedCategories: [],
    maxProductsPerDay: 30,
    minMarginRate: 40,
    minSalesCount: 200,
    isActive: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAutomationSettings();
    }
  }, [user]);

  const fetchAutomationSettings = async () => {
    try {
      // This would call the actual API
      // const response = await automationApi.getAutomationSettings();
      // setAutomationSettings(response.data.automation);
    } catch (error) {
      console.error('Failed to fetch automation settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // This would call the actual API
      // await automationApi.updateAutomationSettings(automationSettings);
      alert('설정이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAutomation = async () => {
    try {
      if (automationSettings.isActive) {
        // await automationApi.stopAutomation();
        setAutomationSettings(prev => ({ ...prev, isActive: false }));
        alert('자동화가 중지되었습니다.');
      } else {
        // await automationApi.startAutomation();
        setAutomationSettings(prev => ({ ...prev, isActive: true }));
        alert('자동화가 시작되었습니다.');
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
      alert('자동화 상태 변경 중 오류가 발생했습니다.');
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">자동화 설정</h1>
              <p className="mt-2 text-gray-600">드롭쉬핑 비즈니스를 자동화하세요</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleToggleAutomation}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  automationSettings.isActive
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {automationSettings.isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    자동화 중지
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    자동화 시작
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>

        {/* Automation Status */}
        <div className={`rounded-lg p-4 mb-8 ${
          automationSettings.isActive 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`h-5 w-5 mr-2 ${
              automationSettings.isActive ? 'text-green-600' : 'text-yellow-600'
            }`} />
            <span className={`font-medium ${
              automationSettings.isActive ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {automationSettings.isActive 
                ? '자동화가 활성화되어 있습니다' 
                : '자동화가 비활성화되어 있습니다'
              }
            </span>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">자동화 옵션</h2>
          
          <div className="space-y-6">
            {/* Basic Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">기본 설정</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={automationSettings.autoSourcing}
                    onChange={(e) => setAutomationSettings(prev => ({ 
                      ...prev, 
                      autoSourcing: e.target.checked 
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">자동 상품 소싱</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={automationSettings.autoUpload}
                    onChange={(e) => setAutomationSettings(prev => ({ 
                      ...prev, 
                      autoUpload: e.target.checked 
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">자동 상품 업로드</span>
                </label>
              </div>
            </div>

            {/* Financial Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">수익 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기본 마진율 (%)
                  </label>
                  <input
                    type="number"
                    value={automationSettings.marginRate}
                    onChange={(e) => setAutomationSettings(prev => ({ 
                      ...prev, 
                      marginRate: Number(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최소 마진율 (%)
                  </label>
                  <input
                    type="number"
                    value={automationSettings.minMarginRate}
                    onChange={(e) => setAutomationSettings(prev => ({ 
                      ...prev, 
                      minMarginRate: Number(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최소 판매량
                  </label>
                  <input
                    type="number"
                    value={automationSettings.minSalesCount}
                    onChange={(e) => setAutomationSettings(prev => ({ 
                      ...prev, 
                      minSalesCount: Number(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    일일 최대 상품 수
                  </label>
                  <input
                    type="number"
                    value={automationSettings.maxProductsPerDay}
                    onChange={(e) => setAutomationSettings(prev => ({ 
                      ...prev, 
                      maxProductsPerDay: Number(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">플랫폼 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟 플랫폼
                  </label>
                  <div className="space-y-2">
                    {['coupang', 'naver', '11st'].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={automationSettings.targetPlatforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAutomationSettings(prev => ({
                                ...prev,
                                targetPlatforms: [...prev.targetPlatforms, platform]
                              }));
                            } else {
                              setAutomationSettings(prev => ({
                                ...prev,
                                targetPlatforms: prev.targetPlatforms.filter(p => p !== platform)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    소스 플랫폼
                  </label>
                  <div className="space-y-2">
                    {['aliexpress', 'alibaba'].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={automationSettings.sourcePlatforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAutomationSettings(prev => ({
                                ...prev,
                                sourcePlatforms: [...prev.sourcePlatforms, platform]
                              }));
                            } else {
                              setAutomationSettings(prev => ({
                                ...prev,
                                sourcePlatforms: prev.sourcePlatforms.filter(p => p !== platform)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

