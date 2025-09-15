'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import Header from '@/components/Header';
import { User, LogOut, Settings, Package, BarChart3, CreditCard, Bell, Shield, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const { getText } = useI18n();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
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

  const menuItems = [
    {
      id: 'profile',
      title: '프로필 정보',
      description: '개인정보 및 계정 설정',
      icon: User,
      href: '/profile/info'
    },
    {
      id: 'products',
      title: '내 상품',
      description: '등록한 상품 관리',
      icon: Package,
      href: '/profile/products'
    },
    {
      id: 'analytics',
      title: '분석',
      description: '판매 분석 및 통계',
      icon: BarChart3,
      href: '/profile/analytics'
    },
    {
      id: 'billing',
      title: '결제 정보',
      description: '구독 및 결제 관리',
      icon: CreditCard,
      href: '/profile/billing'
    },
    {
      id: 'notifications',
      title: '알림 설정',
      description: '알림 및 이메일 설정',
      icon: Bell,
      href: '/profile/notifications'
    },
    {
      id: 'security',
      title: '보안',
      description: '비밀번호 및 보안 설정',
      icon: Shield,
      href: '/profile/security'
    },
    {
      id: 'help',
      title: '도움말',
      description: 'FAQ 및 고객지원',
      icon: HelpCircle,
      href: '/profile/help'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">계정을 관리하고 설정을 변경하세요</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user.name || '사용자'}</h2>
              <p className="text-gray-500">{user.email || 'user@example.com'}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">멤버십</div>
              <div className="text-lg font-semibold text-purple-600">프리미엄</div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(item.href)}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">로그아웃</h3>
                <p className="text-sm text-gray-500">계정에서 로그아웃합니다</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}