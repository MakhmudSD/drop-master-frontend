'use client';

import { Brain, Globe, BarChart3, Zap, Shield, Clock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI 번역',
      description: '상품 설명을 자동으로 한국어로 번역하여 마케팅에 최적화된 내용을 제공합니다.',
    },
    {
      icon: Globe,
      title: '다중 플랫폼 지원',
      description: '쿠팡, 네이버, 11번가 등 주요 쇼핑몰과 알리익스프레스, 알리바바를 연결합니다.',
    },
    {
      icon: BarChart3,
      title: '실시간 분석',
      description: '상품의 인기도, 경쟁도, 수익성을 실시간으로 분석하여 최적의 상품을 추천합니다.',
    },
    {
      icon: Zap,
      title: '자동화 시스템',
      description: '상품 발굴부터 등록까지 전 과정을 자동화하여 효율성을 극대화합니다.',
    },
    {
      icon: Shield,
      title: '안전한 관리',
      description: '주문 관리, 재고 추적, 고객 서비스까지 통합 관리합니다.',
    },
    {
      icon: Clock,
      title: '24/7 모니터링',
      description: '24시간 상품과 시장을 모니터링하여 기회를 놓치지 않습니다.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            강력한 기능들
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            드롭쉬핑 비즈니스를 성공으로 이끄는 모든 도구를 한 곳에서 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




