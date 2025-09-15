import { gql } from '@apollo/client';

// Cart Mutations
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $specifications: JSON) {
    addToCart(productId: $productId, quantity: $quantity, specifications: $specifications) {
      success
      cartItem {
        id
        productId
        productName
        quantity
        price
        image
        platform
      }
      message
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: ID!, $quantity: Int!) {
    updateCartItem(id: $id, quantity: $quantity) {
      success
      cartItem {
        id
        quantity
        price
      }
      message
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id) {
      success
      message
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      success
      message
    }
  }
`;

export const SYNC_CART = gql`
  mutation SyncCart($items: [CartItemInput!]!) {
    syncCart(items: $items) {
      success
      cart {
        totalItems
        totalAmount
      }
      message
    }
  }
`;
