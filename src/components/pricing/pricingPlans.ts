
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
      "Access to Vedas, Puranas & Upanishads",
      "Basic scripture guidance",
      "Community support"
    ],
    limitations: [],
    buttonText: "Choose Free",
    popular: false,
    planId: null,
    current: !subscription?.subscribed
  },
  {
    name: "Devotee Plan",
    price: "₹999",
    period: "month",
    originalPrice: "₹1,499",
    description: "Comprehensive access for dedicated learners of Hindu philosophy",
    features: [
      "200 AI chat messages daily",
      "Create up to 5 quizzes",
      "Complete scripture library access",
      "Advanced AI explanations",
      "Personalized study plans"
    ],
    limitations: [],
    buttonText: subscription?.subscription_tier === 'Devotee Plan' ? "Current Plan" : "Choose Devotee",
    popular: true,
    planId: "devotee",
    current: subscription?.subscription_tier === 'Devotee Plan'
  },
  {
    name: "Guru Plan",
    price: "₹2,999",
    period: "month", 
    originalPrice: "₹3,999",
    description: "Ultimate package for teachers, scholars & spiritual guides",
    features: [
      "Unlimited AI conversations",
      "Unlimited quiz creation",
      "Complete scripture collection",
      "Advanced AI philosophical insights",
      "White-glove support & API access"
    ],
    limitations: [],
    buttonText: subscription?.subscription_tier === 'Guru Plan' ? "Current Plan" : "Choose Guru",
    popular: false,
    planId: "guru",
    current: subscription?.subscription_tier === 'Guru Plan'
  }
];
