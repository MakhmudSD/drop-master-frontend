'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      const errorParam = urlParams.get('error');

      if (errorParam) {
        router.replace(`/login?error=${errorParam}`);
        return;
      }

      try {
        if (tokenParam) {
          // Store the token and redirect to home
          localStorage.setItem('accessToken', tokenParam);
          router.replace('/');
        } else {
          router.replace('/login?error=missing_token');
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        router.replace('/login?error=callback_error');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
}
