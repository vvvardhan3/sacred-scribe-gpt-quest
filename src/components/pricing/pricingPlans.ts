
export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  originalPrice?: string;
  description: string;
  features: string[];
  limitations: string[];
  buttonText: string;
  popular: boolean;
  planId: string | null;
  current: boolean;
}

export const createPricingPlans = (subscription: any): PricingPlan[] => [
  {
    name: "Free Trial",
    price: "₹0",
    period: "forever",
    description: "Perfect for exploring Hindu scriptures and getting started",
    features: [
      "10 AI chat messages daily",
      "Create 1 quiz total",
      "Access to Vedas, Puranas & Upanishads"
    ],
    limitations: [],
    buttonText: "Choose Free",
    popular: false,
    planId: null,
    current: !subscription?.subscribed
  },
  {
    name: "Devotee Plan",
    price: "₹499",
    period: "month",
    originalPrice: "₹999",
    description: "Comprehensive access for dedicated learners of Hindu philosophy",
    features: [
      "200 AI chat messages daily",
      "Create up to 5 quizzes",
      "Complete scripture library access"
    ],
    limitations: [],
    buttonText: subscription?.subscription_tier === 'Devotee Plan' ? "Current Plan" : "Choose Devotee",
    popular: true,
    planId: "devotee",
    current: subscription?.subscription_tier === 'Devotee Plan'
  },
  {
    name: "Guru Plan",
    price: "₹999",
    period: "month", 
    originalPrice: "₹1,999",
    description: "Ultimate package for the teachers, scholars & spiritual guides",
    features: [
      "Unlimited AI conversations",
      "Unlimited quiz creation",
      "Complete scripture collection"
    ],
    limitations: [],
    buttonText: subscription?.subscription_tier === 'Guru Plan' ? "Current Plan" : "Choose Guru",
    popular: false,
    planId: "guru",
    current: subscription?.subscription_tier === 'Guru Plan'
  }
];
