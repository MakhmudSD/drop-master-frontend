import { GET_POPULAR_PRODUCTS, GET_PRODUCT, SEARCH_PRODUCTS } from '@/lib/apollo/queries';
import { UseProductsResult } from '@/lib/hooks.types';
import { Product } from '@/types/product.types';
import { useQuery } from '@apollo/client/react';

export const useProducts = (platform: string, limit?: number, sortBy?: string): UseProductsResult => {
  const { data, loading, error, refetch } = useQuery<{ popularProducts: Product[] }>(GET_POPULAR_PRODUCTS, {
    variables: {
      platform,
      limit: limit || 8,
      sortBy: sortBy || 'daily'
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    products: data?.popularProducts || [],
    loading,
    error,
    refetch: (variables) => refetch(variables)
  };
};

export const useProduct = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id
  });

  return {
    product: data?.product || null,
    loading,
    error,
    refetch
  };
};

export const useSearchProducts = (query: string, platform?: string, category?: string, limit?: number, offset?: number) => {
  const { data, loading, error, refetch } = useQuery<{ searchProducts: Product[] }>(SEARCH_PRODUCTS, {
    variables: {
      query,
      platform,
      category,
      limit: limit || 20,
      offset: offset || 0
    },
    errorPolicy: 'all',
    skip: !query
  });

  return {
    products: data?.searchProducts || [],
    loading,
    error,
    refetch
  };
};
