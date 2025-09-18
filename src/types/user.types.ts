export interface User {
  _id: string;
  id?: string; // For backward compatibility
  email: string;
  name: string;
  password?: string;
  profileImage?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  provider?: 'google' | 'kakao' | 'naver' | 'local';
  googleId?: string;
  kakaoId?: string;
  naverId?: string;
  preferences?: {
    language: string;
    currency: string;
  };
  role: string;
  isActive: boolean;
  accessToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}
