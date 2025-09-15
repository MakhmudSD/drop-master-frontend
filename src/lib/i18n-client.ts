'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  ko: {
    translation: {
      // Common
      'app.title': '드랍쉬핑 마스터',
      'common.loading': '로딩 중...',
      'common.apply': '적용',
      'common.cancel': '취소',
      'common.upload': '업로드',
      'common.refresh': '새로고침',
      'common.analysis': '분석',
      'common.save': '설정 저장',
      
      // Navigation
      'nav.home': '홈',
      'nav.dashboard': '대시보드',
      'nav.cart': '장바구니',
      'nav.settings': '설정',
      'nav.automation': '자동화',
      'nav.myPage': '마이페이지',
      'nav.login': '로그인',
      'nav.register': '회원가입',
      'nav.logout': '로그아웃',
      
      // Product Analysis
      'product.popular': '인기 상품',
      'product.analysis.description': '실시간 데이터로 분석된 인기 상품들을 확인하고 수익 기회를 발견하세요',
      'product.ranking.daily': '일간 인기상품 순위',
      'product.ranking.weekly': '주간 인기상품 순위',
      'product.ranking.monthly': '월간 인기상품 순위',
      'product.total': '총 {{count}}개',
      'product.sales': '판매량',
      'product.growth': '성장률',
      'product.margin': '예상 마진',
      'product.alibaba.price': '알리바바 가격',
      'product.register': '드랍쉬핑 상품으로 등록하기',
      'product.competition.high': '고경쟁',
      'product.competition.medium': '중경쟁',
      'product.competition.low': '저경쟁',
      
      // Platform Names
      'platform.naver': '네이버 플러스스토어',
      'platform.coupang': '쿠팡',
      'platform.11st': '11번가',
      'platform.aliexpress': '알리익스프레스',
      'platform.alibaba': '알리바바',
      'platform.1688': '1688',
      
      // Time Periods
      'time.daily': '일간',
      'time.weekly': '주간',
      'time.monthly': '월간',
      
      // Sourcing
      'sourcing.title': '자동 상품 소싱',
      'sourcing.description': '소싱할 플랫폼을 선택하세요',
      'sourcing.platform.selection': '플랫폼 선택',
      'sourcing.selected.platforms': '선택된 플랫폼',
      'sourcing.applying': '적용 중...',
      
      // Upload
      'upload.title': '자동 업로드',
      'upload.description': '업로드할 플랫폼을 선택하고 상품을 관리하세요',
      'upload.platform.selection': '업로드 플랫폼 선택',
      'upload.products': '소싱된 상품',
      'upload.register': '드랍쉬핑 등록하기',
      
      // Orders
      'orders.title': '주문 및 배송 관리',
      'orders.description': '주문 내역과 배송 상태를 확인하세요',
      'orders.history': '주문내역',
      'orders.delivery': '배송내역',
      'orders.status.completed': '주문완료',
      'orders.status.shipping': '배송중',
      'orders.status.delivered': '배송완료',
      
      // Settings
      'settings.title': '자동화 설정',
      'settings.description': '드롭쉬핑 자동화 옵션을 설정하세요',
      'settings.automation': '자동화 설정',
      'settings.auto.sourcing': '자동 소싱',
      'settings.auto.sourcing.description': '자동으로 상품을 발굴하고 분석합니다',
      'settings.auto.upload': '자동 업로드',
      'settings.auto.upload.description': '자동으로 상품을 업로드합니다',
      'settings.margin.rate': '마진율 설정',
      'settings.additional': '추가 설정',
      'settings.min.margin': '최소 마진율',
      'settings.min.sales': '최소 판매량',
      'settings.max.products': '일일 최대 상품 수',
      'settings.update.frequency': '업데이트 주기',
      'settings.frequency.1h': '1시간마다',
      'settings.frequency.6h': '6시간마다',
      'settings.frequency.12h': '12시간마다',
      'settings.frequency.24h': '24시간마다',
    }
  },
  en: {
    translation: {
      // Common
      'app.title': 'Dropshipping Master',
      'common.loading': 'Loading...',
      'common.apply': 'Apply',
      'common.cancel': 'Cancel',
      'common.upload': 'Upload',
      'common.refresh': 'Refresh',
      'common.analysis': 'Analysis',
      'common.save': 'Save Settings',
      
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.cart': 'Cart',
      'nav.settings': 'Settings',
      'nav.automation': 'Automation',
      'nav.myPage': 'My Page',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.logout': 'Logout',
      
      // Product Analysis
      'product.popular': 'Popular Products',
      'product.analysis.description': 'Discover profitable opportunities with real-time analyzed popular products',
      'product.ranking.daily': 'Daily Popular Products Ranking',
      'product.ranking.weekly': 'Weekly Popular Products Ranking',
      'product.ranking.monthly': 'Monthly Popular Products Ranking',
      'product.total': 'Total {{count}} items',
      'product.sales': 'Sales',
      'product.growth': 'Growth Rate',
      'product.margin': 'Estimated Margin',
      'product.alibaba.price': 'Alibaba Price',
      'product.register': 'Register as Dropshipping Product',
      'product.competition.high': 'High Competition',
      'product.competition.medium': 'Medium Competition',
      'product.competition.low': 'Low Competition',
      
      // Platform Names
      'platform.naver': 'Naver Plus Store',
      'platform.coupang': 'Coupang',
      'platform.11st': '11th Street',
      'platform.aliexpress': 'AliExpress',
      'platform.alibaba': 'Alibaba',
      'platform.1688': '1688',
      
      // Time Periods
      'time.daily': 'Daily',
      'time.weekly': 'Weekly',
      'time.monthly': 'Monthly',
      
      // Sourcing
      'sourcing.title': 'Automatic Product Sourcing',
      'sourcing.description': 'Select platforms to source products from',
      'sourcing.platform.selection': 'Platform Selection',
      'sourcing.selected.platforms': 'Selected Platforms',
      'sourcing.applying': 'Applying...',
      
      // Upload
      'upload.title': 'Automatic Upload',
      'upload.description': 'Select upload platforms and manage products',
      'upload.platform.selection': 'Upload Platform Selection',
      'upload.products': 'Sourced Products',
      'upload.register': 'Register as Dropshipping',
      
      // Orders
      'orders.title': 'Order & Delivery Management',
      'orders.description': 'Check order history and delivery status',
      'orders.history': 'Order History',
      'orders.delivery': 'Delivery History',
      'orders.status.completed': 'Order Completed',
      'orders.status.shipping': 'Shipping',
      'orders.status.delivered': 'Delivered',
      
      // Settings
      'settings.title': 'Automation Settings',
      'settings.description': 'Configure dropshipping automation options',
      'settings.automation': 'Automation Settings',
      'settings.auto.sourcing': 'Auto Sourcing',
      'settings.auto.sourcing.description': 'Automatically discover and analyze products',
      'settings.auto.upload': 'Auto Upload',
      'settings.auto.upload.description': 'Automatically upload products',
      'settings.margin.rate': 'Margin Rate Setting',
      'settings.additional': 'Additional Settings',
      'settings.min.margin': 'Minimum Margin Rate',
      'settings.min.sales': 'Minimum Sales Volume',
      'settings.max.products': 'Daily Maximum Products',
      'settings.update.frequency': 'Update Frequency',
      'settings.frequency.1h': 'Every 1 hour',
      'settings.frequency.6h': 'Every 6 hours',
      'settings.frequency.12h': 'Every 12 hours',
      'settings.frequency.24h': 'Every 24 hours',
    }
  }
};

// Only initialize on client side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ko',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false,
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;
