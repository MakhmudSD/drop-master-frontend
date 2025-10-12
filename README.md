# Drop Master Frontend

Modern Next.js-based frontend for automated dropshipping management platform. Browse products from multiple e-commerce platforms, manage cart, and automate your dropshipping business.

## 🚀 Features

- **Multi-Platform Product Discovery**: Browse products from Naver, Coupang, 11st, AliExpress, and Alibaba
- **Real-time Product Data**: Live fetching with automatic fallback mechanisms
- **Authentication**: JWT-based auth with OAuth2 (Google, Kakao, Naver)
- **Shopping Cart**: Add products, update quantities, manage orders
- **Product Management**: Complete product lifecycle management
- **Automation Dashboard**: Configure automated product syncing
- **Internationalization**: Korean/English language support
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Drop Master Backend running (see backend README)

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file:

```env
# REQUIRED: Backend API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL_GRAPHQL=http://localhost:3001/graphql

# REQUIRED: OpenAI for translation
OPENAI_API_KEY=your_openai_api_key_here

# REQUIRED: Session secret
SESSION_SECRET=your_session_secret_here

# RECOMMENDED: At least one OAuth provider
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Kakao OAuth
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
NEXT_PUBLIC_KAKAO_CALLBACK_URL=http://localhost:3001/api/auth/kakao/callback

# Naver OAuth
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
NEXT_PUBLIC_NAVER_CALLBACK_URL=http://localhost:3001/api/auth/naver/callback

# OPTIONAL: Shopping platform APIs
NAVER_SHOPPING_API_KEY=your_api_key
COUPANG_API_KEY=your_api_key
ELEVENST_API_KEY=your_api_key
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Linting
```bash
npm run lint
```

## 📦 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── cart/                    # Shopping cart
│   ├── products/                # Products management
│   ├── automation/              # Automation settings
│   ├── profile/                 # User profile
│   ├── scraping/                # Web scraping interface
│   ├── search/                  # Product search
│   ├── auth/callback/           # OAuth callback handler
│   └── api/                     # API routes
│       ├── products/            # Products API
│       ├── search/              # Search API
│       └── upload/              # Image upload API
├── components/                   # Reusable components
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Footer
│   ├── PopularProducts.tsx      # Popular products display
│   ├── EditProductModal.tsx     # Product editing modal
│   ├── OAuthButtons.tsx         # Social login buttons
│   └── ...
├── contexts/                    # React contexts
│   └── AuthContext.tsx          # Authentication state
├── hooks/                       # Custom React hooks
│   ├── useCart.ts               # Cart management
│   ├── useProducts.ts           # Products fetching
│   ├── useUser.ts               # User state
│   └── ...
├── lib/                         # Libraries and utilities
│   └── apollo/                  # Apollo Client
│       ├── client.ts            # Apollo configuration
│       ├── queries/             # GraphQL queries
│       ├── mutations/           # GraphQL mutations
│       └── store.ts             # Reactive variables
├── types/                       # TypeScript type definitions
└── middleware.ts                # Next.js middleware
```

## 🔧 Key Technologies

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Apollo Client** - GraphQL client
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **Headless UI** - Accessible components
- **i18next** - Internationalization

## 🎯 Main Features Explained

### Authentication
- Email/password registration and login
- Social login (Google, Kakao, Naver)
- JWT token management
- Automatic token refresh
- Protected routes

### Product Discovery
- Browse products from multiple platforms
- Platform-specific filtering (Naver, Coupang, 11st, AliExpress)
- Time-based sorting (daily, weekly, monthly trends)
- Real-time data fetching with fallback

### Shopping Cart
- Add products with one click
- Update quantities
- Remove items
- Automatic price calculations
- Profit margin display

### Product Management
- View all your products
- Edit product details
- Bulk operations
- Status management
- Platform-specific configurations

### Automation
- Schedule automated tasks
- Configure automation rules
- Monitor runs
- Multi-platform support

## 🌐 API Integration

### GraphQL (Primary)
```typescript
import { useProducts } from '@/hooks/useProducts';

const { products, loading, error } = useProducts({
  platform: 'naver',
  limit: 20,
  query: '인기상품',
  timeFilter: 'daily'
});
```

### REST (Alternative)
```typescript
import { useProductsRest } from '@/hooks/useProductsRest';

const { products, loading } = useProductsRest({
  platform: 'coupang',
  limit: 20
});
```

## 🎨 Styling

- **Tailwind CSS 4**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Theme support with next-themes
- **Accessibility**: WCAG guidelines followed

## 🌍 Internationalization

Currently supports:
- Korean (ko) - Default
- English (en)

```typescript
import { useI18n } from '@/hooks/useI18n';

const { t, language, changeLanguage } = useI18n();
```

## 🔒 Security

- Environment variables protection
- JWT token storage and management
- CORS configuration
- Input validation
- XSS protection

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_API_URL_GRAPHQL` - Your GraphQL endpoint
- All OAuth client IDs (NEXT_PUBLIC_* variables)
- API keys

### Docker
```bash
# Build
docker build -t drop-master-frontend .

# Run
docker run -p 3000:3000 drop-master-frontend
```

## 🐛 Troubleshooting

### "Backend not reachable" Error
- Verify backend is running at `http://localhost:3001`
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Test backend health: `curl http://localhost:3001/api/health`

### OAuth Login Not Working
- Verify OAuth client IDs are correct
- Check callback URLs match OAuth provider settings
- Backend must be running for OAuth callbacks

### Products Not Loading
- Check backend GraphQL endpoint: `http://localhost:3001/graphql`
- Verify you're logged in (JWT token exists)
- Check browser console for errors

### Cart Empty After Adding Products
- Clear browser cache and localStorage
- Logout and login again
- Check browser console for GraphQL errors

### Hydration Errors
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Clear browser cache

## 🧪 Development

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Check for TypeScript Errors
```bash
npx tsc --noEmit
```

### View Build Analysis
```bash
npm run build
```

## 📱 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🎓 Getting Started

1. **Start Backend**: Follow backend README to start the API server
2. **Install Frontend**: Run `npm install`
3. **Configure .env**: Copy `.env.example` and add your credentials
4. **Start Dev Server**: Run `npm run dev`
5. **Open Browser**: Go to `http://localhost:3000`
6. **Register/Login**: Create an account or use OAuth
7. **Browse Products**: Explore products from different platforms
8. **Add to Cart**: Click "상품 등록하기" to add products
9. **Manage Cart**: View and manage your cart at `/cart`

## 📚 Important Notes

### OAuth Setup
If using OAuth (Google, Kakao, Naver):
1. Register your app on the provider's developer console
2. Add authorized origins: `http://localhost:3000`
3. Add authorized redirect URIs (backend callback URLs)
4. Copy client IDs to your `.env` file

### Backend Dependency
The frontend requires the backend to be running. Make sure:
- Backend is running at `http://localhost:3001`
- MongoDB is connected
- GraphQL endpoint is accessible at `http://localhost:3001/graphql`

### First Time Setup
1. Make sure backend is running first
2. Login or register an account
3. OAuth login requires proper credentials configured

## 🎯 Quick Start Commands

```bash
# Development
npm install          # Install dependencies
cp .env.example .env # Setup environment
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server
```

## 📄 License

UNLICENSED - Private Project

## 🆘 Support

For issues:
1. Check backend is running
2. Verify environment variables
3. Check browser console for errors
4. Review network tab for failed requests
5. Refer to troubleshooting section above

---

**Happy Dropshipping! 🚀**
