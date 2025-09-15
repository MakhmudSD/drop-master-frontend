export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  platform?: string;
  specifications?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  specifications?: Record<string, any>;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface Cart {
  userId: string;
  id: string;
  totalItems: number;
  totalAmount: number;
  updatedAt?: string;
}
