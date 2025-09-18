# Products Hooks Usage Guide

This guide explains how to use the refactored product hooks that follow clean coding principles and proper error handling.

## Available Hooks

### 1. `useProducts` (REST Version) - `useProductsRest.ts`

**Features:**
- ✅ Uses `process.env.NEXT_PUBLIC_API_URL` instead of hardcoded localhost
- ✅ Comprehensive error handling for network failures and API errors
- ✅ Fallback dataset for demo purposes when API fails
- ✅ Safe defaults to prevent undefined errors
- ✅ Compatible with Next.js Image component
- ✅ Clean and reusable `refetch` function
- ✅ Proper TypeScript typing with no `any` types
- ✅ Removed duplicated logic

**Usage:**
```typescript
import { useProducts } from '@/hooks/useProductsRest';

// Basic usage
const { products, loading, error, refetch } = useProducts({
  platform: 'coupang',
  limit: 8,
  sortBy: 'daily'
});

// Using with custom parameters
const { products, loading, error, refetch } = useProducts({
  platform: 'naver',
  limit: 12,
  sortBy: 'weekly'
});

// Refetch with new parameters
await refetch({
  platform: 'gmarket',
  limit: 16,
  sortBy: 'monthly'
});
```

### 2. `useProducts` (GraphQL Version) - `useProducts.ts`

**Features:**
- ✅ Updated to match REST version API consistency
- ✅ Proper TypeScript typing
- ✅ Clean refetch function

**Usage:**
```typescript
import { useProducts, useProduct, useSearchProducts } from '@/hooks/useProducts';

// Get popular products
const { products, loading, error, refetch } = useProducts({
  platform: 'coupang',
  limit: 8,
  sortBy: 'daily'
});

// Get single product
const { product, loading, error, refetch } = useProduct({
  id: 'product-123'
});

// Search products
const { products, loading, error, refetch } = useSearchProducts({
  query: '무선이어폰',
  platform: 'coupang',
  category: '전자기기',
  limit: 20,
  offset: 0
});
```

## Error Handling

The hooks provide comprehensive error handling:

```typescript
const { products, loading, error, refetch } = useProducts({
  platform: 'coupang'
});

if (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message, 'Status:', error.status);
  } else if (error instanceof NetworkError) {
    console.log('Network Error:', error.message);
  } else {
    console.log('Unknown Error:', error.message);
  }
}
```

## Product Data Structure

All products now have consistent, safe defaults:

```typescript
interface Product {
  id: string;                    // Always present
  title: string;                 // Safe default: '상품명 없음'
  name: string;                  // Safe default: '상품명 없음'
  price: number;                 // Safe default: 0
  image: string;                 // Safe default: placeholder image
  imageUrl: string;              // Safe default: placeholder image
  salesCount: number;            // Safe default: 0
  growthRate: number;            // Safe default: 0
  estimatedMargin: number;       // Safe default: 0
  link: string;                  // Safe default: '#'
  platform: string;             // Always present
  description: string;           // Safe default: ''
  brand: string;                 // Safe default: 'Unknown'
  category: string;              // Safe default: 'General'
  availability: string;          // Safe default: 'In Stock'
  rating: number;                // Safe default: 0
  reviewCount: number;           // Safe default: 0
  shippingInfo: string;          // Safe default: '무료배송'
  tags: string[];                // Safe default: []
  originalPrice: string;         // Safe default: ''
  discount: number;              // Safe default: 0
  stock: number;                 // Safe default: 0
  seller: string;                // Safe default: 'Unknown'
  location: string;              // Safe default: '서울'
  specifications: Record<string, unknown>; // Safe default: {}
  competitionLevel: 'high' | 'medium' | 'low'; // Safe default: 'medium'
  alibabaPrice: number;          // Safe default: 0
}
```

## Next.js Image Integration

The hooks are now compatible with Next.js Image component thanks to the updated `next.config.ts`:

```typescript
import Image from 'next/image';

const ProductCard = ({ product }: { product: Product }) => (
  <div>
    <Image
      src={product.image}
      alt={product.title}
      width={300}
      height={300}
      priority
    />
    <h3>{product.title}</h3>
    <p>{product.price.toLocaleString()}원</p>
  </div>
);
```

## Environment Configuration

Make sure your `.env.local` includes:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, update this to your actual API URL.

## Hook Factory Pattern

For advanced usage, use the hook factory to create specialized hooks:

```typescript
import { createProductsHook } from '@/hooks/useProductsRest';

// Create a hook with default settings for Coupang
const useCoupangProducts = createProductsHook({
  platform: 'coupang',
  limit: 12,
  sortBy: 'daily'
});

// Use the created hook (note: this should be used as a React hook)
const { products, loading, error, refetch } = useCoupangProducts({
  limit: 20 // Override default limit
});
```

## Migration Guide

If you're migrating from the old hooks:

### Before (Old API)
```typescript
const { products, loading, error, refetch } = useProducts('coupang', 8, 'daily');
```

### After (New API)
```typescript
const { products, loading, error, refetch } = useProducts({
  platform: 'coupang',
  limit: 8,
  sortBy: 'daily'
});
```

The new API is more explicit and provides better TypeScript support.
