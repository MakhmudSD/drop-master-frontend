'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { userVar } from '@/lib/apollo/store';

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

// Helper to update user state in all systems
const syncUserState = (userData: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  // Update React state
  setUser(userData);
  
  // Update Apollo reactive variable
  userVar(userData);
  
  // Update localStorage
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('accessToken');
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize user from localStorage immediately (synchronously)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('jwtToken');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        userVar(userData); // Immediately sync with Apollo
        return userData;
      }
    } catch (e) {
      console.warn('[AuthContext] Failed to load cached user');
    }
    
    return null;
  });
  
  // Set loading to false immediately if we have user from localStorage
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    const hasToken = !!localStorage.getItem('jwtToken');
    const hasUser = !!localStorage.getItem('user');
    // If we have both, we can consider loading complete immediately
    return !(hasToken && hasUser);
  });

  // Verify token with backend (background check, doesn't block UI)
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.data?.user) {
            syncUserState(result.data.user, setUser);
          } else {
            syncUserState(null, setUser);
          }
        } else {
          syncUserState(null, setUser);
        }
      } catch (error) {
        console.error('[AuthContext] Backend verification failed:', error);
        // Don't clear user on network error - keep cached user
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
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
      
      if (data.success && data.data) {
        const { user: userData, token } = data.data;
        localStorage.setItem('jwtToken', token);
        syncUserState(userData, setUser);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
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
      
      if (data.success && data.data) {
        const { user: newUser, token } = data.data;
        localStorage.setItem('jwtToken', token);
        syncUserState(newUser, setUser);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('[AuthContext] Logging out...');
    
    // Clear all auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    
    // Clear state
    setUser(null);
    userVar(null);
    
    // Redirect to homepage
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
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
