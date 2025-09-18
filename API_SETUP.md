# Product API Integration Setup

This guide explains how to configure real API credentials for fetching products from various platforms.

## Environment Variables

Add these to your `.env.local` file:

### Naver Shopping API (Currently Integrated)
```env
NAVER_SHOPPING_API_KEY=your_actual_naver_client_id
NAVER_SHOPPING_SECRET_KEY=your_actual_naver_client_secret
```

**How to get Naver API credentials:**
1. Go to [Naver Developers](https://developers.naver.com/)
2. Create an application
3. Enable "Shopping" API
4. Copy Client ID and Client Secret

### Other Platforms (Placeholder)
```env
# Coupang API (when available)
COUPANG_API_KEY=your_coupang_api_key

# 11st API (when available) 
ELEVENST_API_KEY=your_11st_api_key

# AliExpress API (when available)
ALIEXPRESS_API_KEY=your_aliexpress_api_key
```

## Current Status

- ✅ **Naver**: Real API integration ready (needs credentials)
- ⏳ **Coupang**: Shows "no data found" (needs API implementation)
- ⏳ **11st**: Shows "no data found" (needs API implementation)  
- ⏳ **AliExpress**: Shows "no data found" (needs API implementation)

## How It Works

1. **With Credentials**: Fetches real products from the API
2. **Without Credentials**: Shows "API 연동이 필요합니다" message
3. **API Error**: Shows retry button with error message

## Adding New Platform APIs

To add a new platform:

1. Add credentials to `.env.local`
2. Update `src/lib/api/productSources.ts`
3. Implement the fetch function for that platform
4. The UI will automatically show real data when credentials are available

## Testing

- Start with Naver (most complete integration)
- Other platforms will show "no data found" until APIs are implemented
- Switch between platforms to see different states
