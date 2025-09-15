import { GET_CART_ITEMS, GET_CART_SUMMARY } from '@/lib/apollo/queries';
import { ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from '@/lib/apollo/mutations';
import { UseCartResult } from '@/lib/hooks.types';
import { useMutation, useQuery } from '@apollo/client/react';
import { CartItem } from '@/types';

export const useCart = (): UseCartResult => {
  const { data: cartItemsData, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useQuery<{ cartItems: CartItem[] }>(GET_CART_ITEMS, {
    errorPolicy: 'all'
  });

  const { data: cartSummaryData, loading: summaryLoading, error: summaryError } = useQuery<{ cartSummary: { totalItems: number; finalAmount: number } }>(GET_CART_SUMMARY, {
    errorPolicy: 'all'
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    refetchQueries: [GET_CART_ITEMS, GET_CART_SUMMARY]
  });

  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, {
    refetchQueries: [GET_CART_ITEMS, GET_CART_SUMMARY]
  });

  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: [GET_CART_ITEMS, GET_CART_SUMMARY]
  });

  const [clearCartMutation] = useMutation(CLEAR_CART, {
    refetchQueries: [GET_CART_ITEMS, GET_CART_SUMMARY]
  });

  const addToCart = async (productId: string, quantity: number, specifications?: any) => {
    try {
      const { data } = await addToCartMutation({
        variables: { productId, quantity, specifications }
      });
      return data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  };

  const updateCartItem = async (id: string, quantity: number) => {
    try {
      const { data } = await updateCartItemMutation({
        variables: { id, quantity }
      });
      return data;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const { data } = await removeFromCartMutation({
        variables: { id }
      });
      return data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await clearCartMutation();
      return data;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  };

  return {
    cartItems: cartItemsData?.cartItems || [],
    totalItems: cartSummaryData?.cartSummary?.totalItems || 0,
    totalAmount: cartSummaryData?.cartSummary?.finalAmount || 0,
    loading: itemsLoading || summaryLoading,
    error: itemsError || summaryError,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
};
