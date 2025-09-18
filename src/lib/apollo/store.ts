import { makeVar } from '@apollo/client';
import type { User } from '@/types/user.types';

/* ======================== Reactive Variables ======================== */

// Theme state
export const themeVar = makeVar<Record<string, any>>({});

// User state - reactive variable for immediate UI updates
export const userVar = makeVar<User | null>(null);

// WebSocket connection reference
export const socketVar = makeVar<WebSocket | null>(null);

// Cart state for local updates
export const cartCountVar = makeVar<number>(0);

// Loading states
export const globalLoadingVar = makeVar<boolean>(false);

// Notification state
export const notificationVar = makeVar<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
} | null>(null);

/* ======================== Helper Functions ======================== */

// Helper to get current user
export const getCurrentUser = (): User | null => userVar();

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = userVar();
  return !!user && !!user._id;
};

// Helper to update cart count
export const updateCartCount = (count: number): void => {
  cartCountVar(count);
};

// Helper to show notifications
export const showNotification = (
  message: string, 
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
): void => {
  notificationVar({ show: true, message, type });
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notificationVar(null);
  }, 5000);
};

// Helper to hide notifications
export const hideNotification = (): void => {
  notificationVar(null);
};