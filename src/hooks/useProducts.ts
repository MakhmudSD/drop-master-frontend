import { GET_POPULAR_PRODUCTS, GET_PRODUCT, SEARCH_PRODUCTS } from '@/lib/apollo/queries';
import { UseProductsResult } from '@/lib/hooks.types';
import { Product } from '@/types/product.types';
import { useQuery } from '@apollo/client/react';

interface UseProductsParams {
  platform: string;
  limit?: number;
  query?: string;
}

export const useProducts = ({ platform, limit = 8, query }: UseProductsParams): UseProductsResult => {
  const { data, loading, error, refetch } = useQuery<{ popularProducts: Product[] }>(GET_POPULAR_PRODUCTS, {
    variables: {
      platform,
      limit,
      query: query || '인기상품',
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  return {
    products: data?.popularProducts || [],
    loading,
    error: error || null,
    refetch: async (variables) => {
      await refetch(variables);
    },
  };
};

interface UseProductParams {
  id: string;
}

interface UseSearchProductsParams {
  query: string;
  platform?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export const useProduct = ({ id }: UseProductParams) => {
  const { data, loading, error, refetch } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });

  return {
    product: data?.product || null,
    loading,
    error: error || null,
    refetch: async () => {
      await refetch();
    },
  };
};

export const useSearchProducts = ({ 
  query, 
  platform, 
  category, 
  limit = 20, 
  offset = 0 
}: UseSearchProductsParams) => {
  const { data, loading, error, refetch } = useQuery<{ searchProducts: Product[] }>(SEARCH_PRODUCTS, {
    variables: {
      query,
      platform,
      category,
      limit,
      offset,
    },
    errorPolicy: 'all',
    skip: !query,
  });

  return {
    products: data?.searchProducts || [],
    loading,
    error: error || null,
    refetch: async (variables?: Partial<UseSearchProductsParams>) => {
      await refetch(variables);
    },
  };
};
