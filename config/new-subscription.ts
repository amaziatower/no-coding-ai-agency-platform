// src/config/subscription.ts

export const subscriptionPlans = {
  starter: {
    name: 'Starter',
    description:
      '100 questions answered per mo., 2 Data Sources, Community Support',
    stripe_price_id: '', // Update with the actual Stripe price ID
    questionsLimit: 100,
    numDataSources: 2,
    communitySupport: true,
    dashboardAccess: false,
    premiumSupport: false,
    realTimeUpdates: false,
    apiAccess: false,
    brandingRemoval: false,
  },
  pro: {
    name: 'Pro',
    description:
      '250 questions answered per mo., 4 Data Sources, Community Support, Analytics and Insight Dashboard',
    stripe_price_id: process.env.STRIPE_PRO_MONTHLY_PLAN_ID || '',
    questionsLimit: 250,
    numDataSources: 4,
    communitySupport: true,
    dashboardAccess: true,
    premiumSupport: false,
    realTimeUpdates: false,
    apiAccess: false,
    brandingRemoval: false,
  },
  unlimited: {
    name: 'Unlimited',
    description:
      '500 questions answered per mo., 4 Data Sources, Community Support, Analytics and Insight Dashboard, Premium Email Support, Real-time update from data source, API Access',
    stripe_price_id: '', // Update with the actual Stripe price ID
    questionsLimit: 500,
    numDataSources: 4,
    communitySupport: true,
    dashboardAccess: true,
    premiumSupport: true,
    realTimeUpdates: true,
    apiAccess: true,
    brandingRemoval: false,
  },
  enterprise: {
    name: 'Enterprise',
    description:
      '500 questions answered per mo., 4 Data Sources, Community Support, Analytics and Insight Dashboard, Premium Email Support, Real-time update from data source, API Access, Remove "Powered by Bot Generator"',
    stripe_price_id: '', // Update with the actual Stripe price ID
    questionsLimit: 500,
    numDataSources: 4,
    communitySupport: true,
    dashboardAccess: true,
    premiumSupport: true,
    realTimeUpdates: true,
    apiAccess: true,
    brandingRemoval: true,
  },
  // ... Add other plans as needed
}
