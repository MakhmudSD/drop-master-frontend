import { useReactiveVar } from '@apollo/client/react';
import { userVar, cartCountVar, isAuthenticated } from '@/lib/apollo/store';
import { User } from '@/types/user.types';

interface UseUserResult {
  user: User | null;
  isAuthenticated: boolean;
  cartCount: number;
}

/**
 * Hook for accessing reactive user state
 * This provides immediate UI updates when user state changes
 */
export const useUser = (): UseUserResult => {
  const user = useReactiveVar(userVar);
  const cartCount = useReactiveVar(cartCountVar);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    cartCount,
  };
};

/**
 * Hook for accessing just the authentication status
 * Useful for conditional rendering of authenticated content
 */
export const useIsAuthenticated = (): boolean => {
  const user = useReactiveVar(userVar);
  return !!user && !!user._id;
};

/**
 * Hook for accessing cart count only
 * Useful for cart badges and counters
 */
export const useCartCount = (): number => {
  return useReactiveVar(cartCountVar);
};
