'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cartApi } from '@/lib/api';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  sourcePrice: number;
  marginRate: number;
  platform: string;
  imageUrl: string;
  quantity: number;
  estimatedProfit: number;
}

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await cartApi.getCart();
      if (response?.data?.success) {
        setCartItems(response.data.data.items || []);
      } else {
        throw new Error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      // Demo data for fallback
      setCartItems([
        {
          id: '1',
          productId: 'prod-1',
          title: '에어팟 프로 2세대 무선이어폰',
          price: 289000,
          sourcePrice: 200000,
          marginRate: 30,
          platform: 'coupang',
          imageUrl: '/logos/coupang.png',
          quantity: 1,
          estimatedProfit: 89000
        },
        {
          id: '2',
          productId: 'prod-2',
          title: '갤럭시 S24 투명 젤리케이스',
          price: 8900,
          sourcePrice: 5000,
          marginRate: 44,
          platform: 'naver',
          imageUrl: '/logos/naver.png',
          quantity: 2,
          estimatedProfit: 7800
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    try {
      await cartApi.updateCartItem(itemId, newQuantity);
      setCartItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              quantity: newQuantity,
              estimatedProfit: (item.price - item.sourcePrice) * newQuantity
            }
          : item
      ));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalProfit = cartItems.reduce((sum, item) => sum + item.estimatedProfit, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return { subtotal, totalProfit, totalItems };
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await cartApi.checkout({ items: cartItems });
      if (response?.data?.success) {
        alert('주문이 처리되었습니다!');
        setCartItems([]);
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
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
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                전체 삭제
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : cartItems.length === 0 ? (
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
                              <span className="font-medium">판매가: ₩{item.price.toLocaleString()}</span>
                              <span className="mx-2">•</span>
                              <span>원가: ₩{item.sourcePrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-medium text-gray-900">
                              ₩{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-green-600">
                              예상 수익: ₩{item.estimatedProfit.toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                    <span className="font-medium">₩{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">예상 총 수익</span>
                    <span className="font-medium text-green-600">₩{totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span>총 금액</span>
                      <span>₩{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || cartItems.length === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        처리 중...
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
                    <span className="font-medium text-green-600">₩{totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-600">평균 마진율</span>
                    </div>
                    <span className="font-medium">
                      {cartItems.length > 0 
                        ? Math.round(cartItems.reduce((sum, item) => sum + item.marginRate, 0) / cartItems.length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
