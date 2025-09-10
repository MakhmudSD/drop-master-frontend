# OAuth Authentication Setup

This document explains how to set up OAuth authentication for Google, Kakao, and Naver in the Drop Master application.

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id_here
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id_here
```

## Backend Environment Variables

Add these to your backend `.env` file:

```env
# OAuth Provider Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

KAKAO_CLIENT_ID=your_kakao_client_id_here
KAKAO_CLIENT_SECRET=your_kakao_client_secret_here
KAKAO_CALLBACK_URL=http://localhost:3001/api/auth/kakao/callback

NAVER_CLIENT_ID=your_naver_client_id_here
NAVER_CLIENT_SECRET=your_naver_client_secret_here
NAVER_CALLBACK_URL=http://localhost:3001/api/auth/naver/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## OAuth Provider Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)

### Kakao OAuth
1. Go to [Kakao Developers](https://developers.kakao.com/)
2. Create a new application
3. Go to Product Settings → Kakao Login
4. Set redirect URI:
   - `http://localhost:3001/api/auth/kakao/callback` (for development)
   - `https://yourdomain.com/api/auth/kakao/callback` (for production)

### Naver OAuth
1. Go to [Naver Developers](https://developers.naver.com/)
2. Create a new application
3. Go to API 설정 → 네이버 로그인
4. Set callback URL:
   - `http://localhost:3001/api/auth/naver/callback` (for development)
   - `https://yourdomain.com/api/auth/naver/callback` (for production)

## Features Implemented

### Backend
- ✅ Unified OAuth authentication service
- ✅ Support for Google, Kakao, and Naver providers
- ✅ User creation and login for OAuth users
- ✅ JWT token generation
- ✅ Provider-specific user ID storage

### Frontend
- ✅ Modern OAuth buttons with SCSS styling
- ✅ Google OAuth using @react-oauth/google
- ✅ Kakao OAuth using Kakao SDK
- ✅ Naver OAuth using Naver SDK
- ✅ Unified authentication context
- ✅ Error handling and loading states
- ✅ Responsive design

## Usage

The OAuth buttons are automatically included in both login and register pages. Users can:

1. **Login with existing account**: Use email/password form
2. **Register new account**: Use email/password form
3. **OAuth Login/Register**: Click any of the OAuth provider buttons

The system will automatically:
- Create new users for OAuth logins
- Link OAuth accounts to existing email addresses
- Generate JWT tokens for authentication
- Handle all OAuth provider responses

## Styling

The OAuth buttons use SCSS modules with clear, semantic class names:
- `.oauthContainer` - Main container
- `.oauthButtons` - Button wrapper
- `.kakaoButton` - Kakao-specific styling
- `.naverButton` - Naver-specific styling
- `.divider` - "또는" divider styling

All styles are responsive and follow modern design principles.
