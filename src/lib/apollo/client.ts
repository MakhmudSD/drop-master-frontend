import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
  createHttpLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { socketVar, userVar } from './store';

// Global Apollo Client instance
let apolloClient: ApolloClient | undefined;

/* ======================== Authentication Helpers ======================== */

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem('accessToken') || localStorage.getItem('jwtToken') || null;
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
    return null;
  }
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.warn('Failed to parse stored user:', error);
    return null;
  }
};

/* ======================== WebSocket Helpers ======================== */

const getBrowserWsBase = (): string => {
  return (
    process.env.NEXT_PUBLIC_API_WS ||
    process.env.REACT_APP_API_WS ||
    'ws://localhost:3001'
  );
};

const parseWsBase = (raw?: string): { origin: string; basePath: string } => {
  const rawClean = (raw || 'ws://localhost:3001').trim().replace(/\/+$/, '');
  
  try {
    const ensured = /^wss?:\/\//i.test(rawClean) ? rawClean : `ws://${rawClean}`;
    const url = new URL(ensured);
    let basePath = (url.pathname || '').replace(/\/+$/, '');
    if (basePath === '/') basePath = '';
    const origin = `${url.protocol}//${url.host}`;
    return { origin, basePath };
  } catch (error) {
    console.warn('Failed to parse WebSocket URL:', error);
    return { origin: 'ws://localhost:3001', basePath: '' };
  }
};

const normalizePath = (path: string): string => {
  if (!path) return '';
  const normalized = '/' + path.replace(/^\/+|\/+$/g, '');
  return normalized === '/' ? '' : normalized;
};

const buildWsUrl = (origin: string, path: string, token: string): string => {
  const normalizedPath = normalizePath(path);
  const encodedToken = encodeURIComponent(token);
  return `${origin}${normalizedPath}?token=${encodedToken}`;
};

/* ======================== WebSocket Connection ======================== */

let wsInitialized = false;
let wsInstance: WebSocket | null = null;

export const initAppWebSocketOnce = (): void => {
  if (typeof window === 'undefined') return;
  if (wsInitialized) return;
  
  wsInitialized = true;

  const token = getAuthToken();
  if (!token) {
    console.warn('[WebSocket] Skipped: missing authentication token');
    return;
  }

  // Check if WebSocket is disabled via environment variable
  if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
    console.log('[WebSocket] Disabled via environment variable');
    return;
  }

  const { origin, basePath } = parseWsBase(getBrowserWsBase());
  const candidates = ['', basePath, '/ws', '/socket']
    .map(path => path === '/' || path == null ? '' : path)
    .filter((path, index, array) => array.indexOf(path) === index); // Remove duplicates

  let connected = false;

  const attemptConnection = (candidateIndex: number): void => {
    if (connected || candidateIndex >= candidates.length) {
      if (!connected) {
        console.warn('[WebSocket] Connection not available - this is optional and app will work without it');
      }
      return;
    }

    const path = candidates[candidateIndex];
    const url = buildWsUrl(origin, path, token);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[WebSocket] Attempting connection: ${url}`);
    }

    // Close previous instance if exists
    if (wsInstance) {
      try {
        wsInstance.close(1000, 'superseded');
      } catch (error) {
        console.warn('[WebSocket] Error closing previous instance:', error);
      }
    }

    wsInstance = new WebSocket(url);
    socketVar(wsInstance);

    const timeout = setTimeout(() => {
      if (wsInstance && !connected) {
        try {
          wsInstance.close(4000, 'connection-timeout');
        } catch (error) {
          console.warn('[WebSocket] Error closing timed out connection:', error);
        }
      }
    }, 3000);

    let heartbeatInterval: number | null = null;

    wsInstance.addEventListener('open', () => {
      if (!connected) {
        connected = true;
        clearTimeout(timeout);
        console.log(`[WebSocket] Connected: ${url}`);
      }
    });

    wsInstance.addEventListener('message', (event) => {
      // Start heartbeat after first message from server
      if (!heartbeatInterval) {
        heartbeatInterval = window.setInterval(() => {
          if (wsInstance?.readyState === WebSocket.OPEN) {
            try {
              wsInstance.send(JSON.stringify({ type: 'ping' }));
            } catch (error) {
              console.warn('[WebSocket] Heartbeat failed:', error);
            }
          } else if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }
        }, 25000);
      }

      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] Message received:', data);
      } catch (error) {
        console.log('[WebSocket] Raw message:', event.data);
      }
    });

    wsInstance.addEventListener('close', (event) => {
      clearTimeout(timeout);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      
      console.log(`[WebSocket] Connection closed: ${event.code} ${event.reason}`);

      if (!connected) {
        // Try next candidate
        attemptConnection(candidateIndex + 1);
      }
    });

    wsInstance.addEventListener('error', (error) => {
      console.warn(`[WebSocket] Error on path ${path || '/'}:`, error);
    });
  };

  attemptConnection(0);

  // Allow re-initialization on page reload
  window.addEventListener('beforeunload', () => {
    wsInitialized = false;
  }, { once: true });
};

/* ======================== Apollo Links ======================== */

// Authentication link
const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  };
});

// HTTP link with upload support
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL_GRAPHQL ||
       process.env.REACT_APP_API_GRAPHQL_URL ||
       'http://localhost:3001/graphql',
  credentials: 'include',
});

// Error handling link
const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError, operation, forward } = errorResponse as any;
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorMessage = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
      console.error(errorMessage);
      
      // Show user-friendly errors (exclude input validation messages)
      if (!message?.toLowerCase().includes('input') && 
          !message?.toLowerCase().includes('validation')) {
        // You can integrate with your notification system here
        console.warn('GraphQL Error for user:', message);
      }

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('user');
          userVar(null);
          
          // Redirect to login if needed
          if (!window.location.pathname.includes('/auth')) {
            console.log('Authentication required, redirecting to login');
            // You can trigger your login redirect here
          }
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError.message}`);
    
    // Handle specific network errors
    if (networkError.message?.includes('fetch')) {
      console.warn('Network connectivity issue detected');
    }
  }
});

