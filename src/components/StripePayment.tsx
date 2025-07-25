'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';


interface PaymentFormProps {
  amount: number;
  currency?: string;
  isSubscription?: boolean;
  priceId?: string;
  customerEmail?: string;
  customerName?: string;
  trialPeriodDays?: number;
  onSuccess?: (result: { id: string; status: string; [key: string]: unknown }) => void;
  onError?: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'myr',
  isSubscription = false,
  priceId,
  customerEmail,
  customerName,
  trialPeriodDays,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  const createPaymentIntent = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          paymentMethodTypes: ['card', 'fpx'],
          metadata: {
            type: 'one-time-payment',
          },
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      onError?.('Failed to initialize payment');
    }
  }, [amount, currency, onError]);

  useEffect(() => {
    if (!isSubscription) {
      // Create payment intent for one-time payment
      createPaymentIntent();
    }
  }, [isSubscription, createPaymentIntent]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscription) {
        await handleSubscriptionPayment();
      } else {
        await handleOneTimePayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError?.('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneTimePayment = async () => {
    if (!clientSecret) {
      onError?.('Payment not initialized');
      return;
    }

    if (!stripe || !elements) {
      onError?.('Payment system not ready');
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      onError?.(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess?.({
        id: paymentIntent.id,
        status: paymentIntent.status,
        paymentIntent
      });
    }
  };

  const handleSubscriptionPayment = async () => {
    if (!priceId || !customerEmail) {
      onError?.('Missing subscription details');
      return;
    }

    // Create subscription
    const response = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        name: customerName,
        priceId,
        trialPeriodDays,
        metadata: {
          type: 'subscription',
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      onError?.(data.error);
      return;
    }

    if (data.clientSecret) {
      // Confirm payment for subscription
      if (!stripe || !elements) {
        onError?.('Payment system not ready');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError?.(error.message || 'Subscription payment failed');
      } else {
        onSuccess?.({
          id: paymentIntent?.id || data.id || 'subscription',
          status: paymentIntent?.status || 'succeeded',
          paymentIntent,
          subscription: data,
        });
      }
    } else {
      // Subscription created successfully without immediate payment (trial period)
      onSuccess?.(data);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
    paymentMethodOrder: ['card', 'fpx'],
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">
        {isSubscription ? 'Subscribe' : 'Payment'}
      </h3>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Amount: {currency.toUpperCase()} {amount.toFixed(2)}
          {isSubscription && ' / month'}
        </p>
        {trialPeriodDays && (
          <p className="text-sm text-green-600">
            {trialPeriodDays} days free trial
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={selectedPaymentMethod === 'card'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="fpx"
                checked={selectedPaymentMethod === 'fpx'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-2"
              />
              FPX (Malaysian Online Banking)
            </label>
          </div>
        </div>

        {/* Payment Element */}
        {(clientSecret || isSubscription) && (
          <div className="mb-4">
            <PaymentElement options={paymentElementOptions} />
          </div>
        )}

        {/* FPX Bank Selection */}
        {selectedPaymentMethod === 'fpx' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Bank
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Choose your bank</option>
              <option value="maybank2u">Maybank2u</option>
              <option value="cimb_clicks">CIMB Clicks</option>
              <option value="public_bank">Public Bank</option>
              <option value="rhb_bank">RHB Bank</option>
              <option value="hong_leong_bank">Hong Leong Bank</option>
              <option value="ambank">AmBank</option>
              <option value="affin_bank">Affin Bank</option>
              <option value="alliance_bank">Alliance Bank</option>
              <option value="bank_islam">Bank Islam</option>
              <option value="bank_muamalat">Bank Muamalat</option>
              <option value="bank_rakyat">Bank Rakyat</option>
              <option value="bsn">BSN</option>
              <option value="hsbc_bank">HSBC Bank</option>
              <option value="ocbc_bank">OCBC Bank</option>
              <option value="standard_chartered">Standard Chartered</option>
              <option value="uob_bank">UOB Bank</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Processing...'
            : isSubscription
            ? 'Subscribe Now'
            : 'Pay Now'}
        </button>
      </form>

      {/* Payment Method Info */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Secure payment powered by Stripe</p>
        <p>Supports Malaysian Ringgit (MYR) and FPX banking</p>
      </div>
    </div>
  );
};

interface StripePaymentProps extends PaymentFormProps {
  stripePromise?: Promise<import('@stripe/stripe-js').Stripe | null>;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  stripePromise,
  ...props
}) => {
  const [stripe, setStripe] = useState<import('@stripe/stripe-js').Stripe | null>(null);

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = stripePromise ? await stripePromise : await getStripe();
      setStripe(stripeInstance);
    };
    initStripe();
  }, [stripePromise]);

  if (!stripe) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret: props.isSubscription ? undefined : undefined, // Will be set in PaymentForm
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
      },
    },
  };

  return (
    <Elements stripe={stripe} options={options}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;