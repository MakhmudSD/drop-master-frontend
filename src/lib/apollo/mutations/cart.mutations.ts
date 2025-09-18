import { gql } from '@apollo/client';

// Cart Mutations
export const ADD_TO_CART = gql`
  mutation AddCartItem($productId: ID!, $quantity: Int!, $specifications: String) {
    addCartItem(input: {
      productId: $productId
      quantity: $quantity
      specifications: $specifications
    }) {
      success
      cartItem {
        id
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
      message
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: ID!, $quantity: Int!) {
    updateCartItem(input: { id: $id, quantity: $quantity }) {
      success
      cartItem {
        id
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
      message
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveCartItem($id: ID!) {
    removeCartItem(id: $id) {
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
