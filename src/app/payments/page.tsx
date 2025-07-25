'use client';

import React, { useState } from 'react';
import SubscriptionPlans from '@/components/SubscriptionPlans';

const PaymentsPage: React.FC = () => {
  const [customerEmail, setCustomerEmail] = useState<string>('customer@example.com');
  const [customerName, setCustomerName] = useState<string>('John Doe');

  const handlePaymentSuccess = (result: { id: string; status: string }) => {
    console.log('Payment successful:', result);
    alert('Payment successful! Thank you for your purchase.');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Payment failed: ' + error);
  };

  const handlePlanSelect = (plan: { id: string; name: string; price: number }) => {
    console.log('Plan selected:', plan);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
          <p className="text-gray-600 mt-1">
            Secure payments powered by CHIP with FPX support for Malaysian banks
          </p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <SubscriptionPlans
          onPlanSelect={handlePlanSelect}
          userEmail={customerEmail}
          userName={customerName}
        />

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Payment Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">
                All payments are processed securely through CHIP with industry-standard encryption.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🏦</span>
              </div>
              <h3 className="font-semibold mb-2">FPX Support</h3>
              <p className="text-gray-600 text-sm">
                Pay directly from your Malaysian bank account using FPX for instant transfers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">🔄</span>
              </div>
              <h3 className="font-semibold mb-2">Recurring Billing</h3>
              <p className="text-gray-600 text-sm">
                Automatic subscription management with easy cancellation and plan changes.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Banks */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">Supported Malaysian Banks (FPX)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm text-gray-600">
            {[
              'Maybank',
              'CIMB Bank',
              'Public Bank',
              'RHB Bank',
              'Hong Leong Bank',
              'AmBank',
              'Bank Islam',
              'Affin Bank',
              'Alliance Bank',
              'Bank Rakyat',
              'BSN',
              'HSBC Bank',
            ].map((bank) => (
              <div key={bank} className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>{bank}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            * FPX availability may vary by bank. Additional banks supported through CHIP.
          </p>
        </div>

        {/* Test Mode Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800">Test Mode Active</h3>
              <p className="text-yellow-700 text-sm">
                This is running in CHIP test mode. Use test card numbers for testing.
                No real charges will be made.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;