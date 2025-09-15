import { gql } from '@apollo/client';

// Cart Queries
export const GET_CART = gql`
  query GetCart {
    cart {
      userId
      id
      totalItems
      totalAmount
      updatedAt
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems {
      id
      userId
      productId
      productName
      quantity
      price
      image
      platform
      specifications
      createdAt
      updatedAt
    }
  }
`;

export const GET_CART_SUMMARY = gql`
  query GetCartSummary {
    cartSummary {
      totalItems
      totalAmount
      shippingCost
      taxAmount
      discountAmount
      finalAmount
    }
  }
`;
