export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  platform?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;
}
