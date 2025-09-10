# Drop Master Frontend

AI 기반 자동화 드롭쉬핑 플랫폼의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 주요 기능

### 🏠 홈페이지
- 히어로 섹션
- 기능 소개
- 인기 상품 실시간 표시
- 플랫폼별 상품 필터링

### 🔐 인증
- 로그인/회원가입 페이지
- JWT 토큰 기반 인증
- 자동 로그인 상태 관리

### 🛍️ 상품 관리
- 상품 목록 및 상세 보기
- 실시간 상품 데이터 표시
- 플랫폼별 상품 필터링
- 상품 통계 대시보드

### 🤖 자동화
- 자동화 설정 관리
- 스케줄링 설정
- 자동 번역 설정

### 📊 분석
- 상품 성과 분석
- 수익성 분석
- 트렌드 분석

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.local .env.local
```

`.env.local` 파일에 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── login/             # 로그인 페이지
│   └── register/          # 회원가입 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── Header.tsx         # 헤더 컴포넌트
│   ├── Hero.tsx           # 히어로 섹션
│   ├── Features.tsx       # 기능 소개
│   ├── PopularProducts.tsx # 인기 상품
│   └── Footer.tsx         # 푸터 컴포넌트
├── contexts/              # React Context
│   └── AuthContext.tsx    # 인증 컨텍스트
├── lib/                   # 유틸리티 및 설정
│   └── api.ts             # API 클라이언트
├── types/                 # TypeScript 타입 정의
│   └── index.ts           # 공통 타입
└── styles/                # 스타일 파일
    └── globals.css        # 전역 스타일
```

## 주요 컴포넌트

### Header
- 네비게이션 메뉴
- 사용자 인증 상태 표시
- 반응형 모바일 메뉴

### PopularProducts
- 플랫폼별 상품 표시
- 실시간 데이터 로딩
- 상품 카드 레이아웃
- 플랫폼 로고 표시

### AuthContext
- 사용자 인증 상태 관리
- 로그인/로그아웃 기능
- 토큰 자동 관리

## API 통신

### API 클라이언트
- Axios 기반 HTTP 클라이언트
- 자동 토큰 첨부
- 에러 처리 및 리다이렉션

### 주요 API 엔드포인트
- `authApi`: 인증 관련 API
- `productsApi`: 상품 관리 API
- `scrapingApi`: 스크래핑 API

## 스타일링

### Tailwind CSS
- 유틸리티 퍼스트 CSS 프레임워크
- 반응형 디자인
- 다크 모드 지원

### 컴포넌트 스타일
- 일관된 디자인 시스템
- 재사용 가능한 스타일 클래스
- 접근성 고려

## 상태 관리

### React Context
- 전역 상태 관리
- 사용자 인증 상태
- 테마 설정

### 로컬 상태
- React useState/useEffect
- 컴포넌트별 상태 관리
- 폼 상태 관리

## 성능 최적화

### Next.js 최적화
- 자동 코드 분할
- 이미지 최적화
- 서버 사이드 렌더링

### React 최적화
- 컴포넌트 메모이제이션
- 불필요한 리렌더링 방지
- 지연 로딩

## 접근성

### WCAG 가이드라인
- 키보드 네비게이션
- 스크린 리더 지원
- 색상 대비 고려

### 반응형 디자인
- 모바일 우선 설계
- 다양한 화면 크기 지원
- 터치 친화적 인터페이스

## 개발 도구

### 코드 품질
- ESLint + Prettier
- TypeScript strict mode
- Husky pre-commit hooks

### 개발 환경
- Hot reload
- TypeScript 타입 체킹
- Tailwind CSS IntelliSense

## 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Docker
```bash
# Docker 이미지 빌드
docker build -t drop-master-frontend .

# Docker 컨테이너 실행
docker run -p 3000:3000 drop-master-frontend
```

### 환경 변수
프로덕션 환경에서는 다음 환경 변수를 설정하세요:
- `NEXT_PUBLIC_API_URL`: 백엔드 API URL

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 라이선스

MIT License