// Request logging link (development only)
const requestLoggerLink = new ApolloLink((operation, forward) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Apollo] Starting request for ${operation.operationName}`);
  }
  
  return forward(operation);
});

/* ======================== Apollo Cache Configuration ======================== */

const createInMemoryCache = (): InMemoryCache => {
  return new InMemoryCache({
    typePolicies: {
      // Cart type policies for proper caching
      Cart: {
        fields: {
          items: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      
      // User type policies
      User: {
        keyFields: ['_id'],
      },
      
      // Product type policies
      Product: {
        keyFields: ['id'],
      },
      
      // CartItem type policies
      CartItem: {
        keyFields: ['id'],
      },
      
      // Query field policies
      Query: {
        fields: {
          cartItems: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          products: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });
};

/* ======================== Apollo Client Factory ======================== */

const createApolloClient = (): ApolloClient => {
  // Initialize WebSocket if we have a token
  if (typeof window !== 'undefined' && getAuthToken()) {
    initAppWebSocketOnce();
  }

  // Initialize user state from localStorage
  if (typeof window !== 'undefined') {
    const storedUser = getStoredUser();
    if (storedUser) {
      userVar(storedUser);
    }
  }

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([
      errorLink,
      ...(process.env.NODE_ENV === 'development' ? [requestLoggerLink] : []),
      authLink,
      httpLink,
    ]),
    cache: createInMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

/* ======================== Apollo Client Initialization ======================== */

export const initializeApollo = (initialState: any = null): ApolloClient => {
  const client = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = client.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = { ...(typeof existingCache === 'object' && existingCache ? existingCache : {}), ...(typeof initialState === 'object' && initialState ? initialState : {}) };

    // Restore the cache with the merged data
    client.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return client;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = client;

  return client;
};

export const useApollo = (initialState: any): ApolloClient => {
  return useMemo(() => initializeApollo(initialState), [initialState]);
};

/* ======================== Utility Functions ======================== */

// Function to update user state across the app
export const updateUserState = (user: any): void => {
  if (typeof window !== 'undefined') {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        userVar(user);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('jwtToken');
        userVar(null);
      }
    } catch (error) {
      console.error('Failed to update user state:', error);
    }
  }
};

// Function to clear all auth data
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('jwtToken');
      userVar(null);
      
      // Close WebSocket connection
      if (wsInstance) {
        wsInstance.close(1000, 'logout');
        wsInstance = null;
        socketVar(null);
      }
      
      // Reset WebSocket initialization flag
      wsInitialized = false;
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }
};

export default createApolloClient;