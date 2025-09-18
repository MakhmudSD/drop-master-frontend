'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// Test queries and mutations
const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems {
      id
      productName
      quantity
      price
    }
  }
`;

const ADD_CART_ITEM = gql`
  mutation AddCartItem($productId: ID!, $quantity: Int!) {
    addCartItem(input: {
      productId: $productId
      quantity: $quantity
    }) {
      success
      message
      cartItem {
        id
        productName
        quantity
        price
      }
    }
  }
`;

export const ApolloTestComponent: React.FC = () => {
  const [testToken, setTestToken] = useState('');
  
  // Query with automatic authentication
  const { data: cartData, loading: cartLoading, error: cartError, refetch } = useQuery(GET_CART_ITEMS, {
    fetchPolicy: 'cache-and-network'
  });

  // Mutation with automatic authentication
  const [addCartItem, { loading: addLoading }] = useMutation(ADD_CART_ITEM, {
    onCompleted: (data) => {
      console.log('Add cart item completed:', data);
      refetch(); // Refresh cart items
    },
    onError: (error) => {
      console.error('Add cart item error:', error);
    }
  });

  const handleSetTestToken = () => {
    // Set a test token in localStorage for testing
    const testJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGNiNjkzMGIyYThmN2QyN2ZkNjY2MWQiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTgxNjEyMDAsImV4cCI6MTc1ODc2NjAwMH0.Wwqr-fypjurX84x6kp0Zkba43CG424DCSxNCS1xyHT8';
    localStorage.setItem('jwtToken', testJWT);
    setTestToken(testJWT);
    console.log('Test JWT token set in localStorage');
  };

  const handleClearToken = () => {
    localStorage.removeItem('jwtToken');
    setTestToken('');
    console.log('JWT token cleared from localStorage');
  };

  const handleTestQuery = () => {
    console.log('Testing GraphQL query with current token...');
    refetch();
  };

  const handleTestMutation = () => {
    console.log('Testing GraphQL mutation with current token...');
    addCartItem({
      variables: {
        productId: 'apollo-test-product-' + Date.now(),
        quantity: 1
      }
    });
  };

  const currentToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Apollo Client JWT Test</h2>
      
      {/* Token Management */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Token Management</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Current Token Status:</p>
            <p className={`font-mono text-xs ${currentToken ? 'text-green-600' : 'text-red-600'}`}>
              {currentToken ? `Token Set (${currentToken.length} chars)` : 'No Token'}
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleSetTestToken}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Set Test Token
            </button>
            <button
              onClick={handleClearToken}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Token
            </button>
          </div>
        </div>
      </div>

      {/* GraphQL Testing */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">GraphQL Operations</h3>
        <div className="space-y-3">
          <div className="space-x-2">
            <button
              onClick={handleTestQuery}
              disabled={cartLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {cartLoading ? 'Testing Query...' : 'Test Query (cartItems)'}
            </button>
            <button
              onClick={handleTestMutation}
              disabled={addLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {addLoading ? 'Testing Mutation...' : 'Test Mutation (addCartItem)'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="space-y-4">
        {/* Query Results */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Query Results (cartItems)</h3>
          {cartLoading && <p className="text-blue-600">Loading cart items...</p>}
          {cartError && (
            <div className="text-red-600">
              <p className="font-semibold">Error:</p>
              <pre className="text-xs bg-red-50 p-2 rounded mt-1">{cartError.message}</pre>
            </div>
          )}
          {cartData && (
            <div className="text-green-600">
              <p className="font-semibold">Success!</p>
              <pre className="text-xs bg-green-50 p-2 rounded mt-1">
                {JSON.stringify(cartData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Console Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">🔍 Debug Instructions</h3>
          <p className="text-blue-700 text-sm">
            Open the browser&apos;s developer console (F12) to see detailed Apollo Client logs including:
          </p>
          <ul className="list-disc list-inside text-blue-700 text-sm mt-2 space-y-1">
            <li>Operation names being executed</li>
            <li>Token presence and length</li>
            <li>Complete outgoing headers for each request</li>
            <li>Authentication status for each GraphQL operation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApolloTestComponent;
