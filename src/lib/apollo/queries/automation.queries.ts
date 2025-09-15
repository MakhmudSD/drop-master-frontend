import { gql } from '@apollo/client';

// Automation Queries
export const GET_AUTOMATION = gql`
  query GetAutomation {
    automation {
      id
      userId
      settings {
        autoSourcing
        autoUpload
        marginRate
        targetPlatforms
        sourcePlatforms
        selectedCategories
        maxProductsPerDay
        minMarginRate
        minSalesCount
        isActive
      }
      lastRunAt
      nextRunAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_AUTOMATION_LOGS = gql`
  query GetAutomationLogs($limit: Int, $offset: Int) {
    automationLogs(limit: $limit, offset: $offset) {
      id
      type
      message
      status
      details
      createdAt
    }
  }
`;

export const GET_AUTOMATION_STATS = gql`
  query GetAutomationStats {
    automationStats {
      totalRuns
      successfulRuns
      failedRuns
      productsProcessed
      lastRunAt
      nextRunAt
      averageProcessingTime
    }
  }
`;
