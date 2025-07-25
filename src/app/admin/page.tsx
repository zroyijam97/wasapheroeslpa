'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';

interface ChipSettings {
  brandId: string;
  secretKey: string;
  mode: 'test' | 'live';
}

interface Transaction {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  amount: number;
  currency: string;
  description: string;
  payment_method: string;
  selected_bank: string;
  status: string;
  purchase_id: string;
  checkout_url: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [chipSettings, setChipSettings] = useState<ChipSettings>({
    brandId: '',
    secretKey: '',
    mode: 'test'
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState<'daily' | 'monthly'>('monthly');
  const [showChipSettings, setShowChipSettings] = useState(false);

  // Check if user is authorized admin
  useEffect(() => {
    if (isLoaded && (!user || user.primaryEmailAddress?.emailAddress !== 'azrulnizamazmi.usm@gmail.com')) {
      redirect('/');
    }
  }, [user, isLoaded]);

  // Load existing settings and transactions
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/chip-settings');
        if (response.ok) {
          const settings = await response.json();
          setChipSettings(settings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    const loadTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const response = await fetch('/api/transactions');
        if (response.ok) {
          const transactionsData = await response.json();
          setTransactions(transactionsData);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoadingTransactions(false);
      }
    };
    
    if (user?.primaryEmailAddress?.emailAddress === 'azrulnizamazmi.usm@gmail.com') {
      loadSettings();
      loadTransactions();
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/chip-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chipSettings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Error saving settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ChipSettings, value: string) => {
    setChipSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user || user.primaryEmailAddress?.emailAddress !== 'azrulnizamazmi.usm@gmail.com') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl mb-8 border border-white/20">
          <div className="px-6 py-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">⚙️</span>
                  Admin Dashboard
                </h1>
                <p className="text-white/80 mt-2">Urus tetapan gateway pembayaran CHIP</p>
              </div>
              <div className="text-6xl">👨‍💼</div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{user.firstName?.[0] || 'A'}</span>
              </div>
              <div>
                <p className="font-semibold text-white text-lg">{user.fullName || 'Admin User'}</p>
                <p className="text-white/70">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl border border-white/20 mb-8">
          <div className="px-6 py-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="text-3xl mr-3">📊</span>
                  Analytics Subscription
                </h2>
                <p className="text-white/80 mt-2">Statistik langganan dan pendapatan</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 rounded-lg p-1 flex">
                  <button
                    onClick={() => setAnalyticsToggle('daily')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      analyticsToggle === 'daily'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    📅 Harian
                  </button>
                  <button
                    onClick={() => setAnalyticsToggle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      analyticsToggle === 'monthly'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    📆 Bulanan
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Subscriptions */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Total Subscription</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {transactions.filter(t => t.status === 'accepted').length}
                    </p>
                    <p className="text-blue-200/70 text-xs mt-1">
                      {analyticsToggle === 'daily' ? 'Hari ini' : 'Bulan ini'}
                    </p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              {/* Total Income */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-medium">Total Income</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      RM {transactions
                        .filter(t => t.status === 'accepted')
                        .reduce((sum, t) => sum + Number(t.amount), 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-green-200/70 text-xs mt-1">
                      {analyticsToggle === 'daily' ? 'Hari ini' : 'Bulan ini'}
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              {/* Pending Transactions */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {transactions.filter(t => t.status === 'pending').length}
                    </p>
                    <p className="text-yellow-200/70 text-xs mt-1">
                      Menunggu pembayaran
                    </p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </div>

              {/* Failed Transactions */}
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-6 border border-red-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200 text-sm font-medium">Failed</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {transactions.filter(t => t.status === 'failed').length}
                    </p>
                    <p className="text-red-200/70 text-xs mt-1">
                      Pembayaran gagal
                    </p>
                  </div>
                  <div className="text-4xl">❌</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHIP Settings Dropdown */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl border border-white/20 mb-8">
          <div 
            className="px-6 py-6 border-b border-white/20 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setShowChipSettings(!showChipSettings)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="text-3xl mr-3">💳</span>
                  Tetapan Gateway Pembayaran CHIP
                </h2>
                <p className="text-white/80 mt-2">Lihat dan urus semua transaksi pembayaran</p>
              </div>
              <div className="text-2xl text-white">
                {showChipSettings ? '🔽' : '▶️'}
              </div>
            </div>
          </div>
          
          {showChipSettings && (
            <form onSubmit={handleSaveSettings} className="px-6 py-6 space-y-6">
              {/* Mode Selection */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="block text-sm font-medium text-white mb-3 flex items-center">
                  <span className="text-xl mr-2">🌍</span>
                  Mod Persekitaran
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center bg-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors">
                    <input
                      type="radio"
                      value="test"
                      checked={chipSettings.mode === 'test'}
                      onChange={(e) => handleInputChange('mode', e.target.value as 'test' | 'live')}
                      className="mr-3 text-blue-500"
                    />
                    <span className="text-white font-medium">Mod Ujian</span>
                  </label>
                  <label className="flex items-center bg-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors">
                    <input
                      type="radio"
                      value="live"
                      checked={chipSettings.mode === 'live'}
                      onChange={(e) => handleInputChange('mode', e.target.value as 'test' | 'live')}
                      className="mr-3 text-blue-500"
                    />
                    <span className="text-white font-medium">Mod Langsung</span>
                  </label>
                </div>
              </div>

              {/* Brand ID */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label htmlFor="brandId" className="block text-sm font-medium text-white mb-3 flex items-center">
                  <span className="text-xl mr-2">🏢</span>
                  Brand ID CHIP
                </label>
                <input
                  type="text"
                  id="brandId"
                  value={chipSettings.brandId}
                  onChange={(e) => handleInputChange('brandId', e.target.value)}
                  placeholder="your-brand-id"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>

              {/* Secret Key */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label htmlFor="secretKey" className="block text-sm font-medium text-white mb-3 flex items-center">
                  <span className="text-xl mr-2">🔐</span>
                  Kunci Rahsia CHIP
                </label>
                <input
                  type="password"
                  id="secretKey"
                  value={chipSettings.secretKey}
                  onChange={(e) => handleInputChange('secretKey', e.target.value)}
                  placeholder="your-secret-key"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>

              {/* Webhook Info */}
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🔗</span>
                  <h4 className="text-white font-medium">Maklumat Webhook</h4>
                </div>
                <div className="text-white/90 space-y-2">
                  <p className="text-sm">Webhook endpoint telah dikonfigurasikan secara automatik:</p>
                  <code className="block bg-white/10 px-3 py-2 rounded text-blue-200 text-sm">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api/chip/webhook
                  </code>
                  <p className="text-xs text-white/70">
                    Sila konfigurasikan URL ini dalam dashboard CHIP anda untuk menerima notifikasi pembayaran.
                  </p>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg backdrop-blur-sm border ${
                  message.includes('successfully') 
                    ? 'bg-green-500/20 text-green-100 border-green-400/30' 
                    : 'bg-red-500/20 text-red-100 border-red-400/30'
                }`}>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">
                      {message.includes('successfully') ? '✅' : '❌'}
                    </span>
                    {message}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center"
                >
                  <span className="text-xl mr-2">{isSaving ? '⏳' : '💾'}</span>
                  {isSaving ? 'Menyimpan...' : 'Simpan Tetapan'}
                </button>
              </div>
            </form>
          )}
        </div>



        {/* Transactions Section */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl border border-white/20 mt-8">
          <div className="px-6 py-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="text-3xl mr-3">💰</span>
              Transaksi Pembayaran
            </h2>
            <p className="text-white/80 mt-2">Senarai semua transaksi pembayaran</p>
          </div>
          
          <div className="px-6 py-6">
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Memuatkan transaksi...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-white/70">Tiada transaksi dijumpai</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">Email</th>
                      <th className="text-left py-3 px-2">Nama</th>
                      <th className="text-left py-3 px-2">Telefon</th>
                      <th className="text-left py-3 px-2">Jumlah</th>
                      <th className="text-left py-3 px-2">Kaedah</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Tarikh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-2 font-mono text-sm">{transaction.id}</td>
                        <td className="py-3 px-2">{transaction.email}</td>
                        <td className="py-3 px-2">{transaction.full_name}</td>
                        <td className="py-3 px-2">{transaction.phone_number}</td>
                        <td className="py-3 px-2 font-semibold">
                          {transaction.currency} {Number(transaction.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-2">
                          <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                            {transaction.payment_method}
                          </span>
                          {transaction.selected_bank && (
                            <div className="text-xs text-white/60 mt-1">{transaction.selected_bank}</div>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            transaction.status === 'accepted' 
                              ? 'bg-green-500/20 text-green-200'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-200'
                              : transaction.status === 'failed'
                              ? 'bg-red-500/20 text-red-200'
                              : 'bg-gray-500/20 text-gray-200'
                          }`}>
                            {transaction.status === 'accepted' ? '✅ Diterima' :
                             transaction.status === 'pending' ? '⏳ Menunggu' :
                             transaction.status === 'failed' ? '❌ Gagal' : transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-white/70">
                          {new Date(transaction.created_at).toLocaleDateString('ms-MY', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">📋</span>
            Arahan Persediaan
          </h3>
          <div className="text-white/90 space-y-3">
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">1️⃣</span>
              <p>Dapatkan Brand ID dan Secret Key anda dari Dashboard CHIP</p>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">2️⃣</span>
              <p>Konfigurasikan webhook endpoint dalam CHIP dashboard: <code className="bg-white/20 px-2 py-1 rounded text-blue-200">/api/chip/webhook</code></p>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">3️⃣</span>
              <p>Pastikan gunakan kunci ujian untuk pembangunan dan kunci langsung untuk produksi</p>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">4️⃣</span>
              <p>CHIP menyokong FPX dan kad kredit/debit untuk pembayaran Malaysia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}