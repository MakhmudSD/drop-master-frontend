import { gql } from '@apollo/client';

// Order Queries
export const GET_ORDERS = gql`
  query GetOrders($limit: Int, $offset: Int, $status: OrderStatus, $sortBy: String) {
    orders(limit: $limit, offset: $offset, status: $status, sortBy: $sortBy) {
      id
      userId
      orderNumber
      items {
        productId
        productName
        quantity
        price
        image
        platform
      }
      totalAmount
      status
      shippingAddress
      billingAddress
      paymentMethod
      trackingNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      userId
      orderNumber
      items {
        productId
        productName
        quantity
        price
        image
        platform
        specifications
      }
      totalAmount
      status
      shippingAddress
      billingAddress
      paymentMethod
      trackingNumber
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory($limit: Int, $offset: Int) {
    orderHistory(limit: $limit, offset: $offset) {
      id
      orderNumber
      totalAmount
      status
      createdAt
      items {
        productName
        quantity
        price
      }
    }
  }
`;
