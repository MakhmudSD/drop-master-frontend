import { gql } from '@apollo/client';

// Product Queries
export const GET_POPULAR_PRODUCTS = gql`
  query GetPopularProducts($platform: String!, $limit: Int, $sortBy: String) {
    popularProducts(platform: $platform, limit: $limit, sortBy: $sortBy) {
      id
      title
      name
      price
      image
      imageUrl
      salesCount
      growthRate
      estimatedMargin
      link
      url
      platform
      description
      brand
      category
      availability
      rating
      reviewCount
      shippingInfo
      tags
      originalPrice
      discount
      stock
      seller
      location
      specifications
      competitionLevel
      alibabaPrice
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      name
      price
      image
      imageUrl
      salesCount
      growthRate
      estimatedMargin
      link
      url
      platform
      description
      brand
      category
      availability
      rating
      reviewCount
      shippingInfo
      tags
      originalPrice
      discount
      stock
      seller
      location
      specifications
      competitionLevel
      alibabaPrice
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $platform: String, $category: String, $limit: Int, $offset: Int) {
    searchProducts(query: $query, platform: $platform, category: $category, limit: $limit, offset: $offset) {
      id
      title
      name
      price
      image
      imageUrl
      platform
      description
      brand
      category
      rating
      reviewCount
      link
      url
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($platform: String) {
    productCategories(platform: $platform) {
      id
      name
      slug
      parentId
      level
      productCount
    }
  }
`;
