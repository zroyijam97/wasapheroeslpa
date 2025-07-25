'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';

interface StripeSettings {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  webhookEndpoint: string;
  mode: 'test' | 'live';
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [stripeSettings, setStripeSettings] = useState<StripeSettings>({
    secretKey: '',
    publishableKey: '',
    webhookSecret: '',
    webhookEndpoint: '',
    mode: 'test'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is authorized admin
  useEffect(() => {
    if (isLoaded && (!user || user.primaryEmailAddress?.emailAddress !== 'azrulnizamazmi.usm@gmail.com')) {
      redirect('/');
    }
  }, [user, isLoaded]);

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/stripe-settings');
        if (response.ok) {
          const settings = await response.json();
          setStripeSettings(settings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    if (user?.primaryEmailAddress?.emailAddress === 'azrulnizamazmi.usm@gmail.com') {
      loadSettings();
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/stripe-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeSettings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Error saving settings. Please try again.');
      }
    } catch {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof StripeSettings, value: string) => {
    setStripeSettings(prev => ({
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
                <p className="text-white/80 mt-2">Urus tetapan gateway pembayaran Stripe</p>
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

        {/* Stripe Settings Form */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl border border-white/20">
          <div className="px-6 py-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="text-3xl mr-3">💳</span>
              Tetapan Gateway Pembayaran Stripe
            </h2>
            <p className="text-white/80 mt-2">Konfigurasikan tetapan integrasi Stripe anda</p>
          </div>
          
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
                    checked={stripeSettings.mode === 'test'}
                    onChange={(e) => handleInputChange('mode', e.target.value as 'test' | 'live')}
                    className="mr-3 text-blue-500"
                  />
                  <span className="text-white font-medium">Mod Ujian</span>
                </label>
                <label className="flex items-center bg-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors">
                  <input
                    type="radio"
                    value="live"
                    checked={stripeSettings.mode === 'live'}
                    onChange={(e) => handleInputChange('mode', e.target.value as 'test' | 'live')}
                    className="mr-3 text-blue-500"
                  />
                  <span className="text-white font-medium">Mod Langsung</span>
                </label>
              </div>
            </div>

            {/* Secret Key */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label htmlFor="secretKey" className="block text-sm font-medium text-white mb-3 flex items-center">
                <span className="text-xl mr-2">🔐</span>
                Kunci Rahsia Stripe
              </label>
              <input
                type="password"
                id="secretKey"
                value={stripeSettings.secretKey}
                onChange={(e) => handleInputChange('secretKey', e.target.value)}
                placeholder={stripeSettings.mode === 'test' ? 'sk_test_...' : 'sk_live_...'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            {/* Publishable Key */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label htmlFor="publishableKey" className="block text-sm font-medium text-white mb-3 flex items-center">
                <span className="text-xl mr-2">🔑</span>
                Kunci Boleh Terbit Stripe
              </label>
              <input
                type="text"
                id="publishableKey"
                value={stripeSettings.publishableKey}
                onChange={(e) => handleInputChange('publishableKey', e.target.value)}
                placeholder={stripeSettings.mode === 'test' ? 'pk_test_...' : 'pk_live_...'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            {/* Webhook Secret */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label htmlFor="webhookSecret" className="block text-sm font-medium text-white mb-3 flex items-center">
                <span className="text-xl mr-2">🔗</span>
                Rahsia Webhook
              </label>
              <input
                type="password"
                id="webhookSecret"
                value={stripeSettings.webhookSecret}
                onChange={(e) => handleInputChange('webhookSecret', e.target.value)}
                placeholder="whsec_..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            {/* Webhook Endpoint */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label htmlFor="webhookEndpoint" className="block text-sm font-medium text-white mb-3 flex items-center">
                <span className="text-xl mr-2">🌐</span>
                URL Endpoint Webhook
              </label>
              <input
                type="url"
                id="webhookEndpoint"
                value={stripeSettings.webhookEndpoint}
                onChange={(e) => handleInputChange('webhookEndpoint', e.target.value)}
                placeholder="https://yourdomain.com/api/stripe/webhook"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                required
              />
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
              <p>Dapatkan kunci API Stripe anda dari Dashboard Stripe</p>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">2️⃣</span>
              <p>Cipta endpoint webhook dalam Stripe yang menghala ke: <code className="bg-white/20 px-2 py-1 rounded text-blue-200">/api/stripe/webhook</code></p>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">3️⃣</span>
              <p>Salin rahsia webhook dan tampalkan di atas</p>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">4️⃣</span>
              <p>Pastikan gunakan kunci ujian untuk pembangunan dan kunci langsung untuk produksi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}