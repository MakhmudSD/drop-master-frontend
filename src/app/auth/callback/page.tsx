'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        router.replace('/login?error=missing_token');
        return;
      }

      try {
        // Save JWT to localStorage (save as both for compatibility)
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('accessToken', token);

        // Fetch user profile from backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Store user data in localStorage for the auth context
            localStorage.setItem('user', JSON.stringify(data.data.user));
          } else {
            console.error('Failed to get user data:', data.message);
            router.replace('/login?error=profile_error');
            return;
          }
        } else {
          console.error('Failed to fetch profile', await response.text());
          router.replace('/login?error=profile_fetch_error');
          return;
        }

        router.replace('/'); // Redirect to home/dashboard
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.replace('/login?error=callback_error');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  if (loading) {
    return <div>Logging in...</div>;
  }

  return null;
}