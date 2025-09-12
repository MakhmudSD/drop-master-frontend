'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, Menu, X, ShoppingCart, LogOut } from 'lucide-react';

interface HeaderProps {
  user: { name: string } | null;
}

export default function Header({ user }: HeaderProps) {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Drop Master</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              홈
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  대시보드
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                  상품 관리
                </Link>
                <Link href="/scraping" className="text-gray-700 hover:text-blue-600 font-medium">
                  스크래핑
                </Link>
                <Link href="/automation" className="text-gray-700 hover:text-blue-600 font-medium">
                  자동화
                </Link>
                <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  장바구니
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/profile" className="flex items-center space-x-2 hover:text-blue-600">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </Link>
                </div>
                <div className="relative">
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">로그아웃</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  회원가입
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    대시보드
                  </Link>
                  <Link
                    href="/products"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    상품 관리
                  </Link>
                  <Link
                    href="/scraping"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    스크래핑
                  </Link>
                  <Link
                    href="/automation"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    자동화
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    장바구니
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    프로필
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

