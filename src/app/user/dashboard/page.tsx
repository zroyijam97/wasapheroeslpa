'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserSession {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      router.push('/user/login');
      return;
    }

    const userData = JSON.parse(userSession);
    setUser(userData);

    // Fetch user transactions
    fetchUserTransactions(userData.email, userData.phoneNumber);
  }, [router]);

  const fetchUserTransactions = async (email: string, phoneNumber: string) => {
    try {
      const response = await fetch(`/api/user/transactions?email=${encodeURIComponent(email)}&phoneNumber=${encodeURIComponent(phoneNumber)}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      accepted: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we load your data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">👋 Welcome, {user.fullName}!</h1>
              <p className="text-gray-600">{user.email} • {user.phoneNumber}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Subscriptions</h3>
                <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Successful Payments</h3>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Spent</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {formatAmount(transactions.filter(t => t.status === 'accepted').reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 My Subscriptions</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscriptions Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any successful payments yet.</p>
              <Link 
                href="/"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                Browse Plans
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payment Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {transaction.payment_method}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-white hover:text-gray-200 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}