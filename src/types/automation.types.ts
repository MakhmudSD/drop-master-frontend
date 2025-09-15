export interface AutomationSettings {
  autoSourcing: boolean;
  autoUpload: boolean;
  marginRate: number;
  targetPlatforms: string[];
  sourcePlatforms: string[];
  selectedCategories: string[];
  maxProductsPerDay: number;
  minMarginRate: number;
  minSalesCount: number;
  isActive: boolean;
}

export interface Automation {
  id: string;
  userId: string;
  settings: AutomationSettings;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateAutomationData {
  settings?: Partial<AutomationSettings>;
  isActive?: boolean;
}
