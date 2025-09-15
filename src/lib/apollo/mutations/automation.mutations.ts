import { gql } from '@apollo/client';

// Automation Mutations
export const UPDATE_AUTOMATION = gql`
  mutation UpdateAutomation($settings: AutomationSettingsInput, $isActive: Boolean) {
    updateAutomation(settings: $settings, isActive: $isActive) {
      success
      automation {
        id
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
        updatedAt
      }
      message
    }
  }
`;

export const START_AUTOMATION = gql`
  mutation StartAutomation {
    startAutomation {
      success
      automation {
        id
        isActive
        lastRunAt
        nextRunAt
      }
      message
    }
  }
`;

export const STOP_AUTOMATION = gql`
  mutation StopAutomation {
    stopAutomation {
      success
      automation {
        id
        isActive
        lastRunAt
      }
      message
    }
  }
`;

export const RESET_AUTOMATION = gql`
  mutation ResetAutomation {
    resetAutomation {
      success
      automation {
        id
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
        updatedAt
      }
      message
    }
  }
`;
