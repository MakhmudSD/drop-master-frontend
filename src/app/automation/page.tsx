'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import Header from '@/components/Header';
import { Settings, Play, Pause, Save, AlertCircle, Check, ChevronDown, Upload, Package, Truck, BarChart3, Plus, RotateCcw } from 'lucide-react';
import Image from 'next/image';

export default function AutomationPage() {
  const { user, loading } = useAuth();
  const { getText } = useI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sourcing');
  const [automationSettings, setAutomationSettings] = useState({
    autoSourcing: false,
    autoUpload: false,
    marginRate: 56,
    targetPlatforms: ['coupang'],
    sourcePlatforms: ['aliexpress'],
    selectedCategories: [],
    maxProductsPerDay: 30,
    minMarginRate: 40,
    minSalesCount: 200,
    isActive: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    { id: 'naver', name: 'Naver Plus Store', nameKo: '네이버 플러스스토어', selected: true },
    { id: 'coupang', name: 'Coupang', nameKo: '쿠팡', selected: false },
    { id: '11st', name: '11th Street', nameKo: '11번가', selected: false },
    { id: 'aliexpress', name: 'AliExpress', nameKo: '알리익스프레스', selected: false },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.map(platform =>
        platform.id === platformId
          ? { ...platform, selected: !platform.selected }
          : platform
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // This would call the actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('설정이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPlatformLogo = (platform: any) => {
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
          src={`/logos/${platform.id}.png`}
          alt={platform.nameKo}
          fill
          className="object-contain"
        />
      </div>
    );
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">자동화 관리</h1>
          <p className="text-gray-600">드롭쉬핑 자동화를 설정하고 관리하세요</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'sourcing', label: '자동 소싱', icon: Package },
                { id: 'upload', label: '자동 업로드', icon: Upload },
                { id: 'orders', label: '주문 관리', icon: Truck },
                { id: 'settings', label: '설정', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sourcing' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">자동 상품 소싱</h2>
            
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

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '적용 중...' : '적용'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">자동 업로드</h2>
            
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

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '적용 중...' : '적용'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Package className="w-6 h-6 text-purple-600" />
                <span>주문내역</span>
              </h2>
              
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getPlatformLogo({ id: 'naver', nameKo: '네이버 플러스스토어' })}
                      <div>
                        <p className="text-sm font-medium text-gray-900">에어팟 프로 2세대 무선 이어폰</p>
                        <p className="text-xs text-gray-500">2024-01-15</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">12345678</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        주문완료
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Truck className="w-6 h-6 text-purple-600" />
                <span>배송내역</span>
              </h2>
              
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">AE</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">에어팟 프로 2세대 무선 이어폰</p>
                        <p className="text-xs text-gray-500">AL123456789</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">12345678</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        배송중
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Automation Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">자동화 설정</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center relative">
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                          <Settings className="w-2 h-2 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">자동 소싱</h3>
                      <p className="text-sm text-gray-500">자동으로 상품을 발굴하고 분석합니다</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => setAutomationSettings(prev => ({ ...prev, autoSourcing: !prev.autoSourcing }))}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <span
                        className={`${
                          automationSettings.autoSourcing ? 'bg-purple-600' : 'bg-gray-200'
                        } inline-block h-6 w-11 transform rounded-full transition-transform`}
                      />
                      <span
                        className={`${
                          automationSettings.autoSourcing ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">자동 업로드</h3>
                      <p className="text-sm text-gray-500">자동으로 상품을 업로드합니다</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => setAutomationSettings(prev => ({ ...prev, autoUpload: !prev.autoUpload }))}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <span
                        className={`${
                          automationSettings.autoUpload ? 'bg-purple-600' : 'bg-gray-200'
                        } inline-block h-6 w-11 transform rounded-full transition-transform`}
                      />
                      <span
                        className={`${
                          automationSettings.autoUpload ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Margin Rate Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">마진율 설정</h2>
                <div className="bg-white border border-purple-200 rounded-lg px-3 py-2">
                  <span className="text-purple-600 font-semibold text-lg">{automationSettings.marginRate}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={automationSettings.marginRate}
                    onChange={(e) => setAutomationSettings(prev => ({ ...prev, marginRate: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #9333ea 0%, #9333ea ${automationSettings.marginRate}%, #e5e7eb ${automationSettings.marginRate}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {[25, 50, 75, 100].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setAutomationSettings(prev => ({ ...prev, marginRate: rate }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        automationSettings.marginRate === rate
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '설정 저장'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

