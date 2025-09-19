'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditProductModal from '@/components/EditProductModal';
import { useCart, useUser, useNotification } from '@/hooks';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, Truck, Edit, AlertCircle } from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  productName: string;
  price: number;
  sourcePrice: number;
  marginRate: number;
  platform: string;
  image: string;
  imageUrl: string;
  quantity: number;
  estimatedProfit: number;
  specifications?: Record<string, unknown>;
}

// Safe number formatting utilities to prevent toLocaleString errors
const safeFormatCurrency = (value: unknown, fallback: number = 0): string => {
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : fallback;
  return numericValue.toLocaleString();
};

const safeNumber = (value: unknown, fallback: number = 0): number => {
  return typeof value === 'number' && !isNaN(value) ? value : fallback;
};

const safeString = (value: unknown, fallback: string = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

export default function CartPage() {
  // Use Apollo reactive state for cart management
  const { user, isAuthenticated } = useUser();
  const { cartItems: apolloCartItems, loading: cartLoading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { showNotification } = useNotification();
  
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<CartItem | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Transform Apollo cart items to local format for compatibility
  const cartItems: CartItem[] = apolloCartItems.map(item => {
    // Parse specifications if it's a JSON string
    let parsedSpecs = {};
    try {
      parsedSpecs = typeof item.specifications === 'string' 
        ? JSON.parse(item.specifications) 
        : (item.specifications || {});
    } catch (error) {
      console.warn('Failed to parse cart item specifications:', error);
    }

    // Extract actual values from parsed specifications
    const sourcePrice = (parsedSpecs as any).sourcePrice || (safeNumber(item.price) * 0.7);
    const marginRate = (parsedSpecs as any).marginRate || 30;

    return {
      id: item.id,
      productId: item.productId,
      title: safeString((parsedSpecs as any).title || item.productName, '상품명 없음'),
      productName: safeString(item.productName, '상품명 없음'),
      price: safeNumber(item.price),
      sourcePrice: safeNumber(sourcePrice),
      marginRate: safeNumber(marginRate),
      platform: safeString((parsedSpecs as any).platform || item.platform, 'unknown'),
      image: safeString((parsedSpecs as any).imageUrl || item.image, '/images/placeholder.png'),
      imageUrl: safeString((parsedSpecs as any).imageUrl || item.image, '/images/placeholder.png'),
      quantity: safeNumber(item.quantity, 1),
      estimatedProfit: safeNumber((parsedSpecs as any).estimatedProfit) || (safeNumber(item.price) - safeNumber(sourcePrice)) * safeNumber(item.quantity, 1),
      specifications: parsedSpecs,
    };
  });

  // Wait for auth state to be determined before redirecting
useEffect(() => {
  if (!cartLoading) {
    const accessToken = localStorage.getItem('accessToken');
    const jwtToken = localStorage.getItem('jwtToken');
    const userFromStorage = localStorage.getItem('user');

    const hasToken = !!accessToken || !!jwtToken;
    const hasUser = !!userFromStorage;

    // Only redirect if there’s no reactive auth and no tokens stored
    if (!isAuthenticated && !hasToken && !hasUser) {
      router.push('/login');
    }
  }
}, [isAuthenticated, cartLoading, router]);

  // Enhanced cart operations with Apollo integration and error handling
  const handleRemoveItem = useCallback(async (itemId: string) => {
    try {
      const success = await removeFromCart(itemId);
      if (success) {
        showNotification('상품이 장바구니에서 제거되었습니다', 'success');
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      showNotification('상품 제거에 실패했습니다', 'error');
    }
  }, [removeFromCart, showNotification]);

  const handleUpdateQuantity = useCallback(async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }
    
    try {
      await updateCartItem(itemId, newQuantity);
      showNotification('수량이 업데이트되었습니다', 'success');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showNotification('수량 업데이트에 실패했습니다', 'error');
    }
  }, [updateCartItem, showNotification, handleRemoveItem]);

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('장바구니를 비우시겠습니까?')) return;
    
    try {
      const success = await clearCart();
      if (success) {
        showNotification('장바구니가 비워졌습니다', 'success');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      showNotification('장바구니 비우기에 실패했습니다', 'error');
    }
  }, [clearCart, showNotification]);

  const handleEditProduct = useCallback(async (updatedProduct: CartItem) => {
    try {
      setEditingProduct(null);
      showNotification('상품 정보가 수정되었습니다', 'success');
      
      // In a real app, you'd update the product info via API
      // For now, just close the modal and show success
    } catch (error) {
      console.error('Failed to update product:', error);
      showNotification('상품 정보 수정에 실패했습니다', 'error');
    }
  }, [showNotification]);

  // Safe totals calculation with number safety
  const calculateTotals = useCallback(() => {
    const safeTotals = cartItems.reduce(
      (acc, item) => {
        const itemPrice = safeNumber(item.price);
        const itemQuantity = safeNumber(item.quantity, 1);
        const itemTotal = itemPrice * itemQuantity;
        const itemProfit = safeNumber(item.estimatedProfit);
        
        return {
          subtotal: acc.subtotal + itemTotal,
          totalProfit: acc.totalProfit + itemProfit,
          totalItems: acc.totalItems + itemQuantity,
        };
      },
      { subtotal: 0, totalProfit: 0, totalItems: 0 }
    );
    
    return safeTotals;
  }, [cartItems]);

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      showNotification('장바구니에 상품이 없습니다', 'warning');
      return;
    }

    setIsProcessingCheckout(true);
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('주문이 처리되었습니다!', 'success');
      await handleClearCart();
      router.push('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
      showNotification('주문 처리 중 오류가 발생했습니다', 'error');
    } finally {
      setIsProcessingCheckout(false);
    }
  }, [cartItems.length, showNotification, handleClearCart, router]);

  // Loading and authentication states
  if (cartLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {cartLoading ? '장바구니를 불러오는 중...' : '인증 확인 중...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const { subtotal, totalProfit, totalItems } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="h-8 w-8 mr-3" />
                장바구니
              </h1>
              <p className="mt-2 text-gray-600">드롭쉬핑 상품을 관리하고 주문하세요</p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 flex items-center px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                전체 삭제
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
            <p className="text-gray-500 mb-6">상품을 추가하여 드롭쉬핑을 시작하세요</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              상품 둘러보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    상품 목록 ({totalItems}개)
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.platform} • 마진율 {item.marginRate}%
                          </p>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">판매가: ₩{safeFormatCurrency(item.price)}</span>
                              <span className="mx-2">•</span>
                              <span>원가: ₩{safeFormatCurrency(item.sourcePrice)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, safeNumber(item.quantity) - 1)}
                              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                              disabled={cartLoading}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{safeNumber(item.quantity, 1)}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, safeNumber(item.quantity) + 1)}
                              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                              disabled={cartLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-medium text-gray-900">
                              ₩{safeFormatCurrency(safeNumber(item.price) * safeNumber(item.quantity, 1))}
                            </div>
                            <div className="text-sm text-green-600">
                              예상 수익: ₩{safeFormatCurrency(item.estimatedProfit)}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setEditingProduct(item)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                              title="상품 정보 수정"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
                              title="상품 삭제"
                              disabled={cartLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">주문 요약</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상품 수</span>
                    <span className="font-medium">{totalItems}개</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">소계</span>
                    <span className="font-medium">₩{safeFormatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">예상 총 수익</span>
                    <span className="font-medium text-green-600">₩{safeFormatCurrency(totalProfit)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span>총 금액</span>
                      <span>₩{safeFormatCurrency(subtotal)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessingCheckout || cartItems.length === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    {isProcessingCheckout ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        주문 처리 중...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        주문하기
                      </>
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    주문 후 상품 소싱 및 업로드가 자동으로 진행됩니다
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">빠른 통계</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">총 상품</span>
                    </div>
                    <span className="font-medium">{totalItems}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">예상 수익</span>
                    </div>
                    <span className="font-medium text-green-600">₩{safeFormatCurrency(totalProfit)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-600">평균 마진율</span>
                    </div>
                    <span className="font-medium">
                      {cartItems.length > 0 
                        ? Math.round(cartItems.reduce((sum, item) => sum + safeNumber(item.marginRate), 0) / cartItems.length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onSave={handleEditProduct}
        />
      )}

      <Footer />
    </div>
  );
}
