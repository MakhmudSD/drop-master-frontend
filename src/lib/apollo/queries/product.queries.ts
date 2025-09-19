import { gql } from '@apollo/client';

// Product Queries
export const GET_POPULAR_PRODUCTS = gql`
  query GetPopularProducts($platform: String!, $limit: Float, $query: String) {
    popularProducts(platform: $platform, limit: $limit, query: $query) {
      id
      title
      name
      price
      imageUrl
      link
      platform
      salesCount
      growthRate
      estimatedMargin
      description
      brand
      category
      availability
      rating
      reviewCount
      shippingInfo
      tags
      specifications
      originalPrice
      discount
      stock
      seller
      location
      competitionLevel
      alibabaPrice
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $platform: String, $category: String, $limit: Float, $offset: Float) {
    searchProducts(query: $query, platform: $platform, category: $category, limit: $limit, offset: $offset) {
      id
      title
      name
      price
      imageUrl
      link
      platform
      description
      brand
      category
      rating
      reviewCount
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
