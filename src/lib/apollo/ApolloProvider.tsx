'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { useApollo } from './client'; // your hook that creates Apollo client

type Props = {
  children: ReactNode;
  initialApolloState?: any; // optional
};

export default function ApolloWrapper({ children, initialApolloState }: Props) {
  const client = useApollo(initialApolloState);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
