'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/shared/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  kakaoLogin: () => void;
  naverLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // First check if we have user data in localStorage (from OAuth callback)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem('user');
          }
        }

        // If no stored user, check token with backend
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData.success && userData.data) {
              setUser(userData.data.user);
              // Store user data for future use
              localStorage.setItem('user', JSON.stringify(userData.data.user));
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
            }
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        const { user: userData, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success) {
        const { user: newUser, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(newUser);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const googleLogin = () => {
    // Redirect to Google OAuth
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };

  const kakaoLogin = () => {
    // Redirect to Kakao OAuth
    const kakaoAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/kakao`;
    window.location.href = kakaoAuthUrl;
  };

  const naverLogin = () => {
    // Redirect to Naver OAuth
    const naverAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/naver`;
    window.location.href = naverAuthUrl;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
    kakaoLogin,
    naverLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
