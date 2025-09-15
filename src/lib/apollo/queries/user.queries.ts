import { gql } from '@apollo/client';

// User Queries
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      email
      name
      avatar
      phone
      address
      isActive
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats {
    userStats {
      totalOrders
      totalSpent
      favoritePlatforms
      recentActivity {
        type
        description
        createdAt
      }
    }
  }
`;

export const GET_USER_PREFERENCES = gql`
  query GetUserPreferences {
    userPreferences {
      language
      currency
      notifications {
        email
        push
        sms
      }
      theme
      timezone
    }
  }
`;
