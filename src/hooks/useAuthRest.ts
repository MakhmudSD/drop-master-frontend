import { useState, useEffect, useCallback } from 'react';
import { useReactiveVar } from '@apollo/client/react';
import { User } from '@/types';
import { userVar, updateCartCount, showNotification } from '@/lib/apollo/store';
import { updateUserState, clearAuthData, initAppWebSocketOnce } from '@/lib/apollo/client';

interface UseAuthResult {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  kakaoLogin: () => void;
  naverLogin: () => void;
  refreshUserData: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  // Use reactive variable for immediate UI updates
  const user = useReactiveVar(userVar);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from API
  const fetchUserProfile = useCallback(async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        if (userData.success && userData.data?.user) {
          return userData.data.user;
        }
      }

      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }, []);

  // Refresh user data
  const refreshUserData = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      updateUserState(null);
      return;
    }

    try {
      const userData = await fetchUserProfile(token);
      if (userData) {
        updateUserState(userData);
        showNotification(`Welcome back, ${userData.name}!`, 'success');
        
        // Initialize WebSocket connection
        initAppWebSocketOnce();
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      clearAuthData();
    }
  }, [fetchUserProfile]);

  // Check for existing session on mount and handle OAuth callbacks
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're returning from OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userParam = urlParams.get('user');
        
        if (token && userParam) {
          // Handle OAuth callback
          try {
            const userData = JSON.parse(decodeURIComponent(userParam));
            localStorage.setItem('accessToken', token);
            
            // Force immediate UI update for OAuth
            updateUserState(userData);
            
            // Double-ensure state propagation
            setTimeout(() => {
              updateUserState(userData);
              showNotification(`Welcome, ${userData.name}!`, 'success');
            }, 100);
            
            // Initialize WebSocket
            initAppWebSocketOnce();
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            setLoading(false);
            return;
          } catch (error) {
            console.error('Failed to parse OAuth callback data:', error);
            showNotification('Login failed. Please try again.', 'error');
          }
        }

        // Check for existing user data in reactive variable first
        const currentUser = userVar();
        if (currentUser) {
          setLoading(false);
          return;
        }

        // Check localStorage for stored user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            updateUserState(userData);
            initAppWebSocketOnce();
            setLoading(false);
            return;
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            localStorage.removeItem('user');
          }
        }

        // Check with backend using token
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const userData = await fetchUserProfile(accessToken);
          if (userData) {
            updateUserState(userData);
            initAppWebSocketOnce();
          } else {
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        showNotification('Authentication check failed', 'error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [fetchUserProfile]);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      
      if (data.success && data.data) {
        const { user: userData, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Force immediate UI update
        updateUserState(userData);
        
        // Small delay to ensure reactive state is propagated
        setTimeout(() => {
          updateUserState(userData);
          showNotification(`Welcome back, ${userData.name}!`, 'success');
        }, 100);

        // Initialize WebSocket connection
        initAppWebSocketOnce();
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification(
        error instanceof Error ? error.message : 'Login failed',
        'error'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      
      if (data.success && data.data) {
        const { user: newUser, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        updateUserState(newUser);
        showNotification(`Welcome, ${newUser.name}! Your account has been created.`, 'success');
        
        // Initialize WebSocket connection
        initAppWebSocketOnce();
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification(
        error instanceof Error ? error.message : 'Registration failed',
        'error'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    clearAuthData();
    showNotification('You have been logged out successfully', 'info');
  };

  const googleLogin = (): void => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const redirectUrl = encodeURIComponent(window.location.origin + window.location.pathname);
      const googleAuthUrl = `${baseUrl}/api/auth/google?redirect=${redirectUrl}`;
      
      console.log('Redirecting to Google OAuth:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google login error:', error);
      showNotification('Failed to initiate Google login', 'error');
    }
  };

  const kakaoLogin = (): void => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const redirectUrl = encodeURIComponent(window.location.origin + window.location.pathname);
      const kakaoAuthUrl = `${baseUrl}/api/auth/kakao?redirect=${redirectUrl}`;
      
      console.log('Redirecting to Kakao OAuth:', kakaoAuthUrl);
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      console.error('Kakao login error:', error);
      showNotification('Failed to initiate Kakao login', 'error');
    }
  };

  const naverLogin = (): void => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const redirectUrl = encodeURIComponent(window.location.origin + window.location.pathname);
      const naverAuthUrl = `${baseUrl}/api/auth/naver?redirect=${redirectUrl}`;
      
      console.log('Redirecting to Naver OAuth:', naverAuthUrl);
      window.location.href = naverAuthUrl;
    } catch (error) {
      console.error('Naver login error:', error);
      showNotification('Failed to initiate Naver login', 'error');
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
    kakaoLogin,
    naverLogin,
    refreshUserData,
  };
};
