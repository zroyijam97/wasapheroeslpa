'use client';

import React, { useState, useEffect } from 'react';
import ChipPayment from './ChipPayment';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  priceId?: string;
  trialDays?: number;
}



interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  metadata?: {
    features?: string;
  };
}

interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  recurring?: {
    interval: string;
  };
}

const defaultPlans: Plan[] = [
  {
    id: 'budget',
    name: 'Pakej Budget',
    description: 'Sesuai untuk perniagaan kecil yang baru bermula',
    price: 39,
    interval: 'month',
    features: [
      'Sehingga 1,000 mesej/bulan',
      'Integrasi WhatsApp asas',
      'Sokongan email',
      'Analitik asas',
      'Template mesej standard',
      'Auto-reply asas',
      'Broadcast mesej terhad',
      'Sokongan komuniti',
      'Setup panduan',
      'Laporan bulanan',
    ],
  },
  {
    id: 'unlimited',
    name: 'Pakej Unlimited',
    description: 'Terbaik untuk perniagaan yang sedang berkembang',
    price: 59,
    interval: 'month',
    features: [
      'Unlimited Number',
      'Unlimited Chatbot',
      'Mesej tanpa had',
      'Ciri WhatsApp lanjutan',
      'Sokongan keutamaan 24/7',
      'Analitik terperinci & laporan real-time',
      'Template mesej custom tanpa had',
      'Akses API penuh',
      'Auto-reply pintar dengan AI',
      'Broadcast mesej tanpa had',
      'Integrasi CRM',
      'Multi-admin access',
      'Backup data automatik',
      'Training peribadi',
    ],
    popular: true,
  },
];

