'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuthRest';
import { useUser } from '@/hooks/useUser';
import { useI18n } from '@/hooks/useI18n';
import { User, Menu, X, ShoppingCart, LogOut } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  user?: { name: string } | null; // Make optional since we'll use reactive state
}

export default function Header({ user: propUser }: HeaderProps) {
  const { logout } = useAuth();
  const { user: reactiveUser } = useUser();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure client-side hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Use reactive user state, fallback to prop user for compatibility
  // Only use reactive user on client side to prevent hydration mismatches
  const user = isClient ? (reactiveUser || propUser) : propUser;
  const { getText } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{getText('app.title', '드랍쉬핑 마스터')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              {getText('nav.home', '홈')}
            </Link>
            {isClient && user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  {getText('nav.dashboard', '대시보드')}
                </Link>
                <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {getText('nav.cart', '장바구니')}
                </Link>
                <Link href="/automation" className="text-gray-700 hover:text-blue-600 font-medium">
                  {getText('nav.automation', '자동화')}
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isClient && user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 hover:text-blue-600">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:inline">
                    {user.name}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  {getText('nav.login', '로그인')}
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  {getText('nav.register', '회원가입')}
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
                {getText('nav.home', '홈')}
              </Link>
              {isClient && user && (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getText('nav.dashboard', '대시보드')}
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {getText('nav.cart', '장바구니')}
                  </Link>
                  <Link
                    href="/automation"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getText('nav.automation', '자동화')}
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {getText('nav.logout', '로그아웃')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

