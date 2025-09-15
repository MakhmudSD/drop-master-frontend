export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  role?: string;
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
