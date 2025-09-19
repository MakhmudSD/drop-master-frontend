import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const FETCH_PRODUCTS = gql`
  query FetchProducts($platform: String!, $queries: [String!]!) {
    fetchProducts(platform: $platform, queries: $queries) {
      title
      link
    }
  }
`;

interface SimpleProduct {
  title: string;
  link: string;
}

interface UseFetchProductsParams {
  platform: string;
  queries: string[];
}

interface UseFetchProductsResult {
  products: SimpleProduct[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useFetchProducts = ({ platform, queries }: UseFetchProductsParams): UseFetchProductsResult => {
  const { data, loading, error, refetch } = useQuery<{ fetchProducts: SimpleProduct[] }>(FETCH_PRODUCTS, {
    variables: {
      platform,
      queries,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: !platform || !queries.length,
  });

  return {
    products: data?.fetchProducts || [],
    loading,
    error: error || null,
    refetch,
  };
};