const autoHeroesAddOn: AddOn = {
  id: 'auto-heroes',
  name: 'Auto Heroes Pack',
  description: '6 Tools Sosial Media - Automasi Marketing Tanpa Kos Iklan',
  price: 20,
  features: [
    'Facebook Auto Heroes (Auto Add, Like, Comment)',
    'TikTok Auto Heroes (Auto Follow, Like, Comment)',
    'Instagram Auto Heroes (Auto Follow, Unfollow, Like)',
    'Threads Auto Heroes (Auto Follow, Like, Comment)',
    'X Auto Heroes (Auto Follow, Like, Retweet)',
    'Shopee Auto Heroes (Auto Follow, Like)',
  ],
};

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

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
  const [hasAutoHeroes, setHasAutoHeroes] = useState(false);

  useEffect(() => {
    // Fetch plans from CHIP if needed
    fetchPlansFromChip();
  }, []);

  const fetchPlansFromChip = async () => {
    try {
      // For now, we'll use the default plans
      // In the future, you can implement CHIP product fetching if needed
      console.log('Using default plans for CHIP integration');
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



  const getTotalAmount = () => {
    if (!selectedPlan) return 0;
    const planPrice = parseFloat(getDisplayPrice(selectedPlan));
    const addOnPrice = hasAutoHeroes ? getAutoHeroesPrice() : 0;
    return planPrice + addOnPrice;
  };

  const getAutoHeroesPrice = () => {
    if (isYearly) {
      return autoHeroesAddOn.price * 12 * 0.8; // 20% discount for yearly
    }
    return autoHeroesAddOn.price;
  };

  const getAutoHeroesOriginalYearlyPrice = () => {
    return autoHeroesAddOn.price * 12;
  };

  const handleToggleAutoHeroes = () => {
    setHasAutoHeroes(!hasAutoHeroes);
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
              <p><strong>Pakej:</strong> {selectedPlan.name}</p>
              <p><strong>Harga Pakej:</strong> RM {getDisplayPrice(selectedPlan)} / {isYearly ? 'tahun' : 'bulan'}</p>
              
              {hasAutoHeroes && (
                <div className="mt-4">
                  <p><strong>Add-On:</strong></p>
                  <p className="text-sm text-gray-600 ml-4">
                    • {autoHeroesAddOn.name} - RM {autoHeroesAddOn.price}/bulan
                  </p>
                </div>
              )}
              
              <div className="border-t pt-2 mt-4">
                <p className="text-lg font-semibold">
                  <strong>Jumlah Keseluruhan:</strong> RM {getTotalAmount().toFixed(0)} / {isYearly ? 'tahun' : 'bulan'}
                </p>
              </div>
              
              {isYearly && (
                <p className="text-green-600">
                  <strong>Anda jimat:</strong> RM {(parseFloat(getOriginalYearlyPrice(selectedPlan)) - parseFloat(getDisplayPrice(selectedPlan))).toFixed(0)} setahun
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
            <ChipPayment
              amount={getTotalAmount()}
              currency="MYR"
              interval={isYearly ? 'year' : 'month'}
              clientEmail={userEmail}
              clientName={userName}
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
          Pilih Pakej Anda
        </h2>
        <p className="text-gray-600 mb-6">
          Pilih pakej yang sesuai untuk keperluan perniagaan WhatsApp anda
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`${!isYearly ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Bulanan
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
            Tahunan
            <span className="text-green-600 text-sm ml-1">(Jimat 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Auto Heroes Add-On Card - Positioned First */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-lg border-2 border-purple-200 transition-all hover:shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {autoHeroesAddOn.name}
              </h3>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                Add-On
              </span>
            </div>
            <p className="text-gray-600 mb-4">{autoHeroesAddOn.description}</p>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  RM {getAutoHeroesPrice().toFixed(0)}
                </span>
                <span className="text-gray-500 ml-1">
                  / {isYearly ? 'tahun' : 'bulan'}
                </span>
              </div>
              {isYearly && (
                <div className="text-sm text-gray-500">
                  <span className="line-through">RM {getAutoHeroesOriginalYearlyPrice().toFixed(0)}</span>
                  <span className="text-green-600 ml-2">Jimat 20%</span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {autoHeroesAddOn.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleToggleAutoHeroes}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                hasAutoHeroes
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              {hasAutoHeroes ? '✓ Ditambah' : '+ Tambah ke Pakej'}
            </button>
          </div>
        </div>
        
        {/* Plans Cards - Unlimited first, then Budget */}
        {plans.filter(plan => plan.id === 'unlimited').map((plan) => (
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
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                     <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                       Paling Popular
                     </span>
                   </div>
                 )}
            
            {currentPlan === plan.id && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Pakej Semasa
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
                    RM {hasAutoHeroes ? (parseFloat(getDisplayPrice(plan)) + getAutoHeroesPrice()).toFixed(0) : getDisplayPrice(plan)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    / {isYearly ? 'tahun' : 'bulan'}
                  </span>
                </div>
                {hasAutoHeroes && (
                  <div className="mt-1">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                      + Auto Heroes
                    </span>
                  </div>
                )}
                {isYearly && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">RM {getOriginalYearlyPrice(plan)}</span>
                    <span className="text-green-600 ml-2">Jimat 20%</span>
                  </div>
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
                  ? 'Pakej Semasa'
                  : 'Pilih Pakej'}
              </button>
            </div>
          </div>
        ))}
        
        {plans.filter(plan => plan.id === 'budget').map((plan) => (
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
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                     <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                       Paling Popular
                     </span>
                   </div>
                 )}
            
            {currentPlan === plan.id && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Pakej Semasa
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
                    RM {hasAutoHeroes ? (parseFloat(getDisplayPrice(plan)) + getAutoHeroesPrice()).toFixed(0) : getDisplayPrice(plan)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    / {isYearly ? 'tahun' : 'bulan'}
                  </span>
                </div>
                {hasAutoHeroes && (
                  <div className="mt-1">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                      + Auto Heroes
                    </span>
                  </div>
                )}
                {isYearly && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">RM {getOriginalYearlyPrice(plan)}</span>
                    <span className="text-green-600 ml-2">Jimat 20%</span>
                  </div>
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
                  ? 'Pakej Semasa'
                  : 'Pilih Pakej'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods Info */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">Kaedah Pembayaran Diterima</h3>
        <div className="flex justify-center items-center space-x-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <span>💳</span>
            <span>Kad Kredit/Debit</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🏦</span>
            <span>FPX (Bank Malaysia)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>Selamat dengan CHIP</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Semua pembayaran diproses dengan selamat. Boleh batal bila-bila masa.</p>
          <p>Harga dalam Ringgit Malaysia (MYR). Cukai mungkin dikenakan.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;