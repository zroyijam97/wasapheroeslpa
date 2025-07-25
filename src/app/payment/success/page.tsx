'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionUpdated, setTransactionUpdated] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const purchaseId = searchParams.get('purchase_id');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const updateTransactionAndCreateUser = async () => {
      if (!transactionId) {
        setError('Transaction ID not found');
        setLoading(false);
        return;
      }

      try {
        // First, update transaction status
        const updateResponse = await fetch(`/api/transactions/${transactionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'accepted'
          }),
        });

        if (updateResponse.ok) {
          setTransactionUpdated(true);
          
          // Get transaction details to create user
          const transactionResponse = await fetch(`/api/transactions/${transactionId}`);
          if (transactionResponse.ok) {
            const transaction = await transactionResponse.json();
            
            // Create or get user and auto-login
            const userResponse = await fetch('/api/auth/auto-login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: transaction.email,
                fullName: transaction.full_name,
                phoneNumber: transaction.phone_number
              }),
            });
            
            if (userResponse.ok) {
              setUserCreated(true);
              // Store user session
              const userData = await userResponse.json();
              localStorage.setItem('userSession', JSON.stringify(userData));
            }
          }
        } else {
          setError('Failed to update transaction status');
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
        setError('Failed to process payment success');
      } finally {
        setLoading(false);
      }
    };

    updateTransactionAndCreateUser();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/payments" 
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors inline-block"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your subscription! Your payment has been processed successfully.
          </p>
          
          {purchaseId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Purchase ID:</p>
              <p className="font-mono text-sm text-gray-800">{purchaseId}</p>
            </div>
          )}
          
          {transactionUpdated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <p className="text-green-800 text-sm">Transaction status updated successfully</p>
              </div>
            </div>
          )}
          
          {userCreated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">👤</span>
                <p className="text-blue-800 text-sm">Account ready! You can now access your dashboard.</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {userCreated ? (
              <button 
                onClick={() => router.push('/user/dashboard')}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to My Dashboard
              </button>
            ) : (
              <Link 
                href="/user/login" 
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                Login to Dashboard
              </Link>
            )}
            <Link 
              href="/" 
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}