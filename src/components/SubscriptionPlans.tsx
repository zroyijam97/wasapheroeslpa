'use client';

import React, { useState, useEffect } from 'react';
import StripePayment from './StripePayment';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  trialDays?: number;
  priceId?: string;
}

const defaultPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals getting started',
    price: 29,
    interval: 'month',
    features: [
      'Up to 1,000 messages/month',
      'Basic WhatsApp integration',
      'Email support',
      'Basic analytics',
    ],
    trialDays: 7,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Best for growing businesses',
    price: 79,
    interval: 'month',
    features: [
      'Up to 10,000 messages/month',
      'Advanced WhatsApp features',
      'Priority support',
      'Advanced analytics',
      'Custom templates',
      'API access',
    ],
    popular: true,
    trialDays: 14,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited messages',
      'Full WhatsApp Business API',
      '24/7 dedicated support',
      'Custom integrations',
      'White-label solution',
      'Advanced security',
      'Custom reporting',
    ],
    trialDays: 30,
  },
];

interface SubscriptionPlansProps {
  onPlanSelect?: (plan: Plan) => void;
  currentPlan?: string;
  userEmail?: string;
  userName?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onPlanSelect,
  currentPlan,
  userEmail,
  userName,
}) => {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    // Fetch plans from Stripe if needed
    fetchPlansFromStripe();
  }, []);

  const fetchPlansFromStripe = async () => {
    try {
      const response = await fetch('/api/stripe/products');
      const data = await response.json();
      
      if (data.products && data.prices) {
        // Convert Stripe products to our plan format
        const stripePlans = data.products.map((product: { id: string; name: string; description?: string; metadata?: { features?: string } }) => {
          const price = data.prices.find((p: { id: string; product: string; unit_amount: number; recurring?: { interval: string } }) => p.product === product.id);
          return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: price ? price.unit_amount / 100 : 0,
            interval: price?.recurring?.interval || 'month',
            features: product.metadata?.features ? JSON.parse(product.metadata.features) : [],
            priceId: price?.id,
          };
        });
        
        if (stripePlans.length > 0) {
          setPlans(stripePlans);
        }
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Keep default plans if API fails
    }
  };

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
    onPlanSelect?.(plan);
  };

  const handlePaymentSuccess = (result: { id: string; status: string }) => {
    console.log('Payment successful:', result);
    setShowPayment(false);
    setSelectedPlan(null);
    // Handle successful subscription
    alert('Subscription successful! Welcome to ' + selectedPlan?.name + ' plan!');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Payment failed: ' + error);
  };

  const getDisplayPrice = (plan: Plan) => {
    if (isYearly) {
      return (plan.price * 12 * 0.8).toFixed(0); // 20% discount for yearly
    }
    return plan.price.toFixed(0);
  };

  const getOriginalYearlyPrice = (plan: Plan) => {
    return (plan.price * 12).toFixed(0);
  };

  if (showPayment && selectedPlan) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowPayment(false)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to plans
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Plan Summary</h3>
            <div className="space-y-2">
              <p><strong>Plan:</strong> {selectedPlan.name}</p>
              <p><strong>Price:</strong> RM {getDisplayPrice(selectedPlan)} / {isYearly ? 'year' : 'month'}</p>
              {selectedPlan.trialDays && (
                <p className="text-green-600">
                  <strong>Free Trial:</strong> {selectedPlan.trialDays} days
                </p>
              )}
              {isYearly && (
                <p className="text-green-600">
                  <strong>You save:</strong> RM {(parseFloat(getOriginalYearlyPrice(selectedPlan)) - parseFloat(getDisplayPrice(selectedPlan))).toFixed(0)} per year
                </p>
              )}
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Features included:</h4>
              <ul className="space-y-1 text-sm">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Payment Form */}
          <div>
            <StripePayment
              amount={parseFloat(getDisplayPrice(selectedPlan))}
              currency="myr"
              isSubscription={true}
              priceId={selectedPlan.priceId}
              customerEmail={userEmail}
              customerName={userName}
              trialPeriodDays={selectedPlan.trialDays}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 mb-6">
          Select the perfect plan for your WhatsApp business needs
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`${!isYearly ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`${isYearly ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Yearly
            <span className="text-green-600 text-sm ml-1">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-lg shadow-lg border-2 transition-all hover:shadow-xl ${
              plan.popular
                ? 'border-blue-500 transform scale-105'
                : 'border-gray-200 hover:border-blue-300'
            } ${
              currentPlan === plan.id ? 'ring-2 ring-green-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            {currentPlan === plan.id && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    RM {getDisplayPrice(plan)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    / {isYearly ? 'year' : 'month'}
                  </span>
                </div>
                {isYearly && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">RM {getOriginalYearlyPrice(plan)}</span>
                    <span className="text-green-600 ml-2">Save 20%</span>
                  </div>
                )}
                {plan.trialDays && (
                  <p className="text-green-600 text-sm mt-1">
                    {plan.trialDays} days free trial
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelection(plan)}
                disabled={currentPlan === plan.id}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  currentPlan === plan.id
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {currentPlan === plan.id
                  ? 'Current Plan'
                  : 'Select Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods Info */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>
        <div className="flex justify-center items-center space-x-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <span>💳</span>
            <span>Credit/Debit Cards</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🏦</span>
            <span>FPX (Malaysian Banks)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>Secure by Stripe</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>All payments are processed securely. Cancel anytime.</p>
          <p>Prices in Malaysian Ringgit (MYR). Taxes may apply.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;