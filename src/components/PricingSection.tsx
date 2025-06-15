
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserLimits } from "@/hooks/useUserLimits";
import { useNavigate } from "react-router-dom";
import { PricingCard } from './pricing/PricingCard';
import { UsageDisplay } from './pricing/UsageDisplay';
import { createPricingPlans } from './pricing/pricingPlans';

export const PricingSection = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { limits, usage } = useUserLimits();
  const navigate = useNavigate();

  const plans = createPricingPlans(subscription);

  const handlePlanClick = (planId: string | null) => {
    if (user) {
      navigate('/billing');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Spiritual Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the profound wisdom of Hindu scriptures with AI-powered learning designed for every seeker
          </p>
          
          {/* Current Usage Display */}
          {user && usage && (
            <UsageDisplay usage={usage} limits={limits} />
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              onPlanClick={handlePlanClick}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-2">
            All plans include access to our advanced AI-powered scripture guidance system
          </p>
          <p className="text-sm text-gray-500">
            Prices in Indian Rupees. Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};
