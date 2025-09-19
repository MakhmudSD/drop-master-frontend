import { useCallback, useEffect } from 'react';
import { GET_CART_ITEMS, GET_CART_SUMMARY } from '@/lib/apollo/queries';
import { ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from '@/lib/apollo/mutations';
import { UseCartResult } from '@/lib/hooks.types';
import { CartItem } from '@/types/cart.types';
import { cartCountVar, showNotification, updateCartCount } from '@/lib/apollo/store';
import { OperationVariables } from '@apollo/client';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client/react';

// Mutation response types
interface AddToCartResponse {
  addCartItem: {
    success: boolean;
    cartItem?: CartItem;
    message?: string;
  };
}

interface UpdateCartItemResponse {
  updateCartItem: {
    success: boolean;
    cartItem?: CartItem;
    message?: string;
  };
}

interface RemoveFromCartResponse {
  removeCartItem: {
    success: boolean;
    message?: string;
  };
}

interface ClearCartResponse {
  clearCart: {
    success: boolean;
    message?: string;
  };
}

interface CartSummaryData {
  cartSummary: {
    totalItems: number;
    totalAmount: number;
    shippingCost?: number;
    taxAmount?: number;
    discountAmount?: number;
    finalAmount: number;
  };
}

export const useCart = (): UseCartResult => {
  const cartCount = useReactiveVar(cartCountVar);

  // --- Cart Items Query ---
  const { data: cartItemsData, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useQuery<{ cartItems: CartItem[] }, OperationVariables>(GET_CART_ITEMS, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (cartItemsData?.cartItems) {
      const itemCount = cartItemsData.cartItems.reduce((total, item) => total + item.quantity, 0) || 0;
      updateCartCount(itemCount);
    }
  }, [cartItemsData]);

  // --- Cart Summary Query ---
  const { data: cartSummaryData, loading: summaryLoading, error: summaryError } = useQuery<CartSummaryData>(GET_CART_SUMMARY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // --- Mutations ---
  const [addToCartMutation, { loading: addToCartLoading }] = useMutation<AddToCartResponse>(ADD_TO_CART, {
    errorPolicy: 'all',
    refetchQueries: [{ query: GET_CART_ITEMS }, { query: GET_CART_SUMMARY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.addCartItem?.success) {
        showNotification(data.addCartItem.message || 'Product added to cart!', 'success');
      } else {
        showNotification(data?.addCartItem?.message || 'Failed to add product', 'error');
      }
    },
    onError: (error) => {
      console.error('Add to cart error:', error);
      showNotification('Failed to add product to cart', 'error');
    },
  });

  const [updateCartItemMutation, { loading: updateCartLoading }] = useMutation<UpdateCartItemResponse>(UPDATE_CART_ITEM, {
    errorPolicy: 'all',
    refetchQueries: [{ query: GET_CART_ITEMS }, { query: GET_CART_SUMMARY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.updateCartItem?.success) {
        showNotification('Cart updated successfully!', 'success');
      } else {
        showNotification(data?.updateCartItem?.message || 'Failed to update cart', 'error');
      }
    },
    onError: (error) => {
      console.error('Update cart item error:', error);
      showNotification('Failed to update cart item', 'error');
    },
  });

  const [removeFromCartMutation, { loading: removeFromCartLoading }] = useMutation<RemoveFromCartResponse>(REMOVE_FROM_CART, {
    errorPolicy: 'all',
    refetchQueries: [{ query: GET_CART_ITEMS }, { query: GET_CART_SUMMARY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.removeCartItem?.success) {
        showNotification('Item removed from cart', 'success');
      } else {
        showNotification(data?.removeCartItem?.message || 'Failed to remove item', 'error');
      }
    },
    onError: (error) => {
      console.error('Remove from cart error:', error);
      showNotification('Failed to remove item from cart', 'error');
    },
  });

  const [clearCartMutation, { loading: clearCartLoading }] = useMutation<ClearCartResponse>(CLEAR_CART, {
    errorPolicy: 'all',
    refetchQueries: [{ query: GET_CART_ITEMS }, { query: GET_CART_SUMMARY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.clearCart?.success) {
        updateCartCount(0);
        showNotification('Cart cleared successfully!', 'success');
      } else {
        showNotification(data?.clearCart?.message || 'Failed to clear cart', 'error');
      }
    },
    onError: (error) => {
      console.error('Clear cart error:', error);
      showNotification('Failed to clear cart', 'error');
    },
  });

  // --- Cart Operations ---
  const addToCart = useCallback(async (productId: string, quantity: number, specifications?: Record<string, unknown>): Promise<CartItem | null> => {
    try {
      const { data } = await addToCartMutation({
        variables: {
          productId,
          quantity,
          specifications: specifications ? JSON.stringify(specifications) : null,
        },
      });
      if (data?.addCartItem?.success && data.addCartItem.cartItem) return data.addCartItem.cartItem;
      throw new Error(data?.addCartItem?.message || 'Failed to add item');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [addToCartMutation]);

  const updateCartItem = useCallback(async (id: string, quantity: number): Promise<CartItem | null> => {
    try {
      const { data } = await updateCartItemMutation({ variables: { id, quantity } });
      if (data?.updateCartItem?.success && data.updateCartItem.cartItem) return data.updateCartItem.cartItem;
      throw new Error(data?.updateCartItem?.message || 'Failed to update item');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [updateCartItemMutation]);

  const removeFromCart = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { data } = await removeFromCartMutation({ variables: { id } });
      if (data?.removeCartItem?.success) return true;
      throw new Error(data?.removeCartItem?.message || 'Failed to remove item');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [removeFromCartMutation]);

  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await clearCartMutation();
      if (data?.clearCart?.success) return true;
      throw new Error(data?.clearCart?.message || 'Failed to clear cart');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [clearCartMutation]);

  // --- Loading & Return ---
  const loading = itemsLoading || summaryLoading || addToCartLoading || updateCartLoading || removeFromCartLoading || clearCartLoading;

  return {
    cartItems: cartItemsData?.cartItems || [],
    totalItems: cartSummaryData?.cartSummary?.totalItems || cartCount,
    totalAmount: cartSummaryData?.cartSummary?.finalAmount || 0,
    loading,
    error: itemsError || summaryError || null,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
};