// Configuration shared between Dart and TypeScript
// This mirrors the configuration from lib/config/gokwik_config.dart

export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export interface AppConfig {
  sanity: SanityConfig;
  appName: string;
  isDebug: boolean;
  environment: 'development' | 'staging' | 'production';
}

// Validate required environment variables
function validateEnvVars() {
  const requiredVars = {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  };

  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value || value === 'your_sanity_project_id_here')
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing or placeholder environment variables: ${missing.join(', ')}`);
    console.warn('Please update your .env.local file with actual values.');
    return false;
  }
  return true;
}

// Check if environment is properly configured
export const isConfigured = validateEnvVars();

// Default configuration - update these values to match your actual Sanity project
export const defaultConfig: AppConfig = {
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2023-05-03'
  },
  appName: process.env.APP_NAME || 'Design Wear',
  isDebug: process.env.NODE_ENV === 'development',
  environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development'
};

// GoKwik Configuration (if needed for payment integration)
export interface GoKwikConfig {
  merchantId: string;
  apiKey: string;
  environment: 'sandbox' | 'production';
  isSandbox: boolean;
  enableLogging: boolean;
}

export const goKwikConfig: GoKwikConfig = {
  merchantId: process.env.GOKWIK_MERCHANT_ID || '',
  apiKey: process.env.GOKWIK_API_KEY || '',
  environment: (process.env.GOKWIK_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  isSandbox: process.env.GOKWIK_ENVIRONMENT !== 'production',
  enableLogging: process.env.DEBUG_MODE === 'true'
};