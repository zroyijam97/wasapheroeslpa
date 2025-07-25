'use client';

import React, { useState, useEffect } from 'react';

// FPX Banks list
const FPX_BANKS = [
  { code: 'affin_bank', name: 'Affin Bank' },
  { code: 'alliance_bank', name: 'Alliance Bank' },
  { code: 'ambank', name: 'AmBank' },
  { code: 'bank_islam', name: 'Bank Islam' },
  { code: 'bank_muamalat', name: 'Bank Muamalat' },
  { code: 'bank_rakyat', name: 'Bank Rakyat' },
  { code: 'bsn', name: 'BSN' },
  { code: 'cimb', name: 'CIMB Bank' },
  { code: 'hong_leong_bank', name: 'Hong Leong Bank' },
  { code: 'hsbc_bank', name: 'HSBC Bank' },
  { code: 'kfh', name: 'Kuwait Finance House' },
  { code: 'maybank2e', name: 'Maybank' },
  { code: 'maybank2u', name: 'Maybank2u' },
  { code: 'ocbc_bank', name: 'OCBC Bank' },
  { code: 'public_bank', name: 'Public Bank' },
  { code: 'rhb_bank', name: 'RHB Bank' },
  { code: 'standard_chartered', name: 'Standard Chartered' },
  { code: 'uob_bank', name: 'UOB Bank' },
];

interface ChipPaymentProps {
  amount: number;
  currency?: string;
  description?: string;
  clientEmail?: string;
  clientName?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  interval?: 'day' | 'week' | 'month' | 'year';
  trialPeriodDays?: number;
}

export default function ChipPayment({
  amount,
  currency = 'MYR',
  description = 'Subscription',
  clientEmail = '',
  clientName = '',
  onSuccess,
  onError,
  interval = 'month',
  trialPeriodDays,
}: ChipPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(clientEmail);
  const [name, setName] = useState(clientName);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'card'>('fpx');
  const [selectedBank, setSelectedBank] = useState('');

  // Debug auto-fill
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setEmail('test@example.com');
      setName('John Doe');
      setPhoneNumber('+60123456789');
      setSelectedBank('maybank2u');
    }
  }, []);

  const handlePayment = async () => {
    if (!email || !name || !phoneNumber) {
      onError?.('Please provide your email, name, and phone number');
      return;
    }

    if (paymentMethod === 'fpx' && !selectedBank) {
      onError?.('Please select your bank for FPX payment');
      return;
    }

    setLoading(true);

    try {
      // First, save transaction to database with pending status
      const saveTransactionResponse = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName: name,
          phoneNumber,
          amount,
          description,
          paymentMethod,
          selectedBank: paymentMethod === 'fpx' ? selectedBank : undefined,
        }),
      });

      const transactionData = await saveTransactionResponse.json();
      
      if (!saveTransactionResponse.ok) {
        throw new Error(transactionData.error || 'Failed to save transaction');
      }

      // Then create payment intent
      const endpoint = '/api/chip/create-subscription';

      const payload = {
        amount,
        currency,
        description,
        clientEmail: email,
        clientName: name,
        paymentMethods: [paymentMethod],
        successRedirect: `${window.location.origin}/payment/success?transaction_id=${transactionData.id}`,
        failureRedirect: `${window.location.origin}/payments?error=payment_failed`,
        cancelRedirect: `${window.location.origin}/payments?error=payment_cancelled`,
        metadata: {
          bank: paymentMethod === 'fpx' ? selectedBank : undefined,
          transactionId: transactionData.id,
        },
        interval,
        trialPeriodDays,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Update transaction with purchase_id and checkout_url
      await fetch(`/api/transactions/${transactionData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseId: data.purchase?.id,
          checkoutUrl: data.checkoutUrl,
        }),
      });

      // Redirect to CHIP checkout page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        onSuccess?.(data);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Subscribe
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {`${formatAmount(amount)} per ${interval}${trialPeriodDays ? ` (${trialPeriodDays} days free trial)` : ''}`}
        </p>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
            placeholder="+60123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value as 'fpx' | 'card')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fpx">FPX (Online Banking)</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>

        {paymentMethod === 'fpx' && (
          <div className="space-y-2">
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
              Select Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedBank(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose your bank</option>
              {FPX_BANKS.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          onClick={handlePayment} 
          disabled={loading || !email || !name || !phoneNumber || (paymentMethod === 'fpx' && !selectedBank)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading 
            ? 'Processing...' 
            : 'Subscribe Now'
          }
        </button>

        <div className="text-xs text-gray-500 text-center">
          Powered by CHIP - Secure payment processing
        </div>
      </div>
    </div>
  );
}