import { gql } from '@apollo/client';

// Order Mutations
export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!, $shippingAddress: String, $billingAddress: String, $paymentMethod: String) {
    createOrder(items: $items, shippingAddress: $shippingAddress, billingAddress: $billingAddress, paymentMethod: $paymentMethod) {
      success
      order {
        id
        orderNumber
        totalAmount
        status
        createdAt
      }
      message
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!, $trackingNumber: String) {
    updateOrderStatus(id: $id, status: $status, trackingNumber: $trackingNumber) {
      success
      order {
        id
        status
        trackingNumber
        updatedAt
      }
      message
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      success
      order {
        id
        status
        updatedAt
      }
      message
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      success
      message
    }
  }
`;
