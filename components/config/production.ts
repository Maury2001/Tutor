
export const PRODUCTION_CONFIG = {
  // API Configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:3000',
    timeout: 10000,
    retries: 3
  },
  
  // Supabase Configuration
  supabase: {
    url: 'https://tvfqqayqacwecvnetbry.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZnFxYXlxYWN3ZWN2bmV0YnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjEzNTEsImV4cCI6MjA2MzczNzM1MX0.g1NONnVU1-Yid8vVjwyOpHNQSrEfbl1ZQP9bjPIWVwI'
  },

  // Feature Flags
  features: {
    enableAICounselor: true,
    enableAdvancedReports: true,
    enableRealTimeUpdates: true,
    enableOfflineMode: false
  },

  // Performance Configuration
  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    cacheTimeout: 300000, // 5 minutes
    maxRetries: 3
  },

  // Security Configuration
  security: {
    enableCSP: true,
    enableHTTPS: process.env.NODE_ENV === 'production',
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 5
  }
};
