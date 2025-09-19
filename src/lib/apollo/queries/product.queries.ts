import { gql } from '@apollo/client';

// ---------------------
// Product Queries
// ---------------------

// Get popular products (daily/weekly/monthly)
export const GET_POPULAR_PRODUCTS = gql`
  query GetPopularProducts($platform: String!, $limit: Float, $query: String, $timeFilter: String) {
    popularProducts(platform: $platform, limit: $limit, query: $query, timeFilter: $timeFilter) {
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

// Get single product by ID
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
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

// Search products
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $platform: String, $category: String, $limit: Int, $offset: Int) {
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

// Get product categories
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
