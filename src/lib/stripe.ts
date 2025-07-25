import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration for sandbox mode
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_...';
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

// Server-side Stripe instance
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(stripePublishableKey);
};

// Stripe configuration for Malaysia (FPX support)
export const STRIPE_CONFIG = {
  // Supported payment methods for Malaysia
  paymentMethods: [
    'card',
    'fpx', // Malaysian online banking
    'grabpay', // GrabPay
    'alipay', // Alipay
  ],
  
  // Currency for Malaysia
  currency: 'myr',
  
  // FPX specific configuration
  fpx: {
    // Supported Malaysian banks for FPX
    supportedBanks: [
      'maybank2u',
      'cimb_clicks',
      'public_bank',
      'rhb_bank',
      'hong_leong_bank',
      'ambank',
      'affin_bank',
      'alliance_bank',
      'bank_islam',
      'bank_muamalat',
      'bank_rakyat',
      'bsn',
      'hsbc_bank',
      'kfh',
      'maybank2e',
      'ocbc_bank',
      'standard_chartered',
      'uob_bank',
    ],
  },
  
  // Recurring payment configuration
  subscription: {
    // Default billing intervals
    intervals: {
      monthly: 'month',
      yearly: 'year',
      weekly: 'week',
    },
    
    // Trial period options (in days)
    trialPeriods: [7, 14, 30],
  },
};



// Helper function to create subscription
export const createSubscription = async ({
  customerId,
  priceId,
  paymentMethodId,
  trialPeriodDays,
}: {
  customerId: string;
  priceId: string;
  paymentMethodId?: string;
  trialPeriodDays?: number;
}) => {
  const subscriptionData: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  };

  if (paymentMethodId) {
    subscriptionData.default_payment_method = paymentMethodId;
  }

  if (trialPeriodDays) {
    subscriptionData.trial_period_days = trialPeriodDays;
  }

  return await stripe.subscriptions.create(subscriptionData);
};

// Helper function to create customer
export const createCustomer = async ({
  email,
  name,
  metadata = {},
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) => {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
};

// Helper function to create product and price for subscription
export const createSubscriptionProduct = async ({
  name,
  description,
  amount,
  interval = 'month',
  currency = 'myr',
}: {
  name: string;
  description?: string;
  amount: number;
  interval?: 'month' | 'year' | 'week' | 'day';
  currency?: string;
}) => {
  // Create product
  const product = await stripe.products.create({
    name,
    description,
    type: 'service',
  });

  // Create price for the product
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(amount * 100), // Convert to cents
    currency,
    recurring: {
      interval,
    },
  });

  return { product, price };
};