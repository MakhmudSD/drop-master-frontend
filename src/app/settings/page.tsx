'use client';

import { useState } from 'react';
import { Settings, BarChart3, Plus, RotateCcw, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AutomationSettingsPage() {
  const [autoSourcing, setAutoSourcing] = useState(false);
  const [autoUpload, setAutoUpload] = useState(true);
  const [marginRate, setMarginRate] = useState(56);

  const handleMarginRateChange = (value: number) => {
    setMarginRate(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">자동화 설정</h1>
          <p className="text-gray-600">드롭쉬핑 자동화 옵션을 설정하세요</p>
        </div>

        {/* Automation Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">자동화 설정</h2>
          
          <div className="space-y-6">
            {/* Auto Sourcing */}
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
                  onClick={() => setAutoSourcing(!autoSourcing)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <span
                    className={`${
                      autoSourcing ? 'bg-purple-600' : 'bg-gray-200'
                    } inline-block h-6 w-11 transform rounded-full transition-transform`}
                  />
                  <span
                    className={`${
                      autoSourcing ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Auto Upload */}
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
                  onClick={() => setAutoUpload(!autoUpload)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <span
                    className={`${
                      autoUpload ? 'bg-purple-600' : 'bg-gray-200'
                    } inline-block h-6 w-11 transform rounded-full transition-transform`}
                  />
                  <span
                    className={`${
                      autoUpload ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Margin Rate Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">마진율 설정</h2>
            <div className="bg-white border border-purple-200 rounded-lg px-3 py-2">
              <span className="text-purple-600 font-semibold text-lg">{marginRate}%</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={marginRate}
                onChange={(e) => handleMarginRateChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #9333ea 0%, #9333ea ${marginRate}%, #e5e7eb ${marginRate}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Quick Settings */}
            <div className="flex space-x-2">
              {[25, 50, 75, 100].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMarginRate(rate)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    marginRate === rate
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

        {/* Additional Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">추가 설정</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 마진율
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 판매량
                </label>
                <input
                  type="number"
                  min="0"
                  defaultValue="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일일 최대 상품 수
                </label>
                <input
                  type="number"
                  min="1"
                  defaultValue="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  업데이트 주기
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="1">1시간마다</option>
                  <option value="6">6시간마다</option>
                  <option value="12">12시간마다</option>
                  <option value="24">24시간마다</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            설정 저장
          </button>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-gray-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-400">분석</span>
          </button>

          <button className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </button>

          <button className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-purple-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <span className="text-xs text-purple-600 font-medium">새로고침</span>
          </button>
        </div>
      </div>

      {/* Desktop Bottom Spacing */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
