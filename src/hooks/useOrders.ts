import { GET_ORDERS, GET_ORDER, GET_ORDER_HISTORY } from '@/lib/apollo/queries';
import { CREATE_ORDER, UPDATE_ORDER_STATUS, CANCEL_ORDER } from '@/lib/apollo/mutations';
import { UseOrdersResult } from '@/lib/hooks.types';
import { useMutation, useQuery } from '@apollo/client/react';
import { Order } from '@/types/order.types';

export const useOrders = (limit?: number, offset?: number, status?: string, sortBy?: string) => {
  const { data, loading, error, refetch } = useQuery<{ orders: Order[] }>(GET_ORDERS, {
    variables: {
      limit: limit || 10,
      offset: offset || 0,
      status,
      sortBy
    },
    errorPolicy: 'all'
  });

  return {
    orders: data?.orders || [],
    loading,
    error,
    refetch
  };
};

export const useOrder = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ order: Order }>(GET_ORDER, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id
  });

  return {
    order: data?.order || null,
    loading,
    error,
    refetch
  };
};

export const useOrderHistory = (limit?: number, offset?: number) => {
  const { data, loading, error, refetch } = useQuery<{ orderHistory: Order[] }>(GET_ORDER_HISTORY, {
    variables: {
      limit: limit || 20,
      offset: offset || 0
    },
    errorPolicy: 'all'
  });

  return {
    orders: data?.orderHistory || [],
    loading,
    error,
    refetch
  };
};

export const useOrderMutations = (): UseOrdersResult => {
  const [createOrderMutation] = useMutation(CREATE_ORDER, {
    refetchQueries: [GET_ORDERS, GET_ORDER_HISTORY]
  });

  const [updateOrderStatusMutation] = useMutation(UPDATE_ORDER_STATUS, {
    refetchQueries: [GET_ORDERS, GET_ORDER]
  });

  const [cancelOrderMutation] = useMutation(CANCEL_ORDER, {
    refetchQueries: [GET_ORDERS, GET_ORDER]
  });

  const createOrder = async (orderData: any) => {
    try {
      const { data } = await createOrderMutation({
        variables: orderData
      });
      return data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: string, trackingNumber?: string) => {
    try {
      const { data } = await updateOrderStatusMutation({
        variables: { id, status, trackingNumber }
      });
      return data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  };

  return {
    orders: [],
    loading: false,
    error: null,
    createOrder,
    updateOrderStatus
  };
};
