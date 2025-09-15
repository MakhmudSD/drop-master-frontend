'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Package, Truck } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  nameKo: string;
  logo: string;
}

const platforms: Platform[] = [
  {
    id: 'naver',
    name: 'Naver Plus Store',
    nameKo: '네이버 플러스스토어',
    logo: '/logos/naver.png',
  },
  {
    id: 'coupang',
    name: 'Coupang',
    nameKo: '쿠팡',
    logo: '/logos/coupang.png',
  },
  {
    id: '11st',
    name: '11th Street',
    nameKo: '11번가',
    logo: '/logos/11st.png',
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    nameKo: '알리익스프레스',
    logo: '/logos/aliexpress.png',
  },
];

const sampleOrders = [
  {
    id: '12345678',
    productName: '에어팟 프로 2세대 무선 이어폰',
    platform: 'naver',
    status: '주문완료',
    date: '2024-01-15',
    amount: 289000,
  },
  {
    id: '12345679',
    productName: '갤럭시 버즈 프로 무선 이어폰',
    platform: 'naver',
    status: '배송중',
    date: '2024-01-14',
    amount: 199000,
  },
  {
    id: '12345680',
    productName: '소니 WH-1000XM5 무선 헤드폰',
    platform: 'naver',
    status: '주문완료',
    date: '2024-01-13',
    amount: 450000,
  },
  {
    id: '12345681',
    productName: '에어팟 프로 2세대 무선 이어폰',
    platform: 'naver',
    status: '배송완료',
    date: '2024-01-12',
    amount: 289000,
  },
  {
    id: '12345682',
    productName: '갤럭시 버즈 프로 무선 이어폰',
    platform: 'naver',
    status: '주문완료',
    date: '2024-01-11',
    amount: 199000,
  },
  {
    id: '12345683',
    productName: '소니 WH-1000XM5 무선 헤드폰',
    platform: 'naver',
    status: '배송중',
    date: '2024-01-10',
    amount: 450000,
  },
];

const sampleDeliveries = [
  {
    id: '12345678',
    productName: '에어팟 프로 2세대 무선 이어폰',
    platform: 'aliexpress',
    status: '배송중',
    trackingNumber: 'AL123456789',
    date: '2024-01-15',
  },
  {
    id: '12345679',
    productName: '갤럭시 버즈 프로 무선 이어폰',
    platform: 'aliexpress',
    status: '배송완료',
    trackingNumber: 'AL123456790',
    date: '2024-01-14',
  },
  {
    id: '12345680',
    productName: '소니 WH-1000XM5 무선 헤드폰',
    platform: 'aliexpress',
    status: '배송중',
    trackingNumber: 'AL123456791',
    date: '2024-01-13',
  },
  {
    id: '12345681',
    productName: '에어팟 프로 2세대 무선 이어폰',
    platform: 'aliexpress',
    status: '배송완료',
    trackingNumber: 'AL123456792',
    date: '2024-01-12',
  },
  {
    id: '12345682',
    productName: '갤럭시 버즈 프로 무선 이어폰',
    platform: 'aliexpress',
    status: '배송중',
    trackingNumber: 'AL123456793',
    date: '2024-01-11',
  },
  {
    id: '12345683',
    productName: '소니 WH-1000XM5 무선 헤드폰',
    platform: 'aliexpress',
    status: '배송완료',
    trackingNumber: 'AL123456794',
    date: '2024-01-10',
  },
];

export default function OrdersPage() {
  const [selectedOrderPlatform, setSelectedOrderPlatform] = useState('naver');
  const [selectedDeliveryPlatform, setSelectedDeliveryPlatform] = useState('aliexpress');

  const getPlatformLogo = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    
    if (platformId === 'naver') {
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
    
    if (platformId === 'aliexpress') {
      return (
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">AE</span>
        </div>
      );
    }
    
    return (
      <div className="w-8 h-8 relative">
        <Image
          src={platform?.logo || '/logos/default.png'}
          alt={platform?.nameKo || 'Platform'}
          fill
          className="object-contain"
        />
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '주문완료':
        return 'text-blue-600 bg-blue-100';
      case '배송중':
        return 'text-yellow-600 bg-yellow-100';
      case '배송완료':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">주문 및 배송 관리</h1>
          <p className="text-gray-600">주문 내역과 배송 상태를 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Package className="w-6 h-6 text-purple-600" />
                <span>주문내역</span>
              </h2>
            </div>
            
            <div className="p-6">
              {/* Platform Selector */}
              <div className="mb-6">
                <div className="relative">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getPlatformLogo(selectedOrderPlatform)}
                      <span className="text-gray-900">
                        {platforms.find(p => p.id === selectedOrderPlatform)?.nameKo || '네이버 플러스스토어'}
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Order List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sampleOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getPlatformLogo(order.platform)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                          {order.productName}
                        </p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{order.id}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Truck className="w-6 h-6 text-purple-600" />
                <span>배송내역</span>
              </h2>
            </div>
            
            <div className="p-6">
              {/* Platform Selector */}
              <div className="mb-6">
                <div className="relative">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getPlatformLogo(selectedDeliveryPlatform)}
                      <span className="text-gray-900">
                        {platforms.find(p => p.id === selectedDeliveryPlatform)?.nameKo || '알리익스프레스'}
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Delivery List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sampleDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getPlatformLogo(delivery.platform)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                          {delivery.productName}
                        </p>
                        <p className="text-xs text-gray-500">{delivery.trackingNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{delivery.id}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
